"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Wraps any content and fades/slides it into view the first time it
 * scrolls into the viewport (see the .reveal / .reveal.is-visible rules
 * in globals.css for the actual animation). Pure CSS animation — this
 * component's only job is toggling one class at the right moment via
 * IntersectionObserver, so it stays a small, cheap Client Component
 * even though the pages that use it are Server Components.
 *
 * `delay` (ms) lets a row of siblings stagger in one after another
 * instead of all popping in at once. Renders a plain <div> — safe to
 * drop straight into a flex/grid layout as one of its direct children.
 */
export default function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${visible ? "is-visible" : ""} ${className}`}
      style={visible && delay ? { animationDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
