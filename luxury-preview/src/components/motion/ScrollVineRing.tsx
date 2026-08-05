import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { registerGsap } from "../../lib/gsap";

/**
 * Scroll-scrubbed SVG vine + interlocking golden rings that draw
 * as the user moves through the wedding timeline section.
 */
export default function ScrollVineRing({ className = "" }: { className?: string }) {
  const root = useRef<HTMLDivElement>(null);
  const { gsap } = registerGsap();

  useGSAP(
    () => {
      if (!root.current) return;
      const vine = root.current.querySelector<SVGPathElement>("#vine-path");
      const ringA = root.current.querySelector<SVGCircleElement>("#ring-a");
      const ringB = root.current.querySelector<SVGCircleElement>("#ring-b");
      if (!vine || !ringA || !ringB) return;

      const vineLen = vine.getTotalLength();
      gsap.set(vine, {
        strokeDasharray: vineLen,
        strokeDashoffset: vineLen,
      });
      gsap.set([ringA, ringB], {
        strokeDasharray: 220,
        strokeDashoffset: 220,
        opacity: 0.35,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top 75%",
          end: "bottom 25%",
          scrub: 1.1,
        },
      });

      tl.to(vine, { strokeDashoffset: 0, ease: "none", duration: 1 }, 0)
        .to(
          ringA,
          { strokeDashoffset: 0, opacity: 1, ease: "none", duration: 0.45 },
          0.35
        )
        .to(
          ringB,
          { strokeDashoffset: 0, opacity: 1, ease: "none", duration: 0.45 },
          0.5
        )
        .to(
          [ringA, ringB],
          { rotate: 12, transformOrigin: "50% 50%", ease: "none", duration: 0.4 },
          0.7
        );
    },
    { scope: root }
  );

  return (
    <div ref={root} className={`relative ${className}`}>
      <svg
        viewBox="0 0 320 520"
        className="mx-auto h-[420px] w-auto max-w-full text-brand-gold md:h-[520px]"
        fill="none"
        aria-hidden
      >
        <path
          id="vine-path"
          d="M160 20 C 120 80, 210 120, 150 180 C 90 240, 220 280, 160 340 C 110 390, 190 430, 160 500"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        {/* leaf accents */}
        <path
          d="M148 110 C 130 95, 118 108, 132 122 C 140 118, 148 114, 148 110Z"
          fill="currentColor"
          opacity="0.55"
        />
        <path
          d="M172 250 C 190 236, 204 250, 188 266 C 180 260, 172 254, 172 250Z"
          fill="currentColor"
          opacity="0.45"
        />
        <path
          d="M146 390 C 128 378, 118 392, 134 404 C 140 398, 146 394, 146 390Z"
          fill="currentColor"
          opacity="0.5"
        />
        <circle
          id="ring-a"
          cx="145"
          cy="300"
          r="34"
          stroke="currentColor"
          strokeWidth="2.2"
        />
        <circle
          id="ring-b"
          cx="175"
          cy="318"
          r="34"
          stroke="#e2711d"
          strokeWidth="2.2"
        />
      </svg>
    </div>
  );
}
