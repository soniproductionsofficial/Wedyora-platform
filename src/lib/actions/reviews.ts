"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

// RLS ("reviews: customer insert own completed booking") already refuses
// this write unless the caller is the booking's own customer and the
// booking's status is "completed" — the check here is just for a clean
// error message, not the actual security boundary.
export async function submitReviewAction(formData: FormData) {
  const bookingId = String(formData.get("booking_id") ?? "");
  const vendorId = String(formData.get("vendor_id") ?? "");
  const rating = Number(formData.get("rating") ?? 0);
  const comment = String(formData.get("comment") ?? "").trim();

  if (!bookingId || !vendorId || rating < 1 || rating > 5) {
    redirect("/account?error=" + encodeURIComponent("Please choose a rating from 1 to 5."));
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error } = await supabase.from("reviews").insert({
    booking_id: bookingId,
    customer_id: user.id,
    vendor_id: vendorId,
    rating,
    comment: comment || null,
  });

  if (error) {
    redirect("/account?error=" + encodeURIComponent(error.message));
  }

  revalidatePath("/account");
  redirect("/account?message=" + encodeURIComponent("Thanks for your review!"));
}
