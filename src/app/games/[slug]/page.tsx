"use client";

import { notFound } from "next/navigation";
import { GAMES, type GameSlug } from "@/constants";
import DiceGame from "@/components/games/DiceGame";
import LotteryGame from "@/components/games/LotteryGame";
import CardGame from "@/components/games/CardGame";
import CoinGame from "@/components/games/CoinGame";
import HotColdGame from "@/components/games/HotColdGame";
import LuckyBoxGame from "@/components/games/LuckyBoxGame";
import ReelStreakGame from "@/components/games/ReelStreakGame";
import RpsGame from "@/components/games/RpsGame";
import SpinGame from "@/components/games/SpinGame";

const MAP: Record<GameSlug, React.ComponentType> = {
  dice: DiceGame,
  lottery: LotteryGame,
  card: CardGame,
  coin: CoinGame,
  "hot-cold": HotColdGame,
  "lucky-box": LuckyBoxGame,
  "reel-streak": ReelStreakGame,
  "rps-bet": RpsGame,
  spin: SpinGame,
};

export default function GamePage({ params }: { params: { slug: string } }) {
  const slug = params.slug as GameSlug;
  const exists = GAMES.some((g) => g.slug === slug);
  if (!exists) notFound();
  const Game = MAP[slug];
  return <Game />;
}
