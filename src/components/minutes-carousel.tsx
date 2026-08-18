"use client";

import { useRef, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function MinutesCarousel({
  children,
}: {
  children: ReactNode[];
}) {
  const trackRef = useRef<HTMLDivElement>(null);

  function scrollByCard(direction: 1 | -1) {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-minutes-carousel-item]");
    const amount = card ? card.offsetWidth + 16 : el.clientWidth * 0.85;
    el.scrollBy({ left: direction * amount, behavior: "smooth" });
  }

  return (
    <div className="minutes-carousel relative">
      <div
        ref={trackRef}
        className="minutes-carousel-track flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2"
      >
        {children.map((child, i) => (
          <div
            key={i}
            data-minutes-carousel-item
            className="w-[85%] shrink-0 snap-start sm:w-[46%] lg:w-[31%]"
          >
            {child}
          </div>
        ))}
      </div>

      <button
        type="button"
        aria-label="Previous"
        onClick={() => scrollByCard(-1)}
        className="minutes-carousel-arrow left-2.5 top-1/2 -translate-y-1/2 sm:-left-4"
      >
        <ChevronLeft className="h-4.5 w-4.5" />
      </button>
      <button
        type="button"
        aria-label="Next"
        onClick={() => scrollByCard(1)}
        className="minutes-carousel-arrow right-2.5 top-1/2 -translate-y-1/2 sm:-right-4"
      >
        <ChevronRight className="h-4.5 w-4.5" />
      </button>
    </div>
  );
}
