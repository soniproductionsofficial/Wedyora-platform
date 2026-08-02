"use client";

/**
 * AnimationReviewExperience — isolated visual redesign for approval.
 *
 * USED ONLY BY: /animation-review
 * DOES NOT modify `src/app/page.tsx` or any production route.
 *
 * ---------------------------------------------------------------------------
 * HOW TO SWAP ONTO THE REAL HOMEPAGE (after you approve):
 * ---------------------------------------------------------------------------
 * 1. Open `src/app/page.tsx`.
 * 2. Keep the same Supabase data fetches (categories / vendors) as they are.
 * 3. Replace the returned JSX with:
 *      return (
 *        <AnimationReviewExperience
 *          categories={categories ?? []}
 *          vendors={vendors ?? []}
 *        />
 *      );
 * 4. Import this file:
 *      import AnimationReviewExperience from
 *        "@/components/animation-review/AnimationReviewExperience";
 * 5. Optionally delete `src/app/animation-review/page.tsx` once live.
 * ---------------------------------------------------------------------------
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import {
  ShieldCheck,
  CreditCard,
  Headset,
  CalendarCheck,
  MapPin,
  Search,
} from "lucide-react";
import { getCategoryIcon } from "@/lib/category-icons";
import PageLoader from "@/components/animation-review/page-loader";
import AmbientMidground from "@/components/animation-review/ambient-midground";

export type ReviewCategory = { id: string; name: string; slug: string };
export type ReviewVendor = {
  id: string;
  business_name: string;
  city: string;
  experience_years: number | null;
  service_categories: { name: string } | null;
};

type ThemeId = "wedding" | "maternity";

const THEMES = {
  wedding: {
    id: "wedding" as const,
    label: "Wedding Events",
    loaderLabel: "Wedding experiences",
    eyebrow: "India's managed wedding services",
    title: "Find. Book.",
    accentWord: "Celebrate.",
    body: "Photography, decor, catering and more — every vendor on Wedyora is verified by our team, so you can book with confidence.",
    primaryCta: "Plan Your Wedding",
    canvas: "#FAF9F6",
    accent: "#D4AF37",
    text: "#2B2B2B",
    muted: "#6B645C",
    soft: "rgba(212, 175, 55, 0.16)",
    card: "rgba(250, 249, 246, 0.9)",
    overlay:
      "linear-gradient(180deg, rgba(43,43,43,0.55) 0%, rgba(43,43,43,0.25) 45%, #FAF9F6 92%)",
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=2000&q=80",
    midground: "petals" as const,
  },
  maternity: {
    id: "maternity" as const,
    label: "Maternity Events",
    loaderLabel: "Maternity keepsakes",
    eyebrow: "Soft light, lasting memories",
    title: "Pause. Glow.",
    accentWord: "Remember.",
    body: "Warm maternity sessions and gentle styling — the same verified Wedyora care, tuned for this quieter chapter.",
    primaryCta: "Book a Session",
    canvas: "#FDFBF7",
    accent: "#C4A484",
    text: "#3F3A36",
    muted: "#7A7168",
    soft: "rgba(226, 232, 240, 0.85)",
    card: "rgba(253, 251, 247, 0.92)",
    overlay:
      "linear-gradient(180deg, rgba(63,58,54,0.48) 0%, rgba(63,58,54,0.22) 48%, #FDFBF7 92%)",
    image:
      "https://images.unsplash.com/photo-1555252333-9f8e00e644e5?auto=format&fit=crop&w=2000&q=80",
    midground: "leaks" as const,
  },
};

const HOW_IT_WORKS = [
  {
    title: "You place your request",
    body: "Tell us the service, date, city, and budget for your event.",
  },
  {
    title: "Wedyora reviews it",
    body: "Our team checks the details and finds a verified vendor who fits.",
  },
  {
    title: "A vendor is assigned",
    body: "We confirm pricing with you before anything is charged.",
  },
  {
    title: "You pay a secure deposit",
    body: "Held through Razorpay, India's trusted payment system.",
  },
  {
    title: "Your vendor delivers",
    body: "On the day, and beyond — Wedyora stays the single point of contact.",
  },
];

const WHY_WEDYORA = [
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
    body: "Wedyora manages the booking end-to-end, so you're never left coordinating with a stranger alone.",
  },
  {
    icon: Headset,
    title: "A Real Team Behind It",
    body: "Questions or issues get a person, not just an app.",
  },
];

function ScrollReveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={
        reduce
          ? false
          : { opacity: 0, y: 36, scale: 0.97, filter: "blur(6px)" }
      }
      whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
      style={{ willChange: "transform, opacity, filter" }}
    >
      {children}
    </motion.div>
  );
}

export default function AnimationReviewExperience({
  categories,
  vendors,
}: {
  categories: ReviewCategory[];
  vendors: ReviewVendor[];
}) {
  const [themeId, setThemeId] = useState<ThemeId>("wedding");
  const theme = THEMES[themeId];
  const reduce = useReducedMotion();

  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(8);

  const { scrollYProgress } = useScroll();
  const bgY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, 140]);
  const bgScale = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [1, 1.14]);
  const midY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, 240]);
  const foreY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, 48]);

  useEffect(() => {
    if (reduce) {
      setProgress(100);
      setLoading(false);
      return;
    }
    let p = 8;
    const id = window.setInterval(() => {
      p += Math.random() * 14 + 6;
      if (p >= 100) {
        p = 100;
        setProgress(100);
        window.clearInterval(id);
        window.setTimeout(() => setLoading(false), 280);
      } else {
        setProgress(p);
      }
    }, 160);
    return () => window.clearInterval(id);
  }, [reduce]);

  return (
    <div
      className="relative min-h-screen transition-colors duration-500"
      style={{ background: theme.canvas, color: theme.text }}
    >
      <PageLoader
        visible={loading}
        progress={progress}
        accent={theme.accent}
        canvas={theme.canvas}
        label={theme.loaderLabel}
      />

      {/* Preview banner — remove when integrating to homepage */}
      <div
        className="relative z-40 border-b px-4 py-2.5 text-center text-xs md:text-sm"
        style={{
          background: theme.text,
          color: theme.canvas,
          borderColor: `${theme.accent}55`,
        }}
      >
        <strong style={{ color: theme.accent }}>Animation review only</strong>
        {" — "}
        Live homepage untouched.{" "}
        <Link href="/" className="underline underline-offset-2">
          Back to current site
        </Link>
        {" · "}
        <Link href="/parallax-preview" className="underline underline-offset-2">
          Parallax preview
        </Link>
      </div>

      {/* Theme switcher */}
      <div className="sticky top-[4.25rem] z-30 px-4 pt-4 md:px-6">
        <div
          className="mx-auto flex max-w-md gap-1 rounded-full border p-1 shadow-lg backdrop-blur-xl"
          style={{ background: theme.card, borderColor: `${theme.accent}40` }}
          role="tablist"
          aria-label="Event theme"
        >
          {(Object.keys(THEMES) as ThemeId[]).map((id) => {
            const active = id === themeId;
            return (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setThemeId(id)}
                className="relative flex-1 rounded-full px-3 py-2.5 text-xs font-semibold md:text-sm"
                style={{ color: active ? theme.text : theme.muted }}
              >
                {active && (
                  <motion.span
                    layoutId="animation-review-theme"
                    className="absolute inset-0 rounded-full"
                    style={{ background: theme.soft }}
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative z-10">{THEMES[id].label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Parallax hero */}
      <section className="relative h-[115vh] min-h-[760px] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={theme.id}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              className="absolute inset-[-10%] will-change-transform"
              style={{ y: bgY, scale: bgScale }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={theme.image}
                alt=""
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0" style={{ background: theme.overlay }} />
            </motion.div>

            <motion.div className="absolute inset-0 will-change-transform" style={{ y: midY }}>
              <AmbientMidground mode={theme.midground} accent={theme.accent} />
            </motion.div>
          </motion.div>
        </AnimatePresence>

        <motion.div
          className="relative z-10 mx-auto flex h-full max-w-6xl flex-col justify-center px-6 pb-36 pt-24 will-change-transform"
          style={{ y: foreY }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={theme.id + "-copy"}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-3xl text-center mx-auto"
            >
              <p
                className="mb-4 text-xs font-semibold uppercase tracking-[0.28em]"
                style={{ color: theme.accent }}
              >
                {theme.eyebrow}
              </p>
              <h1 className="font-heading text-5xl font-semibold leading-[1.05] text-white md:text-7xl">
                {theme.title}{" "}
                <em className="not-italic italic" style={{ color: theme.accent }}>
                  {theme.accentWord}
                </em>
              </h1>
              <p className="mx-auto mt-6 max-w-xl text-base text-white/85 md:text-lg">
                {theme.body}
              </p>
              <div className="mt-10 flex flex-wrap justify-center gap-3">
                <Link
                  href="/book"
                  className="rounded-full px-6 py-3 text-sm font-semibold shadow-lg transition-transform hover:-translate-y-0.5"
                  style={{ background: theme.accent, color: theme.text }}
                >
                  {theme.primaryCta}
                </Link>
                <Link
                  href="/vendors"
                  className="rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-transform hover:-translate-y-0.5"
                >
                  Browse Vendors
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Existing search form — same action / fields as homepage */}
          <ScrollReveal className="mx-auto mt-12 w-full max-w-3xl" delay={0.1}>
            <form
              action="/vendors"
              method="get"
              className="rounded-2xl border p-3 shadow-xl backdrop-blur-md"
              style={{
                background: theme.card,
                borderColor: `${theme.accent}40`,
              }}
            >
              <div className="flex flex-col gap-3 md:flex-row">
                <select
                  name="category"
                  defaultValue=""
                  className="flex-1 rounded-xl px-4 py-3 text-sm focus:outline-none"
                  style={{ background: theme.canvas, color: theme.text }}
                >
                  <option value="">Any Service</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <input
                  name="city"
                  placeholder="City"
                  className="flex-1 rounded-xl px-4 py-3 text-sm focus:outline-none"
                  style={{ background: theme.canvas, color: theme.text }}
                />
                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-transform hover:-translate-y-0.5"
                  style={{ background: theme.accent, color: theme.text }}
                >
                  <Search className="h-4 w-4" />
                  Search
                </button>
              </div>
            </form>
          </ScrollReveal>

          <div className="mx-auto mt-10 grid max-w-3xl grid-cols-2 gap-3 md:grid-cols-4">
            {[
              { icon: ShieldCheck, label: "Verified Vendors" },
              { icon: CalendarCheck, label: "Easy Booking" },
              { icon: CreditCard, label: "Secure Payments" },
              { icon: Headset, label: "Real Support" },
            ].map(({ icon: Icon, label }, i) => (
              <ScrollReveal key={label} delay={0.05 * i}>
                <div
                  className="flex flex-col items-center gap-2 rounded-2xl border px-3 py-4 backdrop-blur-md"
                  style={{
                    background: "rgba(255,255,255,0.12)",
                    borderColor: "rgba(255,255,255,0.22)",
                    color: "#fff",
                  }}
                >
                  <Icon className="h-5 w-5" style={{ color: theme.accent }} />
                  <p className="text-xs font-medium text-white/85">{label}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Popular Services — existing category data */}
      {categories.length > 0 && (
        <section className="border-b px-6 py-16" style={{ borderColor: `${theme.accent}22` }}>
          <div className="mx-auto max-w-6xl">
            <ScrollReveal>
              <h2 className="mb-10 text-center font-heading text-3xl font-semibold">
                Popular Services
              </h2>
            </ScrollReveal>
            <div className="flex flex-wrap justify-center gap-4">
              {categories.map((c, i) => {
                const Icon = getCategoryIcon(c.slug);
                return (
                  <ScrollReveal key={c.id} delay={Math.min(i * 0.03, 0.3)} className="w-24">
                    <Link
                      href={`/vendors?category=${c.slug}`}
                      className="group flex flex-col items-center gap-2"
                    >
                      <span
                        className="flex h-14 w-14 items-center justify-center rounded-2xl border shadow-sm transition-transform group-hover:-translate-y-1"
                        style={{
                          background: theme.card,
                          borderColor: `${theme.accent}33`,
                          color: theme.text,
                        }}
                      >
                        <Icon className="h-6 w-6" style={{ color: theme.accent }} />
                      </span>
                      <p className="text-center text-xs font-medium">{c.name}</p>
                    </Link>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Verified Vendors — existing vendor rows */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <ScrollReveal>
            <div className="mb-8 flex items-center justify-between gap-4">
              <h2 className="font-heading text-3xl font-semibold">Verified Vendors</h2>
              <Link
                href="/vendors"
                className="text-sm font-semibold"
                style={{ color: theme.accent }}
              >
                View All →
              </Link>
            </div>
          </ScrollReveal>

          {vendors.length === 0 ? (
            <ScrollReveal>
              <p className="text-sm" style={{ color: theme.muted }}>
                We&rsquo;re reviewing our first vendor applications now — check back soon, or{" "}
                <Link href="/vendor/apply" className="font-medium" style={{ color: theme.accent }}>
                  apply to become one of our first verified vendors
                </Link>
                .
              </p>
            </ScrollReveal>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
              {vendors.map((v, i) => (
                <ScrollReveal key={v.id} delay={Math.min(i * 0.06, 0.3)}>
                  <article
                    className="overflow-hidden rounded-2xl border shadow-[0_16px_40px_rgba(43,43,43,0.06)] backdrop-blur-md transition-transform hover:-translate-y-1"
                    style={{
                      background: theme.card,
                      borderColor: `${theme.accent}30`,
                    }}
                  >
                    <div
                      className="h-40 bg-cover bg-center"
                      style={{
                        backgroundImage: `url(https://picsum.photos/seed/${v.id}/480/320)`,
                        backgroundColor: "#1c1714",
                      }}
                    />
                    <div className="p-5">
                      <p
                        className="mb-1 text-xs font-semibold uppercase tracking-wide"
                        style={{ color: theme.accent }}
                      >
                        {v.service_categories?.name}
                      </p>
                      <h3 className="mb-1 font-heading text-xl font-semibold">
                        {v.business_name}
                      </h3>
                      <p
                        className="flex items-center gap-1 text-sm"
                        style={{ color: theme.muted }}
                      >
                        <MapPin className="h-3.5 w-3.5" />
                        {v.city}
                        {v.experience_years
                          ? ` · ${v.experience_years} yrs experience`
                          : ""}
                      </p>
                    </div>
                  </article>
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* How it works */}
      <section
        className="border-y px-6 py-16"
        style={{
          borderColor: `${theme.accent}22`,
          background: theme.soft,
        }}
      >
        <div className="mx-auto max-w-6xl">
          <ScrollReveal>
            <h2 className="mb-12 text-center font-heading text-3xl font-semibold">
              How Wedyora Works
            </h2>
          </ScrollReveal>
          <div className="grid gap-6 md:grid-cols-5">
            {HOW_IT_WORKS.map((step, i) => (
              <ScrollReveal key={step.title} delay={i * 0.06}>
                <div className="text-center">
                  <span
                    className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold text-white"
                    style={{ background: theme.accent, color: theme.text }}
                  >
                    {i + 1}
                  </span>
                  <h3 className="mb-2 font-heading text-lg font-semibold">{step.title}</h3>
                  <p className="text-xs leading-relaxed" style={{ color: theme.muted }}>
                    {step.body}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Why Wedyora */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <ScrollReveal>
            <h2 className="mb-12 text-center font-heading text-3xl font-semibold">
              Why Couples Choose Wedyora
            </h2>
          </ScrollReveal>
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
            {WHY_WEDYORA.map(({ icon: Icon, title, body }, i) => (
              <ScrollReveal key={title} delay={i * 0.06}>
                <div
                  className="rounded-2xl border p-6 backdrop-blur-md"
                  style={{
                    background: theme.card,
                    borderColor: `${theme.accent}30`,
                  }}
                >
                  <span
                    className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl"
                    style={{ background: theme.soft, color: theme.accent }}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mb-2 font-heading text-lg font-semibold">{title}</h3>
                  <p className="text-xs leading-relaxed" style={{ color: theme.muted }}>
                    {body}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Vendor CTA */}
      <section className="relative overflow-hidden px-6 py-20 text-white">
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${theme.text} 0%, #1a1410 100%)`,
          }}
        />
        <div
          className="pointer-events-none absolute left-1/4 top-0 h-48 w-48 rounded-full blur-3xl"
          style={{ background: `${theme.accent}33` }}
        />
        <ScrollReveal className="relative mx-auto max-w-3xl text-center">
          <h2 className="mb-4 font-heading text-3xl font-semibold md:text-4xl">
            Are you a wedding vendor?
          </h2>
          <p className="mx-auto mb-8 max-w-xl text-white/70">
            Join Wedyora&rsquo;s verified vendor network and get matched with
            couples planning their wedding in your city.
          </p>
          <Link
            href="/vendor/apply"
            className="inline-flex rounded-full px-6 py-3 font-semibold transition-transform hover:-translate-y-0.5"
            style={{ background: theme.accent, color: theme.text }}
          >
            Apply as a Vendor
          </Link>
        </ScrollReveal>
      </section>
    </div>
  );
}
