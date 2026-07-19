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

export default function CardGame() {
  const requireAuth = useRequireAuthForBet();
  const sfx = useSfx();
  const [stake, setStake] = useState("50");
  const [sessionId, setSessionId] = useState("");
  const [card, setCard] = useState("A");
  const [loading, setLoading] = useState(false);
  const [starting, setStarting] = useState(true);
  const [result, setResult] = useState<{ correct: boolean; nextCard: string; payout: number; message: string } | null>(null);

  const start = async () => {
    try {
      setStarting(true);
      setResult(null);
      const res = await axiosClient.get("/virtual/start-card");
      setSessionId(res.data.game.session_id);
      setCard(String(res.data.game.current_card || "A"));
      sfx.play("startPlayer");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setStarting(false);
    }
  };

  useEffect(() => {
    void start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const guess = async (dir: "higher" | "lower") => {
    if (!requireAuth() || loading || !sessionId) return;
    if (Number(stake) < 50) return toast("Minimum stake is 50");

    try {
      setLoading(true);
      sfx.play("flipPlayer");
      const res = await axiosClient.post("/virtual/pick-card", {
        guess: dir,
        stake: Number(stake),
        session_id: sessionId,
      });
      const game = res.data.game;
      const correct = Boolean(game.correct);
      setResult({
        correct,
        nextCard: String(game.next_card || ""),
        payout: Number(game.payout || 0),
        message: res.data.message || (correct ? "Correct!" : "Wrong"),
      });
      if (game.next_card) setCard(String(game.next_card));
      sfx.play(correct ? "winPlayer" : "losePlayer");
      void getWallet(true);
    } catch (error) {
      const err = error as { response?: { status?: number; data?: { message?: string } } };
      if (err.response?.status === 400 && err.response?.data?.message === "Session expired or invalid") {
        toast.error("Session expired. Starting a new game.");
        void start();
      } else {
        toast.error(getApiErrorMessage(error));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <GameShell title="Card">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-charcoal-light rounded-2xl p-8 flex flex-col items-center justify-center min-h-[280px]">
          <motion.div
            key={card}
            initial={{ rotateY: 90 }}
            animate={{ rotateY: 0 }}
            className="w-28 h-40 md:w-32 md:h-48 rounded-xl bg-white text-charcoal flex items-center justify-center text-4xl font-black shadow-xl"
          >
            {starting ? "…" : card}
          </motion.div>
          {result ? (
            <div className={`mt-4 text-center ${result.correct ? "text-green" : "text-red"}`}>
              <p className="font-bold">{result.message}</p>
              {result.correct ? <p className="text-yellow">{displayCurrency(result.payout)}</p> : null}
            </div>
          ) : null}
        </div>
        <div className="bg-charcoal-light rounded-2xl p-5 space-y-4">
          <p className="text-sm text-gray">Will the next card be higher or lower?</p>
          <input
            value={stake}
            onChange={(e) => setStake(e.target.value)}
            type="number"
            className="w-full h-11 rounded-lg bg-charcoal border border-white/10 px-3"
          />
          <div className="grid grid-cols-2 gap-3">
            <CustomButton title="Higher" onClick={() => void guess("higher")} isLoading={loading} className="rounded-lg" textClassName="text-white" />
            <CustomButton title="Lower" onClick={() => void guess("lower")} isLoading={loading} className="rounded-lg" bgColor="bg-charcoal border border-yellow" textClassName="text-yellow" />
          </div>
          <CustomButton title="New Round" onClick={() => void start()} className="w-full rounded-lg" bgColor="bg-charcoal-light border border-white/10" textClassName="text-white" />
        </div>
      </div>
    </GameShell>
  );
}
