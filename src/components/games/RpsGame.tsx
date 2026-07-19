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

const CHOICES = [
  { id: "rock", icon: "✊", label: "Rock" },
  { id: "paper", icon: "✋", label: "Paper" },
  { id: "scissors", icon: "✌️", label: "Scissors" },
] as const;

export default function RpsGame() {
  const requireAuth = useRequireAuthForBet();
  const sfx = useSfx();
  const [stake, setStake] = useState("50");
  const [loading, setLoading] = useState(false);
  const [userChoice, setUserChoice] = useState("❓");
  const [aiChoice, setAiChoice] = useState("🤖");
  const [resultText, setResultText] = useState("Choose your move");
  const [payout, setPayout] = useState(0);

  const play = async (choice: "rock" | "paper" | "scissors") => {
    if (!requireAuth() || loading) return;
    if (Number(stake) < 50) return toast("Minimum stake is 50");

    try {
      setLoading(true);
      sfx.play("flipPlayer");
      const res = await axiosClient.post("/virtual/rsp", { pick: choice, stake: Number(stake) });
      const game = res.data.game?.Game || res.data.game || res.data;
      const winner = game.winner;
      const ai = game.ai_choice || "rock";
      const iconMap: Record<string, string> = { rock: "✊", paper: "✋", scissors: "✌️" };
      setUserChoice(iconMap[choice]);
      setAiChoice(iconMap[ai] || "🤖");
      setPayout(Number(game.payout || 0));

      if (winner === "user") {
        sfx.play("winPlayer");
        setResultText(`WIN! +${displayCurrency(Number(game.payout || 0))}`);
      } else if (winner === "ai") {
        sfx.play("losePlayer");
        setResultText(`LOSS — AI chose ${ai}`);
      } else {
        sfx.play("startPlayer");
        setResultText("DRAW — stake returned");
      }
      void getWallet(true);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <GameShell title="RPS Bet">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-charcoal-light rounded-2xl p-8 flex flex-col items-center gap-6 min-h-[260px] justify-center">
          <div className="flex items-center gap-8 text-5xl">
            <span>{userChoice}</span>
            <span className="text-yellow text-lg font-bold">VS</span>
            <span>{aiChoice}</span>
          </div>
          <p className="font-semibold text-center">{resultText}</p>
          {payout > 0 ? <p className="text-yellow">{displayCurrency(payout)}</p> : null}
        </div>
        <div className="bg-charcoal-light rounded-2xl p-5 space-y-4">
          <input
            value={stake}
            onChange={(e) => setStake(e.target.value)}
            type="number"
            className="w-full h-11 rounded-lg bg-charcoal border border-white/10 px-3"
          />
          <div className="grid grid-cols-3 gap-3">
            {CHOICES.map((c) => (
              <CustomButton
                key={c.id}
                title={`${c.icon} ${c.label}`}
                onClick={() => void play(c.id)}
                isLoading={loading}
                className="rounded-xl min-h-[56px] px-2"
                textClassName="text-white text-xs"
              />
            ))}
          </div>
        </div>
      </div>
    </GameShell>
  );
}
