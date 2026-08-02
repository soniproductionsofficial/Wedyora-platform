"use client";

import confetti from "canvas-confetti";
import { useEffect, useRef } from "react";

interface ConfettiBurstProps {
  /** Fire once when this becomes true (e.g. success banner visible). */
  fire?: boolean;
}

/**
 * Decorative celebration burst. Does not touch forms or server actions —
 * mount near an existing success UI state and pass `fire`.
 */
export default function ConfettiBurst({ fire = true }: ConfettiBurstProps) {
  const fired = useRef(false);

  useEffect(() => {
    if (!fire || fired.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    fired.current = true;

    const end = Date.now() + 900;
    const colors = ["#d4af6a", "#e2711d", "#c97b84", "#f0e4d0"];

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors,
        disableForReducedMotion: true,
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors,
        disableForReducedMotion: true,
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
  }, [fire]);

  return null;
}
