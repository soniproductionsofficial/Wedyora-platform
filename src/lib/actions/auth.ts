"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { normalizePhone } from "@/lib/phone";

// --- Customer sign-up ---
//
// Follows the business plan's "Chapter 3: Customer Registration Process"
// wizard: phone + OTP first (identity), then a chain of short one-question
// steps (name, location, language, wedding date, venue, budget) each
// writing straight to the now-authenticated user's own profile row and
// redirecting to the next phase — no form-to-form data needs to be
// threaded through hidden inputs the way the pre-verification steps do,
// since verifyOtp() already activated a real session by that point.
//
// Two deliberate departures from the plan's mockup, both to stay
// consistent with the phone-only auth system already built and tested:
//   - No password field in "Profile Creation" — this app has no passwords
//     anywhere, on purpose (that was an explicit earlier decision).
//   - No Google/Apple sign-up buttons yet — those need separate developer
//     accounts (Google Cloud Console, and a paid Apple Developer account)
//     set up on the business side first; phone is the only method for now.
//
// Every step after "name" is optional and skippable — a customer who
// doesn't know their wedding date yet, or declines location access, still
// ends up with a complete, usable account.

export async function requestSignupOtpAction(formData: FormData) {
  const phoneRaw = String(formData.get("phone") ?? "").trim();

  if (!phoneRaw) {
    redirect("/signup?error=" + encodeURIComponent("Please enter your phone number."));
  }

  const phone = normalizePhone(phoneRaw);
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    phone,
    options: { shouldCreateUser: true, data: { role: "customer" } },
  });

  if (error) {
    redirect("/signup?error=" + encodeURIComponent(error.message));
  }

  const params = new URLSearchParams({ phase: "otp", phone });
  redirect(`/signup?${params.toString()}`);
}

export async function verifySignupOtpAction(formData: FormData) {
  const phone = String(formData.get("phone") ?? "").trim();
  const token = String(formData.get("token") ?? "").trim();

  const supabase = await createClient();
  const { error } = await supabase.auth.verifyOtp({ phone, token, type: "sms" });

  if (error) {
    const params = new URLSearchParams({ phase: "otp", phone, error: error.message });
    redirect(`/signup?${params.toString()}`);
  }

  // From here on the wizard steps operate on the now-authenticated user's
  // own profile row, so no more data needs to travel via URL params.
  redirect("/signup?phase=profile");
}

// --- Step: Profile Creation (name + optional email — no password) ---

export async function submitProfileStepAction(formData: FormData) {
  const fullName = String(formData.get("full_name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();

  if (!fullName) {
    redirect("/signup?phase=profile&error=" + encodeURIComponent("Please enter your name."));
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await supabase
    .from("profiles")
    .update({ full_name: fullName, email: email || null })
    .eq("id", user.id);

  redirect("/signup?phase=location");
}

// --- Step: Location Permission (browser geolocation — skippable) ---
// Called directly from a client component (not a <form>), so it takes
// plain arguments instead of FormData.

export async function submitLocationStepAction(lat: number | null, lng: number | null) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  if (lat != null && lng != null) {
    await supabase
      .from("profiles")
      .update({ location_lat: lat, location_lng: lng })
      .eq("id", user.id);
  }

  redirect("/signup?phase=language");
}

// --- Step: Preferred Language ---

export async function submitLanguageStepAction(formData: FormData) {
  const language = String(formData.get("preferred_language") ?? "en").trim();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await supabase.from("profiles").update({ preferred_language: language }).eq("id", user.id);
  redirect("/signup?phase=date");
}

// --- Step: Wedding Date (skippable) ---

export async function submitWeddingDateStepAction(formData: FormData) {
  const weddingDate = String(formData.get("wedding_date") ?? "").trim();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await supabase
    .from("profiles")
    .update({ wedding_date: weddingDate || null })
    .eq("id", user.id);

  redirect("/signup?phase=venue");
}

// --- Step: Wedding Venue (skippable) ---

export async function submitVenueStepAction(formData: FormData) {
  const venueName = String(formData.get("wedding_venue_name") ?? "").trim();
  const city = String(formData.get("city") ?? "").trim();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await supabase
    .from("profiles")
    .update({ wedding_venue_name: venueName || null, city: city || null })
    .eq("id", user.id);

  redirect("/signup?phase=budget");
}

// --- Step: Budget Range (skippable) — final step before account is done ---

export async function submitBudgetStepAction(formData: FormData) {
  const range = String(formData.get("budget_range") ?? "").trim();

  let budgetMin: number | null = null;
  let budgetMax: number | null = null;
  if (range) {
    const [minStr, maxStr] = range.split("-");
    budgetMin = Number(minStr) || null;
    budgetMax = maxStr ? Number(maxStr) || null : null;
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await supabase
    .from("profiles")
    .update({
      budget_min: budgetMin,
      budget_max: budgetMax,
      onboarding_completed_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  redirect("/signup?phase=done");
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
      .select("full_name, role")
      .eq("id", userRes.user.id)
      .single();

    // Role-aware landing so vendors/admins don't get stuck on /account.
    if (profile?.role === "vendor") {
      redirect("/vendor/dashboard");
    }
    if (profile?.role === "admin") {
      redirect("/admin");
    }

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
