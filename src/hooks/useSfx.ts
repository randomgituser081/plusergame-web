"use client";

import { useCallback, useRef } from "react";
import { sounds } from "@/constants";

type SoundKey = keyof typeof sounds;

export function useSfx() {
  const cache = useRef<Map<string, HTMLAudioElement>>(new Map());

  const play = useCallback((key: SoundKey) => {
    if (typeof window === "undefined") return;
    try {
      let audio = cache.current.get(key);
      if (!audio) {
        audio = new Audio(sounds[key]);
        cache.current.set(key, audio);
      }
      audio.currentTime = 0;
      void audio.play().catch(() => {});
    } catch {}
  }, []);

  return { play };
}
