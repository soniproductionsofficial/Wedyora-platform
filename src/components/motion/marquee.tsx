"use client";

import type { CSSProperties, ReactNode } from "react";

/** Infinite horizontal marquee — USP tickers, review strips, logo walls. */
export default function Marquee({
  children,
  speed = 40,
  reverse = false,
  className = "",
}: {
  children: ReactNode;
  speed?: number;
  reverse?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`marquee ${className}`}
      style={
        {
          "--marquee-duration": `${speed}s`,
          "--marquee-direction": reverse ? "reverse" : "normal",
        } as CSSProperties
      }
    >
      <div className="marquee-track">
        <div className="marquee-group">{children}</div>
        <div className="marquee-group" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}
