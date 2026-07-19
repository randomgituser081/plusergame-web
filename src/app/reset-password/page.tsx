"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Header from "@/components/Header";
import FormField from "@/components/FormField";
import CustomButton from "@/components/CustomButton";
import { images, OTP_LENGTH } from "@/constants";
import { axiosClient } from "@/lib/api";
import { getApiErrorMessage } from "@/lib/apiErrorMessage";
import { useLoaderStore } from "@/store/loaderStore";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState<"otp" | "password">("otp");
  const { setLoading } = useLoaderStore();

  useEffect(() => {
    const p = sessionStorage.getItem("resetPhone") || "";
    if (!p) router.replace("/forgot-password");
    else setPhone(p);
  }, [router]);

  const verifyOtp = async () => {
    if (otp.length < OTP_LENGTH) return toast("Enter OTP");
    try {
      setLoading(true);
      await axiosClient.post("/auth/verify-reset-password-otp", {
        phone_number: phone,
        verification_code: otp,
      });
      setStep("password");
      toast.success("OTP verified");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async () => {
    if (password.length < 8) return toast("Password must be at least 8 characters");
    if (password !== confirmPassword) return toast("Passwords do not match");
    try {
      setLoading(true);
      await axiosClient.post("/auth/reset-password", {
        phone_number: phone,
        verification_code: otp,
        new_password: password,
      });
      sessionStorage.removeItem("resetPhone");
      toast.success("Password reset successful");
      router.push("/login");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-dvh bg-cover bg-center"
      style={{ backgroundImage: `linear-gradient(rgba(15,17,21,0.85), rgba(15,17,21,0.95)), url(${images.splash})` }}
    >
      <Header title="Reset Password" />
      <div className="max-w-md mx-auto px-4 py-6">
        <div className="bg-charcoal-light rounded-3xl p-6 space-y-4">
          {step === "otp" ? (
            <>
              <p className="text-white text-sm text-center">Enter the OTP sent to your phone</p>
              <input
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, OTP_LENGTH))}
                className="w-full h-12 rounded-lg bg-gray text-charcoal text-center text-xl tracking-[0.4em] font-bold outline-none"
                placeholder="------"
                inputMode="numeric"
              />
              <CustomButton title="Verify OTP" onClick={verifyOtp} className="w-[70%] rounded-lg mx-auto" textClassName="text-white" />
            </>
          ) : (
            <>
              <FormField title="New Password" value={password} placeholder="New password" onChange={setPassword} />
              <FormField title="Confirm Password" value={confirmPassword} placeholder="Confirm password" onChange={setConfirmPassword} secure />
              <CustomButton title="Reset Password" onClick={resetPassword} className="w-[70%] rounded-lg mx-auto" textClassName="text-white" />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
