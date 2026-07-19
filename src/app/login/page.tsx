"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { z } from "zod";
import Header from "@/components/Header";
import FormField from "@/components/FormField";
import CustomButton from "@/components/CustomButton";
import { images, OTP_LENGTH } from "@/constants";
import { axiosClient } from "@/lib/api";
import { storage } from "@/lib/storage";
import { getApiErrorMessage, isUnverifiedAccountMessage } from "@/lib/apiErrorMessage";
import { useAuthStore } from "@/store/AuthStore";
import { useLoaderStore } from "@/store/loaderStore";
import { useProfileStore } from "@/store/ProfileStore";

const loginSchema = z
  .object({
    phoneNumber: z
      .string()
      .min(10, "Phone number is less than 10 digits")
      .max(11, "Phone number is greater than 11 digits")
      .regex(/^\d+$/, "Phone number must contain only digits"),
    password: z.string(),
  })
  .refine((data) => data.password.length >= 8, {
    message: "Password must be at least 8 characters long",
    path: ["password"],
  });

function formatPhone(phoneNumber: string) {
  const removeFirstZero = phoneNumber.startsWith("0") ? phoneNumber.slice(1) : phoneNumber;
  return `234${removeFirstZero}`;
}

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ phoneNumber: "", password: "" });
  const [needsVerification, setNeedsVerification] = useState(false);
  const [verificationPhone, setVerificationPhone] = useState("");
  const [otp, setOtp] = useState("");
  const { isLoading, setLoading } = useLoaderStore();
  const login = useAuthStore((s) => s.login);
  const setProfile = useProfileStore((s) => s.setProfile);

  const openVerification = (phone: string, message?: string) => {
    setVerificationPhone(phone);
    setNeedsVerification(true);
    setOtp("");
    if (message) toast(message);
  };

  const handleVerifyOtp = async () => {
    if (isLoading) return;
    if (!otp || otp.length < OTP_LENGTH) {
      return toast("OTP needs 6 numbers");
    }
    try {
      setLoading(true);
      const result = await axiosClient.post("/auth/verify-account", {
        phone_number: verificationPhone,
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
      router.push("/");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = async () => {
    const result = loginSchema.safeParse(form);
    if (!result.success) {
      return toast(result.error.issues[0].message);
    }
    const phone = formatPhone(form.phoneNumber);
    try {
      setLoading(true);
      const res = await axiosClient.post("/auth/login", {
        phone_number: phone,
        password: form.password,
      });
      const user = {
        phoneNumber: res.data.user.phoneNumber || "",
        countryOfResidence: res.data.user.countryOfResidence || "",
        email: res.data.user.email || "",
        fullName: res.data.user.fullName || "",
        profilePicture: res.data.user.profilePicture || "",
        kycVerified: false,
        gender: res.data.user.gender || "",
        dateOfBirth: res.data.user.dateOfBirth || "",
        isEmailVerified: res.data.user.isEmailVerified ?? false,
      };
      storage.set("accessToken", res.data.user.accessToken);
      storage.set("refreshToken", res.data.user.refreshToken);
      storage.set("userProfile", JSON.stringify(user));
      login(res.data.user.accessToken);
      setProfile(user);
      router.push("/");
    } catch (error) {
      const message = getApiErrorMessage(error);
      if (isUnverifiedAccountMessage(message)) {
        openVerification(phone, message);
      } else {
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-dvh bg-cover bg-center"
      style={{ backgroundImage: `linear-gradient(rgba(15,17,21,0.85), rgba(15,17,21,0.95)), url(${images.splash})` }}
    >
      <Header title="Log In" />
      <div className="max-w-md mx-auto px-4 py-6">
        <div className="bg-charcoal-light rounded-3xl p-6">
          <FormField
            title="Enter Phone Number"
            value={form.phoneNumber}
            placeholder="Enter here"
            onChange={(e) => setForm({ ...form, phoneNumber: e })}
            type="tel"
          />
          <FormField
            title="Password"
            value={form.password}
            placeholder="Password"
            onChange={(e) => setForm({ ...form, password: e })}
            className="mt-4"
            labelClassName="text-white"
          />
          <p className="text-white text-sm mt-4">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-semibold underline">
              Register
            </Link>
          </p>
          <Link href="/forgot-password" className="block text-white text-sm font-semibold my-3">
            Forgot Password
          </Link>

          {needsVerification ? (
            <div className="mt-4 pt-4 border-t border-charcoal">
              <p className="text-center text-white text-sm mb-3">Enter the 6-digit verification code</p>
              <input
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, OTP_LENGTH))}
                className="w-full h-12 rounded-lg bg-gray text-charcoal text-center text-xl tracking-[0.4em] font-bold outline-none"
                placeholder="------"
                inputMode="numeric"
              />
              <CustomButton
                title="Verify Account"
                onClick={handleVerifyOtp}
                className="w-[70%] rounded-lg mt-4 mx-auto"
                textClassName="text-white"
              />
            </div>
          ) : null}

          <CustomButton
            title="Log In"
            onClick={handleContinue}
            className="w-[70%] rounded-lg mt-4 mx-auto"
            textClassName="text-white"
          />
        </div>
      </div>
    </div>
  );
}
