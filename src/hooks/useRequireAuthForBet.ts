"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/AuthStore";

/** Guards bet actions for guests — redirects to register. */
export function useRequireAuthForBet() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return () => {
    if (!isAuthenticated) {
      toast("Create an account to place bets");
      router.push("/register");
      return false;
    }
    return true;
  };
}
