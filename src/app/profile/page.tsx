"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight, LogOut, Lock, Headphones, Eye, EyeOff } from "lucide-react";
import Header from "@/components/Header";
import { images } from "@/constants";
import { axiosClient } from "@/lib/api";
import { storage } from "@/lib/storage";
import { useAuthStore } from "@/store/AuthStore";
import { useProfileStore } from "@/store/ProfileStore";
import useWalletStore from "@/store/WalletStore";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoadingAuth = useAuthStore((s) => s.isLoading);
  const logout = useAuthStore((s) => s.logout);
  const { userProfile, clearProfile } = useProfileStore();
  const { hideWallet, setHideWallet } = useWalletStore();

  useEffect(() => {
    if (!isLoadingAuth && !isAuthenticated) router.replace("/login");
  }, [isAuthenticated, isLoadingAuth, router]);

  const toggleHide = () => {
    const next = hideWallet === "true" ? "false" : "true";
    setHideWallet(next);
    storage.set("hideBalance", next);
  };

  const handleLogout = async () => {
    try {
      await axiosClient.post("/auth/logout");
    } catch {}
    storage.remove("accessToken");
    storage.remove("refreshToken");
    storage.remove("userProfile");
    logout();
    clearProfile();
    toast.success("Logged out");
    router.push("/login");
  };

  const photo =
    userProfile.profilePicture ||
    `${process.env.NEXT_PUBLIC_IMAGE_URI || ""}${userProfile.profilePicture}` ||
    images.avatar;

  return (
    <div className="py-2 max-w-lg mx-auto">
      <Header title="Profile" />
      <div className="mt-4 space-y-4">
        <div className="bg-charcoal-light rounded-2xl p-5 flex items-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={userProfile.profilePicture ? userProfile.profilePicture : images.avatar}
            alt=""
            className="w-16 h-16 rounded-full object-cover bg-charcoal"
            onError={(e) => {
              (e.target as HTMLImageElement).src = images.avatar;
            }}
          />
          <div className="flex-1 min-w-0">
            <p className="font-bold text-lg truncate">{userProfile.fullName || "Player"}</p>
            <p className="text-gray text-sm truncate">{userProfile.phoneNumber || photo}</p>
            <p className="text-gray text-xs truncate">{userProfile.email}</p>
          </div>
        </div>

        <div className="bg-charcoal-light rounded-2xl overflow-hidden divide-y divide-white/5">
          <Link href="/profile/edit" className="flex items-center justify-between px-4 py-4 hover:bg-charcoal">
            <span>Edit Profile</span>
            <ChevronRight size={18} className="text-gray" />
          </Link>
          <Link href="/profile/change-password" className="flex items-center justify-between px-4 py-4 hover:bg-charcoal">
            <span className="flex items-center gap-2"><Lock size={16} /> Change Password</span>
            <ChevronRight size={18} className="text-gray" />
          </Link>
          <button type="button" onClick={toggleHide} className="w-full flex items-center justify-between px-4 py-4 hover:bg-charcoal">
            <span className="flex items-center gap-2">
              {hideWallet === "true" ? <EyeOff size={16} /> : <Eye size={16} />}
              {hideWallet === "true" ? "Show Balance" : "Hide Balance"}
            </span>
          </button>
          <Link href="/support" className="flex items-center justify-between px-4 py-4 hover:bg-charcoal">
            <span className="flex items-center gap-2"><Headphones size={16} /> Support</span>
            <ChevronRight size={18} className="text-gray" />
          </Link>
          <button type="button" onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-4 text-red hover:bg-charcoal">
            <LogOut size={16} /> Log Out
          </button>
        </div>
      </div>
    </div>
  );
}
