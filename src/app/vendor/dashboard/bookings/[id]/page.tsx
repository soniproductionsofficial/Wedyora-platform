import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import {
  CHECKOUT_CHECKLIST,
  VENDOR_PRE_WEDDING_CHECKLIST,
  labelForDeliverableCategory,
  DELIVERABLE_CATEGORIES,
} from "@/lib/wedding-day-ops";
import {
  toggleVendorChecklistItemAction,
  toggleCheckoutChecklistItemAction,
  confirmCheckoutAction,
  updateProjectNotesAction,
  uploadDeliverableAction,
} from "@/lib/actions/wedding-day-ops";
import VendorCheckinButton from "@/components/vendor-checkin-button";
import PrintCallSheetButton from "@/components/print-call-sheet-button";

export default async function VendorBookingDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) notFound();

  const { data: booking } = await supabase
    .from("bookings")
    .select(
      "id, event_date, city, guest_count, agreed_vendor_payout, special_requirements, status, service_categories(name), profiles!bookings_customer_id_fkey(full_name, phone, wedding_venue_name)"
    )
    .eq("id", id)
    .eq("vendor_id", user.id)
    .maybeSingle();

  if (!booking) notFound();

  const [{ data: ops }, { data: addOns }, { data: deliverables }] = await Promise.all([
    supabase.from("wedding_day_ops").select("*").eq("booking_id", id).maybeSingle(),
    supabase.from("booking_add_ons").select("add_ons(name)").eq("booking_id", id),
    supabase
      .from("wedding_day_deliverables")
      .select("*")
      .eq("booking_id", id)
      .order("created_at", { ascending: false }),
  ]);

  const vendorDone = ops?.vendor_checklist_done ?? [];
  const checkoutDone = ops?.checkout_checklist_done ?? [];
  const allCheckoutDone = CHECKOUT_CHECKLIST.every((item) => checkoutDone.includes(item.key));

  return (
    <div className="flex flex-col gap-6">
      <Link href="/vendor/dashboard/bookings" className="print:hidden text-xs text-brand-gray">
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
          {booking.guest_count && (
            <div>
              <p className="text-brand-gray text-xs mb-0.5">Guest Count</p>
              <p className="font-medium">{booking.guest_count}</p>
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

      {/* Check-in */}
      <section className="print:hidden rounded-2xl border border-brand-line bg-white p-6">
        <h2 className="font-heading text-lg font-semibold mb-4">Venue Check-In</h2>
        <VendorCheckinButton bookingId={id} checkedInAt={ops?.checked_in_at ?? null} />
      </section>

      {/* Pre-wedding checklist (vendor side) */}
      <section className="print:hidden rounded-2xl border border-brand-line bg-white p-6">
        <h2 className="font-heading text-lg font-semibold mb-1">Pre-Wedding Checklist</h2>
        <p className="text-xs text-brand-gray mb-4">Your prep items before the event.</p>
        <ul className="flex flex-col gap-2">
          {VENDOR_PRE_WEDDING_CHECKLIST.map((item) => {
            const done = vendorDone.includes(item.key);
            return (
              <li
                key={item.key}
                className="flex items-center justify-between gap-3 rounded-xl border border-brand-line px-4 py-2.5 text-sm"
              >
                <span className={done ? "line-through text-brand-gray" : ""}>{item.label}</span>
                <form action={toggleVendorChecklistItemAction}>
                  <input type="hidden" name="booking_id" value={id} />
                  <input type="hidden" name="item_key" value={item.key} />
                  <button
                    type="submit"
                    className={`text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap ${
                      done
                        ? "border border-brand-line text-brand-gray hover:bg-brand-cream"
                        : "bg-brand-button text-brand-black hover:bg-brand-button-dark"
                    }`}
                  >
                    {done ? "Undo" : "Mark Done"}
                  </button>
                </form>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Checkout checklist + confirmation */}
      <section className="print:hidden rounded-2xl border border-brand-line bg-white p-6">
        <h2 className="font-heading text-lg font-semibold mb-1">Checkout Checklist</h2>
        <p className="text-xs text-brand-gray mb-4">Wrap-up items before you leave the venue.</p>
        <ul className="flex flex-col gap-2 mb-4">
          {CHECKOUT_CHECKLIST.map((item) => {
            const done = checkoutDone.includes(item.key);
            return (
              <li
                key={item.key}
                className="flex items-center justify-between gap-3 rounded-xl border border-brand-line px-4 py-2.5 text-sm"
              >
                <span className={done ? "line-through text-brand-gray" : ""}>{item.label}</span>
                <form action={toggleCheckoutChecklistItemAction}>
                  <input type="hidden" name="booking_id" value={id} />
                  <input type="hidden" name="item_key" value={item.key} />
                  <button
                    type="submit"
                    className={`text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap ${
                      done
                        ? "border border-brand-line text-brand-gray hover:bg-brand-cream"
                        : "bg-brand-button text-brand-black hover:bg-brand-button-dark"
                    }`}
                  >
                    {done ? "Undo" : "Mark Done"}
                  </button>
                </form>
              </li>
            );
          })}
        </ul>
        {ops?.checked_out_at ? (
          <p className="text-sm text-green-700 font-medium">
            Checked out at {new Date(ops.checked_out_at).toLocaleString("en-IN")}
          </p>
        ) : (
          <form action={confirmCheckoutAction}>
            <input type="hidden" name="booking_id" value={id} />
            <button
              type="submit"
              disabled={!allCheckoutDone}
              className="rounded-full bg-brand-black text-white font-semibold px-5 py-2.5 text-sm hover:opacity-90 disabled:opacity-40"
            >
              Confirm Checkout
            </button>
            {!allCheckoutDone && (
              <p className="text-xs text-brand-gray mt-2">
                Finish every checklist item above to confirm checkout.
              </p>
            )}
          </form>
        )}
      </section>

      {/* Project notes */}
      <section className="print:hidden rounded-2xl border border-brand-line bg-white p-6">
        <h2 className="font-heading text-lg font-semibold mb-4">Project Notes</h2>
        <form action={updateProjectNotesAction} className="flex flex-col gap-3">
          <input type="hidden" name="booking_id" value={id} />
          <textarea
            name="project_notes"
            rows={4}
            defaultValue={ops?.project_notes ?? ""}
            placeholder="Anything the editing team should know about this shoot…"
            className="rounded-xl border border-brand-line px-4 py-2.5 text-sm"
          />
          <button
            type="submit"
            className="self-start rounded-full bg-brand-button text-brand-black font-semibold px-5 py-2 text-sm hover:bg-brand-button-dark"
          >
            Save Notes
          </button>
        </form>
      </section>

      {/* Deliverables upload */}
      <section className="print:hidden rounded-2xl border border-brand-line bg-white p-6">
        <h2 className="font-heading text-lg font-semibold mb-4">Post-Event Deliverables</h2>
        <form
          action={uploadDeliverableAction}
          encType="multipart/form-data"
          className="flex flex-wrap items-end gap-3 mb-6"
        >
          <input type="hidden" name="booking_id" value={id} />
          <div>
            <label className="block text-xs text-brand-gray mb-1">Category</label>
            <select
              name="category"
              required
              defaultValue=""
              className="rounded-lg border border-brand-line px-3 py-2 text-sm"
            >
              <option value="" disabled>
                Choose category
              </option>
              {DELIVERABLE_CATEGORIES.map((c) => (
                <option key={c.key} value={c.key}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-brand-gray mb-1">File</label>
            <input type="file" name="file" required className="text-sm" />
          </div>
          <button
            type="submit"
            className="rounded-full bg-brand-button text-brand-black font-semibold px-5 py-2 text-sm hover:bg-brand-button-dark"
          >
            Upload
          </button>
        </form>

        {!deliverables || deliverables.length === 0 ? (
          <p className="text-sm text-brand-gray">No files uploaded yet.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {deliverables.map((d) => (
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
                <span className="text-xs text-brand-gray">
                  {new Date(d.created_at).toLocaleDateString("en-IN")}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
