"use client";

/**
 * ParallaxHero — dual-theme (Wedding Services / Maternity Services) hero.
 *
 * PREVIEW ONLY FOR NOW.
 * Review it at: /parallax-preview
 *
 * ---------------------------------------------------------------------------
 * HOW TO INTEGRATE INTO THE MAIN HOMEPAGE (after you approve the design):
 * ---------------------------------------------------------------------------
 * 1. Open `src/app/page.tsx` (the real homepage — do NOT do this until approved).
 * 2. Import this component near the top:
 *      import ParallaxHero from "@/components/parallax/ParallaxHero";
 * 3. Replace the existing homepage hero block (the `<HeroStage>…</HeroStage>`
 *    section, or whatever hero markup is live) with:
 *      <ParallaxHero />
 * 4. Keep the rest of the homepage (vendors grid, how-it-works, etc.) as-is,
 *    or nest those sections under this component’s feature cards if preferred.
 * 5. Optionally delete `src/app/parallax-preview/page.tsx` once production
 *    integration is confirmed.
 * ---------------------------------------------------------------------------
 */

import { useMemo, useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";
import Link from "next/link";
import { Heart, Sparkles, Camera, Baby, Flower2, Sun } from "lucide-react";

type ThemeId = "wedding" | "maternity";

interface ThemeConfig {
  id: ThemeId;
  label: string;
  eyebrow: string;
  title: string;
  titleAccent: string;
  body: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  backgroundImage: string;
  backgroundAlt: string;
  colors: {
    canvas: string;
    accent: string;
    text: string;
    muted: string;
    overlay: string;
    card: string;
    soft: string;
  };
  midground: "petals" | "leaks";
  cards: Array<{
    icon: typeof Heart;
    title: string;
    body: string;
  }>;
}

const THEMES: Record<ThemeId, ThemeConfig> = {
  wedding: {
    id: "wedding",
    label: "Wedding Services",
    eyebrow: "Managed wedding experiences",
    title: "Your forever begins",
    titleAccent: "beautifully",
    body: "Verified photographers, décor, and celebration teams — curated for the most important day of your life.",
    primaryCta: { label: "Plan Your Wedding", href: "/book" },
    secondaryCta: { label: "Browse Vendors", href: "/vendors" },
    backgroundImage:
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=2000&q=80",
    backgroundAlt: "Elegant wedding venue with soft natural light",
    colors: {
      canvas: "#FAF9F6",
      accent: "#D4AF37",
      text: "#2B2B2B",
      muted: "#6B645C",
      overlay: "rgba(43, 43, 43, 0.42)",
      card: "rgba(250, 249, 246, 0.88)",
      soft: "rgba(212, 175, 55, 0.18)",
    },
    midground: "petals",
    cards: [
      {
        icon: Camera,
        title: "Verified Creatives",
        body: "Every photographer and artist is reviewed before they can take a booking.",
      },
      {
        icon: Sparkles,
        title: "Champagne Details",
        body: "From décor to day-of coordination, one team keeps the celebration seamless.",
      },
      {
        icon: Heart,
        title: "Held With Care",
        body: "Secure deposits, clear timelines, and a real person when you need one.",
      },
    ],
  },
  maternity: {
    id: "maternity",
    label: "Maternity Services",
    eyebrow: "Soft light, lasting keepsakes",
    title: "Celebrate the quiet",
    titleAccent: "glow",
    body: "Warm, unhurried maternity sessions and nursery styling — captured in golden hour tones that feel like a memory already.",
    primaryCta: { label: "Book Maternity Session", href: "/book" },
    secondaryCta: { label: "Explore Services", href: "/services" },
    backgroundImage:
      "https://images.unsplash.com/photo-1555252333-9f8e00e644e5?auto=format&fit=crop&w=2000&q=80",
    backgroundAlt: "Soft golden hour maternity portrait",
    colors: {
      canvas: "#FDFBF7",
      accent: "#C4A484",
      text: "#3F3A36",
      muted: "#7A7168",
      overlay: "rgba(63, 58, 54, 0.38)",
      card: "rgba(253, 251, 247, 0.9)",
      soft: "rgba(226, 232, 240, 0.75)",
    },
    midground: "leaks",
    cards: [
      {
        icon: Sun,
        title: "Golden Hour Portraits",
        body: "Soft natural light sessions designed around comfort and calm.",
      },
      {
        icon: Baby,
        title: "Nursery Styling",
        body: "Gentle décor and keepsake planning for the months ahead.",
      },
      {
        icon: Flower2,
        title: "Earthy Palettes",
        body: "Sage, blush, and warm neutrals that feel intimate — never loud.",
      },
    ],
  },
};

function FloatingPetals({ accent }: { accent: string }) {
  const petals = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        id: i,
        left: `${6 + ((i * 7) % 88)}%`,
        top: `${8 + ((i * 11) % 70)}%`,
        size: 8 + (i % 5) * 3,
        delay: (i % 7) * 0.35,
        duration: 7 + (i % 5),
      })),
    []
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {petals.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-full opacity-70 blur-[0.5px]"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size * 1.35,
            background: `radial-gradient(circle at 30% 30%, ${accent}, transparent 70%)`,
            borderRadius: "60% 40% 55% 45%",
          }}
          animate={{
            y: [0, -28, 10, 0],
            x: [0, 12, -8, 0],
            rotate: [0, 25, -15, 0],
            opacity: [0.25, 0.7, 0.4, 0.25],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

function WarmLightLeaks() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <motion.div
        className="absolute -left-10 top-1/4 h-64 w-64 rounded-full bg-[#F6D7C3]/35 blur-3xl"
        animate={{ x: [0, 40, 0], y: [0, -20, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute right-0 top-10 h-72 w-72 rounded-full bg-[#E2E8F0]/55 blur-3xl"
        animate={{ x: [0, -30, 0], y: [0, 30, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-10 left-1/3 h-56 w-56 rounded-full bg-[#C4A484]/25 blur-3xl"
        animate={{ opacity: [0.35, 0.7, 0.35], scale: [0.95, 1.2, 0.95] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

function FeatureCardGrid({
  theme,
  reduce,
}: {
  theme: ThemeConfig;
  reduce: boolean | null;
}) {
  return (
    <section
      className="relative z-20 mx-auto max-w-6xl px-6 pb-24 pt-6"
      style={{ background: theme.colors.canvas }}
    >
      <div className="mb-10 max-w-xl">
        <p
          className="mb-2 text-xs font-semibold uppercase tracking-[0.22em]"
          style={{ color: theme.colors.accent }}
        >
          Why this chapter
        </p>
        <h2
          className="font-heading text-3xl font-semibold md:text-4xl"
          style={{ color: theme.colors.text }}
        >
          Designed for depth, not just decoration
        </h2>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {theme.cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.article
              key={`${theme.id}-${card.title}`}
              initial={reduce ? false : { opacity: 0, y: 40, scale: 0.92 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{
                duration: 0.55,
                delay: index * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="rounded-3xl border p-7 shadow-[0_18px_50px_rgba(43,43,43,0.06)] backdrop-blur-md"
              style={{
                background: theme.colors.card,
                borderColor: `${theme.colors.accent}33`,
                color: theme.colors.text,
              }}
            >
              <span
                className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl"
                style={{ background: theme.colors.soft, color: theme.colors.accent }}
              >
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mb-2 font-heading text-xl font-semibold">{card.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: theme.colors.muted }}>
                {card.body}
              </p>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}

function useParallaxLayers(scrollYProgress: MotionValue<number>, reduce: boolean | null) {
  const bgY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, 120]); // ~0.2x feel
  const bgScale = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [1, 1.12]);
  const midY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, 220]); // ~0.5x
  const foreY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, 360]); // 1.0x
  const foreOpacity = useTransform(scrollYProgress, [0, 0.55], [1, reduce ? 1 : 0.35]);
  return { bgY, bgScale, midY, foreY, foreOpacity };
}

export default function ParallaxHero() {
  const [themeId, setThemeId] = useState<ThemeId>("wedding");
  const theme = THEMES[themeId];
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll();
  const { bgY, bgScale, midY, foreY, foreOpacity } = useParallaxLayers(
    scrollYProgress,
    reduce
  );

  return (
    <div style={{ background: theme.colors.canvas, color: theme.colors.text }}>
      {/* Theme toggle */}
      <div className="sticky top-[4.25rem] z-30 px-4 pt-4 md:px-6">
        <div
          className="mx-auto flex max-w-md items-center gap-1 rounded-full border p-1 shadow-lg backdrop-blur-xl"
          style={{
            background: `${theme.colors.card}`,
            borderColor: `${theme.colors.accent}40`,
          }}
          role="tablist"
          aria-label="Service theme"
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
                className="relative flex-1 rounded-full px-3 py-2.5 text-xs font-semibold tracking-wide md:text-sm"
                style={{ color: active ? theme.colors.text : theme.colors.muted }}
              >
                {active && (
                  <motion.span
                    layoutId="parallax-theme-pill"
                    className="absolute inset-0 rounded-full"
                    style={{ background: theme.colors.soft }}
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative z-10">{THEMES[id].label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Hero stack */}
      <section className="relative h-[125vh] min-h-[820px] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={theme.id}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Background layer — 0.2x + subtle zoom */}
            <motion.div
              className="absolute inset-[-8%] will-change-transform"
              style={{ y: bgY, scale: bgScale }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={theme.backgroundImage}
                alt={theme.backgroundAlt}
                className="h-full w-full object-cover"
              />
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(180deg, ${theme.colors.overlay} 8%, rgba(0,0,0,0.15) 45%, ${theme.colors.canvas} 96%)`,
                }}
              />
            </motion.div>

            {/* Midground layer — 0.5x ambient */}
            <motion.div
              className="absolute inset-0 will-change-transform"
              style={{ y: midY }}
            >
              {theme.midground === "petals" ? (
                <FloatingPetals accent={theme.colors.accent} />
              ) : (
                <WarmLightLeaks />
              )}
            </motion.div>

            {/* Foreground content — 1.0x */}
            <motion.div
              className="relative z-10 mx-auto flex h-full max-w-6xl flex-col justify-center px-6 pb-40 pt-28 will-change-transform md:pb-52"
              style={{ y: foreY, opacity: foreOpacity }}
            >
              <motion.p
                key={`${theme.id}-eyebrow`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                className="mb-4 text-xs font-semibold uppercase tracking-[0.28em]"
                style={{ color: theme.colors.accent }}
              >
                {theme.eyebrow}
              </motion.p>

              <motion.h1
                key={`${theme.id}-title`}
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.05 }}
                className="max-w-3xl font-heading text-5xl font-semibold leading-[1.05] md:text-7xl"
                style={{ color: "#FFFFFF" }}
              >
                {theme.title}{" "}
                <em style={{ color: theme.colors.accent, fontStyle: "italic" }}>
                  {theme.titleAccent}
                </em>
              </motion.h1>

              <motion.p
                key={`${theme.id}-body`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.12 }}
                className="mt-6 max-w-xl text-base leading-relaxed md:text-lg"
                style={{ color: "rgba(255,255,255,0.86)" }}
              >
                {theme.body}
              </motion.p>

              <motion.div
                key={`${theme.id}-ctas`}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.18 }}
                className="mt-10 flex flex-wrap gap-3"
              >
                <Link
                  href={theme.primaryCta.href}
                  className="rounded-full px-6 py-3 text-sm font-semibold shadow-lg transition-transform hover:-translate-y-0.5"
                  style={{
                    background: theme.colors.accent,
                    color: theme.id === "wedding" ? "#2B2B2B" : "#3F3A36",
                  }}
                >
                  {theme.primaryCta.label}
                </Link>
                <Link
                  href={theme.secondaryCta.href}
                  className="rounded-full border px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-transform hover:-translate-y-0.5"
                  style={{ borderColor: "rgba(255,255,255,0.45)" }}
                >
                  {theme.secondaryCta.label}
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </section>

      <FeatureCardGrid theme={theme} reduce={reduce} />
    </div>
  );
}
