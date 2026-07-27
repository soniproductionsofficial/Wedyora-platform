"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function signUpAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const fullName = String(formData.get("full_name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const city = String(formData.get("city") ?? "").trim();

  if (!email || !password || !fullName) {
    redirect("/signup?error=" + encodeURIComponent("Please fill in all required fields."));
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName, role: "customer" },
    },
  });

  if (error) {
    redirect("/signup?error=" + encodeURIComponent(error.message));
  }

  // Store phone/city on the profile row created by the DB trigger.
  const { data: userRes } = await supabase.auth.getUser();
  if (userRes.user) {
    await supabase
      .from("profiles")
      .update({ phone, city })
      .eq("id", userRes.user.id);
  }

  redirect("/login?message=" + encodeURIComponent(
    "Account created. Check your email to confirm, then log in."
  ));
}

export async function signInAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const redirectTo = String(formData.get("redirectTo") ?? "/account");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect("/login?error=" + encodeURIComponent(error.message));
  }

  redirect(redirectTo);
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
