"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient, createAdminClient } from "@/lib/supabase/server";

// These actions rely on the normal (cookie-authenticated) Supabase client,
// NOT the service-role admin client. That's intentional: Row Level Security
// policies already grant admins read/write on vendor_profiles and bookings
// (see is_admin() in the migration), so if the caller isn't actually an
// admin, these writes fail at the database level — not just because the
// UI hid the button.

export async function reviewVendorAction(formData: FormData) {
  const vendorId = String(formData.get("vendor_id") ?? "");
  const decision = String(formData.get("decision") ?? "");

  if (!vendorId || (decision !== "approved" && decision !== "rejected")) {
    return;
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  await supabase
    .from("vendor_profiles")
    .update({
      status: decision,
      reviewed_by: user?.id,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", vendorId);

  revalidatePath("/admin/vendors");
}

// --- Vendor packages (Chapter 4: Booking Workflow "Price Locked" step) ---
//
// There's no vendor dashboard yet (that's the later Vendor Journey
// chapter), so for now admin enters a vendor's packages on their behalf —
// same as how admin already handles vendor pricing today, just structured
// as a reusable priced package instead of a number typed fresh each time.

export async function createPackageAction(formData: FormData) {
  const vendorId = String(formData.get("vendor_id") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const price = Number(formData.get("price") ?? 0);

  if (!vendorId || !title || !price || price <= 0) {
    redirect(
      "/admin/packages?error=" +
        encodeURIComponent("Please choose a vendor, a title, and a price greater than zero.")
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.from("packages").insert({
    vendor_id: vendorId,
    title,
    description: description || null,
    price,
  });

  if (error) {
    redirect("/admin/packages?error=" + encodeURIComponent(error.message));
  }

  revalidatePath("/admin/packages");
  revalidatePath("/admin/bookings");
}

export async function togglePackageActiveAction(formData: FormData) {
  const packageId = String(formData.get("package_id") ?? "");
  const isActive = String(formData.get("is_active") ?? "") === "true";

  if (!packageId) return;

  const supabase = await createClient();
  await supabase.from("packages").update({ is_active: !isActive }).eq("id", packageId);

  revalidatePath("/admin/packages");
  revalidatePath("/admin/bookings");
}

// --- Booking assignment ---
//
// The admin picks one entry from a combined "vendor + package" dropdown
// (see BookingAssignCard) — but per the framework's own security guidance,
// we never trust a price the client hands back. Only the package's ID
// travels in the form; its price and its vendor's approval status are
// re-read from the database here, and the vendor's availability on the
// requested date is re-checked here too (Chapter 4's "Date Available? /
// Vendor Available?" validation), so nothing about the actual charge
// depends on what the browser submitted.

export async function assignVendorToBookingAction(formData: FormData) {
  const bookingId = String(formData.get("booking_id") ?? "");
  const packageId = String(formData.get("package_id") ?? "");
  const advanceAmount = Number(formData.get("advance_amount") ?? 0);

  if (!bookingId || !packageId || !advanceAmount || advanceAmount <= 0) {
    redirect(
      "/admin/bookings?error=" +
        encodeURIComponent("Please choose a package and enter an advance amount.")
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: booking } = await supabase
    .from("bookings")
    .select("id, event_date, status")
    .eq("id", bookingId)
    .single();

  if (!booking || booking.status !== "pending_assignment") {
    redirect(
      "/admin/bookings?error=" +
        encodeURIComponent("This booking is no longer waiting for a vendor.")
    );
  }

  const { data: pkg } = await supabase
    .from("packages")
    .select("id, price, is_active, vendor_id, vendor_profiles(status)")
    .eq("id", packageId)
    .single();

  if (!pkg || !pkg.is_active || pkg.vendor_profiles?.status !== "approved") {
    redirect(
      "/admin/bookings?error=" +
        encodeURIComponent("That package is no longer available.")
    );
  }

  // Availability check: don't double-book this vendor for the same date.
  const { data: clash } = await supabase
    .from("bookings")
    .select("id")
    .eq("vendor_id", pkg.vendor_id)
    .eq("event_date", booking.event_date)
    .in("status", ["pending_vendor_acceptance", "awaiting_payment", "confirmed", "in_progress"])
    .limit(1);

  if (clash && clash.length > 0) {
    redirect(
      "/admin/bookings?error=" +
        encodeURIComponent("This vendor already has another booking on that date.")
    );
  }

  if (advanceAmount > pkg.price) {
    redirect(
      "/admin/bookings?error=" +
        encodeURIComponent("Advance amount can't be more than the package price.")
    );
  }

  // Status goes to "pending_vendor_acceptance", not straight to
  // "awaiting_payment" — the Vendor Journey poster's Lead Assigned ->
  // Review Lead -> Accept/Reject steps mean the vendor has to confirm they
  // can actually take this booking before the customer is asked to pay.
  const { error } = await supabase
    .from("bookings")
    .update({
      vendor_id: pkg.vendor_id,
      package_id: pkg.id,
      agreed_price: pkg.price,
      advance_amount: advanceAmount,
      status: "pending_vendor_acceptance",
      assigned_by: user?.id,
      assigned_at: new Date().toISOString(),
    })
    .eq("id", bookingId);

  if (error) {
    redirect("/admin/bookings?error=" + encodeURIComponent(error.message));
  }

  revalidatePath("/admin/bookings");
}

// --- Payouts (Vendor Journey "Payouts" page + poster's Payment &
// Settlement step) ---
//
// Minimal ledger only: marks a collected payment as released to the
// vendor. Writes go through the service-role client, same as every other
// payments write in this app — regular RLS intentionally has no update
// policy for payments at all, so this can't be done any other way, which
// is the point (nobody can fake a payout from the browser).

export async function markPayoutReleasedAction(formData: FormData) {
  const paymentId = String(formData.get("payment_id") ?? "");
  if (!paymentId) return;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user?.id ?? "")
    .single();

  if (profile?.role !== "admin") return;

  const admin = createAdminClient();
  await admin.from("payments").update({ payout_status: "released" }).eq("id", paymentId);

  revalidatePath("/admin/payouts");
}
