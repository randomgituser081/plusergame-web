"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import GameShell from "@/components/games/GameShell";
import CustomButton from "@/components/CustomButton";
import { axiosClient } from "@/lib/api";
import { getApiErrorMessage } from "@/lib/apiErrorMessage";
import getWallet from "@/lib/WalletApi";
import { useSfx } from "@/hooks/useSfx";
import { useRequireAuthForBet } from "@/hooks/useRequireAuthForBet";
import displayCurrency from "@/lib/displayCurrency";

const SYMBOLS = ["🍒", "🍋", "🔔", "⭐", "7️⃣", "🍉"];

export default function ReelStreakGame() {
  const requireAuth = useRequireAuthForBet();
  const sfx = useSfx();
  const [stake, setStake] = useState("50");
  const [loading, setLoading] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [reels, setReels] = useState([0, 1, 2]);
  const [result, setResult] = useState<{ isWin: boolean; message: string; payout: number } | null>(null);

  useEffect(() => {
    if (!spinning) return;
    const id = setInterval(() => {
      setReels([
        Math.floor(Math.random() * SYMBOLS.length),
        Math.floor(Math.random() * SYMBOLS.length),
        Math.floor(Math.random() * SYMBOLS.length),
      ]);
    }, 80);
    return () => clearInterval(id);
  }, [spinning]);

  const pull = async () => {
    if (!requireAuth() || loading) return;
    if (Number(stake) < 50) return toast("Minimum stake is 50");

    try {
      setLoading(true);
      setSpinning(true);
      setResult(null);
      sfx.play("flipPlayer");

      const res = await axiosClient.post("/virtual/reel", { stake: Number(stake) });
      const game = res.data.game || res.data;
      const isWin = Boolean(game.is_win ?? game.isWin);
      const symbols = game.reels || game.symbols || [];

      setTimeout(() => {
        setSpinning(false);
        if (Array.isArray(symbols) && symbols.length >= 3) {
          setReels(
            symbols.slice(0, 3).map((s: string | number) => {
              if (typeof s === "number") return s % SYMBOLS.length;
              const idx = SYMBOLS.findIndex((x) => x === s || String(s).includes(x));
              return idx >= 0 ? idx : Math.floor(Math.random() * SYMBOLS.length);
            })
          );
        }
        setResult({
          isWin,
          message: res.data.message || (isWin ? "Jackpot streak!" : "No match"),
          payout: Number(game.payout || 0),
        });
        sfx.play(isWin ? "winPlayer" : "losePlayer");
        void getWallet(true);
      }, 1600);
    } catch (error) {
      setSpinning(false);
      toast.error(getApiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <GameShell title="Reel Streak">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-b from-[#1a0f2b] to-[#0d061a] rounded-2xl p-8 flex items-center justify-center min-h-[260px] border border-yellow/20">
          <div className="flex gap-3 bg-charcoal rounded-xl p-4 border border-white/10">
            {reels.map((r, i) => (
              <motion.div
                key={i}
                animate={spinning ? { y: [0, -8, 0] } : {}}
                transition={{ repeat: spinning ? Infinity : 0, duration: 0.15 + i * 0.05 }}
                className="w-16 h-20 md:w-20 md:h-24 bg-charcoal-light rounded-lg flex items-center justify-center text-3xl md:text-4xl"
              >
                {SYMBOLS[r]}
              </motion.div>
            ))}
          </div>
        </div>
        <div className="bg-charcoal-light rounded-2xl p-5 space-y-4">
          {result ? (
            <div className={result.isWin ? "text-green" : "text-red"}>
              <p className="font-bold text-lg">{result.message}</p>
              {result.isWin ? <p className="text-yellow">{displayCurrency(result.payout)}</p> : null}
            </div>
          ) : (
            <p className="text-gray text-sm">Pull the reels and match symbols to win.</p>
          )}
          <input
            value={stake}
            onChange={(e) => setStake(e.target.value)}
            type="number"
            className="w-full h-11 rounded-lg bg-charcoal border border-white/10 px-3"
          />
          <CustomButton title="Pull Reels" onClick={pull} isLoading={loading || spinning} className="w-full rounded-lg" textClassName="text-white" />
        </div>
      </div>
    </GameShell>
  );
}
