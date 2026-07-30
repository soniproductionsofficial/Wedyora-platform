import LegalDisclaimer from "@/components/legal-disclaimer";

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="font-heading text-3xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-brand-gray text-sm mb-6">Last updated: [add date when you publish this]</p>

        <LegalDisclaimer />

        <div className="flex flex-col gap-6 text-sm text-brand-gray leading-relaxed">
          <section>
            <h2 className="font-heading text-lg font-semibold text-brand-black mb-2">
              1. What We Collect
            </h2>
            <p>
              To run bookings on Wedyora, we collect: your name, phone number,
              and city (for customer accounts); wedding date, venue, guest
              count, and budget (when you plan a wedding); and, for vendors,
              business details, PAN/Aadhaar/GST numbers, bank account details,
              and portfolio files (for vendor verification and payouts). We
              also collect location coordinates if you choose to share them
              during signup, and check-in location for vendors on a wedding
              day, both of which are optional.
            </p>
          </section>
          <section>
            <h2 className="font-heading text-lg font-semibold text-brand-black mb-2">
              2. How We Use It
            </h2>
            <p>
              Your information is used to match you with vendors, process
              payments through Razorpay, verify vendor applications, and
              contact you about your booking. We do not sell your personal
              information to third parties.
            </p>
          </section>
          <section>
            <h2 className="font-heading text-lg font-semibold text-brand-black mb-2">
              3. Who We Share It With
            </h2>
            <p>
              We share the minimum necessary information with the vendor
              assigned to your booking (so they can deliver the service), our
              payment processor Razorpay (to process payments), and our SMS
              provider (to send login one-time codes). We do not share your
              data with advertisers.
            </p>
          </section>
          <section>
            <h2 className="font-heading text-lg font-semibold text-brand-black mb-2">
              4. Data Security
            </h2>
            <p>
              Your data is stored with Supabase (our database and file
              storage provider) with access controls that restrict who can
              read what — for example, only you, your assigned vendor, and
              Wedyora&rsquo;s admin team can see the details of your booking.
              Sensitive files (like wedding-day deliverables) are kept
              private and only accessible via secure, time-limited links.
            </p>
          </section>
          <section>
            <h2 className="font-heading text-lg font-semibold text-brand-black mb-2">
              5. Your Rights
            </h2>
            <p>
              You can request a copy of your data, ask us to correct it, or
              ask us to delete your account by contacting us (see Contact
              Us). Some information may be retained where required for
              financial record-keeping (e.g. payment records).
            </p>
          </section>
          <section>
            <h2 className="font-heading text-lg font-semibold text-brand-black mb-2">
              6. Contact
            </h2>
            <p>
              Questions about this policy can be sent through our Contact Us
              page.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
