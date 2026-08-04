"use client";

import { useEffect, useRef, useState } from "react";

// A small looping clip (white paper airplane trailing pink hearts) that
// drifts diagonally across whatever section it's placed in, on a loop.
// The clip's own background is solid black rather than real
// transparency, so it's rendered with `mix-blend-mode: screen` — that
// blend mode makes pure black vanish against any background color
// behind it (screening pure black onto anything is a no-op), which
// fakes transparency without needing a real alpha channel.
export default function PaperPlane() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reducedMotion) {
      videoRef.current?.pause();
    }
  }, []);

  return (
    <div className="paper-plane-track" aria-hidden="true">
      <video
        ref={videoRef}
        className="paper-plane-video"
        src="/paper-plane-heart.webm"
        autoPlay
        loop
        muted
        playsInline
      />
    </div>
  );
}
