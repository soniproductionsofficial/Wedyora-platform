"use server";

import { redirect } from "next/navigation";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { normalizePhone } from "@/lib/phone";

// The vendor application form is longer than the customer one (business
// details, category, experience, bio) and none of it should be re-typed
// after the phone is verified. Since these two actions are plain
// server-action + redirect (no client-side state), the only way to carry
// that data across the "enter details" -> "enter the texted code" step is
// to round-trip it through the URL as hidden form fields on the OTP page.
// None of it is a secret (no password exists anymore), so that's fine.
function otpRedirectParams(fields: Record<string, string>) {
  return new URLSearchParams({ phase: "otp", ...fields }).toString();
}

export async function requestVendorOtpAction(formData: FormData) {
  const fullName = String(formData.get("full_name") ?? "").trim();
  const phoneRaw = String(formData.get("phone") ?? "").trim();
  const businessName = String(formData.get("business_name") ?? "").trim();
  const categoryId = String(formData.get("category_id") ?? "");
  const city = String(formData.get("city") ?? "").trim();
  const bio = String(formData.get("bio") ?? "").trim();
  const experienceYears = String(formData.get("experience_years") ?? "");

  if (!fullName || !phoneRaw || !businessName || !categoryId || !city) {
    redirect(
      "/vendor/apply?error=" +
        encodeURIComponent("Please fill in all required fields.")
    );
  }

  const phone = normalizePhone(phoneRaw);
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    phone,
    options: {
      shouldCreateUser: true,
      data: { full_name: fullName, role: "vendor" },
    },
  });

  if (error) {
    redirect("/vendor/apply?error=" + encodeURIComponent(error.message));
  }

  redirect(
    `/vendor/apply?${otpRedirectParams({
      phone,
      full_name: fullName,
      business_name: businessName,
      category_id: categoryId,
      city,
      bio,
      experience_years: experienceYears,
    })}`
  );
}

export async function verifyVendorOtpAction(formData: FormData) {
  const phone = String(formData.get("phone") ?? "").trim();
  const token = String(formData.get("token") ?? "").trim();
  const fullName = String(formData.get("full_name") ?? "").trim();
  const businessName = String(formData.get("business_name") ?? "").trim();
  const categoryId = String(formData.get("category_id") ?? "");
  const city = String(formData.get("city") ?? "").trim();
  const bio = String(formData.get("bio") ?? "").trim();
  const experienceYearsRaw = String(formData.get("experience_years") ?? "");
  const experienceYears = Number(experienceYearsRaw) || null;

  const carriedFields = {
    phone,
    full_name: fullName,
    business_name: businessName,
    category_id: categoryId,
    city,
    bio,
    experience_years: experienceYearsRaw,
  };

  const supabase = await createClient();
  const { error: verifyError, data: verifyData } = await supabase.auth.verifyOtp({
    phone,
    token,
    type: "sms",
  });

  if (verifyError || !verifyData.user) {
    redirect(
      `/vendor/apply?${otpRedirectParams({
        ...carriedFields,
        error: verifyError?.message ?? "Could not verify that code.",
      })}`
    );
  }

  const userId = verifyData.user.id;

  // Use the admin (service-role) client for these two writes rather than
  // the now-authenticated request-scoped client. This is the very first
  // request for a brand-new phone number, and Supabase's own trigger that
  // creates the `profiles` row runs asynchronously right around the same
  // moment — writing through the admin client avoids racing that trigger,
  // the same reason the original email-based flow used it too.
  const admin = createAdminClient();

  await admin.from("profiles").update({ full_name: fullName, phone, city }).eq("id", userId);

  const { error: vendorError } = await admin.from("vendor_profiles").insert({
    id: userId,
    business_name: businessName,
    category_id: categoryId,
    city,
    bio,
    experience_years: experienceYears,
    status: "pending",
  });

  if (vendorError) {
    redirect(
      `/vendor/apply?${otpRedirectParams({ ...carriedFields, error: vendorError.message })}`
    );
  }

  redirect(
    "/login?message=" +
      encodeURIComponent(
        "Application submitted! Our team will review it and you'll be notified once approved."
      )
  );
}
