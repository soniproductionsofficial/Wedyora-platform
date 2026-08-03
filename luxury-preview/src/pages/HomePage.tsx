import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
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
import FloatingWeddingLayer from "../components/motion/FloatingWeddingLayer";
import PinnedScrollJourney from "../components/motion/PinnedScrollJourney";
import WeddingTimeline from "../components/motion/WeddingTimeline";
import { RevealStagger, StatCounter } from "../components/motion/Reveal";

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
  const [profile, setProfile] = useState<Vendor | null>(null);
  const [inquiry, setInquiry] = useState<Vendor | null>(null);
  const featured = getFeaturedVendors();

  return (
    <div className="relative">
      <FloatingWeddingLayer />

      <PinnedScrollJourney />

      {/* Stats */}
      <section className="relative z-10 border-y border-line bg-surface py-16">
        <RevealStagger className="mx-auto grid max-w-5xl grid-cols-2 gap-10 px-6 md:grid-cols-4">
          <StatCounter value={500} suffix="+" label="Verified vendors" />
          <StatCounter value={120} suffix="+" label="Cities covered" />
          <StatCounter value={4} suffix="" label="Core categories" />
          <StatCounter value={24} suffix="/7" label="Support chat" />
        </RevealStagger>
      </section>

      {/* Featured vendors — scroll reveal */}
      <section className="relative z-10 bg-background py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-12 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-gold">
                Verified network
              </p>
              <h2 className="mt-2 font-display text-4xl md:text-5xl">
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

          <RevealStagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((v) => (
              <button
                key={v.id}
                type="button"
                data-reveal
                onClick={() => setProfile(v)}
                className="group overflow-hidden rounded-2xl border border-line bg-surface text-left shadow-sm"
              >
                <div className="relative h-48 overflow-hidden">
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
              </button>
            ))}
          </RevealStagger>
        </div>
      </section>

      <div className="relative z-10 bg-surface">
        <WeddingTimeline />
      </div>

      {/* Why */}
      <section className="relative z-10 border-t border-line bg-background py-24">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="mb-14 text-center font-display text-4xl md:text-5xl">
            Why couples choose Wedyora
          </h2>
          <RevealStagger className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {WHY.map(({ icon: Icon, title, body }) => (
              <div key={title} data-reveal className="text-center">
                <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-brand-gold/30 bg-brand-gold/10 text-brand-gold">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="font-display text-xl">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{body}</p>
              </div>
            ))}
          </RevealStagger>
        </div>
      </section>

      {/* Budget CTA */}
      <section className="relative z-10 luxury-gradient py-24 text-white">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-3xl px-6 text-center"
        >
          <Calculator className="mx-auto mb-4 h-8 w-8 text-brand-gold" />
          <h2 className="font-display text-4xl md:text-5xl">
            Wedding Budget Estimator
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-white/70">
            Motion-graphics gauges and celebratory confetti — sketch a first-pass
            budget, then book on the live platform.
          </p>
          <Link
            to="/tools/budget"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand-orange px-6 py-3 text-sm font-semibold text-white hover:bg-brand-orange-dark"
          >
            Open estimator
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </section>

      <section className="relative z-10 bg-brand-black py-16 text-center text-white">
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
