import Link from "next/link";

export default function Home() {
  return (
    <div>
      <section className="bg-brand-black text-white">
        <div className="mx-auto max-w-6xl px-6 py-24 text-center">
          <p className="text-brand-gold uppercase tracking-[0.2em] text-xs font-semibold mb-4">
            India&rsquo;s Managed Wedding Services Platform
          </p>
          <h1 className="font-heading text-4xl md:text-5xl font-bold leading-tight mb-6">
            Every wedding vendor you need.
            <br />
            One trusted platform.
          </h1>
          <p className="text-white/70 max-w-xl mx-auto mb-10">
            Book verified photographers, decorators, caterers and more —
            Wedyora matches you with the right vendor and manages the whole
            journey, start to finish.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/vendors"
              className="px-6 py-3 rounded-full bg-brand-red font-semibold hover:bg-brand-red-dark transition-colors"
            >
              Browse Vendors
            </Link>
            <Link
              href="/signup"
              className="px-6 py-3 rounded-full border border-white/30 font-semibold hover:bg-white/10 transition-colors"
            >
              Start Planning
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20 grid md:grid-cols-3 gap-8">
        {[
          {
            title: "1. Tell us your event",
            body: "Date, city, guest count, and the services you need — photography, catering, decor, and more.",
          },
          {
            title: "2. Get matched",
            body: "We assign a verified vendor suited to your budget and requirements.",
          },
          {
            title: "3. Book with confidence",
            body: "Pay a secure advance, track your booking, and let Wedyora manage the rest.",
          },
        ].map((step) => (
          <div
            key={step.title}
            className="rounded-2xl border border-brand-line bg-white p-8"
          >
            <h3 className="font-heading text-lg font-semibold mb-3">
              {step.title}
            </h3>
            <p className="text-brand-gray text-sm leading-relaxed">
              {step.body}
            </p>
          </div>
        ))}
      </section>

      <section className="bg-white border-t border-brand-line">
        <div className="mx-auto max-w-6xl px-6 py-16 text-center">
          <h2 className="font-heading text-2xl font-semibold mb-4">
            Are you a wedding vendor?
          </h2>
          <p className="text-brand-gray mb-8 max-w-xl mx-auto">
            Join Wedyora&rsquo;s verified vendor network and get matched with
            couples planning their wedding in your city.
          </p>
          <Link
            href="/vendor/apply"
            className="px-6 py-3 rounded-full bg-brand-black text-white font-semibold hover:bg-brand-charcoal transition-colors"
          >
            Apply as a Vendor
          </Link>
        </div>
      </section>
    </div>
  );
}
