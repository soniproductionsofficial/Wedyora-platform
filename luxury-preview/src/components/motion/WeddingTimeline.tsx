import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { registerGsap } from "../../lib/gsap";
import ScrollVineRing from "./ScrollVineRing";

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

export default function WeddingTimeline() {
  const root = useRef<HTMLElement>(null);
  const { gsap } = registerGsap();

  useGSAP(
    () => {
      if (!root.current) return;
      gsap.fromTo(
        ".tl-step",
        { opacity: 0, x: 36, filter: "blur(6px)" },
        {
          opacity: 1,
          x: 0,
          filter: "blur(0px)",
          stagger: 0.18,
          ease: "power2.out",
          scrollTrigger: {
            trigger: root.current,
            start: "top 60%",
            end: "center 35%",
            scrub: 0.9,
          },
        }
      );
    },
    { scope: root }
  );

  return (
    <section ref={root} className="relative overflow-hidden py-24 md:py-32">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-gold">
            Wedding timeline
          </p>
          <h2 className="mt-3 font-display text-4xl md:text-5xl">
            Scroll the story of your day
          </h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">
            Golden vines and interlocking rings draw as you move — a motion
            graphic of how Wedyora carries every booking start to finish.
          </p>
          <ScrollVineRing className="mt-8" />
        </div>

        <ol className="relative space-y-5">
          {STEPS.map((step, i) => (
            <li
              key={step.title}
              className="tl-step glass flex gap-4 rounded-2xl border border-line bg-surface/80 p-5"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-orange text-sm font-semibold text-white">
                {i + 1}
              </span>
              <div>
                <h3 className="font-display text-xl">{step.title}</h3>
                <p className="mt-1 text-sm text-muted">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
