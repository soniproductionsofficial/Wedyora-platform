"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { EASE_OUT, fadeUp, VIEWPORT_ONCE } from "@/lib/motion";

/**
 * Scroll-triggered fade + slide-up entrance — the site-wide default.
 * Wrap any card, section, or list item to animate it in once as it
 * enters the viewport (opacity 0/y:24 -> opacity 1/y:0, ~0.5s ease-out).
 */
export default function Reveal({
  children,
  className = "",
  delayMs = 0,
}: {
  children: ReactNode;
  className?: string;
  delayMs?: number;
}) {
  return (
    <motion.div
      className={className}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT_ONCE}
      transition={{ duration: 0.5, ease: EASE_OUT, delay: delayMs / 1000 }}
    >
      {children}
    </motion.div>
  );
}
