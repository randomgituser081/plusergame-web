"use client";

import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { motion, useAnimation } from "framer-motion";
import GameShell from "@/components/games/GameShell";
import CustomButton from "@/components/CustomButton";
import { axiosClient } from "@/lib/api";
import { getApiErrorMessage } from "@/lib/apiErrorMessage";
import getWallet from "@/lib/WalletApi";
import { useSfx } from "@/hooks/useSfx";
import { useRequireAuthForBet } from "@/hooks/useRequireAuthForBet";
import displayCurrency from "@/lib/displayCurrency";

const SEGMENTS = [
  { label: "2x", value: 2, color: "#9A2121" },
  { label: "0x", value: 0, color: "#1B1F27" },
  { label: "5x", value: 5, color: "#D4AF37" },
  { label: "1x", value: 1, color: "#9A2121" },
  { label: "10x", value: 10, color: "#22C55E" },
  { label: "0x", value: 0, color: "#1B1F27" },
  { label: "3x", value: 3, color: "#D4AF37" },
  { label: "1.5x", value: 1.5, color: "#9A2121" },
];

export default function SpinGame() {
  const requireAuth = useRequireAuthForBet();
  const sfx = useSfx();
  const controls = useAnimation();
  const [stake, setStake] = useState("50");
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<{ isWin: boolean; payout: number; multiplier: number } | null>(null);

  const gradient = useMemo(() => {
    const step = 100 / SEGMENTS.length;
    return `conic-gradient(${SEGMENTS.map((s, i) => `${s.color} ${i * step}% ${(i + 1) * step}%`).join(", ")})`;
  }, []);

  const spin = async () => {
    if (!requireAuth() || spinning) return;
    if (Number(stake) < 50) return toast("Minimum stake is 50");

    try {
      setSpinning(true);
      setResult(null);
      sfx.play("startPlayer");
      await controls.start({ rotate: 360 * 8, transition: { duration: 0.8, ease: "linear", repeat: Infinity } });

      const res = await axiosClient.post("/virtual/spin", { stake: Number(stake) });
      const game = res.data.game || res.data;
      const isWin = Boolean(game.is_win);
      const multiplier = Number(game.multiplier || 0);
      const spinNumber = Number(game.spine_number ?? game.spin_number ?? 0);
      const idx = Math.max(0, SEGMENTS.findIndex((s) => s.value === spinNumber || s.label.startsWith(String(spinNumber))));
      const target = 360 * 5 + (360 - (idx * (360 / SEGMENTS.length) + 360 / SEGMENTS.length / 2));

      await controls.start({
        rotate: target,
        transition: { duration: 4, ease: [0.15, 0.85, 0.2, 1] },
      });

      setResult({ isWin, payout: Number(game.payout || 0), multiplier });
      sfx.play(isWin ? "winPlayer" : "losePlayer");
      void getWallet(true);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
      await controls.stop();
      await controls.set({ rotate: 0 });
    } finally {
      setSpinning(false);
    }
  };

  return (
    <GameShell title="Spin 2 Win">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-charcoal-light rounded-2xl p-6 flex flex-col items-center justify-center min-h-[320px] relative">
          <div className="absolute top-4 z-10 w-0 h-0 border-l-[12px] border-r-[12px] border-t-[20px] border-l-transparent border-r-transparent border-t-yellow" />
          <motion.div
            animate={controls}
            className="w-56 h-56 md:w-72 md:h-72 rounded-full border-4 border-yellow shadow-2xl relative"
            style={{ background: gradient }}
          >
            {SEGMENTS.map((s, i) => {
              const angle = (360 / SEGMENTS.length) * i + 360 / SEGMENTS.length / 2;
              return (
                <span
                  key={i}
                  className="absolute left-1/2 top-1/2 text-[10px] md:text-xs font-bold text-white"
                  style={{
                    transform: `rotate(${angle}deg) translateY(-95px) rotate(-${angle}deg)`,
                  }}
                >
                  {s.label}
                </span>
              );
            })}
          </motion.div>
        </div>
        <div className="bg-charcoal-light rounded-2xl p-5 space-y-4">
          {result ? (
            <div className={result.isWin ? "text-green" : "text-red"}>
              <p className="font-bold text-lg">{result.isWin ? "You won!" : "No win this spin"}</p>
              <p className="text-yellow">{result.multiplier}x · {displayCurrency(result.payout)}</p>
            </div>
          ) : (
            <p className="text-gray text-sm">Spin the wheel and land on a multiplier.</p>
          )}
          <input
            value={stake}
            onChange={(e) => setStake(e.target.value)}
            type="number"
            className="w-full h-11 rounded-lg bg-charcoal border border-white/10 px-3"
          />
          <CustomButton title="Spin" onClick={spin} isLoading={spinning} className="w-full rounded-lg" textClassName="text-white" />
        </div>
      </div>
    </GameShell>
  );
}
