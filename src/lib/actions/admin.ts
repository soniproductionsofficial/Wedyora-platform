"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { INCENTIVE_TIERS, partnerTierForEvents } from "@/lib/vendor-incentives";
import { getPenaltyIssue } from "@/lib/vendor-penalties";

// These actions rely on the normal (cookie-authenticated) Supabase client,
// NOT the service-role admin client. That's intentional: Row Level Security
// policies already grant admins read/write on vendor_profiles and bookings
// (see is_admin() in the migration), so if the caller isn't actually an
// admin, these writes fail at the database level — not just because the
// UI hid the button. Money-ledger tables (vendor_payments, payout_milestones)
// have no regular-user write policy at all, so those specific writes go
// through the service-role client after an explicit is_admin() check here.

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

  const { createNotification } = await import("@/lib/notifications");
  await createNotification({
    userId: vendorId,
    kind: "approval",
    title:
      decision === "approved"
        ? "You're approved on Wedyora"
        : "Application update from Wedyora",
    body:
      decision === "approved"
        ? "Your vendor application was approved. New customer leads will appear in your dashboard."
        : "Your vendor application was not approved. Contact support if you have questions.",
    link: decision === "approved" ? "/vendor/dashboard" : "/vendor/dashboard/support",
  });

  revalidatePath("/admin/vendors");
}

// --- Vendor packages (Chapter 4: Booking Workflow "Price Locked" step;
// tier/customer_price/vendor_payout added in Vendor Pricing & Quote
// Structure so Wedyora's margin per package is tracked, not implied) ---
//
// There's no vendor dashboard yet (that's the later Vendor Journey
// chapter), so for now admin enters a vendor's packages on their behalf —
// same as how admin already handles vendor pricing today, just structured
// as a reusable priced package instead of a number typed fresh each time.

export async function createPackageAction(formData: FormData) {
  const vendorId = String(formData.get("vendor_id") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const tier = String(formData.get("tier") ?? "").trim();
  const customerPrice = Number(formData.get("customer_price") ?? 0);
  const vendorPayout = Number(formData.get("vendor_payout") ?? 0);

  if (
    !vendorId ||
    !title ||
    !customerPrice ||
    customerPrice <= 0 ||
    !vendorPayout ||
    vendorPayout <= 0
  ) {
    redirect(
      "/admin/packages?error=" +
        encodeURIComponent(
          "Please choose a vendor, a title, and both a customer price and vendor payout greater than zero."
        )
    );
  }
  if (vendorPayout > customerPrice) {
    redirect(
      "/admin/packages?error=" +
        encodeURIComponent("The vendor payout can't be more than the customer price.")
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.from("packages").insert({
    vendor_id: vendorId,
    title,
    description: description || null,
    tier: (["basic", "premium", "luxury"].includes(tier) ? tier : null) as
      | "basic"
      | "premium"
      | "luxury"
      | null,
    customer_price: customerPrice,
    vendor_payout: vendorPayout,
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
// (see BookingAssignCard) plus any add-ons — but per the framework's own
// security guidance, we never trust a price the client hands back. Only
// the package's and add-ons' IDs travel in the form; their prices and the
// vendor's approval status are re-read from the database here, and the
// vendor's availability on the requested date is re-checked here too
// (Chapter 4's "Date Available? / Vendor Available?" validation), so
// nothing about the actual charge depends on what the browser submitted.

export async function assignVendorToBookingAction(formData: FormData) {
  const bookingId = String(formData.get("booking_id") ?? "");
  const packageId = String(formData.get("package_id") ?? "");
  const advanceAmount = Number(formData.get("advance_amount") ?? 0);
  const addOnIds = formData.getAll("add_on_ids").map(String).filter(Boolean);

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
    .select("id, customer_price, vendor_payout, is_active, vendor_id, vendor_profiles(status)")
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

  const { data: addOns } = addOnIds.length
    ? await supabase
        .from("add_ons")
        .select("id, customer_price, vendor_payout")
        .in("id", addOnIds)
        .eq("is_active", true)
    : { data: [] as { id: string; customer_price: number; vendor_payout: number }[] };

  const addOnCustomerTotal = (addOns ?? []).reduce((sum, a) => sum + Number(a.customer_price), 0);
  const addOnVendorTotal = (addOns ?? []).reduce((sum, a) => sum + Number(a.vendor_payout), 0);
  const totalCustomerPrice = Number(pkg.customer_price) + addOnCustomerTotal;
  const totalVendorPayout = Number(pkg.vendor_payout) + addOnVendorTotal;

  if (advanceAmount > totalCustomerPrice) {
    redirect(
      "/admin/bookings?error=" +
        encodeURIComponent("Advance amount can't be more than the total package + add-on price.")
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
      agreed_price: totalCustomerPrice,
      agreed_vendor_payout: totalVendorPayout,
      advance_amount: advanceAmount,
      status: "pending_vendor_acceptance",
      assigned_by: user?.id,
      assigned_at: new Date().toISOString(),
    })
    .eq("id", bookingId);

  if (error) {
    redirect("/admin/bookings?error=" + encodeURIComponent(error.message));
  }

  // Clear out any add-ons from a previous assignment attempt on this same
  // booking (e.g. the vendor rejected it and it's being reassigned), then
  // snapshot the chosen ones at today's prices.
  await supabase.from("booking_add_ons").delete().eq("booking_id", bookingId);
  if (addOns && addOns.length > 0) {
    await supabase.from("booking_add_ons").insert(
      addOns.map((a) => ({
        booking_id: bookingId,
        add_on_id: a.id,
        customer_price: a.customer_price,
        vendor_payout: a.vendor_payout,
      }))
    );
  }

  // Vendor tasks: default checklist + any custom lines the admin typed.
  const { DEFAULT_VENDOR_TASKS, createNotification } = await import(
    "@/lib/notifications"
  );
  const customTasks = String(formData.get("vendor_tasks") ?? "")
    .split("\n")
    .map((t) => t.trim())
    .filter(Boolean);
  const taskTitles = [...DEFAULT_VENDOR_TASKS, ...customTasks];
  const admin = createAdminClient();
  await admin.from("vendor_tasks").delete().eq("booking_id", bookingId);
  await admin.from("vendor_tasks").insert(
    taskTitles.map((title, i) => ({
      booking_id: bookingId,
      vendor_id: pkg.vendor_id,
      title,
      sort_order: i,
    }))
  );

  const { data: bookingDetails } = await supabase
    .from("bookings")
    .select(
      "event_date, city, service_categories(name), profiles!bookings_customer_id_fkey(full_name)"
    )
    .eq("id", bookingId)
    .single();

  const categoryName = bookingDetails?.service_categories?.name ?? "an event";
  const customerName = bookingDetails?.profiles?.full_name ?? "a customer";
  const eventDate = bookingDetails?.event_date
    ? new Date(bookingDetails.event_date).toLocaleDateString("en-IN")
    : "the event date";
  const city = bookingDetails?.city ?? "their city";

  await createNotification({
    userId: pkg.vendor_id,
    kind: "lead",
    title: "New lead assigned to you",
    body: `${customerName} needs ${categoryName} in ${city} on ${eventDate}. Review the lead and accept or reject it.`,
    link: "/vendor/dashboard/leads",
    bookingId,
  });

  revalidatePath("/admin/bookings");
  revalidatePath("/vendor/dashboard/leads");
  revalidatePath("/vendor/dashboard/notifications");
}

// --- Booking completion + performance bonus (Vendor Incentive Program) ---
//
// There's no Wedding Day Operations / Editing Department workflow yet to
// trigger this automatically, so an admin marks a booking completed by
// hand for now. Doing so both unlocks the "Wedding Successfully Completed"
// payout milestone for release and checks whether the vendor just crossed
// a bonus tier (10/25/50/100 successful events).

export async function markBookingCompletedAction(formData: FormData) {
  const bookingId = String(formData.get("booking_id") ?? "");
  if (!bookingId) return;

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

  const { data: booking } = await admin
    .from("bookings")
    .select("id, vendor_id, status")
    .eq("id", bookingId)
    .single();

  if (!booking || !booking.vendor_id || !["confirmed", "in_progress"].includes(booking.status)) {
    redirect(
      "/admin/bookings?error=" + encodeURIComponent("This booking can't be marked completed yet.")
    );
  }

  await admin.from("bookings").update({ status: "completed" }).eq("id", bookingId);

  const { data: vendor } = await admin
    .from("vendor_profiles")
    .select("successful_events_count")
    .eq("id", booking!.vendor_id!)
    .single();

  const previousCount = vendor?.successful_events_count ?? 0;
  const newCount = previousCount + 1;
  const newTier = partnerTierForEvents(newCount);

  await admin
    .from("vendor_profiles")
    .update({ successful_events_count: newCount, partner_tier: newTier })
    .eq("id", booking!.vendor_id!);

  const crossedTier = INCENTIVE_TIERS.find((t) => previousCount < t.events && newCount >= t.events);
  if (crossedTier) {
    await admin.from("vendor_payments").insert({
      vendor_id: booking!.vendor_id!,
      type: "incentive_bonus",
      direction: "credit",
      amount: crossedTier.bonus,
      status: "pending",
      reason: `Performance bonus for reaching ${crossedTier.events} successful events`,
      created_by: user?.id,
    });
  }

  revalidatePath("/admin/bookings");
  revalidatePath("/admin/vendors");
  revalidatePath("/admin/payouts");
}

// --- Vendor Penalty Policy ---

export async function logVendorPenaltyAction(formData: FormData) {
  const vendorId = String(formData.get("vendor_id") ?? "");
  const issueKey = String(formData.get("issue") ?? "");
  const daysLate = Number(formData.get("days_late") ?? 1) || 1;
  const issue = getPenaltyIssue(issueKey);

  if (!vendorId || !issue) {
    redirect(
      "/admin/vendors?error=" + encodeURIComponent("Please choose a vendor and a valid issue.")
    );
  }

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

  const amount = issue!.perDay ? issue!.amount * Math.max(1, daysLate) : issue!.amount;

  const admin = createAdminClient();
  await admin.from("vendor_payments").insert({
    vendor_id: vendorId,
    type: "penalty",
    direction: "debit",
    amount,
    status: "pending",
    reason: issue!.perDay
      ? `${issue!.label} (${daysLate} day${daysLate === 1 ? "" : "s"})`
      : issue!.label,
    created_by: user?.id,
  });

  if (issue!.suspends) {
    await admin.from("vendor_profiles").update({ status: "suspended" }).eq("id", vendorId);
  }

  revalidatePath("/admin/vendors");
}

// --- Vendor ledger (registration/deposit/renewal/bonus/penalty) ---

export async function markVendorPaymentResolvedAction(formData: FormData) {
  const paymentId = String(formData.get("payment_id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!paymentId || (status !== "paid" && status !== "waived")) return;

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
  await admin.from("vendor_payments").update({ status }).eq("id", paymentId);

  revalidatePath("/admin/payouts");
}

// --- Add-on pricing catalog (platform-wide, e.g. Pre-Wedding Shoot) ---

export async function createAddOnAction(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const customerPrice = Number(formData.get("customer_price") ?? 0);
  const vendorPayout = Number(formData.get("vendor_payout") ?? 0);

  if (!name || !customerPrice || customerPrice <= 0 || !vendorPayout || vendorPayout <= 0) {
    redirect(
      "/admin/add-ons?error=" +
        encodeURIComponent("Please enter a name, a customer price, and a vendor payout greater than zero.")
    );
  }
  if (vendorPayout > customerPrice) {
    redirect(
      "/admin/add-ons?error=" +
        encodeURIComponent("The vendor payout can't be more than the customer price.")
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.from("add_ons").insert({
    name,
    customer_price: customerPrice,
    vendor_payout: vendorPayout,
  });

  if (error) {
    redirect("/admin/add-ons?error=" + encodeURIComponent(error.message));
  }

  revalidatePath("/admin/add-ons");
  revalidatePath("/admin/bookings");
}

export async function toggleAddOnActiveAction(formData: FormData) {
  const addOnId = String(formData.get("add_on_id") ?? "");
  const isActive = String(formData.get("is_active") ?? "") === "true";
  if (!addOnId) return;

  const supabase = await createClient();
  await supabase.from("add_ons").update({ is_active: !isActive }).eq("id", addOnId);

  revalidatePath("/admin/add-ons");
  revalidatePath("/admin/bookings");
}

// --- Payout Milestones (Vendor Payment Timeline) ---
//
// Writes go through the service-role client, same as every other payout
// write in this app — regular RLS intentionally has no update policy for
// payout_milestones at all, so this can't be done any other way, which is
// the point (nobody can fake or self-release a payout from the browser).

export async function releasePayoutMilestoneAction(formData: FormData) {
  const milestoneId = String(formData.get("milestone_id") ?? "");
  if (!milestoneId) return;

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
  await admin
    .from("payout_milestones")
    .update({ status: "released", released_at: new Date().toISOString() })
    .eq("id", milestoneId);

  revalidatePath("/admin/payouts");
  revalidatePath("/vendor/dashboard/payouts");
  revalidatePath("/vendor/dashboard");
}
