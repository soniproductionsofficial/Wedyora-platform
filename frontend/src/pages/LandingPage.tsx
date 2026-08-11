import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, MapPin, ArrowRight } from "lucide-react";
import { api, money, type Vendor } from "../lib/api";
import { FlashCard } from "../components/FlashCard";
import WelcomePopup from "../components/WelcomePopup";
import { Button, FadeIn, Skeleton } from "../components/ui";

const CATEGORIES = [
  "Photography",
  "Catering",
  "Decoration",
  "Makeup",
  "Entertainment",
  "Lighting",
];

const STEPS = [
  {
    title: "Browse vendors",
    body: "Filter by category, city, budget, and rating.",
    icon: "1",
  },
  {
    title: "Book your event",
    body: "Tell us the date and services — we match the best partners.",
    icon: "2",
  },
  {
    title: "Vendors get notified",
    body: "Assigned vendors accept, complete tasks, and deliver.",
    icon: "3",
  },
];

const TESTIMONIALS = [
  {
    quote: "Wedyora matched us with a photographer in two days. The deposit flow made us feel safe.",
    name: "Ishita & Kabir",
    city: "Mumbai",
  },
  {
    quote: "As a vendor, the plan + refundable deposit was clear, and leads arrive with tasks ready.",
    name: "Meera Lens Studio",
    city: "Partner",
  },
];

export default function LandingPage() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    api
      .get("/vendors")
      .then((r) => setVendors(r.data.vendors ?? []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <WelcomePopup />

      <section className="relative min-h-[88vh] overflow-hidden bg-brand-black text-white">
        <motion.img
          src="/images/services/decoration.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-35"
          initial={{ scale: 1.12 }}
          animate={{ scale: 1 }}
          transition={{ duration: 12, ease: "easeOut" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-charcoal/75 via-brand-black/70 to-brand-black" />
        <div className="relative mx-auto max-w-6xl px-6 py-24 md:py-32">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-heading text-4xl md:text-6xl font-bold text-brand-gold-bright mb-4"
          >
            Wedyora
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="font-heading text-3xl md:text-5xl font-bold max-w-2xl mb-5"
          >
            For every moment, forever.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16 }}
            className="text-white/75 max-w-xl mb-8"
          >
            India&apos;s managed wedding marketplace — customers book, Wedyora
            assigns verified vendors and tasks, partners get notified instantly.
          </motion.p>

          <motion.form
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.24 }}
            className="flex flex-col sm:flex-row gap-3 max-w-2xl"
            onSubmit={(e) => {
              e.preventDefault();
              const params = new URLSearchParams();
              if (q) params.set("q", q);
              if (category) params.set("category", category);
              window.location.href = `/vendors?${params.toString()}`;
            }}
          >
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search vendors…"
              className="flex-1 rounded-full px-5 py-3 text-brand-black bg-white"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-full px-4 py-3 text-brand-black bg-white"
            >
              <option value="">All categories</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <Button type="submit" className="px-6 py-3">
              Search
            </Button>
          </motion.form>
        </div>
      </section>

      <section className="py-16 bg-white border-b border-brand-line">
        <div className="mx-auto max-w-6xl px-6">
          <FadeIn>
            <h2 className="font-heading text-2xl font-semibold mb-8 text-center">
              How it works
            </h2>
          </FadeIn>
          <div className="grid md:grid-cols-3 gap-4">
            {STEPS.map((s, i) => (
              <FadeIn key={s.title} delay={i * 0.08}>
                <FlashCard
                  front={
                    <div className="h-full flex flex-col items-center justify-center text-center">
                      <span className="h-10 w-10 rounded-full bg-brand-black text-brand-gold-bright flex items-center justify-center font-bold mb-3">
                        {s.icon}
                      </span>
                      <p className="font-heading font-semibold">{s.title}</p>
                      <p className="text-[11px] text-brand-gray mt-3">Tap to flip</p>
                    </div>
                  }
                  back={<p className="text-sm leading-relaxed text-white/85">{s.body}</p>}
                />
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-brand-cream">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex items-end justify-between gap-4 mb-8">
            <h2 className="font-heading text-2xl font-semibold">Featured vendors</h2>
            <Link to="/vendors" className="text-sm font-semibold text-brand-orange flex items-center gap-1">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          {loading ? (
            <div className="flex gap-4 overflow-hidden">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="min-w-[280px] h-72" />
              ))}
            </div>
          ) : (
            <div className="flex gap-4 overflow-x-auto pb-2 snap-x">
              {vendors.slice(0, 6).map((v, i) => (
                <motion.div
                  key={v.id}
                  initial={{ opacity: 0, x: 24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  whileHover={{ y: -6 }}
                  className="snap-start min-w-[280px] rounded-2xl overflow-hidden border border-brand-line bg-white shadow-sm"
                >
                  <Link to={`/vendors/${v.id}`}>
                    <div className="h-40 bg-brand-charcoal">
                      {v.portfolioUrls[0] && (
                        <img
                          src={v.portfolioUrls[0]}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>
                    <div className="p-4">
                      <p className="text-[11px] uppercase tracking-wide text-brand-gold font-semibold">
                        {v.category}
                      </p>
                      <p className="font-heading font-semibold">{v.businessName}</p>
                      <p className="text-xs text-brand-gray flex items-center gap-1 mt-1">
                        <MapPin className="h-3.5 w-3.5" /> {v.city}
                      </p>
                      <p className="text-xs mt-2 flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 text-brand-gold-bright fill-brand-gold-bright" />
                        {v.rating} · from {money(v.priceMin)}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="mx-auto max-w-6xl px-6 grid md:grid-cols-2 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <FadeIn key={t.name} delay={i * 0.1}>
              <blockquote className="rounded-3xl bg-brand-cream p-8">
                <p className="font-heading text-lg mb-4">&ldquo;{t.quote}&rdquo;</p>
                <footer className="text-sm text-brand-gray">
                  {t.name} · {t.city}
                </footer>
              </blockquote>
            </FadeIn>
          ))}
        </div>
      </section>

      <section className="bg-brand-black text-white py-16">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <h2 className="font-heading text-2xl font-semibold mb-3">Wedding vendors</h2>
          <p className="text-white/70 mb-6 max-w-xl mx-auto">
            Choose Basic, Premium, or Pro — pay a refundable deposit, get verified,
            and receive real-time job notifications.
          </p>
          <Link to="/signup?role=vendor">
            <Button>Become a partner</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
