"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { normalizePhone } from "@/lib/phone";

// --- Customer sign-up: collect name + phone, then verify via a texted code ---

export async function requestSignupOtpAction(formData: FormData) {
  const fullName = String(formData.get("full_name") ?? "").trim();
  const phoneRaw = String(formData.get("phone") ?? "").trim();
  const city = String(formData.get("city") ?? "").trim();

  if (!fullName || !phoneRaw) {
    redirect(
      "/signup?error=" +
        encodeURIComponent("Please enter your name and phone number.")
    );
  }

  const phone = normalizePhone(phoneRaw);
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    phone,
    options: {
      shouldCreateUser: true,
      data: { full_name: fullName, role: "customer" },
    },
  });

  if (error) {
    redirect("/signup?error=" + encodeURIComponent(error.message));
  }

  const params = new URLSearchParams({
    phase: "otp",
    phone,
    full_name: fullName,
    city,
  });
  redirect(`/signup?${params.toString()}`);
}

export async function verifySignupOtpAction(formData: FormData) {
  const phone = String(formData.get("phone") ?? "").trim();
  const token = String(formData.get("token") ?? "").trim();
  const fullName = String(formData.get("full_name") ?? "").trim();
  const city = String(formData.get("city") ?? "").trim();

  const supabase = await createClient();
  const { error } = await supabase.auth.verifyOtp({ phone, token, type: "sms" });

  if (error) {
    const params = new URLSearchParams({
      phase: "otp",
      phone,
      full_name: fullName,
      city,
      error: error.message,
    });
    redirect(`/signup?${params.toString()}`);
  }

  // Unlike email signUp() (which needs a separate "click the link in your
  // inbox" step before a session exists), verifyOtp() for phone activates
  // the session immediately — so this write goes through the normal,
  // RLS-checked client, not the admin client. auth.uid() is already this
  // exact user.
  const { data: userRes } = await supabase.auth.getUser();
  if (userRes.user) {
    await supabase
      .from("profiles")
      .update({ full_name: fullName, city })
      .eq("id", userRes.user.id);
  }

  redirect("/account");
}

// --- Login: same texted-code flow, works for existing or brand-new numbers ---

export async function requestLoginOtpAction(formData: FormData) {
  const phoneRaw = String(formData.get("phone") ?? "").trim();
  const redirectTo = String(formData.get("redirectTo") ?? "/account");

  if (!phoneRaw) {
    redirect("/login?error=" + encodeURIComponent("Please enter your phone number."));
  }

  const phone = normalizePhone(phoneRaw);
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    phone,
    // shouldCreateUser: true means someone can land on /login with a phone
    // number that's never been seen before and it just works (an account
    // gets created for them) rather than making them go find /signup first
    // — the same "just enter your number" pattern most Indian consumer
    // apps use. verifyLoginOtpAction below sends brand-new accounts to
    // /complete-profile to collect a name, since this path never asks.
    options: { shouldCreateUser: true, data: { role: "customer" } },
  });

  if (error) {
    redirect("/login?error=" + encodeURIComponent(error.message));
  }

  const params = new URLSearchParams({ phase: "otp", phone, redirectTo });
  redirect(`/login?${params.toString()}`);
}

export async function verifyLoginOtpAction(formData: FormData) {
  const phone = String(formData.get("phone") ?? "").trim();
  const token = String(formData.get("token") ?? "").trim();
  const redirectTo = String(formData.get("redirectTo") ?? "/account");

  const supabase = await createClient();
  const { error } = await supabase.auth.verifyOtp({ phone, token, type: "sms" });

  if (error) {
    const params = new URLSearchParams({
      phase: "otp",
      phone,
      redirectTo,
      error: error.message,
    });
    redirect(`/login?${params.toString()}`);
  }

  const { data: userRes } = await supabase.auth.getUser();
  if (userRes.user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", userRes.user.id)
      .single();

    if (!profile?.full_name) {
      redirect(`/complete-profile?redirectTo=${encodeURIComponent(redirectTo)}`);
    }
  }

  redirect(redirectTo);
}

// --- Safety net for accounts created via the login form (no name captured yet) ---

export async function completeProfileAction(formData: FormData) {
  const fullName = String(formData.get("full_name") ?? "").trim();
  const city = String(formData.get("city") ?? "").trim();
  const redirectTo = String(formData.get("redirectTo") ?? "/account");

  if (!fullName) {
    redirect(
      `/complete-profile?redirectTo=${encodeURIComponent(redirectTo)}&error=` +
        encodeURIComponent("Please enter your name.")
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  await supabase.from("profiles").update({ full_name: fullName, city }).eq("id", user.id);
  redirect(redirectTo);
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
