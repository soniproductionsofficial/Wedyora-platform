const FAQS = [
  {
    question: "How does booking a vendor through Wedyora work?",
    answer:
      "Tell us your service, date, city, and budget on the Plan Your Wedding page. Our team reviews the request and assigns a verified vendor with pricing confirmed before anything is charged. You pay a secure advance through Razorpay to confirm the booking.",
  },
  {
    question: "Are all vendors on Wedyora verified?",
    answer:
      "Yes — every vendor goes through an application and review process before they can accept a single booking. Approved vendors are the only ones shown when you browse or get matched.",
  },
  {
    question: "How do payments work?",
    answer:
      "Payments are collected through Razorpay, never in cash or over a private transfer. A booking is confirmed once your advance is paid, and the remaining balance follows the payment schedule your vendor's package sets out.",
  },
  {
    question: "What if I need to cancel or reschedule?",
    answer:
      "See our Refund Policy for how advance payments are handled on cancellation. If you need to reschedule, reach out through Contact Us as early as possible so we can check your vendor's availability on the new date.",
  },
  {
    question: "How do I become a vendor on Wedyora?",
    answer:
      "Apply through Become a Partner. You'll submit your business details and portfolio, choose a registration plan, and pay a one-time registration fee plus a refundable security deposit once your application is approved.",
  },
  {
    question: "Who do I contact if something goes wrong on the wedding day?",
    answer:
      "Every booking has Wedyora as a single point of contact — you're never left coordinating directly with an unfamiliar vendor alone. Use Contact Us and our team will step in.",
  },
];

export default function FaqPage() {
  return (
    <div>
      <section className="bg-brand-black text-white">
        <div className="mx-auto max-w-3xl px-6 py-16 text-center">
          <p className="text-brand-gold uppercase tracking-[0.2em] text-xs font-semibold mb-4">
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
