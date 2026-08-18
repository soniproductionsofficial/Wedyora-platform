"use client";

import { useEffect, useState } from "react";
import {
  Camera,
  Tag,
  Layers,
  Zap,
  Route,
  CalendarCheck,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "#occasions", label: "Occasions", icon: Camera },
  { href: "#core-packages", label: "Packages", icon: Tag },
  { href: "#combos", label: "Combos", icon: Layers },
  { href: "#photographer-now", label: "Now", icon: Zap },
  { href: "#journey", label: "Journey", icon: Route },
  { href: "#availability", label: "Book", icon: CalendarCheck },
] as const;

export default function MinutesFloatingNav() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setVisible(window.scrollY > window.innerHeight * 0.55);
        ticking = false;
      });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      aria-label="Photography in Minutes sections"
      className={`minutes-floating-nav fixed inset-x-0 bottom-5 z-40 flex justify-center px-4 ${
        visible ? "is-visible" : ""
      }`}
    >
      <div className="minutes-floating-pill flex items-center gap-1 rounded-full border-2 border-brand-magenta/25 bg-white p-1.5 shadow-[0_18px_44px_-18px_rgba(216,27,96,0.55)] backdrop-blur">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
          <a
            key={href}
            href={href}
            className="minutes-nav-item relative flex h-10 w-10 items-center justify-center rounded-full text-brand-magenta-deep transition-colors sm:h-11 sm:w-11"
          >
            <span
              className="minutes-nav-highlight absolute inset-0 rounded-full bg-brand-magenta/0 transition-all duration-200"
              aria-hidden
            />
            <Icon className="relative z-10 h-4.5 w-4.5 sm:h-5 sm:w-5" />
            <span className="minutes-nav-tooltip pointer-events-none absolute -top-9 left-1/2 whitespace-nowrap rounded-full bg-brand-magenta-deep px-2.5 py-1 text-[10px] font-semibold text-white opacity-0 transition-all duration-200">
              {label}
            </span>
          </a>
        ))}
      </div>
    </nav>
  );
}
