"use server";

import { redirect } from "next/navigation";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { normalizePhone } from "@/lib/phone";
import { getVendorPlan } from "@/lib/vendor-plans";

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
  "agree_vendor_terms",
  "agree_cancellation_policy",
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

  if (
    !fields.full_name ||
    !fields.phone ||
    !fields.business_name ||
    !fields.category_id ||
    !fields.city
  ) {
    redirect(
      "/vendor/apply?error=" +
        encodeURIComponent("Please fill in all required fields.")
    );
  }

  if (fields.agree_vendor_terms !== "yes" || fields.agree_cancellation_policy !== "yes") {
    redirect(
      "/vendor/apply?error=" +
        encodeURIComponent(
          "Please tick both the Vendor Terms & Conditions and the Vendor Cancellation Policy to continue."
        )
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

  // Re-checked here, not just on the first form — these two hidden fields
  // round-trip through the URL like everything else in this flow (see the
  // comment on otpRedirectParams above), so a tampered request could
  // otherwise skip straight past the checkboxes to a verified OTP.
  if (fields.agree_vendor_terms !== "yes" || fields.agree_cancellation_policy !== "yes") {
    redirect(
      `/vendor/apply?${otpRedirectParams({
        ...fields,
        error: "Please tick both the Vendor Terms & Conditions and the Vendor Cancellation Policy to continue.",
      })}`
    );
  }

  const agreedAt = new Date().toISOString();

  // Use the admin (service-role) client for these writes rather than the
  // now-authenticated request-scoped client. This is the very first request
  // for a brand-new phone number, and Supabase's own trigger that creates
  // the `profiles` row runs asynchronously right around the same moment —
  // writing through the admin client avoids racing that trigger.
  const admin = createAdminClient();

  await admin
    .from("profiles")
    .update({
      full_name: fields.full_name,
      phone,
      city: fields.city,
      role: "vendor",
    })
    .eq("id", userId);

  const vendorPayload = {
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
    agreed_to_vendor_terms_at: agreedAt,
    agreed_to_cancellation_policy_at: agreedAt,
    // Plan + fee rows are created on the next step (phase=plan), right
    // after OTP sign-in, so the registration plan can "pop up" then.
    status: "pending_payment" as const,
  };

  const { data: existingVendor } = await admin
    .from("vendor_profiles")
    .select("id, plan")
    .eq("id", userId)
    .maybeSingle();

  if (existingVendor) {
    const { error: vendorError } = await admin
      .from("vendor_profiles")
      .update(vendorPayload)
      .eq("id", userId);
    if (vendorError) {
      redirect(
        `/vendor/apply?${otpRedirectParams({ ...fields, error: vendorError.message })}`
      );
    }
    if (existingVendor.plan) {
      redirect("/vendor/apply?phase=fees");
    }
  } else {
    const { error: vendorError } = await admin
      .from("vendor_profiles")
      .insert(vendorPayload);
    if (vendorError) {
      redirect(
        `/vendor/apply?${otpRedirectParams({ ...fields, error: vendorError.message })}`
      );
    }
  }

  // After OTP, show the registration plan picker before taking payment.
  redirect("/vendor/apply?phase=plan");
}

export async function selectVendorPlanAction(formData: FormData) {
  const planKey = String(formData.get("plan") ?? "").trim();
  const plan = getVendorPlan(planKey);

  if (!plan) {
    redirect(
      "/vendor/apply?phase=plan&error=" +
        encodeURIComponent("Please choose a registration plan.")
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/vendor/login");
  }

  const admin = createAdminClient();
  const { data: vendor } = await admin
    .from("vendor_profiles")
    .select("id, plan")
    .eq("id", user.id)
    .maybeSingle();

  if (!vendor) {
    redirect(
      "/vendor/apply?error=" +
        encodeURIComponent("Please complete your vendor application first.")
    );
  }

  const { error: updateError } = await admin
    .from("vendor_profiles")
    .update({
      plan: plan.key,
      security_deposit_amount: plan.securityDeposit,
      status: "pending_payment",
    })
    .eq("id", user.id);

  if (updateError) {
    redirect(
      "/vendor/apply?phase=plan&error=" + encodeURIComponent(updateError.message)
    );
  }

  // Replace any unfinished fee rows so switching plans doesn't leave
  // stale amounts pending from a previous choice.
  await admin
    .from("vendor_payments")
    .delete()
    .eq("vendor_id", user.id)
    .eq("status", "pending")
    .in("type", ["registration_fee", "security_deposit"]);

  await admin.from("vendor_payments").insert([
    {
      vendor_id: user.id,
      type: "registration_fee",
      direction: "debit",
      amount: plan.registrationFee,
      status: "pending",
      reason: `${plan.label} plan registration fee`,
    },
    {
      vendor_id: user.id,
      type: "security_deposit",
      direction: "debit",
      amount: plan.securityDeposit,
      status: "pending",
      reason: `${plan.label} plan security deposit (refundable)`,
    },
  ]);

  redirect("/vendor/apply?phase=fees");
}

// --- Portfolio upload (Chapter 5, step 8) — optional, skippable ---

export async function uploadPortfolioAction(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/vendor/login");
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

// --- Vendor phone login (existing partners) ---
//
// Separate from /login so we never auto-create a customer account for a
// vendor number, and so non-vendors get a clear "apply first" message
// instead of landing on the customer account page.

export async function requestVendorLoginOtpAction(formData: FormData) {
  const phoneRaw = String(formData.get("phone") ?? "").trim();

  if (!phoneRaw) {
    redirect(
      "/vendor/login?error=" + encodeURIComponent("Please enter your phone number.")
    );
  }

  const phone = normalizePhone(phoneRaw);
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    phone,
    options: {
      // Existing vendor accounts only — new partners go through /vendor/apply.
      shouldCreateUser: false,
    },
  });

  if (error) {
    const message =
      error.message.toLowerCase().includes("signups not allowed") ||
      error.message.toLowerCase().includes("user not found")
        ? "No vendor account found for this number. Apply as a partner first."
        : error.message;
    redirect("/vendor/login?error=" + encodeURIComponent(message));
  }

  const params = new URLSearchParams({ phase: "otp", phone });
  redirect(`/vendor/login?${params.toString()}`);
}

export async function verifyVendorLoginOtpAction(formData: FormData) {
  const phone = String(formData.get("phone") ?? "").trim();
  const token = String(formData.get("token") ?? "").trim();

  const supabase = await createClient();
  const { error, data } = await supabase.auth.verifyOtp({
    phone,
    token,
    type: "sms",
  });

  if (error || !data.user) {
    const params = new URLSearchParams({
      phase: "otp",
      phone,
      error: error?.message ?? "Could not verify that code.",
    });
    redirect(`/vendor/login?${params.toString()}`);
  }

  const userId = data.user.id;
  const [{ data: profile }, { data: vendor }] = await Promise.all([
    supabase.from("profiles").select("role, phone").eq("id", userId).single(),
    supabase
      .from("vendor_profiles")
      .select("id, plan, status")
      .eq("id", userId)
      .maybeSingle(),
  ]);

  const isVendor = profile?.role === "vendor" || !!vendor;

  if (!isVendor) {
    await supabase.auth.signOut();
    redirect(
      "/vendor/login?error=" +
        encodeURIComponent(
          "This number is not registered as a vendor. Apply as a partner to continue."
        )
    );
  }

  // Keep role + phone in sync for older accounts created before role metadata
  // was set consistently on every path.
  const admin = createAdminClient();
  await admin
    .from("profiles")
    .update({
      role: "vendor",
      phone: phone || profile?.phone || null,
    })
    .eq("id", userId);

  // Returning vendors who never picked a plan (or still owe fees) continue
  // the apply flow instead of landing on an empty dashboard.
  if (!vendor?.plan) {
    redirect("/vendor/apply?phase=plan");
  }
  if (vendor.status === "pending_payment") {
    redirect("/vendor/apply?phase=fees");
  }

  redirect("/vendor/dashboard");
}
