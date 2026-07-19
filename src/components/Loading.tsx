"use client";

import Lottie from "lottie-react";
import { useEffect, useState } from "react";

export default function Loading({ className = "" }: { className?: string }) {
  const [animationData, setAnimationData] = useState<object | null>(null);

  useEffect(() => {
    fetch("/images/loading.json")
      .then((res) => res.json())
      .then(setAnimationData)
      .catch(() => {});
  }, []);

  return (
    <div className={`w-full flex-1 flex items-center justify-center py-10 ${className}`}>
      {animationData ? (
        <Lottie animationData={animationData} loop autoplay style={{ width: 100, height: 100 }} />
      ) : (
        <div className="w-10 h-10 rounded-full border-2 border-yellow border-t-transparent animate-spin" />
      )}
    </div>
  );
}
