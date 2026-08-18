"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Check, ArrowRight } from "lucide-react";
import {
  MINUTES_CATEGORIES,
  formatMinutesPrice,
  minutesBookingHref,
  type MinutesCategoryId,
} from "@/lib/minutes-content";

export default function MinutesCategoryPricing() {
  const [activeId, setActiveId] = useState<MinutesCategoryId>(
    MINUTES_CATEGORIES[0].id
  );

  const category = useMemo(
    () => MINUTES_CATEGORIES.find((c) => c.id === activeId) ?? MINUTES_CATEGORIES[0],
    [activeId]
  );

  return (
    <div>
      <div className="mb-8 flex gap-2 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {MINUTES_CATEGORIES.map((c) => {
          const selected = c.id === activeId;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => setActiveId(c.id)}
              className={`shrink-0 rounded-full px-3.5 py-2 text-xs font-semibold transition-all ${
                selected
                  ? "bg-brand-magenta text-white shadow-[0_10px_24px_-12px_rgba(216,27,96,0.8)]"
                  : "border border-brand-line bg-white text-brand-black hover:border-brand-magenta/40 hover:text-brand-magenta"
              }`}
            >
              {c.title}
            </button>
          );
        })}
      </div>

      <div className="mb-6 max-w-2xl">
        <h3 className="font-wedding-display text-2xl font-semibold text-brand-magenta-deep">
          {category.title}
        </h3>
        <p className="mt-2 text-sm text-brand-gray">{category.body}</p>
        <p className="mt-2 text-xs font-semibold text-brand-magenta">
          Starting {formatMinutesPrice({ price: category.startingPrice })}
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {category.packages.map((pkg) => (
          <article
            key={pkg.id}
            className={`minutes-lift flex flex-col rounded-2xl border bg-white p-5 ${
              pkg.featured
                ? "border-brand-magenta shadow-[0_18px_40px_-28px_rgba(216,27,96,0.55)]"
                : "border-brand-line"
            }`}
          >
            {pkg.featured ? (
              <span className="mb-2 w-fit rounded-full bg-brand-magenta/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand-magenta">
                Most popular
              </span>
            ) : (
              <span className="mb-2 h-5" aria-hidden />
            )}
            <h4 className="font-heading text-lg font-semibold text-brand-black">
              {pkg.name}
            </h4>
            <p className="mt-2 font-heading text-2xl font-bold text-brand-magenta">
              {formatMinutesPrice(pkg)}
            </p>
            <ul className="mt-4 flex flex-1 flex-col gap-2">
              {pkg.includes.map((line) => (
                <li
                  key={line}
                  className="flex items-start gap-2 text-sm text-brand-gray"
                >
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-magenta" />
                  {line}
                </li>
              ))}
            </ul>
            <Link
              href={minutesBookingHref({
                categoryId: category.id,
                packageName: `${category.title}: ${pkg.name}`,
              })}
              className="mt-5 inline-flex items-center justify-center gap-1.5 rounded-full bg-brand-magenta px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-magenta-deep"
            >
              Book {pkg.name}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
