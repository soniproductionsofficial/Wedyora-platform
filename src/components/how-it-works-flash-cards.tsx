"use client";

import { useState } from "react";

export type FlashCardStep = {
  title: string;
  body: string;
  icon: string;
};

export default function HowItWorksFlashCards({
  steps,
}: {
  steps: FlashCardStep[];
}) {
  const [flipped, setFlipped] = useState<Record<number, boolean>>({});

  function toggle(i: number) {
    setFlipped((prev) => ({ ...prev, [i]: !prev[i] }));
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-5">
      {steps.map((step, i) => {
        const isFlipped = !!flipped[i];
        return (
          <button
            key={step.title}
            type="button"
            onClick={() => toggle(i)}
            aria-pressed={isFlipped}
            className="flash-card group relative h-52 text-left perspective-1000 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange rounded-2xl"
            style={{ animationDelay: `${0.08 * i}s` }}
          >
            <div
              className={`flash-card-inner relative h-full w-full transition-transform duration-500 [transform-style:preserve-3d] ${
                isFlipped ? "[transform:rotateY(180deg)]" : ""
              }`}
            >
              <div className="absolute inset-0 rounded-2xl border border-brand-line bg-white p-5 flex flex-col items-center justify-center text-center shadow-sm [backface-visibility:hidden]">
                <span className="text-4xl mb-3" aria-hidden>
                  {step.icon}
                </span>
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand-black text-brand-gold-bright text-xs font-bold mb-3">
                  {i + 1}
                </span>
                <h3 className="font-heading text-sm font-bold text-brand-black">
                  {step.title}
                </h3>
                <p className="mt-3 text-[11px] text-brand-gray">Tap to flip</p>
              </div>
              <div className="absolute inset-0 rounded-2xl border border-brand-gold/40 bg-brand-black text-white p-5 flex flex-col justify-center text-center shadow-md [backface-visibility:hidden] [transform:rotateY(180deg)]">
                <p className="text-xs leading-relaxed text-white/85">{step.body}</p>
                <p className="mt-4 text-[11px] text-brand-gold-bright">Tap to flip back</p>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
