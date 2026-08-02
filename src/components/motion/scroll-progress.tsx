"use client";

import { motion, useScroll, useSpring, useReducedMotion } from "framer-motion";

/** Thin top-of-viewport progress bar driven by page scroll. */
export default function ScrollProgress() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 28,
    restDelta: 0.001,
  });

  if (reduce) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 right-0 top-0 z-[60] h-[2px] origin-left bg-gradient-to-r from-brand-gold via-brand-orange to-brand-rose"
      style={{ scaleX }}
    />
  );
}
