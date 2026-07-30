"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

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

  const { error } = await supabase
    .from("bookings")
    .update({ status: "awaiting_payment" })
    .eq("id", bookingId)
    .eq("vendor_id", user.id)
    .eq("status", "pending_vendor_acceptance");

  if (error) {
    redirect("/vendor/dashboard/leads?error=" + encodeURIComponent(error.message));
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
  const price = Number(formData.get("price") ?? 0);

  if (!title || !price || price <= 0) {
    redirect(
      "/vendor/dashboard/profile?error=" +
        encodeURIComponent("Please enter a title and a price greater than zero.")
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
    price,
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
