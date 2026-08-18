"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { scaleIn, VIEWPORT_ONCE } from "@/lib/motion";

/**
 * Scroll-triggered fade + scale (0.95 -> 1) entrance — for phone mockups,
 * app-preview cards, and other elements that should "pop in" rather than
 * slide up.
 */
export default function ScaleReveal({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      variants={scaleIn}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT_ONCE}
    >
      {children}
    </motion.div>
  );
}
