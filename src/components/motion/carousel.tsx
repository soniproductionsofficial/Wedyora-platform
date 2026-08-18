"use client";

import { useRef, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/** Horizontally swipeable carousel with left/right arrow buttons. */
export default function Carousel({
  children,
  itemClassName = "w-[85%] sm:w-[46%] lg:w-[31%]",
}: {
  children: ReactNode[];
  itemClassName?: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);

  function scrollByCard(direction: 1 | -1) {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-carousel-item]");
    const amount = card ? card.offsetWidth + 16 : el.clientWidth * 0.85;
    el.scrollBy({ left: direction * amount, behavior: "smooth" });
  }

  return (
    <div className="relative">
      <div
        ref={trackRef}
        className="carousel-track flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2"
      >
        {children.map((child, i) => (
          <div
            key={i}
            data-carousel-item
            className={`shrink-0 snap-start ${itemClassName}`}
          >
            {child}
          </div>
        ))}
      </div>

      <button
        type="button"
        aria-label="Previous"
        onClick={() => scrollByCard(-1)}
        className="carousel-arrow left-2.5 top-1/2 -translate-y-1/2 sm:-left-4"
      >
        <ChevronLeft className="h-4.5 w-4.5" />
      </button>
      <button
        type="button"
        aria-label="Next"
        onClick={() => scrollByCard(1)}
        className="carousel-arrow right-2.5 top-1/2 -translate-y-1/2 sm:-right-4"
      >
        <ChevronRight className="h-4.5 w-4.5" />
      </button>
    </div>
  );
}
