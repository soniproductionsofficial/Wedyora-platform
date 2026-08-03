"use client";

import Spline from "@splinetool/react-spline";

/** Optional Spline scene loader for the staging hero. */
export default function StagingSplineHero({ url }: { url: string }) {
  return <Spline scene={url} style={{ width: "100%", height: "100%" }} />;
}
