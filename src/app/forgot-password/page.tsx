"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Header from "@/components/Header";
import FormField from "@/components/FormField";
import CustomButton from "@/components/CustomButton";
import { images } from "@/constants";
import { axiosClient } from "@/lib/api";
import { getApiErrorMessage } from "@/lib/apiErrorMessage";
import { useLoaderStore } from "@/store/loaderStore";

function formatPhone(phoneNumber: string) {
  const removeFirstZero = phoneNumber.startsWith("0") ? phoneNumber.slice(1) : phoneNumber;
  return `234${removeFirstZero}`;
}

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState("");
  const { setLoading } = useLoaderStore();

  const handleContinue = async () => {
    if (phoneNumber.length < 10) return toast("Enter a valid phone number");
    const phone = formatPhone(phoneNumber);
    try {
      setLoading(true);
      await axiosClient.post("/auth/forgot-password", { phone_number: phone });
      sessionStorage.setItem("resetPhone", phone);
      toast.success("OTP sent");
      router.push("/reset-password");
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
      <Header title="Forgot Password" />
      <div className="max-w-md mx-auto px-4 py-6">
        <div className="bg-charcoal-light rounded-3xl p-6">
          <FormField title="Enter Phone Number" value={phoneNumber} placeholder="Enter here" onChange={setPhoneNumber} type="tel" />
          <CustomButton title="Continue" onClick={handleContinue} className="w-[70%] rounded-lg mt-6 mx-auto" textClassName="text-white" />
        </div>
      </div>
    </div>
  );
}
