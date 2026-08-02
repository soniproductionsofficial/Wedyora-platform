"use client";

import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useRef, type ReactNode } from "react";

interface ParallaxLayerProps {
  children: ReactNode;
  className?: string;
  /** Distance in px the layer travels relative to scroll. */
  offset?: number;
}

/** Lightweight scroll parallax using GPU transforms only. */
export default function ParallaxLayer({
  children,
  className = "",
  offset = 40,
}: ParallaxLayerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [-offset, offset]);

  return (
    <motion.div
      ref={ref}
      className={className}
      style={reduce ? undefined : { y, willChange: "transform" }}
    >
      {children}
    </motion.div>
  );
}
