import LegalDisclaimer from "@/components/legal-disclaimer";

export default function RefundPolicyPage() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="font-heading text-3xl font-bold mb-2">Refund Policy</h1>
        <p className="text-brand-gray text-sm mb-6">Last updated: [add date when you publish this]</p>

        <LegalDisclaimer />

        <p className="rounded-lg bg-brand-cream text-brand-gray text-xs px-4 py-3 mb-8">
          Note: a full Cancellation Policy chapter (exact refund
          percentages by how far out you cancel, vendor-side no-show
          handling, etc.) is still on the roadmap. This page currently
          describes only how advance payments and vendor payouts already
          work in the app — treat it as a starting point to fill in once
          that chapter is built.
        </p>

        <div className="flex flex-col gap-6 text-sm text-brand-gray leading-relaxed">
          <section>
            <h2 className="font-heading text-lg font-semibold text-brand-black mb-2">
              1. Advance Payments
            </h2>
            <p>
              A booking is confirmed once you pay the advance amount shown at
              the time your vendor is assigned. This advance secures your
              vendor&rsquo;s availability for your date.
            </p>
          </section>
          <section>
            <h2 className="font-heading text-lg font-semibold text-brand-black mb-2">
              2. Cancelling a Booking
            </h2>
            <p>
              [Fill in once the Cancellation Policy chapter is built: how
              much of the advance is refundable, and how that changes the
              closer the cancellation is to your event date.]
            </p>
          </section>
          <section>
            <h2 className="font-heading text-lg font-semibold text-brand-black mb-2">
              3. If a Vendor Doesn&rsquo;t Show Up
            </h2>
            <p>
              A vendor no-show is treated as a serious violation of our
              vendor policy and can result in the vendor being penalized or
              suspended. [Fill in what this means for your refund/replacement
              once finalized.]
            </p>
          </section>
          <section>
            <h2 className="font-heading text-lg font-semibold text-brand-black mb-2">
              4. Refund Timelines
            </h2>
            <p>
              Where a refund is due, it&rsquo;s processed back to your
              original payment method through Razorpay. [Add your standard
              processing time once decided, e.g. &ldquo;5&ndash;7 business
              days.&rdquo;]
            </p>
          </section>
          <section>
            <h2 className="font-heading text-lg font-semibold text-brand-black mb-2">
              5. Add-Ons
            </h2>
            <p>
              Add-on services (like a pre-wedding shoot or live streaming)
              attached to your booking follow the same cancellation terms as
              the main package, unless stated otherwise at the time of
              booking.
            </p>
          </section>
          <section>
            <h2 className="font-heading text-lg font-semibold text-brand-black mb-2">
              6. Contact
            </h2>
            <p>
              To request a cancellation or ask about a refund, reach out
              through our Contact Us page as early as possible.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
