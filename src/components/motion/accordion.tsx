"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { EASE_OUT } from "@/lib/motion";

export type AccordionEntry = {
  question: string;
  answer: string;
};

/**
 * FAQ-style accordion — panel expands with a smooth height animation
 * (Framer Motion AnimatePresence, height: auto), the chevron rotates
 * 180° over 200ms, and content fades in slightly after height settles.
 */
export default function Accordion({
  items,
  accentClassName = "text-brand-magenta",
  defaultOpenIndex = 0,
  className = "",
}: {
  items: readonly AccordionEntry[];
  accentClassName?: string;
  defaultOpenIndex?: number | null;
  className?: string;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpenIndex);

  return (
    <div
      className={`divide-y divide-brand-line rounded-2xl border border-brand-line bg-white ${className}`}
    >
      {items.map((item, i) => {
        const open = openIndex === i;
        return (
          <div key={item.question}>
            <button
              type="button"
              aria-expanded={open}
              onClick={() => setOpenIndex(open ? null : i)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
            >
              <span
                className={`text-sm font-semibold transition-colors duration-200 sm:text-base ${
                  open ? accentClassName : "text-brand-black"
                }`}
              >
                {item.question}
              </span>
              <motion.span
                animate={{ rotate: open ? 180 : 0 }}
                transition={{ duration: 0.2, ease: EASE_OUT }}
                className={`shrink-0 ${open ? accentClassName : "text-brand-gray"}`}
              >
                <ChevronDown className="h-4 w-4" />
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  key="content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{
                    height: { duration: 0.3, ease: EASE_OUT },
                    opacity: { duration: 0.2, delay: 0.1 },
                  }}
                  style={{ overflow: "hidden" }}
                >
                  <div className="px-5 pb-4">
                    <p className="text-sm leading-relaxed text-brand-gray">
                      {item.answer}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
