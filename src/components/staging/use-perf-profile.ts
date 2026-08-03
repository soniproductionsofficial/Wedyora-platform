"use client";

import { useEffect, useState } from "react";

export type PerfProfile = {
  isMobile: boolean;
  reduceMotion: boolean;
  particleCount: number;
  dprMax: number;
  enableWebGL: boolean;
};

/** Detect mobile / reduced-motion once on the client for 60fps fallbacks. */
export function usePerfProfile(): PerfProfile {
  const [profile, setProfile] = useState<PerfProfile>({
    isMobile: false,
    reduceMotion: false,
    particleCount: 64,
    dprMax: 1.75,
    enableWebGL: true,
  });

  useEffect(() => {
    const mobile = window.matchMedia("(max-width: 768px), (pointer: coarse)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Mobile: keep WebGL off by default (CSS orb fallback) for 60fps.
    // Low-end tablets with fine pointer still get a lighter particle field.
    setProfile({
      isMobile: mobile,
      reduceMotion: reduce,
      particleCount: reduce ? 0 : mobile ? 18 : 64,
      dprMax: mobile ? 1.25 : 1.75,
      enableWebGL: !reduce && !mobile,
    });
  }, []);

  return profile;
}
