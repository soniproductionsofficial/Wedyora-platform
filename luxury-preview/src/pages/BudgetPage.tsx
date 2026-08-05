import { useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useGSAP } from "@gsap/react";
import confetti from "canvas-confetti";
import { Calculator } from "lucide-react";
import { formatInr, LIVE } from "../data/vendors";
import { registerGsap } from "../lib/gsap";
import FloatingWeddingLayer from "../components/motion/FloatingWeddingLayer";

const CITY_MULTIPLIER = {
  metro: 1.25,
  tier1: 1.0,
  destination: 1.45,
} as const;

type CityTier = keyof typeof CITY_MULTIPLIER;

const BASE = {
  venue: 350000,
  photography: 120000,
  cateringPerGuest: 1800,
  décor: 180000,
  misc: 75000,
};

function Gauge({
  label,
  value,
  max,
  active,
}: {
  label: string;
  value: number;
  max: number;
  active: boolean;
}) {
  const ref = useRef<SVGCircleElement>(null);
  const { gsap } = registerGsap();
  const r = 42;
  const c = 2 * Math.PI * r;
  const pct = active ? Math.min(value / max, 1) : 0;

  useGSAP(
    () => {
      if (!ref.current) return;
      gsap.to(ref.current, {
        strokeDashoffset: c * (1 - pct),
        duration: 1.1,
        ease: "power3.out",
      });
    },
    { dependencies: [pct, c] }
  );

  return (
    <div className={`flex flex-col items-center ${active ? "" : "opacity-40"}`}>
      <svg width="110" height="110" viewBox="0 0 110 110" className="-rotate-90">
        <circle
          cx="55"
          cy="55"
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="8"
        />
        <circle
          ref={ref}
          cx="55"
          cy="55"
          r={r}
          fill="none"
          stroke="#d9a441"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c}
        />
      </svg>
      <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-brand-gold">
        {label}
      </p>
      <p className="text-sm text-white/80">{formatInr(Math.round(value))}</p>
    </div>
  );
}

function celebrate() {
  confetti({
    particleCount: 90,
    spread: 70,
    origin: { y: 0.7 },
    colors: ["#d9a441", "#e2711d", "#fbf8f3", "#221d19"],
  });
  window.setTimeout(() => {
    confetti({
      particleCount: 45,
      angle: 60,
      spread: 50,
      origin: { x: 0, y: 0.65 },
      colors: ["#d9a441", "#e2711d"],
    });
    confetti({
      particleCount: 45,
      angle: 120,
      spread: 50,
      origin: { x: 1, y: 0.65 },
      colors: ["#d9a441", "#fbf8f3"],
    });
  }, 180);
}

export default function BudgetPage() {
  const [guests, setGuests] = useState(200);
  const [tier, setTier] = useState<CityTier>("tier1");
  const [includeVenue, setIncludeVenue] = useState(true);
  const [includePhoto, setIncludePhoto] = useState(true);
  const [includeCatering, setIncludeCatering] = useState(true);
  const [includeDecor, setIncludeDecor] = useState(true);

  const estimate = useMemo(() => {
    const m = CITY_MULTIPLIER[tier];
    const lines = [
      {
        label: "Venue",
        amount: includeVenue ? BASE.venue * m : 0,
        on: includeVenue,
      },
      {
        label: "Photography",
        amount: includePhoto ? BASE.photography * m : 0,
        on: includePhoto,
      },
      {
        label: "Catering",
        amount: includeCatering ? BASE.cateringPerGuest * guests * m : 0,
        on: includeCatering,
      },
      {
        label: "Decoration",
        amount: includeDecor ? BASE.décor * m : 0,
        on: includeDecor,
      },
      { label: "Misc / buffer", amount: BASE.misc * m, on: true },
    ];
    const total = lines.reduce((sum, l) => sum + l.amount, 0);
    return { lines, total, m };
  }, [guests, tier, includeVenue, includePhoto, includeCatering, includeDecor]);

  const maxGauge = 900000 * CITY_MULTIPLIER.destination;

  return (
    <div className="relative">
      <FloatingWeddingLayer />

      <section className="relative z-10 luxury-gradient text-white">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-gold">
            Animated tool
          </p>
          <h1 className="mt-3 font-display text-4xl md:text-5xl">
            Wedding Budget Estimator
          </h1>
          <p className="mt-4 max-w-xl text-white/70">
            Scroll-animated gauges and celebratory confetti — a first-pass sketch,
            not a quote. Final pricing comes from verified Wedyora vendors.
          </p>
        </div>
      </section>

      <div className="relative z-10 mx-auto grid max-w-6xl gap-8 px-6 py-12 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-line bg-surface p-6 shadow-sm md:p-8"
        >
          <div className="mb-6 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-gold/15 text-brand-gold">
              <Calculator className="h-5 w-5" />
            </span>
            <h2 className="font-display text-2xl">Your inputs</h2>
          </div>

          <label className="mb-6 block">
            <div className="mb-2 flex justify-between text-sm">
              <span className="text-muted">Guest count</span>
              <span className="font-semibold text-brand-orange">{guests}</span>
            </div>
            <input
              type="range"
              min={50}
              max={800}
              step={10}
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              onMouseUp={celebrate}
              onTouchEnd={celebrate}
              className="w-full accent-brand-orange"
            />
          </label>

          <div className="mb-6">
            <p className="mb-2 text-sm text-muted">City tier</p>
            <div className="flex flex-wrap gap-2">
              {(
                [
                  ["metro", "Metro"],
                  ["tier1", "Tier 1"],
                  ["destination", "Destination"],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => {
                    setTier(id);
                    celebrate();
                  }}
                  className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                    tier === id
                      ? "bg-brand-orange text-white"
                      : "border border-line bg-surface-elevated text-muted"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {(
              [
                ["Venue", includeVenue, setIncludeVenue],
                ["Photography", includePhoto, setIncludePhoto],
                ["Catering", includeCatering, setIncludeCatering],
                ["Decoration", includeDecor, setIncludeDecor],
              ] as const
            ).map(([label, on, set]) => (
              <label
                key={label}
                className="flex cursor-pointer items-center justify-between rounded-xl border border-line bg-surface-elevated px-4 py-3 text-sm"
              >
                <span>{label}</span>
                <input
                  type="checkbox"
                  checked={on}
                  onChange={(e) => {
                    set(e.target.checked);
                    if (e.target.checked) celebrate();
                  }}
                  className="h-4 w-4 accent-brand-orange"
                />
              </label>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-3xl border border-brand-gold/25 bg-brand-black p-6 text-white shadow-lg md:p-8"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold">
            Estimated total
          </p>
          <motion.p
            key={estimate.total}
            initial={{ opacity: 0.4, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 font-display text-5xl text-brand-gold md:text-6xl"
          >
            {formatInr(Math.round(estimate.total))}
          </motion.p>
          <p className="mt-2 text-sm text-white/55">
            Indicative only · {guests} guests · {tier}
          </p>

          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Gauge
              label="Venue"
              value={includeVenue ? BASE.venue * estimate.m : 0}
              max={maxGauge}
              active={includeVenue}
            />
            <Gauge
              label="Photo"
              value={includePhoto ? BASE.photography * estimate.m : 0}
              max={maxGauge}
              active={includePhoto}
            />
            <Gauge
              label="Catering"
              value={
                includeCatering
                  ? BASE.cateringPerGuest * guests * estimate.m
                  : 0
              }
              max={maxGauge}
              active={includeCatering}
            />
            <Gauge
              label="Décor"
              value={includeDecor ? BASE.décor * estimate.m : 0}
              max={maxGauge}
              active={includeDecor}
            />
          </div>

          <ul className="mt-8 space-y-3 border-t border-white/10 pt-6">
            {estimate.lines.map((line) => (
              <li
                key={line.label}
                className={`flex items-center justify-between text-sm ${
                  line.on ? "text-white/85" : "text-white/30 line-through"
                }`}
              >
                <span>{line.label}</span>
                <span>{formatInr(Math.round(line.amount))}</span>
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={celebrate}
            className="mt-6 w-full rounded-full border border-brand-gold/40 py-2.5 text-sm font-semibold text-brand-gold hover:bg-brand-gold/10"
          >
            Celebrate this estimate ✨
          </button>

          <a
            href={LIVE.book}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex w-full items-center justify-center rounded-full bg-brand-orange px-5 py-3 text-sm font-semibold text-white hover:bg-brand-orange-dark"
          >
            Turn this into a real booking
          </a>
          <p className="mt-3 text-center text-xs text-white/45">
            Continues on www.wedyora.com — this preview does not process payments.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
