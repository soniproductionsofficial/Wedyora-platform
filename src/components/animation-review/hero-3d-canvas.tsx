"use client";

import dynamic from "next/dynamic";

const Hero3DScene = dynamic(() => import("@/components/animation-review/hero-3d-scene"), {
  ssr: false,
  loading: () => null,
});

/** Client-only 3D stage for the animation-review hero — larger & more visible. */
export default function Hero3DCanvas({
  className = "",
  accent = "#d4af6a",
}: {
  className?: string;
  accent?: string;
}) {
  return <Hero3DScene className={className} accent={accent} />;
}
