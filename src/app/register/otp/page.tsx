"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Header from "@/components/Header";
import CustomButton from "@/components/CustomButton";
import { images, OTP_LENGTH } from "@/constants";
import { axiosClient } from "@/lib/api";
import { storage } from "@/lib/storage";
import { getApiErrorMessage } from "@/lib/apiErrorMessage";
import { useAuthStore } from "@/store/AuthStore";
import { useLoaderStore } from "@/store/loaderStore";
import { useProfileStore } from "@/store/ProfileStore";

export default function RegisterOtpPage() {
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [phone, setPhone] = useState("");
  const { setLoading } = useLoaderStore();
  const login = useAuthStore((s) => s.login);
  const setProfile = useProfileStore((s) => s.setProfile);

  useEffect(() => {
    const p = sessionStorage.getItem("registerPhone") || "";
    if (!p) router.replace("/register");
    else setPhone(p);
  }, [router]);

  const handleVerify = async () => {
    if (otp.length < OTP_LENGTH) return toast("Enter the 6-digit OTP");
    try {
      setLoading(true);
      const result = await axiosClient.post("/auth/verify-account", {
        phone_number: phone,
        verification_code: otp,
      });
      const user = {
        phoneNumber: result.data.user.phoneNumber || "",
        countryOfResidence: result.data.user.countryOfResidence || "",
        email: result.data.user.email || "",
        fullName: result.data.user.fullName || "",
        profilePicture: "",
        kycVerified: false,
        gender: "",
        dateOfBirth: "",
        isEmailVerified: false,
      };
      storage.set("accessToken", result.data.user.accessToken);
      storage.set("refreshToken", result.data.user.refreshToken);
      storage.set("userProfile", JSON.stringify(user));
      login(result.data.user.accessToken);
      setProfile(user);
      sessionStorage.removeItem("registerPhone");
      router.push("/");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    try {
      await axiosClient.post("/auth/resend-otp", { phone_number: phone });
      toast.success("OTP resent");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  return (
    <div
      className="min-h-dvh bg-cover bg-center"
      style={{ backgroundImage: `linear-gradient(rgba(15,17,21,0.85), rgba(15,17,21,0.95)), url(${images.splash})` }}
    >
      <Header title="Verify Account" />
      <div className="max-w-md mx-auto px-4 py-6">
        <div className="bg-charcoal-light rounded-3xl p-6 text-center">
          <p className="text-white mb-4">Enter the 6-digit code sent to your phone</p>
          <input
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, OTP_LENGTH))}
            className="w-full h-12 rounded-lg bg-gray text-charcoal text-center text-xl tracking-[0.4em] font-bold outline-none mb-4"
            placeholder="------"
            inputMode="numeric"
          />
          <button type="button" onClick={resend} className="text-yellow text-sm font-semibold mb-4">
            Resend OTP
          </button>
          <CustomButton title="Verify" onClick={handleVerify} className="w-[70%] rounded-lg mx-auto" textClassName="text-white" />
        </div>
      </div>
    </div>
  );
}
