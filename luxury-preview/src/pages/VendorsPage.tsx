import { useMemo, useRef, useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { useGSAP } from "@gsap/react";
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
import FloatingWeddingLayer from "../components/motion/FloatingWeddingLayer";
import { registerGsap } from "../lib/gsap";

export default function VendorsPage() {
  const [category, setCategory] = useState<VendorCategory | "all">("all");
  const [query, setQuery] = useState("");
  const [profile, setProfile] = useState<Vendor | null>(null);
  const [inquiry, setInquiry] = useState<Vendor | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const { gsap } = registerGsap();

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

  useGSAP(
    () => {
      if (!gridRef.current) return;
      const cards = gridRef.current.querySelectorAll("[data-vendor-card]");
      gsap.fromTo(
        cards,
        { opacity: 0, y: 36, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.55,
          stagger: 0.07,
          ease: "power3.out",
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );
    },
    { dependencies: [filtered.map((v) => v.id).join(",")], scope: gridRef }
  );

  return (
    <div className="relative">
      <FloatingWeddingLayer />

      <section className="relative z-10 luxury-gradient text-white">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-gold">
            Motion directory
          </p>
          <h1 className="mt-3 font-display text-4xl md:text-5xl">
            Browse verified partners
          </h1>
          <p className="mt-4 max-w-xl text-white/70">
            Animated filters with fluid layout morphing — Venues, Photographers,
            Caterers, Decorators. All listings, pricing, and links preserved.
          </p>
        </div>
      </section>

      <div className="relative z-10 mx-auto max-w-6xl px-6 py-10">
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
            <LayoutGroup>
              <div className="flex flex-wrap gap-2">
                {VENDOR_CATEGORIES.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCategory(c.id)}
                    className="relative rounded-full px-3.5 py-1.5 text-xs font-semibold"
                  >
                    {category === c.id && (
                      <motion.span
                        layoutId="vendor-filter-pill"
                        className="absolute inset-0 rounded-full bg-brand-orange"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    )}
                    <span
                      className={`relative z-10 ${
                        category === c.id ? "text-white" : "text-muted"
                      }`}
                    >
                      {c.label}
                    </span>
                  </button>
                ))}
              </div>
            </LayoutGroup>
          </div>
        </div>

        <div ref={gridRef}>
          <AnimatePresence mode="popLayout">
            <motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((v) => (
                <motion.button
                  key={v.id}
                  layout
                  data-vendor-card
                  type="button"
                  onClick={() => setProfile(v)}
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.94 }}
                  whileHover={{ y: -6 }}
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
                    <p className="mt-3 line-clamp-2 text-sm text-muted">
                      {v.tagline}
                    </p>
                    <p className="mt-4 text-sm font-semibold text-brand-orange">
                      From {formatInr(v.startingPriceInr)}
                      {v.category === "caterers" ? " / guest" : ""}
                    </p>
                  </div>
                </motion.button>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

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
