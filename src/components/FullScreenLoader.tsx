"use client";

import Lottie from "lottie-react";
import { useEffect, useState } from "react";

export default function FullScreenLoader({ visible }: { visible: boolean }) {
  const [animationData, setAnimationData] = useState<object | null>(null);

  useEffect(() => {
    if (!visible) return;
    fetch("/images/loading.json")
      .then((res) => res.json())
      .then(setAnimationData)
      .catch(() => {});
  }, [visible]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/20 flex items-center justify-center">
      <div className="rounded-lg w-24 h-24 flex items-center justify-center bg-charcoal-light shadow-lg">
        {animationData ? (
          <Lottie
            animationData={animationData}
            loop
            autoplay
            style={{ width: 80, height: 80, marginTop: -10 }}
          />
        ) : (
          <div className="w-8 h-8 rounded-full border-2 border-yellow border-t-transparent animate-spin" />
        )}
      </div>
    </div>
  );
}
