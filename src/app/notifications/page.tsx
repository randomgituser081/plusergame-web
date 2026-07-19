"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Header from "@/components/Header";
import Loading from "@/components/Loading";
import { axiosClient } from "@/lib/api";
import { getApiErrorMessage } from "@/lib/apiErrorMessage";
import { useAuthStore } from "@/store/AuthStore";
import getUnreadNotifications from "@/lib/getUnreadNotifications";

type Notif = {
  id: string;
  title?: string;
  message?: string;
  body?: string;
  is_read?: boolean;
  created_at?: string;
  type?: string;
};

export default function NotificationsPage() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoadingAuth = useAuthStore((s) => s.isLoading);
  const [tab, setTab] = useState<"all" | "games" | "transaction">("all");
  const [items, setItems] = useState<Notif[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoadingAuth && !isAuthenticated) router.replace("/login");
  }, [isAuthenticated, isLoadingAuth, router]);

  useEffect(() => {
    if (!isAuthenticated) return;
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, tab]);

  const load = async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get("/notification/", {
        params: tab === "all" ? undefined : { type: tab },
      });
      const list = res.data?.results || res.data?.notifications || res.data?.data || [];
      setItems(list);
      void getUnreadNotifications();
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const markAll = async () => {
    try {
      await axiosClient.patch("/notification/read-all");
      toast.success("All marked as read");
      void load();
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  const markOne = async (id: string) => {
    try {
      await axiosClient.patch(`/notification/${id}/read`);
      void load();
    } catch {}
  };

  return (
    <div className="py-2 max-w-2xl mx-auto">
      <Header title="Notifications" />
      <div className="mt-2 flex items-center justify-between gap-2 mb-3">
        <div className="flex gap-2">
          {(["all", "games", "transaction"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize ${
                tab === t ? "bg-red text-white" : "bg-charcoal-light text-gray"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <button type="button" onClick={markAll} className="text-yellow text-xs font-semibold">
          Mark all read
        </button>
      </div>

      {loading ? (
        <Loading />
      ) : items.length === 0 ? (
        <p className="text-center text-gray py-10">No notifications</p>
      ) : (
        <div className="space-y-2">
          {items.map((n) => (
            <button
              key={n.id}
              type="button"
              onClick={() => void markOne(n.id)}
              className={`w-full text-left rounded-xl p-4 border ${
                n.is_read ? "bg-charcoal-light border-transparent" : "bg-charcoal-light border-yellow/40"
              }`}
            >
              <p className="font-semibold text-sm">{n.title || "Notification"}</p>
              <p className="text-gray text-sm mt-1">{n.message || n.body}</p>
              <p className="text-[10px] text-gray mt-2">
                {n.created_at ? new Date(n.created_at).toLocaleString() : ""}
              </p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
