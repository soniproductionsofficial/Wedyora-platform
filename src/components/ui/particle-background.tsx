"use client";

import { useEffect, useRef } from "react";

interface ParticleBackgroundProps {
  className?: string;
  /** Particle count — kept low for mobile performance. */
  density?: number;
  color?: string;
}

/**
 * Lightweight 2D canvas particle field (champagne dust). Avoids a second
 * WebGL context so it can sit under the hero alongside optional Three.js.
 */
export default function ParticleBackground({
  className = "",
  density = 48,
  color = "rgba(212, 175, 106, 0.55)",
}: ParticleBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let w = 0;
    let h = 0;
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    const count = isMobile ? Math.max(16, Math.floor(density * 0.4)) : density;

    const particles = Array.from({ length: count }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1.6 + 0.4,
      vx: (Math.random() - 0.5) * 0.00035,
      vy: -Math.random() * 0.00045 - 0.0001,
      a: Math.random() * 0.5 + 0.25,
    }));

    function resize() {
      if (!canvas) return;
      const parent = canvas.parentElement;
      w = parent?.clientWidth ?? window.innerWidth;
      h = parent?.clientHeight ?? 480;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function tick() {
      if (!ctx) return;
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -0.02) p.y = 1.02;
        if (p.x < -0.02) p.x = 1.02;
        if (p.x > 1.02) p.x = -0.02;
        ctx.beginPath();
        ctx.fillStyle = color.replace(/[\d.]+\)$/, `${p.a})`);
        ctx.arc(p.x * w, p.y * h, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    }

    resize();
    raf = requestAnimationFrame(tick);
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [color, density]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
}
