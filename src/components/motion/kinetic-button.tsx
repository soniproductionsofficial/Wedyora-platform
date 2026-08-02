"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  useRef,
  type MouseEvent,
  type ReactNode,
} from "react";

interface KineticButtonProps {
  children: ReactNode;
  className?: string;
  asChild?: boolean;
  strength?: number;
  pulse?: boolean;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  disabled?: boolean;
}

/**
 * High-energy CTA: magnetic pull + press scale + optional live pulse.
 * Use `asChild` when wrapping an existing Link (renders a motion.span shell).
 */
export default function KineticButton({
  children,
  className = "",
  asChild = false,
  strength = 0.3,
  pulse = false,
  type = "button",
  onClick,
  disabled,
}: KineticButtonProps) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  function handleMove(e: MouseEvent<HTMLElement>) {
    if (reduce || disabled) return;
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    el.style.transform = `translate3d(${x * strength}px, ${y * strength}px, 0) scale(1.03)`;
  }

  function handleLeave() {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "translate3d(0, 0, 0) scale(1)";
  }

  const shellClass = `inline-block will-change-transform transition-transform duration-200 ease-out ${pulse ? "animate-pulse-glow" : ""} ${className}`;

  if (asChild) {
    return (
      <motion.span
        ref={ref as React.RefObject<HTMLSpanElement>}
        className={shellClass}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        whileTap={reduce ? undefined : { scale: 0.97 }}
      >
        {children}
      </motion.span>
    );
  }

  return (
    <motion.button
      ref={ref as React.RefObject<HTMLButtonElement>}
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={shellClass}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      whileTap={reduce || disabled ? undefined : { scale: 0.97 }}
    >
      {children}
    </motion.button>
  );
}
