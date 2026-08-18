"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { heroContainer, heroItem } from "@/lib/motion";

type HeroTag = "div" | "h1" | "p" | "span";

/**
 * Hero entrance sequence — animates on mount (not on scroll, since the
 * hero is already in view on load). Wrap the eyebrow/badge, heading,
 * subtext, and CTA row in <HeroItem> children; they stagger in ~100ms
 * apart in document order.
 */
export function HeroStagger({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      variants={heroContainer}
      initial="hidden"
      animate="visible"
    >
      {children}
    </motion.div>
  );
}

export function HeroItem({
  children,
  className = "",
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: HeroTag;
}) {
  const MotionTag = motion[as];
  return (
    <MotionTag className={className} variants={heroItem}>
      {children}
    </MotionTag>
  );
}
