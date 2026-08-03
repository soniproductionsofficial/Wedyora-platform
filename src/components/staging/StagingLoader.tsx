"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * Cinematic 0–100% intro counter + curtain reveal into the staging canvas.
 */
export default function StagingLoader({ onDone }: { onDone: () => void }) {
  const reduce = useReducedMotion();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (reduce) {
      setProgress(100);
      setVisible(false);
      onDone();
      return;
    }

    let p = 0;
    const id = window.setInterval(() => {
      p += 2.2 + Math.random() * 3.5;
      if (p >= 100) {
        p = 100;
        setProgress(100);
        window.clearInterval(id);
        window.setTimeout(() => {
          setVisible(false);
          window.setTimeout(onDone, 700);
        }, 280);
      } else {
        setProgress(Math.floor(p));
      }
    }, 40);

    return () => window.clearInterval(id);
  }, [onDone, reduce]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[90] flex flex-col items-center justify-center overflow-hidden bg-[#0f0c0a] text-[#FAF9F6]"
          exit={{
            clipPath: "inset(0% 0% 100% 0%)",
            transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1] },
          }}
          style={{ willChange: "clip-path, transform, opacity" }}
        >
          <motion.p
            className="mb-2 font-heading text-4xl font-semibold tracking-[0.18em] md:text-5xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            WEDYORA
          </motion.p>
          <motion.p
            className="mb-12 text-[11px] font-semibold uppercase tracking-[0.35em] text-[#D4AF37]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            For every moment, forever
          </motion.p>

          <div className="relative mb-4 font-heading text-6xl font-semibold tabular-nums text-[#D4AF37] md:text-7xl">
            {progress}
            <span className="text-2xl text-white/50">%</span>
          </div>

          <div className="h-[2px] w-56 overflow-hidden rounded-full bg-white/10 md:w-72">
            <motion.div
              className="h-full origin-left bg-gradient-to-r from-[#D4AF37] via-[#e2711d] to-[#c97b84] will-change-transform"
              style={{ transform: `scaleX(${progress / 100})` }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
