"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { PAYOUT_MILESTONES } from "@/lib/payout-milestones";

// Everything here relies on Row Level Security, not application logic, to
// keep a vendor confined to their own data — "packages: vendor manages
// own" and the equivalent booking/vendor_profiles policies (see
// 0001_phase1_init.sql) already restrict every write in this file to rows
// where auth.uid() is the vendor in question. A vendor can't accept
// someone else's lead or edit someone else's package no matter what ID
// they submit, because the database itself would refuse the write.

// --- Leads: Accept / Reject (poster steps 11-13) ---

export async function acceptLeadAction(formData: FormData) {
  const bookingId = String(formData.get("booking_id") ?? "");
  if (!bookingId) return;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: booking, error } = await supabase
    .from("bookings")
    .update({ status: "awaiting_payment" })
    .eq("id", bookingId)
    .eq("vendor_id", user.id)
    .eq("status", "pending_vendor_acceptance")
    .select("id, agreed_vendor_payout")
    .single();

  if (error) {
    redirect("/vendor/dashboard/leads?error=" + encodeURIComponent(error.message));
  }

  // Set up the 5-stage payout schedule (Vendor Payment Timeline) now that
  // this booking has a locked-in vendor payout. Uses the service-role
  // client — payout_milestones has no insert policy for regular users,
  // same reasoning as `payments` (amounts are server-computed, never
  // submitted by the browser, but only trusted server code may write them).
  if (booking?.agreed_vendor_payout) {
    const admin = createAdminClient();
    // Clear out any milestone rows from an earlier accept on this same
    // booking (e.g. it was rejected and reassigned, then accepted again)
    // before re-inserting, since (booking_id, milestone) is unique.
    await admin.from("payout_milestones").delete().eq("booking_id", bookingId);
    await admin.from("payout_milestones").insert(
      PAYOUT_MILESTONES.map((m) => ({
        booking_id: bookingId,
        milestone: m.key,
        sort_order: m.sortOrder,
        percentage: m.percentage,
        amount: Math.round((booking.agreed_vendor_payout! * m.percentage) / 100),
      }))
    );
  }

  revalidatePath("/vendor/dashboard/leads");
  revalidatePath("/vendor/dashboard");
}

export async function rejectLeadAction(formData: FormData) {
  const bookingId = String(formData.get("booking_id") ?? "");
  if (!bookingId) return;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Sends it back to "pending_assignment" (clearing the vendor/package/
  // price) so admin can hand it to a different vendor — same status a
  // fresh booking starts in.
  const { error } = await supabase
    .from("bookings")
    .update({
      status: "pending_assignment",
      vendor_id: null,
      package_id: null,
      agreed_price: null,
      advance_amount: null,
      assigned_by: null,
      assigned_at: null,
    })
    .eq("id", bookingId)
    .eq("vendor_id", user.id)
    .eq("status", "pending_vendor_acceptance");

  if (error) {
    redirect("/vendor/dashboard/leads?error=" + encodeURIComponent(error.message));
  }

  revalidatePath("/vendor/dashboard/leads");
  revalidatePath("/vendor/dashboard");
  revalidatePath("/admin/bookings");
}

// --- Packages: vendor self-service (replaces admin doing it on their
// behalf, now that there's somewhere for a vendor to do it themselves) ---

export async function createVendorPackageAction(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const tier = String(formData.get("tier") ?? "").trim();
  const customerPrice = Number(formData.get("customer_price") ?? 0);
  const vendorPayout = Number(formData.get("vendor_payout") ?? 0);

  if (!title || !customerPrice || customerPrice <= 0 || !vendorPayout || vendorPayout <= 0) {
    redirect(
      "/vendor/dashboard/profile?error=" +
        encodeURIComponent(
          "Please enter a title, a customer price, and a payout to you — all greater than zero."
        )
    );
  }
  if (vendorPayout > customerPrice) {
    redirect(
      "/vendor/dashboard/profile?error=" +
        encodeURIComponent("Your payout can't be more than the customer price.")
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error } = await supabase.from("packages").insert({
    vendor_id: user.id,
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
    redirect("/vendor/dashboard/profile?error=" + encodeURIComponent(error.message));
  }

  revalidatePath("/vendor/dashboard/profile");
}

export async function toggleVendorPackageActiveAction(formData: FormData) {
  const packageId = String(formData.get("package_id") ?? "");
  const isActive = String(formData.get("is_active") ?? "") === "true";
  if (!packageId) return;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await supabase
    .from("packages")
    .update({ is_active: !isActive })
    .eq("id", packageId)
    .eq("vendor_id", user.id);

  revalidatePath("/vendor/dashboard/profile");
}

// --- Profile (business info, not KYC re-verification) ---

export async function updateVendorProfileAction(formData: FormData) {
  const businessName = String(formData.get("business_name") ?? "").trim();
  const city = String(formData.get("city") ?? "").trim();
  const serviceAreasRaw = String(formData.get("service_areas") ?? "").trim();
  const bio = String(formData.get("bio") ?? "").trim();
  const equipmentDetails = String(formData.get("equipment_details") ?? "").trim();
  const teamSizeRaw = String(formData.get("team_size") ?? "");
  const availableFrom = String(formData.get("available_from") ?? "").trim();

  if (!businessName || !city) {
    redirect(
      "/vendor/dashboard/profile?error=" +
        encodeURIComponent("Business name and city can't be empty.")
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const serviceAreas = serviceAreasRaw
    ? serviceAreasRaw.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  const { error } = await supabase
    .from("vendor_profiles")
    .update({
      business_name: businessName,
      city,
      service_areas: serviceAreas,
      bio: bio || null,
      equipment_details: equipmentDetails || null,
      team_size: Number(teamSizeRaw) || null,
      available_from: availableFrom || null,
    })
    .eq("id", user.id);

  if (error) {
    redirect("/vendor/dashboard/profile?error=" + encodeURIComponent(error.message));
  }

  revalidatePath("/vendor/dashboard/profile");
  revalidatePath("/vendor/dashboard");
}
