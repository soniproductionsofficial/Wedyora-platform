"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface LiveBadgeProps {
  label?: string;
  className?: string;
}

/** Pulsing status chip — pulse only mounts after hydration to avoid mismatch. */
export default function LiveBadge({
  label = "Verified",
  className = "",
}: LiveBadgeProps) {
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setPulse(!reduce);
  }, []);

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border border-brand-gold/35 bg-brand-gold/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-gold ${className}`}
    >
      <span className="relative flex h-2 w-2">
        {pulse && (
          <motion.span
            className="absolute inset-0 rounded-full bg-brand-orange"
            animate={{ scale: [1, 2.1], opacity: [0.55, 0] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeOut" }}
          />
        )}
        <span className="relative h-2 w-2 rounded-full bg-brand-orange" />
      </span>
      {label}
    </span>
  );
}
