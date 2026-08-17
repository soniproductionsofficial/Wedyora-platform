"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, FormEvent } from "react";
import {
  MINUTES_CATEGORIES,
  MINUTES_CITIES,
  getMinutesCategory,
  minutesBookingHref,
} from "@/lib/minutes-content";

export default function MinutesSearchBar({
  variant = "hero",
}: {
  variant?: "hero" | "panel";
}) {
  const router = useRouter();
  const [categoryId, setCategoryId] = useState(MINUTES_CATEGORIES[0].id);
  const [city, setCity] = useState("Bengaluru");
  const [date, setDate] = useState("");
  const [packageId, setPackageId] = useState("");

  const category = useMemo(
    () => getMinutesCategory(categoryId),
    [categoryId]
  );

  useEffect(() => {
    const featured =
      category.packages.find((p) => p.featured)?.id ?? category.packages[0]?.id;
    setPackageId(featured ?? "");
  }, [category]);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const pkg = category.packages.find((p) => p.id === packageId);
    router.push(
      minutesBookingHref({
        packageName: pkg
          ? `${category.title}: ${pkg.name}`
          : undefined,
        categoryId: category.id,
        city,
        date: date || undefined,
      })
    );
  }

  const shell =
    variant === "hero"
      ? "rounded-2xl border border-white/25 bg-black/45 p-3 shadow-xl backdrop-blur-md sm:p-4"
      : "rounded-2xl border border-brand-line bg-white p-4 shadow-sm sm:p-5";

  const label = variant === "hero" ? "text-white/80" : "text-brand-gray";
  const field =
    variant === "hero"
      ? "rounded-xl border border-white/20 bg-white/95 px-3 py-2.5 text-sm text-brand-black outline-none focus:ring-2 focus:ring-brand-gold-bright/50"
      : "rounded-xl border border-brand-line bg-white px-3 py-2.5 text-sm text-brand-black outline-none focus:ring-2 focus:ring-brand-magenta/30";

  return (
    <form onSubmit={onSubmit} className={shell}>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:items-end">
        <label className={`flex flex-col gap-1.5 text-xs font-semibold ${label}`}>
          Occasion
          <select
            className={field}
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value as typeof categoryId)}
          >
            {MINUTES_CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
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
            {category.packages.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} · ₹{p.price.toLocaleString("en-IN")}
                {"priceNote" in p && p.priceNote === "+" ? "+" : ""}
              </option>
            ))}
          </select>
        </label>
      </div>
      <button
        type="submit"
        className="mt-3 w-full rounded-full bg-brand-button px-6 py-3 text-sm font-semibold text-brand-black transition-colors hover:bg-brand-button-dark sm:mt-4"
      >
        Book a photographer
      </button>
    </form>
  );
}
