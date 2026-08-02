"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";

export interface AnimatedTab {
  id: string;
  label: string;
  href: string;
}

interface AnimatedTabSwitchProps {
  tabs: AnimatedTab[];
  activeId: string;
  className?: string;
}

/**
 * Pill tab switcher with a sliding active indicator.
 * Uses normal Link navigation so filter/query routes stay unchanged.
 */
export default function AnimatedTabSwitch({
  tabs,
  activeId,
  className = "",
}: AnimatedTabSwitchProps) {
  const reduce = useReducedMotion();

  return (
    <div
      className={`glass-panel relative flex flex-wrap gap-1 rounded-full p-1.5 ${className}`}
      role="tablist"
    >
      {tabs.map((tab) => {
        const active = tab.id === activeId;
        return (
          <Link
            key={tab.id}
            href={tab.href}
            role="tab"
            aria-selected={active}
            transitionTypes={["nav-forward"]}
            className={`relative z-10 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              active ? "text-brand-black" : "text-brand-gray hover:text-brand-black"
            }`}
          >
            {active && (
              <motion.span
                layoutId={reduce ? undefined : "tab-pill"}
                className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-brand-champagne via-white to-brand-champagne shadow-sm"
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
              />
            )}
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
