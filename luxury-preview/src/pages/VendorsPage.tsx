import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MapPin, Star, Search } from "lucide-react";
import {
  VENDORS,
  VENDOR_CATEGORIES,
  formatInr,
  type Vendor,
  type VendorCategory,
} from "../data/vendors";
import VendorProfileDrawer from "../components/VendorProfileDrawer";
import InquiryDrawer from "../components/InquiryDrawer";

export default function VendorsPage() {
  const [category, setCategory] = useState<VendorCategory | "all">("all");
  const [query, setQuery] = useState("");
  const [profile, setProfile] = useState<Vendor | null>(null);
  const [inquiry, setInquiry] = useState<Vendor | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return VENDORS.filter((v) => {
      if (category !== "all" && v.category !== category) return false;
      if (!q) return true;
      return (
        v.name.toLowerCase().includes(q) ||
        v.city.toLowerCase().includes(q) ||
        v.tagline.toLowerCase().includes(q) ||
        v.services.some((s) => s.toLowerCase().includes(q))
      );
    });
  }, [category, query]);

  return (
    <div>
      <section className="luxury-gradient text-white">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-gold">
            Vendor directory
          </p>
          <h1 className="mt-3 font-display text-4xl md:text-5xl">
            Browse verified partners
          </h1>
          <p className="mt-4 max-w-xl text-white/70">
            Filter by venues, photographers, caterers, and decorators. Every
            listing here reflects Wedyora&apos;s verified standard — bookings
            complete on the live site.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="glass sticky top-[4.5rem] z-20 -mt-16 mb-10 rounded-2xl border border-white/10 bg-surface/90 p-3 shadow-lg backdrop-blur-xl md:top-20">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search city, name, or service…"
                className="w-full rounded-xl border border-line bg-surface-elevated py-2.5 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-brand-gold/35"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {VENDOR_CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCategory(c.id)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                    category === c.id
                      ? "bg-brand-orange text-white"
                      : "border border-line bg-surface-elevated text-muted hover:text-foreground"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <AnimatePresence mode="popLayout">
          <motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((v) => (
              <motion.button
                key={v.id}
                layout
                type="button"
                onClick={() => setProfile(v)}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.35 }}
                className="overflow-hidden rounded-2xl border border-line bg-surface text-left shadow-sm"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={v.coverImage}
                    alt={v.name}
                    className="h-full w-full object-cover"
                  />
                  <span className="absolute bottom-3 left-3 rounded-full bg-brand-black/60 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-brand-gold backdrop-blur">
                    {v.category}
                  </span>
                </div>
                <div className="p-5">
                  <div className="mb-2 flex items-center gap-2 text-xs text-brand-gold">
                    <Star className="h-3.5 w-3.5 fill-brand-gold" />
                    {v.rating.toFixed(1)} · {v.reviewCount}
                  </div>
                  <h3 className="font-display text-2xl">{v.name}</h3>
                  <p className="mt-1 flex items-center gap-1 text-sm text-muted">
                    <MapPin className="h-3.5 w-3.5" />
                    {v.city}, {v.state}
                  </p>
                  <p className="mt-3 line-clamp-2 text-sm text-muted">{v.tagline}</p>
                  <p className="mt-4 text-sm font-semibold text-brand-orange">
                    From {formatInr(v.startingPriceInr)}
                    {v.category === "caterers" ? " / guest" : ""}
                  </p>
                </div>
              </motion.button>
            ))}
          </motion.div>
        </AnimatePresence>

        {filtered.length === 0 && (
          <p className="py-16 text-center text-sm text-muted">
            No vendors match those filters. Try another category or city.
          </p>
        )}
      </div>

      <VendorProfileDrawer
        vendor={profile}
        onClose={() => setProfile(null)}
        onInquire={(v) => {
          setProfile(null);
          setInquiry(v);
        }}
      />
      <InquiryDrawer vendor={inquiry} onClose={() => setInquiry(null)} />
    </div>
  );
}
