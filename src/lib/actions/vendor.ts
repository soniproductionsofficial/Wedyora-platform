"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function vendorApplyAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const fullName = String(formData.get("full_name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const businessName = String(formData.get("business_name") ?? "").trim();
  const categoryId = String(formData.get("category_id") ?? "");
  const city = String(formData.get("city") ?? "").trim();
  const bio = String(formData.get("bio") ?? "").trim();
  const experienceYears = Number(formData.get("experience_years") ?? 0) || null;

  if (!email || !password || !fullName || !businessName || !categoryId || !city) {
    redirect(
      "/vendor/apply?error=" +
        encodeURIComponent("Please fill in all required fields.")
    );
  }

  const supabase = await createClient();

  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName, role: "vendor" },
    },
  });

  if (signUpError || !signUpData.user) {
    redirect(
      "/vendor/apply?error=" +
        encodeURIComponent(signUpError?.message ?? "Could not create account.")
    );
  }

  const userId = signUpData.user.id;

  await supabase.from("profiles").update({ phone, city }).eq("id", userId);

  const { error: vendorError } = await supabase.from("vendor_profiles").insert({
    id: userId,
    business_name: businessName,
    category_id: categoryId,
    city,
    bio,
    experience_years: experienceYears,
    status: "pending",
  });

  if (vendorError) {
    redirect("/vendor/apply?error=" + encodeURIComponent(vendorError.message));
  }

  redirect(
    "/login?message=" +
      encodeURIComponent(
        "Application submitted! Check your email to confirm your account. Our team will review your application — you'll be notified once approved."
      )
  );
}
