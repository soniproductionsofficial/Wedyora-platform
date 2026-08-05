import { useMemo, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { registerGsap } from "../../lib/gsap";

/**
 * Ambient wedding atmosphere — floating petals, gold sparkles,
 * and soft 3D-ish ring shapes that parallax at different scroll speeds.
 */
export default function FloatingWeddingLayer() {
  const root = useRef<HTMLDivElement>(null);
  const { gsap } = registerGsap();

  const petals = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        id: i,
        left: `${6 + ((i * 17) % 88)}%`,
        top: `${8 + ((i * 23) % 80)}%`,
        size: 10 + (i % 5) * 4,
        rotate: i * 37,
        speed: 0.15 + (i % 4) * 0.12,
      })),
    []
  );

  const sparkles = useMemo(
    () =>
      Array.from({ length: 22 }, (_, i) => ({
        id: i,
        left: `${4 + ((i * 13) % 92)}%`,
        top: `${5 + ((i * 19) % 90)}%`,
        delay: (i % 7) * 0.35,
        speed: 0.08 + (i % 3) * 0.06,
      })),
    []
  );

  useGSAP(
    () => {
      if (!root.current) return;

      gsap.utils.toArray<HTMLElement>(".fw-petal", root.current).forEach((el, i) => {
        const speed = petals[i]?.speed ?? 0.2;
        gsap.to(el, {
          y: () => -120 * (1 + speed * 3),
          x: () => (i % 2 === 0 ? 40 : -35) * speed * 4,
          rotation: `+=${80 + i * 12}`,
          ease: "none",
          scrollTrigger: {
            trigger: document.body,
            start: "top top",
            end: "bottom bottom",
            scrub: 1.2 + speed,
          },
        });
      });

      gsap.utils.toArray<HTMLElement>(".fw-sparkle", root.current).forEach((el, i) => {
        const speed = sparkles[i]?.speed ?? 0.1;
        gsap.fromTo(
          el,
          { opacity: 0.15, scale: 0.6 },
          {
            opacity: 0.95,
            scale: 1.25,
            y: () => -60 - i * 3,
            ease: "none",
            scrollTrigger: {
              trigger: document.body,
              start: "top top",
              end: "bottom bottom",
              scrub: 0.8 + speed,
            },
          }
        );
      });

      gsap.utils.toArray<HTMLElement>(".fw-ring", root.current).forEach((el, i) => {
        gsap.to(el, {
          y: i === 0 ? -180 : 140,
          x: i === 0 ? 60 : -50,
          rotateY: i === 0 ? 35 : -28,
          rotateX: i === 0 ? 18 : -12,
          ease: "none",
          scrollTrigger: {
            trigger: document.body,
            start: "top top",
            end: "bottom bottom",
            scrub: 1.6,
          },
        });
      });
    },
    { scope: root }
  );

  return (
    <div
      ref={root}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[5] overflow-hidden"
    >
      {petals.map((p) => (
        <span
          key={p.id}
          className="fw-petal absolute rounded-[60%_40%_55%_45%] bg-gradient-to-br from-[#f2c9c0]/80 to-[#d9a441]/55 opacity-70 blur-[0.3px]"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size * 1.35,
            transform: `rotate(${p.rotate}deg)`,
          }}
        />
      ))}

      {sparkles.map((s) => (
        <span
          key={s.id}
          className="fw-sparkle absolute h-1 w-1 rounded-full bg-brand-gold shadow-[0_0_10px_rgba(217,164,65,0.85)]"
          style={{ left: s.left, top: s.top, animationDelay: `${s.delay}s` }}
        />
      ))}

      <div
        className="fw-ring absolute left-[8%] top-[28%] h-28 w-28 rounded-full border border-brand-gold/35"
        style={{
          transformStyle: "preserve-3d",
          boxShadow: "inset 0 0 24px rgba(217,164,65,0.18)",
        }}
      />
      <div
        className="fw-ring absolute right-[10%] top-[58%] h-20 w-20 rounded-full border border-brand-gold/25"
        style={{
          transformStyle: "preserve-3d",
          boxShadow: "inset 0 0 18px rgba(226,113,29,0.15)",
        }}
      />
    </div>
  );
}
