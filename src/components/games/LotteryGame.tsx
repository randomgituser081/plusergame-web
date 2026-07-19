"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import GameShell from "@/components/games/GameShell";
import CustomButton from "@/components/CustomButton";
import { axiosClient } from "@/lib/api";
import { getApiErrorMessage } from "@/lib/apiErrorMessage";
import getWallet from "@/lib/WalletApi";
import { useSfx } from "@/hooks/useSfx";
import { useRequireAuthForBet } from "@/hooks/useRequireAuthForBet";
import displayCurrency from "@/lib/displayCurrency";

export default function LotteryGame() {
  const requireAuth = useRequireAuthForBet();
  const sfx = useSfx();
  const [stake, setStake] = useState("50");
  const [picks, setPicks] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    isWin: boolean;
    message: string;
    payout: number;
    drew?: number[];
    matched?: number[];
  } | null>(null);

  const toggle = (n: number) => {
    setPicks((prev) => {
      if (prev.includes(n)) return prev.filter((x) => x !== n);
      if (prev.length >= 5) {
        toast("Pick up to 5 numbers");
        return prev;
      }
      return [...prev, n].sort((a, b) => a - b);
    });
  };

  const play = async () => {
    if (!requireAuth() || loading) return;
    if (picks.length < 1) return toast("Select at least 1 number");
    if (Number(stake) < 50) return toast("Minimum stake is 50");

    try {
      setLoading(true);
      sfx.play("flipPlayer");
      const res = await axiosClient.post("/virtual/play-lottery", {
        picks,
        stake: Number(stake),
      });
      const data = res.data.game?.result || res.data.game || res.data;
      const isWin = Boolean(data.is_win);
      setResult({
        isWin,
        message: data.win_message || res.data.message || (isWin ? "You won!" : "No match"),
        payout: Number(data.payout || 0),
        drew: data.drew_numbers || [],
        matched: data.matched_numbers || [],
      });
      sfx.play(isWin ? "winPlayer" : "losePlayer");
      setPicks([]);
      void getWallet(true);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <GameShell title="Lottery">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-charcoal-light rounded-2xl p-5">
          <p className="text-sm text-gray mb-3">Pick up to 5 numbers (1–49)</p>
          <div className="grid grid-cols-7 gap-2 max-h-[320px] overflow-y-auto">
            {Array.from({ length: 49 }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => toggle(n)}
                className={`h-9 rounded-lg text-xs font-bold ${
                  picks.includes(n) ? "bg-yellow text-charcoal" : "bg-charcoal"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
        <div className="bg-charcoal-light rounded-2xl p-5 space-y-4">
          <p className="text-sm">
            Selected: <span className="text-yellow font-bold">{picks.join(", ") || "—"}</span>
          </p>
          {result ? (
            <div className={`p-4 rounded-xl ${result.isWin ? "bg-green/10 text-green" : "bg-red/10 text-red"}`}>
              <p className="font-bold">{result.message}</p>
              {result.drew?.length ? <p className="text-sm mt-1 text-white">Drew: {result.drew.join(", ")}</p> : null}
              {result.isWin ? <p className="text-yellow mt-1">{displayCurrency(result.payout)}</p> : null}
            </div>
          ) : null}
          <input
            value={stake}
            onChange={(e) => setStake(e.target.value)}
            type="number"
            className="w-full h-11 rounded-lg bg-charcoal border border-white/10 px-3"
          />
          <CustomButton title="Play Lottery" onClick={play} isLoading={loading} className="w-full rounded-lg" textClassName="text-white" />
        </div>
      </div>
    </GameShell>
  );
}
