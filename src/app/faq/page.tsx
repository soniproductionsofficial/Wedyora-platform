import { FAQS } from "@/lib/faqs";

export default function FaqPage() {
  return (
    <div>
      <section className="bg-brand-black text-white">
        <div className="mx-auto max-w-3xl px-6 py-16 text-center">
          <p className="text-brand-gold-bright uppercase tracking-[0.2em] text-xs font-semibold mb-4">
            FAQ
          </p>
          <h1 className="font-heading text-3xl md:text-4xl font-bold">
            Frequently Asked Questions
          </h1>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-3xl px-6 py-16 flex flex-col gap-3">
          {FAQS.map((item) => (
            <details
              key={item.question}
              className="group rounded-2xl border border-brand-line bg-white p-5"
            >
              <summary className="font-heading font-semibold text-sm cursor-pointer list-none flex items-center justify-between gap-4">
                {item.question}
                <span className="text-brand-orange group-open:rotate-45 transition-transform text-lg leading-none">
                  +
                </span>
              </summary>
              <p className="text-brand-gray text-sm mt-3 leading-relaxed">{item.answer}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
