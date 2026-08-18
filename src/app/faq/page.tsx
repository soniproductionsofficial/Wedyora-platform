import { FAQS } from "@/lib/faqs";
import Accordion from "@/components/motion/accordion";
import Reveal from "@/components/motion/reveal";
import { GOLD_SWEEP_STYLE } from "@/components/motion/constants";

export default function FaqPage() {
  return (
    <div>
      <section className="bg-brand-chrome text-white">
        <div className="mx-auto max-w-3xl px-6 py-16 text-center">
          <p className="hero-in hero-in-1 text-brand-gold-bright uppercase tracking-[0.2em] text-xs font-semibold mb-4">
            FAQ
          </p>
          <h1 className="hero-in hero-in-2 font-heading text-3xl md:text-4xl font-bold">
            Frequently Asked Questions
          </h1>
          <div className="hero-in hero-in-3 mx-auto mt-8 max-w-xs">
            <div className="sweep-line rounded-full" style={GOLD_SWEEP_STYLE} />
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <Reveal>
            <Accordion
              items={FAQS}
              accentClassName="text-brand-orange"
              defaultOpenIndex={null}
            />
          </Reveal>
        </div>
      </section>
    </div>
  );
}
