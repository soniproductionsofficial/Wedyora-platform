"use client";

import dynamic from "next/dynamic";
import { usePerfProfile } from "@/components/staging/use-perf-profile";

const ThreeScene = dynamic(() => import("@/components/staging/StagingHero3DScene"), {
  ssr: false,
  loading: () => null,
});

const SplineScene = dynamic(() => import("@/components/staging/StagingSplineHero"), {
  ssr: false,
  loading: () => null,
});

/**
 * High-impact hero WebGL layer.
 * Desktop: Three.js rings (+ optional Spline if NEXT_PUBLIC_SPLINE_HERO_URL is set)
 * Mobile / reduced-motion: soft CSS orbs
 */
export default function StagingHero3D({ className = "" }: { className?: string }) {
  const perf = usePerfProfile();
  const splineUrl = process.env.NEXT_PUBLIC_SPLINE_HERO_URL;

  if (!perf.enableWebGL) {
    return (
      <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
        <div className="absolute right-[10%] top-[22%] h-44 w-44 rounded-full bg-[#D4AF37]/25 blur-3xl" />
        <div className="float-soft absolute right-[22%] top-[40%] h-28 w-28 rounded-full border border-[#D4AF37]/35 bg-[#D4AF37]/10" />
      </div>
    );
  }

  if (splineUrl) {
    return (
      <div className={`pointer-events-none absolute inset-0 ${className}`} aria-hidden>
        <SplineScene url={splineUrl} />
      </div>
    );
  }

  return (
    <div className={`pointer-events-none absolute inset-0 ${className}`} aria-hidden>
      <ThreeScene dprMax={perf.dprMax} particleCount={perf.particleCount} />
    </div>
  );
}
