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

const ranges = [
  { label: "1-10", max: 10, pot: "pot1" },
  { label: "1-20", max: 20, pot: "pot2" },
  { label: "1-50", max: 50, pot: "pot3" },
];

export default function HotColdGame() {
  const requireAuth = useRequireAuthForBet();
  const sfx = useSfx();
  const [stake, setStake] = useState("50");
  const [range, setRange] = useState(ranges[0]);
  const [pick, setPick] = useState(0);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    isWin: boolean;
    message: string;
    payout: number;
    systemPick?: number;
  } | null>(null);

  const play = async () => {
    if (!requireAuth() || loading) return;
    if (!pick) return toast("Pick a number");
    if (Number(stake) < 50) return toast("Minimum stake is 50");

    try {
      setLoading(true);
      sfx.play("flipPlayer");
      const res = await axiosClient.post("/virtual/guess", {
        game_type: range.pot,
        pick,
        stake: Number(stake),
      });
      const game = res.data.game || res.data;
      const isWin = Boolean(game.is_win);
      setResult({
        isWin,
        message: res.data.message || (isWin ? "Hot!" : "Cold"),
        payout: Number(game.payout || 0),
        systemPick: game.system_number,
      });
      sfx.play(isWin ? "winPlayer" : "losePlayer");
      void getWallet(true);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <GameShell title="Hot Cold">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-charcoal-light rounded-2xl p-5">
          <p className="text-sm text-gray mb-2">Range</p>
          <div className="flex gap-2 mb-4">
            {ranges.map((r) => (
              <button
                key={r.label}
                type="button"
                onClick={() => {
                  setRange(r);
                  setPick(0);
                }}
                className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  range.label === r.label ? "bg-red" : "bg-charcoal text-gray"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-5 sm:grid-cols-8 gap-2 max-h-[280px] overflow-y-auto">
            {Array.from({ length: range.max }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setPick(n)}
                className={`h-10 rounded-lg font-bold text-sm ${
                  pick === n ? "bg-yellow text-charcoal" : "bg-charcoal"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
        <div className="bg-charcoal-light rounded-2xl p-5 space-y-4">
          {result ? (
            <div className={`p-4 rounded-xl ${result.isWin ? "bg-green/10 text-green" : "bg-red/10 text-red"}`}>
              <p className="font-bold">{result.message}</p>
              <p className="text-sm mt-1">System: {result.systemPick} · You: {pick}</p>
              {result.isWin ? <p className="text-yellow mt-1">{displayCurrency(result.payout)}</p> : null}
            </div>
          ) : (
            <p className="text-gray text-sm">Pick a number and place your stake.</p>
          )}
          <input
            value={stake}
            onChange={(e) => setStake(e.target.value)}
            type="number"
            className="w-full h-11 rounded-lg bg-charcoal border border-white/10 px-3"
          />
          <CustomButton title="Guess" onClick={play} isLoading={loading} className="w-full rounded-lg" textClassName="text-white" />
        </div>
      </div>
    </GameShell>
  );
}
