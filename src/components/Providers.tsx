"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuthBootstrap } from "@/hooks/useAuthBootstrap";
import AppShell from "@/components/AppShell";
import SplashScreen from "@/components/SplashScreen";
import FullScreenLoader from "@/components/FullScreenLoader";
import { Toaster } from "react-hot-toast";
import { useLoaderStore } from "@/store/loaderStore";
import { useAuthStore } from "@/store/AuthStore";

const SPLASH_KEY = "pluserSplashSeen";

export default function Providers({ children }: { children: React.ReactNode }) {
  useAuthBootstrap();
  const isLoading = useLoaderStore((s) => s.isLoading);
  const authLoading = useAuthStore((s) => s.isLoading);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const [splashDone, setSplashDone] = useState(false);
  const [showAnimatedSplash, setShowAnimatedSplash] = useState(false);

  useEffect(() => {
    if (authLoading) return;

    // Logged-in users skip the animated splash (same as mobile)
    if (isAuthenticated) {
      setSplashDone(true);
      return;
    }

    // Guests: show animated splash once per browser session
    const seen = sessionStorage.getItem(SPLASH_KEY);
    if (seen) {
      setSplashDone(true);
    } else {
      setShowAnimatedSplash(true);
    }
  }, [authLoading, isAuthenticated]);

  const handleSplashDone = useCallback(() => {
    sessionStorage.setItem(SPLASH_KEY, "1");
    setShowAnimatedSplash(false);
    setSplashDone(true);
  }, []);

  // Auth still restoring session — show splash background with logo
  if (authLoading) {
    return <SplashScreen animate={false} />;
  }

  // Guest animated splash (zoom stages → home)
  if (showAnimatedSplash && !splashDone) {
    return <SplashScreen animate onDone={handleSplashDone} />;
  }

  if (!splashDone) {
    return <SplashScreen animate={false} />;
  }

  return (
    <>
      <AppShell>{children}</AppShell>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "#1B1F27",
            color: "#fff",
            border: "1px solid #D4AF37",
          },
        }}
      />
      <FullScreenLoader visible={isLoading} />
    </>
  );
}
