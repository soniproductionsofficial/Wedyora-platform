"use server";

import { redirect } from "next/navigation";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { normalizePhone } from "@/lib/phone";
import { getVendorPlan, planTotalPayable } from "@/lib/vendor-plans";

const DETAIL_FIELDS = [
  "full_name",
  "phone",
  "email",
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
  "bank_name",
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

/** Resume incomplete vendors at the correct onboarding step.
 *  Order: plan (tier) → details (application) → fees (Razorpay) → done.
 */
export async function resolveVendorOnboardingPhase(userId: string): Promise<string> {
  const admin = createAdminClient();
  const { data: vendor } = await admin
    .from("vendor_profiles")
    .select(
      "id, plan, status, category_id, city, agreed_to_vendor_terms_at, pan_document_path, aadhaar_document_path, bank_account_number, bio, equipment_details"
    )
    .eq("id", userId)
    .maybeSingle();

  if (!vendor) {
    return "plan";
  }
  if (!vendor.plan) {
    return "plan";
  }

  const detailsComplete = Boolean(
    vendor.agreed_to_vendor_terms_at &&
      vendor.category_id &&
      vendor.city &&
      vendor.pan_document_path &&
      vendor.aadhaar_document_path &&
      vendor.bank_account_number &&
      vendor.bio &&
      vendor.equipment_details
  );

  if (!detailsComplete) {
    return "details";
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

  // Create a draft vendor row if missing. Use upsert + ignoreDuplicates so a
  // second OTP verify (or a race) never blows up on vendor_profiles_pkey.
  const { error: upsertError } = await admin.from("vendor_profiles").upsert(
    {
      id: userId,
      business_name: businessName || "My Business",
      status: "pending_payment",
    },
    { onConflict: "id", ignoreDuplicates: true },
  );

  if (
    upsertError &&
    upsertError.code !== "23505" &&
    !upsertError.message.toLowerCase().includes("duplicate key")
  ) {
    const params = new URLSearchParams({
      phase: "otp",
      phone,
      business_name: businessName,
      error: upsertError.message,
    });
    redirect(`/vendor/apply?${params.toString()}`);
  }

  // Refresh business name only while the application is still a draft.
  const { data: existingVendor } = await admin
    .from("vendor_profiles")
    .select("id, agreed_to_vendor_terms_at")
    .eq("id", userId)
    .maybeSingle();

  if (existingVendor && !existingVendor.agreed_to_vendor_terms_at && businessName) {
    await admin
      .from("vendor_profiles")
      .update({ business_name: businessName })
      .eq("id", userId);
  }

  const phase = await resolveVendorOnboardingPhase(userId);
  redirect(`/vendor/apply?phase=${phase}`);
}

// --- Step 2: full application details (after tier chosen) ---

export async function submitVendorDetailsAction(formData: FormData) {
  const fields = collectDetailFields(formData);

  const missingText = DETAIL_FIELDS.filter((key) => {
    if (key === "agree_vendor_terms" || key === "agree_cancellation_policy") {
      return false;
    }
    return !fields[key];
  });

  if (missingText.length > 0) {
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
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const agreedAt = new Date().toISOString();
  const admin = createAdminClient();

  const { data: existingVendor } = await admin
    .from("vendor_profiles")
    .select("id, plan, pan_document_path, aadhaar_document_path")
    .eq("id", user.id)
    .maybeSingle();

  if (!existingVendor?.plan) {
    redirect(
      "/vendor/apply?phase=plan&error=" +
        encodeURIComponent("Please choose your vendor tier before submitting details.")
    );
  }

  const plan = getVendorPlan(existingVendor.plan);
  if (!plan) {
    redirect(
      "/vendor/apply?phase=plan&error=" +
        encodeURIComponent("Please choose a valid vendor tier.")
    );
  }

  async function uploadKycDoc(
    file: FormDataEntryValue | null,
    kind: "pan" | "aadhaar",
    existingPath: string | null | undefined
  ): Promise<string> {
    if (!(file instanceof File) || file.size === 0) {
      if (existingPath) return existingPath;
      redirect(
        "/vendor/apply?phase=details&error=" +
          encodeURIComponent(`Please upload your ${kind.toUpperCase()} document.`)
      );
    }

    const allowed = new Set([
      "image/jpeg",
      "image/png",
      "image/webp",
      "application/pdf",
    ]);
    if (!allowed.has(file.type)) {
      redirect(
        "/vendor/apply?phase=details&error=" +
          encodeURIComponent(
            `${kind.toUpperCase()} document must be a JPG, PNG, WEBP, or PDF.`
          )
      );
    }
    if (file.size > 10 * 1024 * 1024) {
      redirect(
        "/vendor/apply?phase=details&error=" +
          encodeURIComponent(`${kind.toUpperCase()} document must be under 10 MB.`)
      );
    }

    const ext =
      file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") ||
      (file.type === "application/pdf" ? "pdf" : "jpg");
    const path = `${user!.id}/${kind}-${Date.now()}.${ext}`;

    const { error: uploadError } = await admin.storage
      .from("vendor-kyc")
      .upload(path, file, { contentType: file.type, upsert: false });

    if (uploadError) {
      redirect(
        "/vendor/apply?phase=details&error=" +
          encodeURIComponent(
            `Could not upload ${kind.toUpperCase()} document: ${uploadError.message}`
          )
      );
    }
    return path;
  }

  const panDocumentPath = await uploadKycDoc(
    formData.get("pan_document"),
    "pan",
    existingVendor.pan_document_path
  );
  const aadhaarDocumentPath = await uploadKycDoc(
    formData.get("aadhaar_document"),
    "aadhaar",
    existingVendor.aadhaar_document_path
  );

  await admin
    .from("profiles")
    .update({
      full_name: fields.full_name,
      phone,
      email: fields.email,
      city: fields.city,
      role: "vendor",
    })
    .eq("id", user.id);

  const vendorPayload = {
    business_name: fields.business_name,
    category_id: fields.category_id,
    city: fields.city,
    bio: fields.bio,
    experience_years: experienceYears,
    equipment_details: fields.equipment_details,
    team_size: teamSize,
    service_areas: serviceAreas,
    available_from: fields.available_from,
    pan_number: fields.pan_number,
    aadhaar_number: fields.aadhaar_number,
    gst_number: fields.gst_number,
    bank_name: fields.bank_name,
    bank_account_holder_name: fields.bank_account_holder_name,
    bank_account_number: fields.bank_account_number,
    bank_ifsc: fields.bank_ifsc,
    pan_document_path: panDocumentPath,
    aadhaar_document_path: aadhaarDocumentPath,
    agreed_to_vendor_terms_at: agreedAt,
    agreed_to_cancellation_policy_at: agreedAt,
    status: "pending_payment" as const,
    plan: plan.key,
    security_deposit_amount: plan.securityDeposit,
  };

  const { error: vendorError } = await admin.from("vendor_profiles").upsert(
    { id: user.id, ...vendorPayload },
    { onConflict: "id" }
  );

  if (vendorError) {
    redirect(
      "/vendor/apply?phase=details&error=" + encodeURIComponent(vendorError.message)
    );
  }

  await admin
    .from("vendor_payments")
    .delete()
    .eq("vendor_id", user.id)
    .eq("status", "pending")
    .in("type", ["registration_fee", "security_deposit"]);

  const totalPayable = planTotalPayable(plan.registrationFee);
  const paymentRows: {
    vendor_id: string;
    type: "registration_fee" | "security_deposit";
    direction: "debit";
    amount: number;
    status: "pending";
    reason: string;
  }[] = [
    {
      vendor_id: user.id,
      type: "registration_fee",
      direction: "debit",
      amount: totalPayable,
      status: "pending",
      reason: `${plan.label} registration fee (incl. 18% GST)`,
    },
  ];

  if (plan.securityDeposit > 0) {
    paymentRows.push({
      vendor_id: user.id,
      type: "security_deposit",
      direction: "debit",
      amount: plan.securityDeposit,
      status: "pending",
      reason: `${plan.label} plan security deposit (refundable)`,
    });
  }

  await admin.from("vendor_payments").insert(paymentRows);

  redirect("/vendor/apply?phase=fees");
}

// --- Location (optional helper; main signup skips this) ---

export async function submitVendorLocationAction(
  lat: number | null,
  lng: number | null
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

  redirect("/vendor/apply?phase=fees");
}

// --- Step: registration plan (after OTP, before details) ---

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
    await admin.from("vendor_profiles").upsert(
      {
        id: user.id,
        business_name: "My Business",
        status: "pending_payment",
        plan: plan.key,
        security_deposit_amount: plan.securityDeposit,
      },
      { onConflict: "id" }
    );
  } else {
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
  }

  redirect("/vendor/apply?phase=details");
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
