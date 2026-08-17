"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function createBookingAction(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirectTo=/book");
  }

  const categoryId = String(formData.get("category_id") ?? "");
  const eventDate = String(formData.get("event_date") ?? "");
  const city = String(formData.get("city") ?? "");
  const guestCount = Number(formData.get("guest_count") ?? 0) || null;
  const budgetMin = Number(formData.get("budget_min") ?? 0) || null;
  const budgetMax = Number(formData.get("budget_max") ?? 0) || null;
  const specialRequirementsRaw = String(formData.get("special_requirements") ?? "");
  const cartSummary = String(formData.get("cart_summary") ?? "").trim();
  const cartTotal = String(formData.get("cart_total") ?? "").trim();
  const bookingSource = String(formData.get("booking_source") ?? "").trim();
  const isMinutes = bookingSource === "minutes";

  const specialRequirements = [
    cartSummary
      ? isMinutes
        ? `Minutes package (indicative):\n${cartSummary}${
            cartTotal
              ? `\nEstimated Minutes total: ₹${Number(cartTotal).toLocaleString("en-IN")}`
              : ""
          }`
        : `Selected packages (indicative):\n${cartSummary}${
            cartTotal
              ? `\nEstimated cart total: ₹${Number(cartTotal).toLocaleString("en-IN")}`
              : ""
          }`
      : "",
    specialRequirementsRaw,
  ]
    .filter(Boolean)
    .join("\n\n");

  if (!categoryId || !eventDate || !city) {
    const errQs = isMinutes
      ? "/book?source=minutes&error="
      : "/book?error=";
    redirect(errQs + encodeURIComponent("Please fill in all required fields."));
  }

  const { error } = await supabase.from("bookings").insert({
    customer_id: user.id,
    category_id: categoryId,
    event_date: eventDate,
    city,
    guest_count: guestCount,
    budget_min: budgetMin,
    budget_max: budgetMax,
    special_requirements: specialRequirements || null,
  });

  if (error) {
    const errQs = isMinutes
      ? "/book?source=minutes&error="
      : "/book?error=";
    redirect(errQs + encodeURIComponent(error.message));
  }

  redirect(
    "/account?message=" +
      encodeURIComponent(
        isMinutes
          ? "Minutes booking request submitted! We'll assign a Wedyora Minutes photographer shortly."
          : "Booking request submitted! We'll match you with a verified vendor shortly."
      )
  );
}
