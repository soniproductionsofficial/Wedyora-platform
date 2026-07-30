import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import {
  CUSTOMER_PRE_WEDDING_CHECKLIST,
  VENDOR_PRE_WEDDING_CHECKLIST,
  CHECKOUT_CHECKLIST,
  INCIDENT_ISSUES,
  labelForDeliverableCategory,
} from "@/lib/wedding-day-ops";
import { logIncidentAction, resolveIncidentAction } from "@/lib/actions/wedding-day-ops";
import PrintCallSheetButton from "@/components/print-call-sheet-button";

export default async function AdminBookingDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;
  const supabase = await createClient();

  const { data: booking } = await supabase
    .from("bookings")
    .select(
      "id, event_date, city, guest_count, agreed_price, agreed_vendor_payout, special_requirements, status, service_categories(name), profiles!bookings_customer_id_fkey(full_name, phone, wedding_venue_name), vendor_profiles(id, business_name, city, team_size)"
    )
    .eq("id", id)
    .maybeSingle();

  if (!booking) notFound();

  const [{ data: ops }, { data: incidents }, { data: deliverables }, { data: addOns }] =
    await Promise.all([
      supabase.from("wedding_day_ops").select("*").eq("booking_id", id).maybeSingle(),
      supabase
        .from("wedding_day_incidents")
        .select("*")
        .eq("booking_id", id)
        .order("created_at", { ascending: false }),
      supabase
        .from("wedding_day_deliverables")
        .select("*")
        .eq("booking_id", id)
        .order("created_at", { ascending: false }),
      supabase.from("booking_add_ons").select("add_ons(name)").eq("booking_id", id),
    ]);

  // Signed URLs for the private deliverables bucket — generated fresh on
  // every render, short-lived, never a public getPublicUrl() link.
  const deliverablesWithUrls = await Promise.all(
    (deliverables ?? []).map(async (d) => {
      const { data } = await supabase.storage
        .from("wedding-day-deliverables")
        .createSignedUrl(d.file_path, 60 * 10);
      return { ...d, signedUrl: data?.signedUrl ?? null };
    })
  );

  const customerDone = ops?.customer_checklist_done ?? [];
  const vendorDone = ops?.vendor_checklist_done ?? [];
  const checkoutDone = ops?.checkout_checklist_done ?? [];

  return (
    <div className="flex flex-col gap-6">
      <Link href="/admin/bookings" className="print:hidden text-xs text-brand-gray">
        &larr; Back to all bookings
      </Link>

      {error && (
        <p className="print:hidden rounded-lg bg-red-50 text-brand-orange-dark text-sm px-4 py-3">
          {error}
        </p>
      )}

      {/* Call Sheet: auto-generated from booking data, nothing stored separately. */}
      <section id="call-sheet" className="rounded-2xl border border-brand-line bg-white p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading text-lg font-semibold">Call Sheet</h2>
          <PrintCallSheetButton />
        </div>
        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-brand-gray text-xs mb-0.5">Service</p>
            <p className="font-medium">{booking.service_categories?.name}</p>
          </div>
          <div>
            <p className="text-brand-gray text-xs mb-0.5">Date</p>
            <p className="font-medium">
              {new Date(booking.event_date).toLocaleDateString("en-IN", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <div>
            <p className="text-brand-gray text-xs mb-0.5">City</p>
            <p className="font-medium">{booking.city}</p>
          </div>
          {booking.profiles?.wedding_venue_name && (
            <div>
              <p className="text-brand-gray text-xs mb-0.5">Venue</p>
              <p className="font-medium">{booking.profiles.wedding_venue_name}</p>
            </div>
          )}
          <div>
            <p className="text-brand-gray text-xs mb-0.5">Customer</p>
            <p className="font-medium">
              {booking.profiles?.full_name} &middot; {booking.profiles?.phone}
            </p>
          </div>
          <div>
            <p className="text-brand-gray text-xs mb-0.5">Vendor</p>
            <p className="font-medium">
              {booking.vendor_profiles?.business_name ?? "Not assigned"}
              {booking.vendor_profiles?.team_size && ` · Team of ${booking.vendor_profiles.team_size}`}
            </p>
          </div>
          {booking.guest_count && (
            <div>
              <p className="text-brand-gray text-xs mb-0.5">Guest Count</p>
              <p className="font-medium">{booking.guest_count}</p>
            </div>
          )}
          {(booking.agreed_price || booking.agreed_vendor_payout) && (
            <div>
              <p className="text-brand-gray text-xs mb-0.5">Price / Payout</p>
              <p className="font-medium">
                ₹{booking.agreed_price ?? "—"}
                {booking.agreed_vendor_payout && ` / ₹${booking.agreed_vendor_payout} to vendor`}
              </p>
            </div>
          )}
          {addOns && addOns.length > 0 && (
            <div className="sm:col-span-2">
              <p className="text-brand-gray text-xs mb-0.5">Add-ons</p>
              <p className="font-medium">
                {addOns.map((a) => a.add_ons?.name).filter(Boolean).join(", ")}
              </p>
            </div>
          )}
          {booking.special_requirements && (
            <div className="sm:col-span-2">
              <p className="text-brand-gray text-xs mb-0.5">Special Requirements</p>
              <p className="font-medium">{booking.special_requirements}</p>
            </div>
          )}
        </div>
      </section>

      {/* Checklists + check-in/out status (read-only here — customer and vendor own the toggling) */}
      <section className="print:hidden rounded-2xl border border-brand-line bg-white p-6">
        <h2 className="font-heading text-lg font-semibold mb-4">Checklists &amp; Status</h2>
        <div className="grid sm:grid-cols-2 gap-6 text-sm">
          <div>
            <p className="font-medium mb-2">Customer Checklist</p>
            <ul className="flex flex-col gap-1">
              {CUSTOMER_PRE_WEDDING_CHECKLIST.map((item) => (
                <li key={item.key} className={customerDone.includes(item.key) ? "text-green-700" : "text-brand-gray"}>
                  {customerDone.includes(item.key) ? "✓" : "○"} {item.label}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-medium mb-2">Vendor Checklist</p>
            <ul className="flex flex-col gap-1">
              {VENDOR_PRE_WEDDING_CHECKLIST.map((item) => (
                <li key={item.key} className={vendorDone.includes(item.key) ? "text-green-700" : "text-brand-gray"}>
                  {vendorDone.includes(item.key) ? "✓" : "○"} {item.label}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-medium mb-2">Checkout Checklist</p>
            <ul className="flex flex-col gap-1">
              {CHECKOUT_CHECKLIST.map((item) => (
                <li key={item.key} className={checkoutDone.includes(item.key) ? "text-green-700" : "text-brand-gray"}>
                  {checkoutDone.includes(item.key) ? "✓" : "○"} {item.label}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-medium mb-2">Timestamps</p>
            <p className="text-brand-gray">
              Checked in:{" "}
              {ops?.checked_in_at ? new Date(ops.checked_in_at).toLocaleString("en-IN") : "Not yet"}
            </p>
            <p className="text-brand-gray">
              Checked out:{" "}
              {ops?.checked_out_at ? new Date(ops.checked_out_at).toLocaleString("en-IN") : "Not yet"}
            </p>
          </div>
        </div>
      </section>

      {/* Incident log */}
      <section className="print:hidden rounded-2xl border border-brand-line bg-white p-6">
        <h2 className="font-heading text-lg font-semibold mb-4">Incident Log</h2>
        <form action={logIncidentAction} className="flex flex-wrap items-end gap-3 mb-6">
          <input type="hidden" name="booking_id" value={id} />
          <div>
            <label className="block text-xs text-brand-gray mb-1">Issue Type</label>
            <select
              name="issue_type"
              required
              defaultValue=""
              className="rounded-lg border border-brand-line px-3 py-2 text-sm"
            >
              <option value="" disabled>
                Choose issue
              </option>
              {INCIDENT_ISSUES.map((i) => (
                <option key={i.key} value={i.key}>
                  {i.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs text-brand-gray mb-1">Description</label>
            <input
              name="description"
              placeholder="What happened?"
              className="w-full rounded-lg border border-brand-line px-3 py-2 text-sm"
            />
          </div>
          <button
            type="submit"
            className="rounded-full bg-brand-orange text-white font-semibold px-5 py-2 text-sm hover:bg-brand-orange-dark"
          >
            Log Incident
          </button>
        </form>

        {!incidents || incidents.length === 0 ? (
          <p className="text-sm text-brand-gray">No incidents logged.</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {incidents.map((inc) => (
              <li key={inc.id} className="rounded-xl border border-brand-line p-4 text-sm">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <p className="font-medium">
                    {INCIDENT_ISSUES.find((i) => i.key === inc.issue_type)?.label ?? inc.issue_type}
                  </p>
                  {inc.resolved_at ? (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-green-50 text-green-700">
                      Resolved
                    </span>
                  ) : (
                    <form action={resolveIncidentAction}>
                      <input type="hidden" name="incident_id" value={inc.id} />
                      <input type="hidden" name="booking_id" value={id} />
                      <button
                        type="submit"
                        className="text-xs font-semibold px-3 py-1 rounded-full border border-brand-line hover:bg-brand-cream"
                      >
                        Mark Resolved
                      </button>
                    </form>
                  )}
                </div>
                {inc.description && <p className="text-brand-gray mb-1">{inc.description}</p>}
                <p className="text-xs text-brand-gray">
                  Suggested: {inc.suggested_action} &middot; Escalated to: {inc.escalated_to}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Deliverables */}
      <section className="print:hidden rounded-2xl border border-brand-line bg-white p-6">
        <h2 className="font-heading text-lg font-semibold mb-4">Post-Event Deliverables</h2>
        {!deliverablesWithUrls || deliverablesWithUrls.length === 0 ? (
          <p className="text-sm text-brand-gray">Nothing uploaded yet.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {deliverablesWithUrls.map((d) => (
              <li
                key={d.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-brand-line px-4 py-2.5 text-sm"
              >
                <span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-brand-cream border border-brand-line mr-2">
                    {labelForDeliverableCategory(d.category)}
                  </span>
                  {d.file_name}
                </span>
                {d.signedUrl ? (
                  <a
                    href={d.signedUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-semibold text-brand-orange hover:underline"
                  >
                    Download
                  </a>
                ) : (
                  <span className="text-xs text-brand-gray">Link unavailable</span>
                )}
              </li>
            ))}
          </ul>
        )}
        {ops?.project_notes && (
          <div className="mt-4 rounded-xl bg-brand-cream p-4 text-sm">
            <p className="font-medium mb-1">Vendor&rsquo;s Project Notes</p>
            <p className="text-brand-gray whitespace-pre-wrap">{ops.project_notes}</p>
          </div>
        )}
      </section>
    </div>
  );
}
