"use client";

import { useEffect, useState } from "react";
import { Camera, Calendar, BadgeCheck } from "lucide-react";

const SCREENS = [
  {
    key: "home",
    label: "Choose occasion",
    icon: Camera,
    lines: ["Pooja", "Birthday", "Maternity", "Instant Reels"],
  },
  {
    key: "booking",
    label: "Pick package & pay",
    icon: Calendar,
    lines: ["Standard · ₹2,999", "Bengaluru · Today", "Pay securely"],
  },
  {
    key: "confirmed",
    label: "Booking confirmed",
    icon: BadgeCheck,
    lines: ["Booking ID #WM2481", "Photographer assigned", "Arrival window shared"],
  },
] as const;

export default function MinutesAppPreview() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduceMotion) return;
    const id = setInterval(() => {
      setActive((prev) => (prev + 1) % SCREENS.length);
    }, 3200);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="mx-auto w-[220px] sm:w-[240px]">
      <div className="relative aspect-[9/18.5] overflow-hidden rounded-[2rem] border-[6px] border-brand-magenta-deep bg-white shadow-[0_30px_60px_-30px_rgba(216,27,96,0.5)]">
        {SCREENS.map((screen, i) => {
          const Icon = screen.icon;
          return (
            <div
              key={screen.key}
              className={`minutes-app-screen absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-b from-white to-brand-cream/70 p-5 text-center transition-opacity duration-500 ${
                i === active ? "opacity-100" : "opacity-0"
              }`}
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-magenta/10 text-brand-magenta">
                <Icon className="h-5 w-5" />
              </span>
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-magenta">
                {screen.label}
              </p>
              <div className="mt-1 flex w-full flex-col gap-1.5">
                {screen.lines.map((line) => (
                  <span
                    key={line}
                    className="truncate rounded-full bg-white px-3 py-1.5 text-[11px] font-medium text-brand-black shadow-sm"
                  >
                    {line}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-4 flex justify-center gap-1.5">
        {SCREENS.map((screen, i) => (
          <span
            key={screen.key}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === active ? "w-6 bg-brand-magenta" : "w-1.5 bg-brand-line"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
