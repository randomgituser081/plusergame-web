"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { z } from "zod";
import Header from "@/components/Header";
import FormField from "@/components/FormField";
import CustomButton from "@/components/CustomButton";
import { images } from "@/constants";
import { axiosClient } from "@/lib/api";
import { getApiErrorMessage } from "@/lib/apiErrorMessage";
import { useLoaderStore } from "@/store/loaderStore";
import { useProfileStore } from "@/store/ProfileStore";

const registerSchema = z
  .object({
    fullName: z.string().min(1, "Fullname is required"),
    phoneNumber: z
      .string()
      .min(10, "Phone number is less than 10 digits")
      .max(11, "Phone number is greater than 11 digits")
      .regex(/^\d+$/, "Phone number must contain only digits"),
    email: z.string().email("Invalid email address"),
    referralCode: z.string().optional(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

function formatPhone(phoneNumber: string) {
  const removeFirstZero = phoneNumber.startsWith("0") ? phoneNumber.slice(1) : phoneNumber;
  return `234${removeFirstZero}`;
}

export default function RegisterPage() {
  const router = useRouter();
  const { isLoading, setLoading } = useLoaderStore();
  const setEmail = useProfileStore((s) => s.setEmail);
  const [form, setForm] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    referralCode: "",
    password: "",
    confirmPassword: "",
  });

  const handleContinue = async () => {
    if (isLoading) return;
    const result = registerSchema.safeParse(form);
    if (!result.success) {
      return toast(result.error.issues[0].message);
    }
    const phone = formatPhone(form.phoneNumber);
    try {
      setLoading(true);
      // Match Expo / Swagger dto.SignUpRequest (snake_case).
      const payload: Record<string, string> = {
        country_of_residence: "Nigeria",
        phone_number: phone,
        email: form.email.trim(),
        full_name: form.fullName.trim(),
        password: form.password,
        confirm_password: form.confirmPassword,
      };
      if (form.referralCode.trim()) {
        payload.referral_code = form.referralCode.trim();
      }
      await axiosClient.post("/auth/register", payload);
      setEmail(form.email);
      sessionStorage.setItem("registerPhone", phone);
      toast.success("Account created. Enter OTP to verify.");
      router.push("/register/otp");
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
      <Header title="Create Account" />
      <div className="max-w-md mx-auto px-4 py-6">
        <div className="bg-charcoal-light rounded-3xl p-6 space-y-4">
          <FormField title="Full Name" value={form.fullName} placeholder="Enter here" onChange={(e) => setForm({ ...form, fullName: e })} />
          <FormField title="Enter Phone Number" value={form.phoneNumber} placeholder="Enter here" onChange={(e) => setForm({ ...form, phoneNumber: e })} type="tel" />
          <FormField title="Email" value={form.email} placeholder="Enter email" onChange={(e) => setForm({ ...form, email: e })} type="email" />
          <FormField title="Referral Code (optional)" value={form.referralCode} placeholder="Optional" onChange={(e) => setForm({ ...form, referralCode: e })} />
          <FormField title="Password" value={form.password} placeholder="Password" onChange={(e) => setForm({ ...form, password: e })} />
          <FormField title="Confirm Password" value={form.confirmPassword} placeholder="Confirm password" onChange={(e) => setForm({ ...form, confirmPassword: e })} secure />
          <p className="text-white text-sm">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold underline">
              Log In
            </Link>
          </p>
          <CustomButton title="Register" onClick={handleContinue} className="w-[70%] rounded-lg mx-auto" textClassName="text-white" />
        </div>
      </div>
    </div>
  );
}
