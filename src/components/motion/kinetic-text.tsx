"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

interface KineticTextProps {
  children: string;
  className?: string;
  as?: "h1" | "h2" | "p" | "span";
  delay?: number;
}

/**
 * Character-stagger kinetic headline. Pass plain text only (no nested nodes)
 * so each glyph can animate independently.
 */
export default function KineticText({
  children,
  className = "",
  as: Tag = "h1",
  delay = 0,
}: KineticTextProps) {
  const reduce = useReducedMotion();
  const chars = Array.from(children);

  if (reduce) {
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <Tag className={className} aria-label={children}>
      <span className="inline-block" aria-hidden>
        {chars.map((char, i) => (
          <motion.span
            key={`${char}-${i}`}
            className="inline-block"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.45,
              delay: delay + i * 0.018,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{ whiteSpace: char === " " ? "pre" : undefined }}
          >
            {char}
          </motion.span>
        ))}
      </span>
    </Tag>
  );
}

interface KineticRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

/** Simpler block-level kinetic reveal for mixed JSX headlines. */
export function KineticReveal({ children, className = "", delay = 0 }: KineticRevealProps) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 24, clipPath: "inset(0 0 100% 0)" }}
      animate={{ opacity: 1, y: 0, clipPath: "inset(0 0 0% 0)" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
