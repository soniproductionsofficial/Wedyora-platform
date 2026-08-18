"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { fadeUp, staggerContainer, VIEWPORT_ONCE } from "@/lib/motion";

/**
 * Parent wrapper for a grid/list of cards — triggers once in view, then
 * staggers each <StaggerItem> child's fadeUp by ~0.1s via Framer Motion's
 * variant propagation (no manual per-item delay math needed).
 */
export function StaggerContainer({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT_ONCE}
    >
      {children}
    </motion.div>
  );
}

/** A single staggered card/row inside a <StaggerContainer>. */
export function StaggerItem({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div className={className} variants={fadeUp}>
      {children}
    </motion.div>
  );
}
