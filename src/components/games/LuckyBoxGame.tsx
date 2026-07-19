"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import GameShell from "@/components/games/GameShell";
import CustomButton from "@/components/CustomButton";
import { images } from "@/constants";
import { axiosClient } from "@/lib/api";
import { getApiErrorMessage } from "@/lib/apiErrorMessage";
import getWallet from "@/lib/WalletApi";
import { useSfx } from "@/hooks/useSfx";
import { useRequireAuthForBet } from "@/hooks/useRequireAuthForBet";
import displayCurrency from "@/lib/displayCurrency";

export default function LuckyBoxGame() {
  const requireAuth = useRequireAuthForBet();
  const sfx = useSfx();
  const [stake, setStake] = useState("50");
  const [boxCount] = useState(3);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(true);
  const [revealed, setRevealed] = useState<boolean[]>([false, false, false]);
  const [prizeIndex, setPrizeIndex] = useState<number | null>(null);
  const [result, setResult] = useState<{ isWin: boolean; message: string; payout: number } | null>(null);

  const pick = async (index: number) => {
    if (!requireAuth() || loading || !active) return;
    if (Number(stake) < 50) return toast("Minimum stake is 50");

    try {
      setLoading(true);
      sfx.play("flipPlayer");
      const res = await axiosClient.post("/virtual/box", { pick: index + 1, stake: Number(stake) });
      const game = res.data.game || res.data;
      const isWin = Boolean(game.is_win);
      const systemPick = Number(game.system_pick || 1) - 1;
      setPrizeIndex(systemPick);
      setRevealed([true, true, true]);
      setActive(false);
      setResult({
        isWin,
        message: res.data.message || (isWin ? "You found it!" : "Wrong box"),
        payout: Number(game.payout || 0),
      });
      sfx.play(isWin ? "winPlayer" : "losePlayer");
      void getWallet(true);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const newRound = () => {
    setActive(true);
    setRevealed([false, false, false]);
    setPrizeIndex(null);
    setResult(null);
  };

  return (
    <GameShell title="Lucky Box">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-charcoal-light rounded-2xl p-6 flex gap-4 justify-center items-center min-h-[260px] flex-wrap">
          {Array.from({ length: boxCount }).map((_, i) => (
            <motion.button
              key={i}
              type="button"
              whileTap={{ scale: 0.95 }}
              disabled={!active || loading}
              onClick={() => void pick(i)}
              className="relative w-24 h-28 md:w-28 md:h-32"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={images.box} alt={`Box ${i + 1}`} className="w-full h-full object-contain" />
              {revealed[i] ? (
                <span className="absolute inset-0 flex items-center justify-center text-2xl font-black">
                  {prizeIndex === i ? "💰" : "❌"}
                </span>
              ) : null}
            </motion.button>
          ))}
        </div>
        <div className="bg-charcoal-light rounded-2xl p-5 space-y-4">
          {result ? (
            <div className={result.isWin ? "text-green" : "text-red"}>
              <p className="font-bold text-lg">{result.message}</p>
              {result.isWin ? <p className="text-yellow">{displayCurrency(result.payout)}</p> : null}
            </div>
          ) : (
            <p className="text-gray text-sm">Pick a box to reveal your prize.</p>
          )}
          <input
            value={stake}
            onChange={(e) => setStake(e.target.value)}
            type="number"
            disabled={!active}
            className="w-full h-11 rounded-lg bg-charcoal border border-white/10 px-3"
          />
          {!active ? (
            <CustomButton title="New Round" onClick={newRound} className="w-full rounded-lg" textClassName="text-white" />
          ) : null}
        </div>
      </div>
    </GameShell>
  );
}
