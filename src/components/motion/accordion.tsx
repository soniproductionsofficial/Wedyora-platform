"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export type AccordionEntry = {
  question: string;
  answer: string;
};

/**
 * FAQ-style accordion — smooth height + opacity expand/collapse, chevron
 * rotates 180°, and the active question switches to the accent color.
 */
export default function Accordion({
  items,
  accentClassName = "text-brand-magenta",
  defaultOpenIndex = 0,
  className = "",
}: {
  items: AccordionEntry[];
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
          <div key={item.question} className={`accordion-item ${open ? "is-open" : ""}`}>
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
              <ChevronDown
                className={`accordion-chevron h-4 w-4 shrink-0 ${
                  open ? accentClassName : "text-brand-gray"
                }`}
              />
            </button>
            <div className="accordion-panel">
              <div className="accordion-panel-inner px-5 pb-4">
                <p className="text-sm leading-relaxed text-brand-gray">
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
