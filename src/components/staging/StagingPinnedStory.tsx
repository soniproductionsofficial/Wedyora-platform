"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePerfProfile } from "@/components/staging/use-perf-profile";

gsap.registerPlugin(ScrollTrigger);

const STEPS = [
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

/**
 * GSAP ScrollTrigger pinned narrative — scrub through How Wedyora Works
 * while the section stays pinned (desktop). Mobile falls back to stacked cards.
 */
export default function StagingPinnedStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const perf = usePerfProfile();

  useEffect(() => {
    if (perf.reduceMotion || perf.isMobile) return;
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray<HTMLElement>("[data-story-panel]");
      gsap.set(panels, { opacity: 0.2, y: 28, scale: 0.96 });
      gsap.set(panels[0], { opacity: 1, y: 0, scale: 1 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${panels.length * 90}%`,
          pin: true,
          scrub: 0.65,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      panels.forEach((panel, i) => {
        if (i === 0) return;
        tl.to(
          panels[i - 1],
          { opacity: 0.15, y: -24, scale: 0.96, duration: 1, ease: "none" },
          i - 1
        ).to(
          panel,
          { opacity: 1, y: 0, scale: 1, duration: 1, ease: "none" },
          i - 1
        );
      });
    }, section);

    return () => ctx.revert();
  }, [perf.isMobile, perf.reduceMotion]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden bg-[#FAF9F6] text-[#2B2B2B]"
    >
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-20">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-[#D4AF37]">
          The Wedyora journey
        </p>
        <h2 className="mb-10 font-heading text-4xl font-semibold md:text-5xl">
          How Wedyora Works
        </h2>

        <div ref={trackRef} className="relative">
          {STEPS.map((step, i) => (
            <article
              key={step.title}
              data-story-panel
              className={`will-change-transform rounded-3xl border border-[#D4AF37]/25 bg-white/80 p-8 shadow-[0_20px_60px_rgba(43,43,43,0.06)] backdrop-blur-md md:p-10 ${
                perf.isMobile || perf.reduceMotion ? "mb-5 opacity-100" : "absolute inset-x-0 top-0"
              }`}
              style={
                perf.isMobile || perf.reduceMotion
                  ? undefined
                  : { position: i === 0 ? "relative" : "absolute" }
              }
            >
              <span className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[#e2711d] to-[#c97b84] text-sm font-bold text-white">
                {i + 1}
              </span>
              <h3 className="mb-3 font-heading text-2xl font-semibold md:text-3xl">
                {step.title}
              </h3>
              <p className="max-w-2xl text-base leading-relaxed text-[#6B645C] md:text-lg">
                {step.body}
              </p>
            </article>
          ))}
          {/* Spacer so absolute panels have height on desktop */}
          {!perf.isMobile && !perf.reduceMotion && <div className="h-56 md:h-64" />}
        </div>
      </div>
    </section>
  );
}
