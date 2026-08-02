"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useMemo } from "react";

/** Wedding: floating petal / bokeh dots. Maternity: warm light leaks. */
export default function AmbientMidground({
  mode,
  accent,
}: {
  mode: "petals" | "leaks";
  accent: string;
}) {
  const reduce = useReducedMotion();
  const petals = useMemo(
    () =>
      Array.from({ length: 16 }, (_, i) => ({
        id: i,
        left: `${4 + ((i * 6) % 90)}%`,
        top: `${6 + ((i * 9) % 75)}%`,
        size: 7 + (i % 5) * 3,
        delay: (i % 6) * 0.4,
        duration: 6.5 + (i % 5),
      })),
    []
  );

  if (reduce) return null;

  if (mode === "leaks") {
    return (
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <motion.div
          className="absolute -left-8 top-1/4 h-72 w-72 rounded-full bg-[#F6D7C3]/40 blur-3xl will-change-transform"
          animate={{ x: [0, 36, 0], y: [0, -18, 0], scale: [1, 1.12, 1] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute right-0 top-8 h-80 w-80 rounded-full bg-[#E2E8F0]/60 blur-3xl will-change-transform"
          animate={{ x: [0, -28, 0], y: [0, 24, 0] }}
          transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-16 left-1/3 h-64 w-64 rounded-full blur-3xl will-change-transform"
          style={{ background: `${accent}40` }}
          animate={{ opacity: [0.35, 0.7, 0.35], scale: [0.95, 1.18, 0.95] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    );
  }

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {petals.map((p) => (
        <motion.span
          key={p.id}
          className="absolute will-change-transform"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size * 1.3,
            background: `radial-gradient(circle at 30% 30%, ${accent}, transparent 70%)`,
            borderRadius: "60% 40% 55% 45%",
          }}
          animate={{
            y: [0, -26, 8, 0],
            x: [0, 10, -8, 0],
            rotate: [0, 20, -12, 0],
            opacity: [0.2, 0.65, 0.35, 0.2],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
