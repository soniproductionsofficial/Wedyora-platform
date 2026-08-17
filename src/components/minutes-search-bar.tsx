"use client";

import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";
import {
  MINUTES_CITIES,
  MINUTES_PACKAGES,
  minutesBookingHref,
} from "@/lib/minutes-content";

export default function MinutesSearchBar({
  variant = "hero",
}: {
  variant?: "hero" | "panel";
}) {
  const router = useRouter();
  const [city, setCity] = useState("Bengaluru");
  const [date, setDate] = useState("");
  const [packageId, setPackageId] = useState<string>(MINUTES_PACKAGES[1].id);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const pkg = MINUTES_PACKAGES.find((p) => p.id === packageId);
    router.push(
      minutesBookingHref({
        packageName: pkg?.name,
        city,
        date: date || undefined,
      })
    );
  }

  const shell =
    variant === "hero"
      ? "rounded-2xl border border-white/25 bg-black/45 p-3 shadow-xl backdrop-blur-md sm:p-4"
      : "rounded-2xl border border-brand-line bg-white p-4 shadow-sm sm:p-5";

  const label =
    variant === "hero" ? "text-white/80" : "text-brand-gray";
  const field =
    variant === "hero"
      ? "rounded-xl border border-white/20 bg-white/95 px-3 py-2.5 text-sm text-brand-black outline-none focus:ring-2 focus:ring-brand-gold-bright/50"
      : "rounded-xl border border-brand-line bg-white px-3 py-2.5 text-sm text-brand-black outline-none focus:ring-2 focus:ring-brand-magenta/30";

  return (
    <form onSubmit={onSubmit} className={shell}>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:items-end">
        <label className={`flex flex-col gap-1.5 text-xs font-semibold ${label}`}>
          Service type
          <select className={field} value="photography" disabled>
            <option value="photography">Photography (Minutes)</option>
          </select>
        </label>
        <label className={`flex flex-col gap-1.5 text-xs font-semibold ${label}`}>
          Location
          <select
            className={field}
            value={city}
            onChange={(e) => setCity(e.target.value)}
          >
            {MINUTES_CITIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <label className={`flex flex-col gap-1.5 text-xs font-semibold ${label}`}>
          Date
          <input
            type="date"
            className={field}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </label>
        <label className={`flex flex-col gap-1.5 text-xs font-semibold ${label}`}>
          Package
          <select
            className={field}
            value={packageId}
            onChange={(e) => setPackageId(e.target.value)}
          >
            {MINUTES_PACKAGES.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      <button
        type="submit"
        className="mt-3 w-full rounded-full bg-brand-button px-6 py-3 text-sm font-semibold text-brand-black transition-colors hover:bg-brand-button-dark sm:mt-4"
      >
        Search &amp; book
      </button>
    </form>
  );
}
