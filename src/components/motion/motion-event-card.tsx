"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import TiltCard from "@/components/ui/tilt-card";
import GlassContainer from "@/components/ui/glass-container";

interface MotionEventCardProps {
  children: ReactNode;
  className?: string;
  index?: number;
  variant?: "light" | "dark";
}

/**
 * Staggered card entrance + tilt + glass surface for vendor/event grids.
 * Pure presentation — no data fetching or routing logic.
 */
export default function MotionEventCard({
  children,
  className = "",
  index = 0,
  variant = "light",
}: MotionEventCardProps) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 32, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: 0.55,
        delay: Math.min(index * 0.06, 0.36),
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={reduce ? undefined : { y: -4 }}
      className={className}
    >
      <TiltCard>
        <GlassContainer variant={variant} className="h-full overflow-hidden rounded-2xl">
          {children}
        </GlassContainer>
      </TiltCard>
    </motion.div>
  );
}
