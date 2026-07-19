"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Header from "@/components/Header";
import FormField from "@/components/FormField";
import CustomButton from "@/components/CustomButton";
import { axiosClient } from "@/lib/api";
import { getApiErrorMessage } from "@/lib/apiErrorMessage";
import { useAuthStore } from "@/store/AuthStore";
import { useLoaderStore } from "@/store/loaderStore";

export default function ChangePasswordPage() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoadingAuth = useAuthStore((s) => s.isLoading);
  const { setLoading } = useLoaderStore();
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (!isLoadingAuth && !isAuthenticated) router.replace("/login");
  }, [isAuthenticated, isLoadingAuth, router]);

  const save = async () => {
    if (form.newPassword.length < 8) return toast("New password must be at least 8 characters");
    if (form.newPassword !== form.confirmPassword) return toast("Passwords do not match");
    try {
      setLoading(true);
      await axiosClient.post("/auth/change-password", {
        current_password: form.currentPassword,
        new_password: form.newPassword,
      });
      toast.success("Password changed");
      router.back();
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-2 max-w-lg mx-auto">
      <Header title="Change Password" />
      <div className="bg-charcoal-light rounded-2xl p-5 mt-2 space-y-4">
        <FormField title="Current Password" value={form.currentPassword} onChange={(e) => setForm({ ...form, currentPassword: e })} />
        <FormField title="New Password" value={form.newPassword} onChange={(e) => setForm({ ...form, newPassword: e })} />
        <FormField title="Confirm Password" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e })} secure />
        <CustomButton title="Update Password" onClick={save} className="w-full rounded-lg" textClassName="text-white" />
      </div>
    </div>
  );
}
