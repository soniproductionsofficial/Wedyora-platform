import { FAQS } from "@/lib/faqs";
import PageHero from "@/components/ui/page-hero";

export default function FaqPage() {
  return (
    <div>
      <PageHero
        eyebrow="FAQ"
        title="Frequently Asked Questions"
        size="compact"
      />

      <section className="bg-brand-ivory/60">
        <div className="mx-auto flex max-w-3xl flex-col gap-3 px-6 py-16">
          {FAQS.map((item) => (
            <details
              key={item.question}
              className="glass-panel group rounded-2xl p-5"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-heading text-sm font-semibold">
                {item.question}
                <span className="text-lg leading-none text-brand-orange transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-brand-gray">{item.answer}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
