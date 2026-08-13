"use server";

import { redirect } from "next/navigation";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { normalizePhone } from "@/lib/phone";
import { getVendorPlan } from "@/lib/vendor-plans";

const DETAIL_FIELDS = [
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

function collectDetailFields(formData: FormData): Record<string, string> {
  const out: Record<string, string> = {};
  for (const key of DETAIL_FIELDS) {
    out[key] = String(formData.get(key) ?? "").trim();
  }
  return out;
}

/** Resume incomplete vendors at the correct onboarding step. */
export async function resolveVendorOnboardingPhase(userId: string): Promise<string> {
  const admin = createAdminClient();
  const { data: vendor } = await admin
    .from("vendor_profiles")
    .select("id, plan, status, category_id, city, agreed_to_vendor_terms_at")
    .eq("id", userId)
    .maybeSingle();

  if (!vendor || !vendor.agreed_to_vendor_terms_at || !vendor.category_id || !vendor.city) {
    return "details";
  }
  // Location is shown once immediately after details submit; on resume skip
  // straight to plan selection if they haven't chosen one yet.
  if (!vendor.plan) {
    return "plan";
  }
  if (vendor.status === "pending_payment") {
    return "fees";
  }
  return "done";
}

// --- Step 1: business name + phone → OTP ---

export async function requestVendorOtpAction(formData: FormData) {
  const businessName = String(formData.get("business_name") ?? "").trim();
  const phoneRaw = String(formData.get("phone") ?? "").trim();

  if (!businessName || !phoneRaw) {
    redirect(
      "/vendor/apply?error=" +
        encodeURIComponent("Please enter your business name and phone number.")
    );
  }

  const phone = normalizePhone(phoneRaw);
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    phone,
    options: {
      shouldCreateUser: true,
      data: { role: "vendor", business_name: businessName },
    },
  });

  if (error) {
    redirect("/vendor/apply?error=" + encodeURIComponent(error.message));
  }

  const params = new URLSearchParams({
    phase: "otp",
    phone,
    business_name: businessName,
  });
  redirect(`/vendor/apply?${params.toString()}`);
}

export async function verifyVendorOtpAction(formData: FormData) {
  const token = String(formData.get("token") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const businessName = String(formData.get("business_name") ?? "").trim();

  const supabase = await createClient();
  const { error: verifyError, data: verifyData } = await supabase.auth.verifyOtp({
    phone,
    token,
    type: "sms",
  });

  if (verifyError || !verifyData.user) {
    const params = new URLSearchParams({
      phase: "otp",
      phone,
      business_name: businessName,
      error: verifyError?.message ?? "Could not verify that code.",
    });
    redirect(`/vendor/apply?${params.toString()}`);
  }

  const userId = verifyData.user.id;
  const admin = createAdminClient();

  await admin
    .from("profiles")
    .update({
      phone,
      role: "vendor",
      // Prefer a real person name later; keep business name as a temporary label.
      full_name: businessName || null,
    })
    .eq("id", userId);

  const { data: existingVendor } = await admin
    .from("vendor_profiles")
    .select("id, plan, agreed_to_vendor_terms_at, category_id, city, status")
    .eq("id", userId)
    .maybeSingle();

  if (!existingVendor) {
    const { error: vendorError } = await admin.from("vendor_profiles").insert({
      id: userId,
      business_name: businessName || "My Business",
      status: "pending_payment",
    });
    if (vendorError) {
      const params = new URLSearchParams({
        phase: "otp",
        phone,
        business_name: businessName,
        error: vendorError.message,
      });
      redirect(`/vendor/apply?${params.toString()}`);
    }
  } else if (businessName) {
    await admin
      .from("vendor_profiles")
      .update({ business_name: businessName })
      .eq("id", userId);
  }

  const phase = await resolveVendorOnboardingPhase(userId);
  redirect(`/vendor/apply?phase=${phase}`);
}

// --- Step 2: full application details (after OTP login) ---

export async function submitVendorDetailsAction(formData: FormData) {
  const fields = collectDetailFields(formData);

  if (
    !fields.full_name ||
    !fields.phone ||
    !fields.business_name ||
    !fields.category_id ||
    !fields.city
  ) {
    redirect(
      "/vendor/apply?phase=details&error=" +
        encodeURIComponent("Please fill in all required fields.")
    );
  }

  if (fields.agree_vendor_terms !== "yes" || fields.agree_cancellation_policy !== "yes") {
    redirect(
      "/vendor/apply?phase=details&error=" +
        encodeURIComponent(
          "Please tick both the Vendor Terms & Conditions and the Vendor Cancellation Policy to continue."
        )
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/vendor/login");

  const phone = normalizePhone(fields.phone);
  const experienceYears = Number(fields.experience_years) || null;
  const teamSize = Number(fields.team_size) || null;
  const serviceAreas = fields.service_areas
    ? fields.service_areas.split(",").map((s) => s.trim()).filter(Boolean)
    : [];
  const agreedAt = new Date().toISOString();
  const admin = createAdminClient();

  await admin
    .from("profiles")
    .update({
      full_name: fields.full_name,
      phone,
      city: fields.city,
      role: "vendor",
    })
    .eq("id", user.id);

  const vendorPayload = {
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
    status: "pending_payment" as const,
  };

  const { data: existing } = await admin
    .from("vendor_profiles")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  const { error: vendorError } = existing
    ? await admin.from("vendor_profiles").update(vendorPayload).eq("id", user.id)
    : await admin.from("vendor_profiles").insert({ id: user.id, ...vendorPayload });

  if (vendorError) {
    redirect(
      "/vendor/apply?phase=details&error=" + encodeURIComponent(vendorError.message)
    );
  }

  redirect("/vendor/apply?phase=location");
}

// --- Step 3: location permission ---

export async function submitVendorLocationAction(
  lat: number | null,
  lng: number | null,
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/vendor/login");

  if (lat != null && lng != null) {
    await supabase
      .from("profiles")
      .update({ location_lat: lat, location_lng: lng })
      .eq("id", user.id);
  }

  redirect("/vendor/apply?phase=plan");
}

// --- Step 4: registration plan ---

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
  if (!user) redirect("/vendor/login");

  const admin = createAdminClient();
  const { data: vendor } = await admin
    .from("vendor_profiles")
    .select("id, plan")
    .eq("id", user.id)
    .maybeSingle();

  if (!vendor) {
    redirect(
      "/vendor/apply?phase=details&error=" +
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

// --- Portfolio (optional, kept for later dashboard use) ---

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

// --- Vendor phone login (existing / in-progress partners) ---

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

  const admin = createAdminClient();
  await admin
    .from("profiles")
    .update({
      role: "vendor",
      phone: phone || profile?.phone || null,
    })
    .eq("id", userId);

  const phase = await resolveVendorOnboardingPhase(userId);
  if (phase === "done") {
    redirect("/vendor/dashboard");
  }
  redirect(`/vendor/apply?phase=${phase}`);
}
