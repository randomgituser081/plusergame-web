"use client";

import { useEffect } from "react";
import { storage } from "@/lib/storage";
import { useAuthStore } from "@/store/AuthStore";
import { useProfileStore, type UserProfile } from "@/store/ProfileStore";
import useWalletStore from "@/store/WalletStore";

export function useAuthBootstrap() {
  const login = useAuthStore((s) => s.login);
  const logout = useAuthStore((s) => s.logout);
  const setLoading = useAuthStore((s) => s.setLoading);
  const setProfile = useProfileStore((s) => s.setProfile);
  const setHideWallet = useWalletStore((s) => s.setHideWallet);

  useEffect(() => {
    const token = storage.get("accessToken");
    const profileRaw = storage.get("userProfile");
    const hide = storage.get("hideBalance");

    if (hide) setHideWallet(hide);

    if (token) {
      login(token);
      if (profileRaw) {
        try {
          setProfile(JSON.parse(profileRaw) as UserProfile);
        } catch {}
      }
    } else {
      logout();
    }
    setLoading(false);
  }, [login, logout, setLoading, setProfile, setHideWallet]);
}
