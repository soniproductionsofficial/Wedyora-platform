"use client";

import dynamic from "next/dynamic";

// Client-only lazy load — Three.js never ships in the SSR bundle.
const Floating3DScene = dynamic(() => import("@/components/ui/floating-3d-scene"), {
  ssr: false,
  loading: () => null,
});

interface Floating3DElementProps {
  className?: string;
}

/** Public wrapper used by pages — keeps dynamic import in one place. */
export default function Floating3DElement({ className }: Floating3DElementProps) {
  return <Floating3DScene className={className} />;
}
