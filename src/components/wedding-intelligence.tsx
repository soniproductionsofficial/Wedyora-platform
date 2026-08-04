"use client";

import { useEffect, useRef, useState } from "react";
import { Heart } from "lucide-react";

const HEADING = "Wedding Planning Intelligence";
const CYCLE_MS = 4200;

const FEATURES = [
  {
    label: "Verified Vendor Matching",
    description:
      "Tell us your date, city, and budget. Our team personally reviews your request and matches you with a verified vendor who actually fits — no open marketplace guesswork.",
    stats: [
      { label: "What You Get", value: "A Hand-Picked Vendor" },
      { label: "Categories", value: "Photography to Catering" },
    ],
  },
  {
    label: "Transparent Pricing",
    description:
      "Every quote is broken down clearly before you pay a rupee — what the vendor charges, what Wedyora charges, laid out upfront.",
    stats: [
      { label: "Pricing", value: "Clear, Upfront Quotes" },
      { label: "Surprises", value: "None — Ever" },
    ],
  },
  {
    label: "Secure Deposit Payments",
    description:
      "Pay your deposit safely through Razorpay. Wedyora tracks every payment from booking to final delivery, so nothing gets lost in cash or chat.",
    stats: [
      { label: "Payment Partner", value: "Razorpay" },
      { label: "Tracked", value: "Booking to Delivery" },
    ],
  },
  {
    label: "End-to-End Support",
    description:
      "One team stays with you from your first request through the big day itself — you're never left coordinating with a stranger alone.",
    stats: [
      { label: "Your Contact", value: "One Wedyora Team" },
      { label: "Support", value: "Real People, Not Bots" },
    ],
  },
];

export default function WeddingIntelligence() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [typed, setTyped] = useState("");
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  // Trigger the heading typewriter once, the first time this section
  // scrolls into view.
  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    const reducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      setTyped(HEADING);
      return;
    }
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setTyped(HEADING.slice(0, i));
      if (i >= HEADING.length) clearInterval(id);
    }, 45);
    return () => clearInterval(id);
  }, [inView]);

  // Auto-cycle through the feature list.
  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setActive((a) => (a + 1) % FEATURES.length);
    }, CYCLE_MS);
    return () => clearInterval(id);
  }, [paused]);

  const activeFeature = FEATURES[active];

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-gradient-to-b from-brand-black to-brand-charcoal"
    >
      <div className="hero-blob-field" aria-hidden="true">
        <span className="hero-blob hero-blob-1" />
        <span className="hero-blob hero-blob-2" />
        <span className="hero-blob hero-blob-3" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6 py-20 md:py-28">
        <div
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          className="rounded-3xl bg-brand-cream/95 backdrop-blur border border-white/20 shadow-2xl px-6 py-10 md:px-12 md:py-14 grid md:grid-cols-2 gap-10 md:gap-16 items-center"
        >
          {/* Left: glowing badge with pinned stat callouts */}
          <div className="relative h-64 md:h-80 flex items-center justify-center order-2 md:order-1">
            <span
              className="animate-pulse-glow absolute h-40 w-40 md:h-52 md:w-52 rounded-full blur-2xl"
              style={{
                background:
                  "radial-gradient(circle, var(--brand-gold-bright), transparent 70%)",
                opacity: 0.55,
              }}
              aria-hidden="true"
            />
            <span
              className="relative flex h-32 w-32 md:h-40 md:w-40 items-center justify-center rounded-full text-white shadow-xl"
              style={{
                background:
                  "linear-gradient(135deg, var(--brand-button), var(--brand-black))",
              }}
            >
              <Heart className="h-14 w-14 md:h-16 md:w-16" strokeWidth={1.5} />
            </span>

            {/* Callout 1 */}
            <div
              key={`stat1-${active}`}
              className="animate-fade-in absolute left-0 top-2 md:left-4 md:top-6 text-left max-w-[9.5rem]"
            >
              <p className="text-[10px] uppercase tracking-wide text-brand-black/50 font-semibold leading-tight">
                {activeFeature.stats[0].label}
              </p>
              <p className="text-sm font-bold text-brand-black leading-snug">
                {activeFeature.stats[0].value}
              </p>
            </div>
            <span className="hidden md:block absolute left-[7.5rem] top-11 w-10 border-t border-dashed border-brand-black/25" />
            <span className="hidden md:block absolute left-[11.6rem] top-[2.6rem] h-1.5 w-1.5 rounded-full bg-brand-black/40" />

            {/* Callout 2 */}
            <div
              key={`stat2-${active}`}
              className="animate-fade-in absolute right-0 bottom-2 md:right-2 md:bottom-8 text-right max-w-[9.5rem]"
            >
              <p className="text-[10px] uppercase tracking-wide text-brand-black/50 font-semibold leading-tight">
                {activeFeature.stats[1].label}
              </p>
              <p className="text-sm font-bold text-brand-black leading-snug">
                {activeFeature.stats[1].value}
              </p>
            </div>
            <span className="hidden md:block absolute right-[7.5rem] bottom-12 w-10 border-t border-dashed border-brand-black/25" />
            <span className="hidden md:block absolute right-[11.6rem] bottom-[3.1rem] h-1.5 w-1.5 rounded-full bg-brand-black/40" />
          </div>

          {/* Right: typed heading + auto-cycling feature tabs */}
          <div className="order-1 md:order-2">
            <p className="text-brand-orange uppercase tracking-[0.2em] text-xs font-semibold mb-3">
              Why Couples Trust Wedyora
            </p>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-brand-black mb-4 min-h-[2.5em] md:min-h-[2em]">
              {typed}
              <span className="typewriter-caret inline-block w-[2px] h-[1em] align-middle bg-brand-black/50 ml-0.5" />
            </h2>
            <p
              key={`desc-${active}`}
              className="animate-fade-in text-sm text-brand-gray mb-8 min-h-[3em]"
            >
              {activeFeature.description}
            </p>

            <ul className="flex flex-col">
              {FEATURES.map((f, i) => (
                <li
                  key={f.label}
                  className="relative border-b border-brand-black/10 last:border-b-0"
                >
                  <button
                    type="button"
                    onClick={() => setActive(i)}
                    className={`w-full text-left py-3 flex items-center justify-between gap-3 transition-colors duration-300 ${
                      i === active
                        ? "text-brand-black font-semibold"
                        : "text-brand-black/40 hover:text-brand-black/70"
                    }`}
                  >
                    <span className="text-sm">{f.label}</span>
                    {i === active && (
                      <span className="hover-wiggle h-2 w-2 shrink-0 rounded-full bg-brand-button animate-pulse-glow" />
                    )}
                  </button>
                  {i === active && (
                    <span
                      key={`bar-${active}-${paused}`}
                      className="feature-progress-fill absolute bottom-0 left-0 h-[2px] bg-brand-button"
                      style={{
                        animationDuration: `${CYCLE_MS}ms`,
                        animationPlayState: paused ? "paused" : "running",
                      }}
                    />
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
