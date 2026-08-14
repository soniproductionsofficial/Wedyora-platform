"use server";

import { redirect } from "next/navigation";
import { createClient, createAdminClient } from "@/lib/supabase/server";

const MIN_PASSWORD_LENGTH = 12;

export async function adminLoginAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    redirect(
      "/admin/login?error=" +
        encodeURIComponent("Enter your admin email and password.")
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(
      "/admin/login?error=" +
        encodeURIComponent("Invalid admin email or password.")
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(
      "/admin/login?error=" + encodeURIComponent("Could not start admin session.")
    );
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    await supabase.auth.signOut();
    redirect(
      "/admin/login?error=" +
        encodeURIComponent("This account is not authorized for admin access.")
    );
  }

  redirect("/admin");
}

export async function adminSignOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

/**
 * One-time bootstrap: create the first admin email/password account.
 * Requires ADMIN_SETUP_SECRET in env. Disabled once any admin already exists
 * (unless you pass force=yes with the secret for adding another teammate).
 */
export async function bootstrapAdminAccountAction(formData: FormData) {
  const setupSecret = String(formData.get("setup_secret") ?? "");
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const fullName = String(formData.get("full_name") ?? "").trim() || "Wedyora Admin";
  const force = String(formData.get("force") ?? "") === "yes";

  const expected = process.env.ADMIN_SETUP_SECRET;
  if (!expected || setupSecret !== expected) {
    redirect(
      "/admin/login?error=" +
        encodeURIComponent("Invalid setup secret.") +
        "&setup=1"
    );
  }

  if (!email || password.length < MIN_PASSWORD_LENGTH) {
    redirect(
      "/admin/login?error=" +
        encodeURIComponent(
          `Use a valid email and a password of at least ${MIN_PASSWORD_LENGTH} characters.`
        ) +
        "&setup=1"
    );
  }

  const admin = createAdminClient();
  const { data: existingAdmins } = await admin
    .from("profiles")
    .select("id")
    .eq("role", "admin")
    .limit(5);

  const existingCount = existingAdmins?.length ?? 0;

  // If an admin already exists (e.g. phone-OTP account), attach email+password
  // to that user instead of creating a second admin — unless force=yes.
  if (existingCount > 0 && !force) {
    const adminId = existingAdmins![0].id;
    const { error: updateError } = await admin.auth.admin.updateUserById(
      adminId,
      {
        email,
        password,
        email_confirm: true,
        user_metadata: { role: "admin", full_name: fullName },
        app_metadata: { role: "admin" },
      }
    );

    if (updateError) {
      redirect(
        "/admin/login?error=" +
          encodeURIComponent(updateError.message) +
          "&setup=1"
      );
    }

    await admin
      .from("profiles")
      .update({ full_name: fullName, role: "admin" })
      .eq("id", adminId);

    redirect(
      "/admin/login?message=" +
        encodeURIComponent(
          "Admin email and password set. Sign in with those credentials (phone OTP is no longer required for admin)."
        )
    );
  }

  const { data: created, error: createError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { role: "admin", full_name: fullName },
    app_metadata: { role: "admin" },
  });

  if (createError || !created.user) {
    redirect(
      "/admin/login?error=" +
        encodeURIComponent(createError?.message ?? "Could not create admin.") +
        "&setup=1"
    );
  }

  // Ensure profile role is admin (trigger may default to customer).
  await admin.from("profiles").upsert({
    id: created.user.id,
    full_name: fullName,
    role: "admin",
  });

  redirect(
    "/admin/login?message=" +
      encodeURIComponent("Admin account created. Sign in with your email and password.")
  );
}
