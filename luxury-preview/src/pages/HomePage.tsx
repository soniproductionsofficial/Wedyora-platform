import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  ShieldCheck,
  CreditCard,
  Headset,
  CalendarCheck,
  ArrowRight,
  Calculator,
} from "lucide-react";
import {
  getFeaturedVendors,
  formatInr,
  LIVE,
  type Vendor,
} from "../data/vendors";
import VendorProfileDrawer from "../components/VendorProfileDrawer";
import InquiryDrawer from "../components/InquiryDrawer";

const HERO_SLIDES = [
  {
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&q=80",
    caption: "Heritage venues",
  },
  {
    image:
      "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=1920&q=80",
    caption: "Editorial photography",
  },
  {
    image:
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1920&q=80",
    caption: "Couture décor",
  },
];

const WHY = [
  {
    icon: ShieldCheck,
    title: "Every Vendor Is Verified",
    body: "No open marketplace guessing — our team reviews every vendor before they can take a booking.",
  },
  {
    icon: CreditCard,
    title: "Secure, Trackable Payments",
    body: "Deposits are paid and tracked through Razorpay, not cash or unofficial transfers.",
  },
  {
    icon: CalendarCheck,
    title: "One Team, Start to Finish",
    body: "Wedyora manages the booking end-to-end, so you're never left coordinating alone.",
  },
  {
    icon: Headset,
    title: "A Real Team Behind It",
    body: "Questions or issues get a person, not just an app.",
  },
];

export default function HomePage() {
  const [slide, setSlide] = useState(0);
  const [profile, setProfile] = useState<Vendor | null>(null);
  const [inquiry, setInquiry] = useState<Vendor | null>(null);
  const featured = getFeaturedVendors();

  useEffect(() => {
    const id = window.setInterval(
      () => setSlide((s) => (s + 1) % HERO_SLIDES.length),
      5500
    );
    return () => window.clearInterval(id);
  }, []);

  return (
    <div>
      {/* Hero — brand-first, full-bleed */}
      <section className="relative min-h-[92vh] overflow-hidden text-white">
        <AnimatePresence mode="wait">
          <motion.div
            key={HERO_SLIDES[slide].image}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <img
              src={HERO_SLIDES[slide].image}
              alt=""
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-brand-black via-brand-black/75 to-brand-black/35" />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-black/90 via-transparent to-brand-black/40" />
          </motion.div>
        </AnimatePresence>

        <div className="relative mx-auto flex min-h-[92vh] max-w-6xl flex-col justify-end px-6 pb-20 pt-28 md:justify-center md:pb-24">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.7 }}
            className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-brand-gold"
          >
            India&apos;s Managed Wedding Services Platform
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28, duration: 0.8 }}
            className="font-display text-5xl leading-[1.05] tracking-tight md:text-7xl lg:text-8xl"
          >
            Wedyora
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.42, duration: 0.75 }}
            className="mt-5 max-w-lg text-base text-white/75 md:text-lg"
          >
            Find. Book. Celebrate. — verified photographers, décor, catering and
            more, with one team accountable start to finish.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.7 }}
            className="mt-9 flex flex-wrap gap-3"
          >
            <Link
              to="/vendors"
              className="inline-flex items-center gap-2 rounded-full bg-brand-orange px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-orange-dark"
            >
              Explore vendors
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href={LIVE.book}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/35 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-brand-black"
            >
              Plan on live site
            </a>
          </motion.div>

          <div className="mt-12 flex gap-2">
            {HERO_SLIDES.map((s, i) => (
              <button
                key={s.caption}
                type="button"
                aria-label={s.caption}
                onClick={() => setSlide(i)}
                className={`h-1 rounded-full transition-all ${
                  i === slide ? "w-10 bg-brand-gold" : "w-4 bg-white/35"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Featured vendors */}
      <section className="bg-background py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-10 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-gold">
                Verified network
              </p>
              <h2 className="mt-2 font-display text-3xl md:text-4xl">
                Featured partners
              </h2>
            </div>
            <Link
              to="/vendors"
              className="text-sm font-semibold text-brand-orange hover:text-brand-orange-dark"
            >
              View directory →
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((v, i) => (
              <motion.button
                key={v.id}
                type="button"
                onClick={() => setProfile(v)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                whileHover={{ y: -4 }}
                className="group overflow-hidden rounded-2xl border border-line bg-surface text-left shadow-sm"
              >
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={v.coverImage}
                    alt={v.name}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                  <span className="absolute left-3 top-3 rounded-full bg-brand-black/55 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-brand-gold backdrop-blur">
                    {v.category}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-display text-xl">{v.name}</h3>
                  <p className="mt-1 text-xs text-muted">
                    {v.city} · from {formatInr(v.startingPriceInr)}
                  </p>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Why Wedyora */}
      <section className="border-t border-line bg-surface py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="mb-12 text-center font-display text-3xl md:text-4xl">
            Why couples choose Wedyora
          </h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {WHY.map(({ icon: Icon, title, body }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="text-center"
              >
                <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-brand-gold/30 bg-brand-gold/10 text-brand-gold">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="font-display text-xl">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tool CTA */}
      <section className="luxury-gradient py-20 text-white">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <Calculator className="mx-auto mb-4 h-8 w-8 text-brand-gold" />
          <h2 className="font-display text-3xl md:text-4xl">
            Wedding Budget Estimator
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-white/70">
            Sketch a first-pass budget by guest count and city tier — then book
            verified vendors on the live Wedyora platform.
          </p>
          <Link
            to="/tools/budget"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand-orange px-6 py-3 text-sm font-semibold text-white hover:bg-brand-orange-dark"
          >
            Open estimator
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Vendor apply */}
      <section className="bg-brand-black py-16 text-center text-white">
        <h2 className="font-display text-3xl">Are you a wedding vendor?</h2>
        <p className="mx-auto mt-3 max-w-xl text-white/70">
          Join Wedyora&apos;s verified vendor network and get matched with
          couples planning their wedding in your city.
        </p>
        <a
          href={LIVE.vendorApply}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-block rounded-full bg-brand-orange px-6 py-3 text-sm font-semibold text-white hover:bg-brand-orange-dark"
        >
          Apply as a Vendor
        </a>
      </section>

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
