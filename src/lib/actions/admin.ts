"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

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

export async function assignVendorToBookingAction(formData: FormData) {
  const bookingId = String(formData.get("booking_id") ?? "");
  const vendorId = String(formData.get("vendor_id") ?? "");
  const agreedPrice = Number(formData.get("agreed_price") ?? 0);
  const advanceAmount = Number(formData.get("advance_amount") ?? 0);

  if (!bookingId || !vendorId || !agreedPrice || !advanceAmount) {
    // Missing/invalid input from the assignment form — nothing to do.
    // (Booking stays visibly "pending_assignment" in the admin list.)
    return;
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase
    .from("bookings")
    .update({
      vendor_id: vendorId,
      agreed_price: agreedPrice,
      advance_amount: advanceAmount,
      status: "awaiting_payment",
      assigned_by: user?.id,
      assigned_at: new Date().toISOString(),
    })
    .eq("id", bookingId);

  if (error) {
    console.error("assignVendorToBookingAction failed:", error.message);
  }

  revalidatePath("/admin/bookings");
}
