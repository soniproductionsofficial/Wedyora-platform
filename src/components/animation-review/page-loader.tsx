"use client";

import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

interface PageLoaderProps {
  visible: boolean;
  progress: number;
  accent: string;
  canvas: string;
  label: string;
}

/**
 * High-end curtain / progress loader. GPU-friendly transforms + opacity only.
 */
export default function PageLoader({
  visible,
  progress,
  accent,
  canvas,
  label,
}: PageLoaderProps) {
  const reduce = useReducedMotion();

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[80] flex flex-col items-center justify-center overflow-hidden"
          style={{ background: canvas, color: "#2B2B2B" }}
          initial={{ opacity: 1 }}
          exit={
            reduce
              ? { opacity: 0 }
              : {
                  clipPath: "inset(0 0 100% 0)",
                  opacity: 1,
                  transition: { duration: 0.85, ease: [0.76, 0, 0.24, 1] },
                }
          }
        >
          <motion.p
            className="mb-3 font-heading text-4xl font-semibold tracking-wide md:text-5xl"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            Wedyora
          </motion.p>
          <motion.p
            className="mb-10 text-xs font-semibold uppercase tracking-[0.28em]"
            style={{ color: accent }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.5 }}
          >
            {label}
          </motion.p>

          <div
            className="relative h-[2px] w-48 overflow-hidden rounded-full md:w-64"
            style={{ background: `${accent}33` }}
          >
            <motion.div
              className="absolute inset-y-0 left-0 will-change-transform"
              style={{
                background: accent,
                width: `${Math.min(100, Math.max(8, progress))}%`,
              }}
              transition={{ type: "spring", stiffness: 120, damping: 24 }}
            />
          </div>

          <motion.p
            className="mt-5 text-[11px] tracking-[0.2em] uppercase opacity-60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.65 }}
            transition={{ delay: 0.25 }}
          >
            Preparing your experience
          </motion.p>

          {/* Soft curtain panels for exit drama */}
          {!reduce && (
            <>
              <motion.div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-1/2 origin-top"
                style={{ background: canvas }}
                exit={{ y: "-100%", transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
              />
              <motion.div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 origin-bottom"
                style={{ background: canvas }}
                exit={{ y: "100%", transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
              />
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
