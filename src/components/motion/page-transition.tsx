"use client";

/// <reference types="react/canary" />

import { ViewTransition } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Orchestrates route-level motion:
 * - Native View Transitions for directional enter/exit during navigation
 * - Framer Motion entrance polish when the App Router remounts `template.tsx`
 */
export default function PageTransition({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();

  return (
    <ViewTransition
      enter={{
        "nav-forward": "nav-forward",
        "nav-back": "nav-back",
        default: "page-fade",
      }}
      exit={{
        "nav-forward": "nav-forward",
        "nav-back": "nav-back",
        default: "page-fade",
      }}
      default="none"
    >
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 14, filter: "blur(4px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="min-h-full"
      >
        {children}
      </motion.div>
    </ViewTransition>
  );
}
