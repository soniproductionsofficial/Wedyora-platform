import LegalDisclaimer from "@/components/legal-disclaimer";

export default function TermsAndConditionsPage() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="font-heading text-3xl font-bold mb-2">Terms and Conditions</h1>
        <p className="text-brand-gray text-sm mb-6">Last updated: [add date when you publish this]</p>

        <LegalDisclaimer />

        <div className="flex flex-col gap-6 text-sm text-brand-gray leading-relaxed">
          <section>
            <h2 className="font-heading text-lg font-semibold text-brand-black mb-2">
              1. What Wedyora Is
            </h2>
            <p>
              Wedyora is a managed marketplace connecting couples with
              independent, verified wedding-service vendors (photographers,
              decorators, caterers, and others). Wedyora reviews and
              coordinates vendors but each vendor is an independent business,
              not a Wedyora employee.
            </p>
          </section>
          <section>
            <h2 className="font-heading text-lg font-semibold text-brand-black mb-2">
              2. Bookings and Pricing
            </h2>
            <p>
              A booking is confirmed once a vendor is assigned, pricing is
              agreed, and your advance payment clears. The price and vendor
              payout amounts shown to you at that point are what apply to
              your booking — later catalog price changes don&rsquo;t affect a
              booking already confirmed.
            </p>
          </section>
          <section>
            <h2 className="font-heading text-lg font-semibold text-brand-black mb-2">
              3. Vendor Responsibilities
            </h2>
            <p>
              Vendors agree to deliver the services described in their
              package, arrive as scheduled, and follow Wedyora&rsquo;s vendor
              policies. Vendors who don&rsquo;t meet these standards may be
              subject to penalties or suspension under our vendor policy.
            </p>
          </section>
          <section>
            <h2 className="font-heading text-lg font-semibold text-brand-black mb-2">
              4. Cancellations and Refunds
            </h2>
            <p>
              See our Refund Policy for how cancellations, rescheduling, and
              refunds are handled.
            </p>
          </section>
          <section>
            <h2 className="font-heading text-lg font-semibold text-brand-black mb-2">
              5. Limitation of Liability
            </h2>
            <p>
              Wedyora coordinates and verifies vendors but is not itself the
              provider of photography, catering, decor, or other on-the-day
              services — those are delivered by the independent vendor
              assigned to your booking. [This section in particular should
              be reviewed by a lawyer before publishing, since it defines
              what Wedyora is and isn&rsquo;t responsible for.]
            </p>
          </section>
          <section>
            <h2 className="font-heading text-lg font-semibold text-brand-black mb-2">
              6. Changes to These Terms
            </h2>
            <p>
              We may update these terms from time to time. Continued use of
              Wedyora after an update means you accept the revised terms.
            </p>
          </section>
          <section>
            <h2 className="font-heading text-lg font-semibold text-brand-black mb-2">
              7. Contact
            </h2>
            <p>Questions about these terms can be sent through our Contact Us page.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
