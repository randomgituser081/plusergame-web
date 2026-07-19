"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  Gamepad2,
  ArrowLeftRight,
  User,
  Bell,
} from "lucide-react";
import { images } from "@/constants";
import { useAuthStore } from "@/store/AuthStore";
import useNotificationStore from "@/store/NotificationStore";
import clsx from "clsx";

const tabs = [
  { href: "/", label: "Home", icon: Home, auth: false },
  { href: "/games-played", label: "Played", icon: Gamepad2, auth: true },
  { href: "/transactions", label: "Txns", icon: ArrowLeftRight, auth: true },
  { href: "/profile", label: "Profile", icon: User, auth: true },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const unread = useNotificationStore((s) => s.unreadCount);

  const hideChrome =
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/reset-password") ||
    pathname.startsWith("/games/");

  const onTab = (href: string, needsAuth: boolean) => {
    if (needsAuth && !isAuthenticated) {
      router.push("/login");
      return;
    }
    router.push(href);
  };

  return (
    <div className="min-h-dvh bg-charcoal text-white font-mregular">
      {!hideChrome ? (
        <header className="sticky top-0 z-40 border-b border-white/5 bg-charcoal/95 backdrop-blur">
          <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={images.logo} alt="Pluser Game" className="h-8 w-auto" />
              <span className="font-bold text-yellow hidden sm:inline">Pluser Game</span>
            </Link>
            <nav className="hidden md:flex items-center gap-1">
              {tabs.map((tab) => {
                const active = pathname === tab.href || (tab.href !== "/" && pathname.startsWith(tab.href));
                return (
                  <button
                    key={tab.href}
                    type="button"
                    onClick={() => onTab(tab.href, tab.auth)}
                    className={clsx(
                      "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      active ? "bg-red text-white" : "text-gray hover:text-white hover:bg-charcoal-light"
                    )}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </nav>
            <div className="flex items-center gap-2">
              {isAuthenticated ? (
                <Link href="/notifications" className="relative p-2 rounded-full bg-charcoal-light">
                  <Bell size={18} className="text-yellow" />
                  {unread > 0 ? (
                    <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-red text-[10px] flex items-center justify-center">
                      {unread > 9 ? "9+" : unread}
                    </span>
                  ) : null}
                </Link>
              ) : (
                <Link href="/login" className="text-sm font-semibold bg-red px-4 py-2 rounded-full">
                  Log In
                </Link>
              )}
            </div>
          </div>
        </header>
      ) : null}

      <main className={clsx("mx-auto w-full", hideChrome ? "max-w-5xl" : "max-w-6xl px-4 pb-24 md:pb-8")}>
        {children}
      </main>

      {!hideChrome ? (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-charcoal/95 backdrop-blur pb-safe">
          <div className="flex items-center justify-around h-16 px-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const active = pathname === tab.href || (tab.href !== "/" && pathname.startsWith(tab.href));
              return (
                <button
                  key={tab.href}
                  type="button"
                  onClick={() => onTab(tab.href, tab.auth)}
                  className={clsx(
                    "flex flex-col items-center gap-0.5 text-[10px] font-medium min-w-[64px]",
                    active ? "text-yellow" : "text-gray"
                  )}
                >
                  <Icon size={20} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </nav>
      ) : null}
    </div>
  );
}
