import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { storage } from "@/lib/storage";
import { useAuthStore } from "@/store/AuthStore";
import { useProfileStore } from "@/store/ProfileStore";

/**
 * Browser calls same-origin /api/proxy/* to avoid CORS.
 * The Next.js route forwards to buzzycash.viaspark.site/api/v1.
 */
const axiosClient = axios.create({
  baseURL: "/api/proxy",
});

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const subscribeTokenRefresh = (cb: (token: string) => void) => {
  refreshSubscribers.push(cb);
};

const onRefreshed = (token: string) => {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
};

axiosClient.interceptors.request.use((config) => {
  const accessToken = storage.get("accessToken");
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  if (config.method === "post") {
    config.headers["Idempotency-Key"] = uuidv4();
  }
  return config;
});

const UNAUTHORIZED_MESSAGES = new Set([
  "session expired",
  "Invalid or expired token",
  "Please provide a valid authorization token.",
  "Your session is not valid for this resource.",
  "Your session has expired. Please log in again.",
]);

const isUnauthorizedError = (error: unknown): boolean => {
  const err = error as {
    response?: { status?: number; data?: { message?: string; error?: string } };
  };
  if (err.response?.status !== 401) return false;
  const { message, error: errField } = err.response?.data || {};
  return UNAUTHORIZED_MESSAGES.has(message || "") || UNAUTHORIZED_MESSAGES.has(errField || "");
};

const clearSessionAndRedirect = () => {
  storage.remove("accessToken");
  storage.remove("refreshToken");
  storage.remove("userProfile");
  useAuthStore.getState().logout();
  useProfileStore.getState().clearProfile();
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
};

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!isUnauthorizedError(error) || originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise((resolve) => {
        subscribeTokenRefresh((newToken: string) => {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          resolve(axiosClient(originalRequest));
        });
      });
    }

    isRefreshing = true;

    try {
      const refreshToken = storage.get("refreshToken");
      if (!refreshToken) throw new Error("No refresh token available");

      const refreshResponse = await axios.post("/api/proxy/auth/refresh-token", {
        refresh_token: refreshToken,
      });

      const newAccessToken = refreshResponse.data.accessToken;
      storage.set("accessToken", newAccessToken);
      useAuthStore.getState().login(newAccessToken);
      onRefreshed(newAccessToken);
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return axiosClient(originalRequest);
    } catch (refreshError) {
      refreshSubscribers = [];
      clearSessionAndRedirect();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export { axiosClient };
