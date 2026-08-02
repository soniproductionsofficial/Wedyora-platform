import Link from "next/link";
import ParallaxHero from "@/components/parallax/ParallaxHero";

/**
 * Isolated approval page for the dual-theme ParallaxHero.
 *
 * Visit: /parallax-preview
 *
 * This route does NOT change the production homepage (`src/app/page.tsx`).
 * After you approve the design, follow the integration comments inside
 * `src/components/parallax/ParallaxHero.tsx` to swap it onto the main landing page.
 */
export default function ParallaxPreviewPage() {
  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      <div className="border-b border-black/10 bg-[#2B2B2B] px-6 py-3 text-sm text-white/80">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
          <p>
            <span className="font-semibold text-[#D4AF37]">Preview only</span>
            {" — "}
            Dual-theme Parallax Hero (Wedding / Maternity). Not on the live homepage yet.
          </p>
          <Link href="/" className="underline decoration-[#D4AF37]/60 underline-offset-4 hover:text-white">
            Back to current homepage
          </Link>
        </div>
      </div>

      <ParallaxHero />

      <div className="mx-auto max-w-3xl px-6 pb-16 text-sm leading-relaxed text-[#6B645C]">
        <h2 className="mb-3 font-heading text-2xl font-semibold text-[#2B2B2B]">
          Approval checklist
        </h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>Toggle Wedding ↔ Maternity and confirm the background, palette, and copy change smoothly.</li>
          <li>Scroll the hero and confirm background / midground / content move at different depths.</li>
          <li>Confirm the 3 feature cards fade and scale in as they enter view.</li>
          <li>
            When approved, integrate via the comments in{" "}
            <code className="rounded bg-black/5 px-1.5 py-0.5">src/components/parallax/ParallaxHero.tsx</code>
            — do not edit the homepage until then.
          </li>
        </ul>
      </div>
    </div>
  );
}
