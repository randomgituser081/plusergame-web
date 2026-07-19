"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { images } from "@/constants";

const ZOOM_STAGES = [
  { width: 55, height: 62 },
  { width: 100, height: 108 },
  { width: 140, height: 150 },
];

type SplashScreenProps = {
  /** When true, play full zoom animation then call onDone. When false, show static logo (auth loading). */
  animate?: boolean;
  onDone?: () => void;
};

export default function SplashScreen({ animate = true, onDone }: SplashScreenProps) {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    if (!animate) return;

    const t1 = setTimeout(() => setStage(1), 600);
    const t2 = setTimeout(() => setStage(2), 1200);
    const t3 = setTimeout(() => onDone?.(), 3200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [animate, onDone]);

  const size = ZOOM_STAGES[animate ? stage : 2];

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-charcoal bg-cover bg-center"
      style={{ backgroundImage: `url(${images.splash})` }}
    >
      <div className="absolute inset-0 bg-charcoal/40" />
      <motion.img
        src={images.logo}
        alt="Pluser Game"
        className="relative z-10 object-contain"
        animate={{ width: size.width, height: size.height }}
        transition={{ duration: 0.01 }}
        style={{ width: size.width, height: size.height }}
      />
    </div>
  );
}
