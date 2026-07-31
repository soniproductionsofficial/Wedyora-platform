const CANCELLATION_PENALTIES = [
  {
    history: "First cancellation without valid reason",
    action: "Written warning and performance review",
  },
  {
    history: "Second cancellation within 12 months",
    action: "Temporary suspension from receiving new bookings for up to 30 days",
  },
  {
    history: "Third cancellation within 12 months",
    action: "Suspension for up to 90 days and review for continued association",
  },
  {
    history: "Repeated or deliberate cancellations",
    action: "Permanent removal from the WEDYORA platform",
  },
];

export default function VendorCancellationPolicyPage() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="font-heading text-3xl font-bold mb-2">
          Wedyora Vendor Cancellation Policy
        </h1>
        <p className="text-brand-gray text-sm mb-8">Last updated: July 31, 2026</p>

        <p className="text-sm text-brand-gray leading-relaxed mb-8">
          This Vendor Cancellation Policy forms part of the WEDYORA Vendor
          Agreement and applies to all registered vendors, including
          photographers, videographers, drone operators, makeup artists,
          decorators, caterers, venues, entertainers, transportation
          providers, priests, mehendi artists, and other service partners.
        </p>

        <div className="flex flex-col gap-6 text-sm text-brand-gray leading-relaxed">
          <section>
            <h2 className="font-heading text-lg font-semibold text-brand-black mb-2">
              Purpose
            </h2>
            <p>
              This policy is intended to ensure reliable service for
              customers and to minimize disruptions caused by vendor
              cancellations.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-brand-black mb-2">
              Vendor Commitment
            </h2>
            <p>
              Once a booking is accepted through WEDYORA, the Vendor is
              responsible for delivering the agreed services on the
              scheduled date and time.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-brand-black mb-2">
              Cancellation by Vendor
            </h2>
            <p className="mb-2">
              A Vendor shall not cancel an accepted booking except in
              exceptional circumstances, such as:
            </p>
            <ul className="list-disc pl-5 flex flex-col gap-1 mb-2">
              <li>Serious medical emergency.</li>
              <li>Death of an immediate family member.</li>
              <li>Natural disaster or government-imposed restrictions.</li>
              <li>Major accident or other unavoidable events beyond the Vendor&rsquo;s control.</li>
            </ul>
            <p>
              The Vendor must notify WEDYORA immediately and provide
              supporting documents if requested.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-brand-black mb-2">
              Advance Notice
            </h2>
            <p>
              If cancellation is unavoidable, the Vendor must inform
              WEDYORA as early as possible. Failure to provide timely
              notice may result in penalties.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-brand-black mb-2">
              Replacement Vendor
            </h2>
            <p>
              WEDYORA may appoint a replacement Vendor to ensure
              uninterrupted service to the customer. The original Vendor
              shall cooperate by providing any information reasonably
              required for a smooth handover.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-brand-black mb-2">
              Cancellation Penalties
            </h2>
            <p className="mb-3">
              The following actions may be taken depending on the nature
              and frequency of cancellations:
            </p>
            <div className="overflow-hidden rounded-xl border border-brand-line mb-3">
              <table className="w-full text-left text-xs">
                <thead className="bg-brand-cream">
                  <tr>
                    <th className="px-4 py-2.5 font-semibold text-brand-black">Cancellation History</th>
                    <th className="px-4 py-2.5 font-semibold text-brand-black">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {CANCELLATION_PENALTIES.map((row, i) => (
                    <tr key={row.history} className={i > 0 ? "border-t border-brand-line" : ""}>
                      <td className="px-4 py-3 align-top">{row.history}</td>
                      <td className="px-4 py-3 align-top">{row.action}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p>
              Where WEDYORA incurs reasonable costs due to the Vendor&rsquo;s
              unjustified cancellation, the Company may recover such costs
              from future payments, subject to applicable law and the
              Vendor Agreement.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-brand-black mb-2">
              Customer Compensation
            </h2>
            <p>
              If a Vendor&rsquo;s unjustified cancellation causes WEDYORA to
              incur additional expenses to arrange an alternative service,
              WEDYORA may recover those reasonable costs from the Vendor in
              accordance with the Vendor Agreement and applicable law.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-brand-black mb-2">
              No-Show Policy
            </h2>
            <p className="mb-2">
              A Vendor who fails to report to the venue without prior
              notice shall be treated as a &ldquo;No-Show.&rdquo;
              Consequences may include:
            </p>
            <ul className="list-disc pl-5 flex flex-col gap-1">
              <li>Immediate suspension.</li>
              <li>Reduction in booking priority.</li>
              <li>Negative performance rating.</li>
              <li>Financial recovery of reasonable losses incurred by WEDYORA.</li>
              <li>Permanent removal for repeated no-shows.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-brand-black mb-2">
              Late Arrival
            </h2>
            <p className="mb-2">
              If a Vendor anticipates a delay, they must immediately inform
              the WEDYORA Operations Team. Repeated delays may result in:
            </p>
            <ul className="list-disc pl-5 flex flex-col gap-1">
              <li>Reduced booking priority.</li>
              <li>Performance review.</li>
              <li>Temporary suspension for repeated violations.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-brand-black mb-2">
              Emergency Exceptions
            </h2>
            <p>
              WEDYORA may waive penalties where the Vendor provides
              satisfactory evidence of genuine emergencies. Approval of any
              waiver is at WEDYORA&rsquo;s discretion.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-brand-black mb-2">
              False Emergency Claims
            </h2>
            <p>
              Providing false or misleading information to justify a
              cancellation may result in immediate suspension or permanent
              termination of the Vendor&rsquo;s registration.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-brand-black mb-2">
              Force Majeure
            </h2>
            <p>
              Neither WEDYORA nor the Vendor shall be liable for failure to
              perform obligations due to events beyond reasonable control,
              including natural disasters, war, civil unrest, government
              restrictions, epidemics, or other force majeure events.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-brand-black mb-2">
              Appeals
            </h2>
            <p>
              A Vendor may submit a written explanation or supporting
              documents within seven (7) days of receiving notice of a
              penalty. WEDYORA will review the appeal and communicate its
              decision.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-brand-black mb-2">
              Policy Updates
            </h2>
            <p>
              WEDYORA reserves the right to amend this Cancellation Policy
              from time to time. Updated versions will apply from the date
              they are published or otherwise notified to Vendors.
            </p>
          </section>

          <section className="rounded-2xl bg-brand-cream p-6">
            <h2 className="font-heading text-lg font-semibold text-brand-black mb-2">
              Vendor Acknowledgement
            </h2>
            <p>
              By registering with WEDYORA and accepting assignments through
              the platform, the Vendor confirms that they have read,
              understood, and agree to comply with this Vendor
              Cancellation Policy.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
