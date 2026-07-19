"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useAuthStore } from "@/store/AuthStore";
import displayCurrency from "@/lib/displayCurrency";
import useWalletStore from "@/store/WalletStore";

export default function GameShell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const wallet = useWalletStore((s) => s.wallet);

  return (
    <div className="min-h-dvh bg-charcoal">
      <div className="sticky top-0 z-30 bg-charcoal/95 backdrop-blur border-b border-white/5">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="w-10 h-10 rounded-full bg-charcoal-light flex items-center justify-center"
          >
            <ArrowLeft size={18} />
          </button>
          <h1 className="font-semibold">{title}</h1>
          <div className="text-right min-w-[80px]">
            {isAuthenticated ? (
              <p className="text-yellow text-xs font-bold">{displayCurrency(wallet.total)}</p>
            ) : (
              <Link href="/login" className="text-yellow text-xs font-bold">
                Log In
              </Link>
            )}
          </div>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-4 py-4 md:py-6">{children}</div>
    </div>
  );
}
