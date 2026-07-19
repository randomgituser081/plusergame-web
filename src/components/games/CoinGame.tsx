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

export default function CoinGame() {
  const requireAuth = useRequireAuthForBet();
  const sfx = useSfx();
  const [stake, setStake] = useState("50");
  const [bet, setBet] = useState<"head" | "tail" | "edge">("head");
  const [loading, setLoading] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [face, setFace] = useState<"head" | "tail" | "edge">("head");
  const [result, setResult] = useState<{ isWin: boolean; message: string; payout: number } | null>(null);

  const toss = async () => {
    if (!requireAuth() || loading) return;
    if (Number(stake) < 50) return toast("Minimum stake is 50");

    try {
      setLoading(true);
      setSpinning(true);
      setResult(null);
      sfx.play("flipPlayer");
      const flipInterval = setInterval(() => {
        setFace((f) => (f === "head" ? "tail" : "head"));
      }, 100);

      const res = await axiosClient.post("/virtual/toss", { pick: bet, stake: Number(stake) });
      const game = res.data.game || res.data;
      const systemPick = (game.system_pick || game.systemPick || "head") as "head" | "tail" | "edge";
      const isWin = Boolean(game.is_win ?? game.isWin);

      setTimeout(() => {
        clearInterval(flipInterval);
        setSpinning(false);
        setFace(systemPick);
        setResult({
          isWin,
          message: res.data.message || (isWin ? "You won!" : "You lost"),
          payout: Number(game.payout || 0),
        });
        sfx.play(isWin ? "winPlayer" : "losePlayer");
        void getWallet(true);
      }, 900);
    } catch (error) {
      setSpinning(false);
      toast.error(getApiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <GameShell title="Coin Toss">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-charcoal-light rounded-2xl p-8 flex flex-col items-center justify-center min-h-[280px]">
          <motion.div
            animate={spinning ? { rotateY: 360 } : {}}
            transition={{ repeat: spinning ? Infinity : 0, duration: 0.4, ease: "linear" }}
            className="w-36 h-36 rounded-full overflow-hidden border-4 border-yellow shadow-lg"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={face === "tail" ? images.coinTail : images.coin}
              alt={face}
              className="w-full h-full object-cover"
            />
          </motion.div>
          {result ? (
            <div className={`mt-4 text-center ${result.isWin ? "text-green" : "text-red"}`}>
              <p className="font-bold">{result.message}</p>
              {result.isWin ? <p className="text-yellow">{displayCurrency(result.payout)}</p> : null}
            </div>
          ) : null}
        </div>
        <div className="bg-charcoal-light rounded-2xl p-5 space-y-4">
          <div className="flex gap-2">
            {(["head", "tail", "edge"] as const).map((o) => (
              <button
                key={o}
                type="button"
                onClick={() => setBet(o)}
                className={`flex-1 py-3 rounded-xl capitalize font-semibold border ${
                  bet === o ? "bg-red border-red" : "border-gray text-gray"
                }`}
              >
                {o}
              </button>
            ))}
          </div>
          <input
            value={stake}
            onChange={(e) => setStake(e.target.value)}
            type="number"
            className="w-full h-11 rounded-lg bg-charcoal border border-white/10 px-3"
            placeholder="Stake"
          />
          <CustomButton title="Toss Coin" onClick={toss} isLoading={loading} className="w-full rounded-lg" textClassName="text-white" />
        </div>
      </div>
    </GameShell>
  );
}
