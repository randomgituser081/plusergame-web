"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Gamepad2 } from "lucide-react";
import BalanceCard from "@/components/BalanceCard";
import GameCard from "@/components/GameCard";
import { GAMES, images } from "@/constants";
import { useAuthStore } from "@/store/AuthStore";
import getWallet from "@/lib/WalletApi";
import getUnreadNotifications from "@/lib/getUnreadNotifications";

const DEMO_WINNERS = [
  { name: "Chinedu O.", amount: "₦12,500", game: "Dice" },
  { name: "Amina K.", amount: "₦8,200", game: "Spin" },
  { name: "Tunde B.", amount: "₦25,000", game: "Lottery" },
  { name: "Grace M.", amount: "₦5,400", game: "Coin" },
  { name: "Ifeanyi N.", amount: "₦15,750", game: "Lucky Box" },
];

export default function HomePage() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);

  useEffect(() => {
    if (!isAuthenticated) return;
    let cancelled = false;
    (async () => {
      await getWallet(false);
      if (!cancelled) void getUnreadNotifications();
    })();
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

  if (isLoading) {
    return null;
  }

  return (
    <div className="py-4 md:py-8">
      {!isAuthenticated ? (
        <div
          className="rounded-2xl overflow-hidden mb-6 relative min-h-[180px] md:min-h-[220px] flex items-end"
          style={{
            backgroundImage: `linear-gradient(to top, rgba(15,17,21,0.95), rgba(15,17,21,0.4)), url(${images.splash})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="p-6 w-full">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Welcome to Pluser Game</h1>
            <p className="text-gray text-sm mb-4 max-w-lg">
              Play virtual games, win rewards, deposit and withdraw instantly.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/register" className="bg-red px-5 py-2.5 rounded-full text-sm font-semibold">
                Create Account
              </Link>
              <Link
                href="/login"
                className="border border-yellow text-yellow px-5 py-2.5 rounded-full text-sm font-semibold"
              >
                Log In
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <BalanceCard />
      )}

      <div className="overflow-hidden rounded-xl bg-charcoal-light border border-white/5 mb-4">
        <div className="px-3 py-2 text-xs text-yellow font-semibold tracking-wider">RECENT WINNINGS</div>
        <div className="flex gap-4 overflow-x-auto px-3 pb-3 scrollbar-none animate-pulse">
          {DEMO_WINNERS.map((w) => (
            <div key={w.name} className="shrink-0 bg-charcoal rounded-lg px-3 py-2 min-w-[140px]">
              <p className="text-white text-xs font-semibold truncate">{w.name}</p>
              <p className="text-green text-sm font-bold">{w.amount}</p>
              <p className="text-gray text-[10px]">{w.game}</p>
            </div>
          ))}
        </div>
      </div>

      <div
        className="rounded-xl mb-5 overflow-hidden border border-yellow/20"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(154,33,33,0.85), rgba(212,175,55,0.5)), url(${images.card1})`,
          backgroundSize: "cover",
        }}
      >
        <div className="p-4 md:p-6">
          <p className="text-yellow text-xs font-bold tracking-widest mb-1">FEATURED</p>
          <h2 className="text-xl font-bold">Spin, Roll & Win Big</h2>
          <p className="text-white/80 text-sm mt-1 max-w-md">
            Nine virtual games ready to play. Start with as little as ₦50.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1 my-3">
        <Gamepad2 size={16} className="text-yellow" />
        <h2 className="text-white text-sm font-semibold tracking-widest">VIRTUAL GAMES</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1 md:gap-3">
        {GAMES.map((game, index) => (
          <GameCard key={game.id} item={game} index={index} />
        ))}
      </div>
    </div>
  );
}
