"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Header from "@/components/Header";
import FormField from "@/components/FormField";
import CustomButton from "@/components/CustomButton";
import { data } from "@/constants";
import { axiosClient } from "@/lib/api";
import { storage } from "@/lib/storage";
import { getApiErrorMessage } from "@/lib/apiErrorMessage";
import { useAuthStore } from "@/store/AuthStore";
import { useLoaderStore } from "@/store/loaderStore";
import { useProfileStore } from "@/store/ProfileStore";

export default function EditProfilePage() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoadingAuth = useAuthStore((s) => s.isLoading);
  const { userProfile, setProfile } = useProfileStore();
  const { setLoading } = useLoaderStore();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    gender: "",
    dateOfBirth: "",
  });

  useEffect(() => {
    if (!isLoadingAuth && !isAuthenticated) router.replace("/login");
  }, [isAuthenticated, isLoadingAuth, router]);

  useEffect(() => {
    setForm({
      fullName: userProfile.fullName || "",
      email: userProfile.email || "",
      gender: userProfile.gender || "",
      dateOfBirth: userProfile.dateOfBirth || "",
    });
  }, [userProfile]);

  const save = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.patch("/profile/update", {
        full_name: form.fullName,
        email: form.email,
        gender: form.gender,
        date_of_birth: form.dateOfBirth || undefined,
      });
      const updated = {
        ...userProfile,
        fullName: res.data?.fullName || form.fullName,
        email: res.data?.email || form.email,
        gender: res.data?.gender || form.gender,
        dateOfBirth: res.data?.dateOfBirth || form.dateOfBirth,
        profilePicture: res.data?.profilePicture || userProfile.profilePicture,
      };
      setProfile(updated);
      storage.set("userProfile", JSON.stringify(updated));
      toast.success("Profile updated");
      router.back();
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-2 max-w-lg mx-auto">
      <Header title="Edit Profile" />
      <div className="bg-charcoal-light rounded-2xl p-5 mt-2 space-y-4">
        <FormField title="Full Name" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e })} />
        <FormField title="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e })} type="email" />
        <div>
          <p className="text-white text-sm mb-2">Gender</p>
          <div className="flex gap-2 flex-wrap">
            {data.gender.map((g) => (
              <button
                key={g.value}
                type="button"
                onClick={() => setForm({ ...form, gender: g.value })}
                className={`px-4 py-2 rounded-full text-sm border ${
                  form.gender === g.value ? "bg-red border-red" : "border-gray text-gray"
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>
        <FormField title="Date of Birth" value={form.dateOfBirth} onChange={(e) => setForm({ ...form, dateOfBirth: e })} type="date" />
        <CustomButton title="Save" onClick={save} className="w-full rounded-lg" textClassName="text-white" />
      </div>
    </div>
  );
}
