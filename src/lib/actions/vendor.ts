"use server";

import { redirect } from "next/navigation";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { normalizePhone } from "@/lib/phone";

// The vendor application form is longer than the customer one (business
// details, KYC, bank details, category, experience, bio) and none of it
// should be re-typed after the phone is verified. Since these two actions
// are plain server-action + redirect (no client-side state), the only way
// to carry that data across the "enter details" -> "enter the texted code"
// step is to round-trip it through the URL as hidden form fields on the
// OTP page. None of it is a secret in the password sense (no password
// exists anymore), so that's fine — though see the migration file for a
// note on why PAN/Aadhaar are still protected at the database level.
function otpRedirectParams(fields: Record<string, string>) {
  return new URLSearchParams({ phase: "otp", ...fields }).toString();
}

const APPLICATION_FIELDS = [
  "full_name",
  "phone",
  "business_name",
  "category_id",
  "city",
  "bio",
  "experience_years",
  "equipment_details",
  "team_size",
  "service_areas",
  "available_from",
  "pan_number",
  "aadhaar_number",
  "gst_number",
  "bank_account_holder_name",
  "bank_account_number",
  "bank_ifsc",
] as const;

function collectFields(formData: FormData): Record<string, string> {
  const out: Record<string, string> = {};
  for (const key of APPLICATION_FIELDS) {
    out[key] = String(formData.get(key) ?? "").trim();
  }
  return out;
}

export async function requestVendorOtpAction(formData: FormData) {
  const fields = collectFields(formData);

  if (!fields.full_name || !fields.phone || !fields.business_name || !fields.category_id || !fields.city) {
    redirect(
      "/vendor/apply?error=" +
        encodeURIComponent("Please fill in all required fields.")
    );
  }

  const phone = normalizePhone(fields.phone);
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    phone,
    options: {
      shouldCreateUser: true,
      data: { full_name: fields.full_name, role: "vendor" },
    },
  });

  if (error) {
    redirect("/vendor/apply?error=" + encodeURIComponent(error.message));
  }

  redirect(`/vendor/apply?${otpRedirectParams({ ...fields, phone })}`);
}

export async function verifyVendorOtpAction(formData: FormData) {
  const token = String(formData.get("token") ?? "").trim();
  const fields = collectFields(formData);
  const phone = fields.phone;

  const supabase = await createClient();
  const { error: verifyError, data: verifyData } = await supabase.auth.verifyOtp({
    phone,
    token,
    type: "sms",
  });

  if (verifyError || !verifyData.user) {
    redirect(
      `/vendor/apply?${otpRedirectParams({
        ...fields,
        error: verifyError?.message ?? "Could not verify that code.",
      })}`
    );
  }

  const userId = verifyData.user.id;
  const experienceYears = Number(fields.experience_years) || null;
  const teamSize = Number(fields.team_size) || null;
  const serviceAreas = fields.service_areas
    ? fields.service_areas.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  // Use the admin (service-role) client for these two writes rather than
  // the now-authenticated request-scoped client. This is the very first
  // request for a brand-new phone number, and Supabase's own trigger that
  // creates the `profiles` row runs asynchronously right around the same
  // moment — writing through the admin client avoids racing that trigger,
  // the same reason the original email-based flow used it too.
  const admin = createAdminClient();

  await admin
    .from("profiles")
    .update({ full_name: fields.full_name, phone, city: fields.city })
    .eq("id", userId);

  const { error: vendorError } = await admin.from("vendor_profiles").insert({
    id: userId,
    business_name: fields.business_name,
    category_id: fields.category_id,
    city: fields.city,
    bio: fields.bio || null,
    experience_years: experienceYears,
    equipment_details: fields.equipment_details || null,
    team_size: teamSize,
    service_areas: serviceAreas,
    available_from: fields.available_from || null,
    pan_number: fields.pan_number || null,
    aadhaar_number: fields.aadhaar_number || null,
    gst_number: fields.gst_number || null,
    bank_account_holder_name: fields.bank_account_holder_name || null,
    bank_account_number: fields.bank_account_number || null,
    bank_ifsc: fields.bank_ifsc || null,
    status: "pending",
  });

  if (vendorError) {
    redirect(
      `/vendor/apply?${otpRedirectParams({ ...fields, error: vendorError.message })}`
    );
  }

  // Portfolio upload needs an actual file, which can't survive the
  // hidden-input/URL round trip the rest of this form uses — it happens
  // here instead, now that verifyOtp() has activated a real session tied
  // to this exact new vendor.
  redirect("/vendor/apply?phase=portfolio");
}

// --- Portfolio upload (Chapter 5, step 8) — optional, skippable ---

export async function uploadPortfolioAction(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const files = formData
    .getAll("portfolio_files")
    .filter((f): f is File => f instanceof File && f.size > 0);

  if (files.length === 0) {
    redirect("/vendor/apply?phase=done");
  }

  const { data: existing } = await supabase
    .from("vendor_profiles")
    .select("portfolio_urls")
    .eq("id", user.id)
    .single();

  const uploadedUrls: string[] = [];

  for (const file of files) {
    const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
    const path = `${user.id}/${Date.now()}-${safeName}`;
    const { error: uploadError } = await supabase.storage
      .from("vendor-portfolios")
      .upload(path, file, { contentType: file.type || undefined });

    if (!uploadError) {
      const {
        data: { publicUrl },
      } = supabase.storage.from("vendor-portfolios").getPublicUrl(path);
      uploadedUrls.push(publicUrl);
    }
  }

  if (uploadedUrls.length > 0) {
    await supabase
      .from("vendor_profiles")
      .update({ portfolio_urls: [...(existing?.portfolio_urls ?? []), ...uploadedUrls] })
      .eq("id", user.id);
  }

  redirect("/vendor/apply?phase=done");
}
