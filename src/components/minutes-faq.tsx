"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { MINUTES_FAQS } from "@/lib/minutes-content";

export default function MinutesFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="mx-auto max-w-2xl divide-y divide-brand-line rounded-2xl border border-brand-line bg-white">
      {MINUTES_FAQS.map((faq, i) => {
        const open = openIndex === i;
        return (
          <div key={faq.question} className={`minutes-faq-item ${open ? "is-open" : ""}`}>
            <button
              type="button"
              aria-expanded={open}
              onClick={() => setOpenIndex(open ? null : i)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
            >
              <span
                className={`text-sm font-semibold transition-colors duration-200 sm:text-base ${
                  open ? "text-brand-magenta" : "text-brand-black"
                }`}
              >
                {faq.question}
              </span>
              <ChevronDown
                className={`minutes-faq-chevron h-4 w-4 shrink-0 transition-transform duration-300 ${
                  open ? "rotate-180 text-brand-magenta" : "text-brand-gray"
                }`}
              />
            </button>
            <div className="minutes-faq-panel">
              <div className="minutes-faq-panel-inner px-5 pb-4">
                <p className="text-sm leading-relaxed text-brand-gray">
                  {faq.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
