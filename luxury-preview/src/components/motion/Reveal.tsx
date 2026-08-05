import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { registerGsap } from "../../lib/gsap";

export function RevealStagger({
  children,
  className = "",
  selector = "[data-reveal]",
}: {
  children: ReactNode;
  className?: string;
  selector?: string;
}) {
  const root = useRef<HTMLDivElement>(null);
  const { gsap } = registerGsap();

  useGSAP(
    () => {
      if (!root.current) return;
      const items = root.current.querySelectorAll(selector);
      gsap.fromTo(
        items,
        { opacity: 0, y: 40, rotateX: 8 },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 0.9,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: root.current,
            start: "top 78%",
            toggleActions: "play none none reverse",
          },
        }
      );
    },
    { scope: root }
  );

  return (
    <div ref={root} className={className} style={{ perspective: 900 }}>
      {children}
    </div>
  );
}

export function StatCounter({
  value,
  suffix = "",
  label,
}: {
  value: number;
  suffix?: string;
  label: string;
}) {
  const numRef = useRef<HTMLSpanElement>(null);
  const root = useRef<HTMLDivElement>(null);
  const { gsap } = registerGsap();

  useGSAP(
    () => {
      if (!numRef.current || !root.current) return;
      const obj = { n: 0 };
      gsap.to(obj, {
        n: value,
        duration: 1.6,
        ease: "power2.out",
        scrollTrigger: {
          trigger: root.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
        onUpdate: () => {
          if (numRef.current) {
            numRef.current.textContent = `${Math.round(obj.n)}${suffix}`;
          }
        },
      });
    },
    { scope: root, dependencies: [value, suffix] }
  );

  return (
    <div ref={root} className="text-center" data-reveal>
      <span
        ref={numRef}
        className="font-display text-4xl text-brand-gold md:text-5xl"
      >
        0{suffix}
      </span>
      <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted">
        {label}
      </p>
    </div>
  );
}
