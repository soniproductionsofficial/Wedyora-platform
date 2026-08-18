"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

/** Scroll-triggered fade/slide-up — Flashoot-style entrance. */
export function MinutesReveal({
  children,
  className = "",
  delayMs = 0,
}: {
  children: ReactNode;
  className?: string;
  delayMs?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`minutes-reveal ${visible ? "is-visible" : ""} ${className}`}
      style={{ transitionDelay: `${delayMs}ms` }}
    >
      {children}
    </div>
  );
}

/** Infinite horizontal marquee (features / reviews). */
export function MinutesMarquee({
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
      className={`minutes-marquee ${className}`}
      style={
        {
          "--minutes-marquee-duration": `${speed}s`,
          "--minutes-marquee-direction": reverse ? "reverse" : "normal",
        } as CSSProperties
      }
    >
      <div className="minutes-marquee-track">
        <div className="minutes-marquee-group">{children}</div>
        <div className="minutes-marquee-group" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}

export function MinutesStat({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="text-center">
      <p className="font-heading text-2xl font-bold text-brand-magenta sm:text-3xl">
        {value}
      </p>
      <p className="mt-1 text-xs font-medium uppercase tracking-wide text-brand-gray">
        {label}
      </p>
    </div>
  );
}
