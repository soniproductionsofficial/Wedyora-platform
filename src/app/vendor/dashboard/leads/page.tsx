import { Inbox } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { acceptLeadAction, rejectLeadAction } from "@/lib/actions/vendor-dashboard";

export default async function VendorLeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: leads } = await supabase
    .from("bookings")
    .select(
      "id, event_date, city, guest_count, budget_min, budget_max, special_requirements, agreed_price, advance_amount, service_categories(name), profiles!bookings_customer_id_fkey(full_name, phone)"
    )
    .eq("vendor_id", user.id)
    .eq("status", "pending_vendor_acceptance")
    .order("event_date", { ascending: true });

  return (
    <div>
      <p className="text-brand-gray text-sm mb-8">
        These are bookings our team has matched to you, at a package price
        you already offer. Accept to confirm you can take it — the customer
        is then asked to pay the advance. Reject to send it back to our team
        so it can go to another vendor.
      </p>

      {error && (
        <p className="mb-6 rounded-lg bg-red-50 text-brand-orange-dark text-sm px-4 py-3">
          {error}
        </p>
      )}

      {!leads || leads.length === 0 ? (
        <div className="rounded-2xl border border-brand-line bg-white p-10 text-center">
          <Inbox className="h-8 w-8 text-brand-gray mx-auto mb-3" />
          <p className="text-brand-gray text-sm">No new leads right now.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {leads.map((lead) => (
            <div key={lead.id} className="rounded-2xl border border-brand-line bg-white p-6">
              <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                <div>
                  <p className="font-heading font-semibold">
                    {lead.service_categories?.name} &middot; {lead.city}
                  </p>
                  <p className="text-xs text-brand-gray">
                    {new Date(lead.event_date).toLocaleDateString("en-IN")}
                    {lead.guest_count && ` · ${lead.guest_count} guests`}
                  </p>
                </div>
                {lead.agreed_price && (
                  <span className="text-sm font-semibold text-brand-orange">
                    ₹{Number(lead.agreed_price).toLocaleString("en-IN")}
                    {lead.advance_amount && (
                      <span className="text-xs text-brand-gray font-normal">
                        {" "}
                        (₹{Number(lead.advance_amount).toLocaleString("en-IN")} advance)
                      </span>
                    )}
                  </span>
                )}
              </div>

              <div className="text-sm text-brand-gray mb-4 flex flex-col gap-1">
                <p>
                  Customer: {lead.profiles?.full_name ?? "—"}
                  {lead.profiles?.phone && ` · ${lead.profiles.phone}`}
                </p>
                {(lead.budget_min || lead.budget_max) && (
                  <p>
                    Budget: ₹{lead.budget_min ?? "—"} – ₹{lead.budget_max ?? "—"}
                  </p>
                )}
                {lead.special_requirements && <p>Notes: {lead.special_requirements}</p>}
              </div>

              <div className="flex gap-3">
                <form action={acceptLeadAction}>
                  <input type="hidden" name="booking_id" value={lead.id} />
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-full bg-brand-orange text-white text-sm font-semibold hover:bg-brand-orange-dark transition-colors"
                  >
                    Accept
                  </button>
                </form>
                <form action={rejectLeadAction}>
                  <input type="hidden" name="booking_id" value={lead.id} />
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-full border border-brand-line text-sm font-semibold hover:bg-brand-cream transition-colors"
                  >
                    Reject
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
