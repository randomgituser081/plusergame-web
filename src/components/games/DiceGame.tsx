"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { z } from "zod";
import { motion } from "framer-motion";
import GameShell from "@/components/games/GameShell";
import CustomButton from "@/components/CustomButton";
import { axiosClient } from "@/lib/api";
import { getApiErrorMessage } from "@/lib/apiErrorMessage";
import getWallet from "@/lib/WalletApi";
import { useSfx } from "@/hooks/useSfx";
import { useRequireAuthForBet } from "@/hooks/useRequireAuthForBet";
import displayCurrency from "@/lib/displayCurrency";

const schema = z.object({
  stake: z.coerce.number().min(50, "Minimum stake is 50").max(1000, "Maximum stake is 1000"),
  bet_type: z.enum(["even", "odd", "highest", "lowest", "specific"]),
  guess: z.number().min(2).max(12),
});

function DiceFace({ value }: { value: number }) {
  const dots: Record<number, number[][]> = {
    1: [[1, 1]],
    2: [[0, 0], [2, 2]],
    3: [[0, 0], [1, 1], [2, 2]],
    4: [[0, 0], [0, 2], [2, 0], [2, 2]],
    5: [[0, 0], [0, 2], [1, 1], [2, 0], [2, 2]],
    6: [[0, 0], [0, 1], [0, 2], [2, 0], [2, 1], [2, 2]],
  };
  return (
    <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-xl p-2 shadow-lg">
      <div className="grid grid-cols-3 grid-rows-3 w-full h-full gap-0.5">
        {[0, 1, 2].map((row) =>
          [0, 1, 2].map((col) => {
            const active = dots[value]?.some(([r, c]) => r === row && c === col);
            return (
              <div key={`${row}-${col}`} className="flex items-center justify-center">
                <div className={`w-2.5 h-2.5 rounded-full bg-charcoal ${active ? "opacity-100" : "opacity-0"}`} />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default function DiceGame() {
  const requireAuth = useRequireAuthForBet();
  const sfx = useSfx();
  const [stake, setStake] = useState("50");
  const [mode, setMode] = useState<"even" | "odd" | "highest" | "lowest" | "specific">("even");
  const [specificNumber, setSpecificNumber] = useState(7);
  const [loading, setLoading] = useState(false);
  const [rolling, setRolling] = useState(false);
  const [dice, setDice] = useState([1, 1]);
  const [result, setResult] = useState<{ isWin: boolean; message: string; payout: number } | null>(null);
  const [history, setHistory] = useState<boolean[]>([]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (rolling) {
      interval = setInterval(() => {
        setDice([Math.ceil(Math.random() * 6), Math.ceil(Math.random() * 6)]);
      }, 120);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [rolling]);

  const handleRoll = async () => {
    if (!requireAuth() || loading) return;
    const validation = schema.safeParse({ stake, bet_type: mode, guess: specificNumber });
    if (!validation.success) return toast(validation.error.issues[0].message);

    try {
      setLoading(true);
      setRolling(true);
      setResult(null);
      sfx.play("rollDice");

      const res = await axiosClient.post("/virtual/dice", {
        bet_type: mode === "specific" ? "exact" : mode,
        stake: Number(stake),
        guess: mode === "specific" ? specificNumber : undefined,
      });

      const payload = res.data;
      const d1 = Number(payload.dice_one ?? payload.diceOne ?? 1);
      const d2 = Number(payload.dice_two ?? payload.diceTwo ?? 1);
      const isWin = Boolean(payload.is_win ?? payload.isWin ?? payload.status === "won");
      const payout = Number(payload.payout ?? 0);

      setTimeout(() => {
        setRolling(false);
        setDice([d1, d2]);
        setResult({
          isWin,
          message: payload.message || (isWin ? "You won!" : "Better luck next time"),
          payout,
        });
        setHistory((h) => [isWin, ...h].slice(0, 10));
        sfx.play(isWin ? "winPlayer" : "losePlayer");
        void getWallet(true);
      }, 800);
    } catch (error) {
      setRolling(false);
      toast.error(getApiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const modes = ["even", "odd", "highest", "lowest", "specific"] as const;

  return (
    <GameShell title="Dice">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-charcoal-light rounded-2xl p-6 flex flex-col items-center justify-center min-h-[280px]">
          <motion.div
            animate={rolling ? { x: [0, -6, 6, -4, 4, 0], rotate: [0, -8, 8, -4, 4, 0] } : {}}
            transition={{ repeat: rolling ? Infinity : 0, duration: 0.35 }}
            className="flex gap-4"
          >
            <DiceFace value={dice[0]} />
            <DiceFace value={dice[1]} />
          </motion.div>
          {result ? (
            <div className={`mt-6 text-center ${result.isWin ? "text-green" : "text-red"}`}>
              <p className="font-bold text-lg">{result.message}</p>
              {result.isWin ? <p className="text-yellow">{displayCurrency(result.payout)}</p> : null}
            </div>
          ) : null}
          <div className="flex gap-1 mt-4">
            {history.map((w, i) => (
              <span key={i} className={`w-2.5 h-2.5 rounded-full ${w ? "bg-green" : "bg-red"}`} />
            ))}
          </div>
        </div>

        <div className="bg-charcoal-light rounded-2xl p-5 space-y-4">
          <div>
            <p className="text-sm text-gray mb-2">Bet type</p>
            <div className="flex flex-wrap gap-2">
              {modes.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMode(m)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize border ${
                    mode === m ? "bg-red border-red text-white" : "border-gray text-gray"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
          {mode === "specific" ? (
            <div>
              <p className="text-sm text-gray mb-2">Guess (2–12)</p>
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 11 }, (_, i) => i + 2).map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setSpecificNumber(n)}
                    className={`w-9 h-9 rounded-lg text-sm font-bold ${
                      specificNumber === n ? "bg-yellow text-charcoal" : "bg-charcoal text-white"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
          <label className="block">
            <span className="text-sm text-gray">Stake (₦50–₦1000)</span>
            <input
              value={stake}
              onChange={(e) => setStake(e.target.value)}
              type="number"
              className="mt-1 w-full h-11 rounded-lg bg-charcoal border border-white/10 px-3 outline-none focus:border-yellow"
            />
          </label>
          <CustomButton
            title={rolling || loading ? "Rolling…" : "Roll Dice"}
            onClick={handleRoll}
            isLoading={loading}
            className="w-full rounded-lg"
            textClassName="text-white"
          />
        </div>
      </div>
    </GameShell>
  );
}
