"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import ParticleBackground from "@/components/ui/particle-background";
import Floating3DElement from "@/components/ui/floating-3d-element";

interface HeroStageProps {
  children: ReactNode;
}

/**
 * Client visual shell for the landing hero: ambient particles + optional
 * 3D accents behind the server-rendered search / CTA content.
 */
export default function HeroStage({ children }: HeroStageProps) {
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-hidden luxury-gradient-dark text-white">
      <ParticleBackground density={56} />
      <Floating3DElement className="opacity-80 max-md:hidden" />

      {/* Soft full-bleed atmosphere plane (visual anchor under copy) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at 50% 120%, rgba(226,113,29,0.25), transparent 55%), linear-gradient(180deg, transparent 40%, rgba(15,12,10,0.55) 100%)",
        }}
      />

      <motion.div
        className="relative z-10 mx-auto max-w-6xl px-6 py-20 md:py-28"
        initial={reduce ? false : { opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </section>
  );
}
