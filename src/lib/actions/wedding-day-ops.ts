"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { DELIVERABLE_CATEGORIES, getIncidentIssue } from "@/lib/wedding-day-ops";

// These all use the regular (cookie-authenticated) Supabase client, not the
// service-role admin client — no money is involved here, so the same
// ownership-based RLS policy that guards packages/reviews is enough (see
// migration 0007's comment on wedding_day_ops for why this differs from the
// vendor_payments/payout_milestones ledger tables).

type ChecklistColumn =
  | "customer_checklist_done"
  | "vendor_checklist_done"
  | "checkout_checklist_done";

async function toggleChecklistArray(bookingId: string, column: ChecklistColumn, itemKey: string) {
  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("wedding_day_ops")
    .select("customer_checklist_done, vendor_checklist_done, checkout_checklist_done")
    .eq("booking_id", bookingId)
    .maybeSingle();

  const current = existing?.[column] ?? [];
  const next = current.includes(itemKey)
    ? current.filter((k) => k !== itemKey)
    : [...current, itemKey];

  if (column === "customer_checklist_done") {
    await supabase
      .from("wedding_day_ops")
      .upsert(
        { booking_id: bookingId, customer_checklist_done: next },
        { onConflict: "booking_id" }
      );
  } else if (column === "vendor_checklist_done") {
    await supabase
      .from("wedding_day_ops")
      .upsert({ booking_id: bookingId, vendor_checklist_done: next }, { onConflict: "booking_id" });
  } else {
    await supabase
      .from("wedding_day_ops")
      .upsert(
        { booking_id: bookingId, checkout_checklist_done: next },
        { onConflict: "booking_id" }
      );
  }
}

export async function toggleCustomerChecklistItemAction(formData: FormData) {
  const bookingId = String(formData.get("booking_id") ?? "");
  const itemKey = String(formData.get("item_key") ?? "");
  if (!bookingId || !itemKey) return;

  await toggleChecklistArray(bookingId, "customer_checklist_done", itemKey);
  revalidatePath("/account");
}

export async function toggleVendorChecklistItemAction(formData: FormData) {
  const bookingId = String(formData.get("booking_id") ?? "");
  const itemKey = String(formData.get("item_key") ?? "");
  if (!bookingId || !itemKey) return;

  await toggleChecklistArray(bookingId, "vendor_checklist_done", itemKey);
  revalidatePath(`/vendor/dashboard/bookings/${bookingId}`);
}

export async function toggleCheckoutChecklistItemAction(formData: FormData) {
  const bookingId = String(formData.get("booking_id") ?? "");
  const itemKey = String(formData.get("item_key") ?? "");
  if (!bookingId || !itemKey) return;

  await toggleChecklistArray(bookingId, "checkout_checklist_done", itemKey);
  revalidatePath(`/vendor/dashboard/bookings/${bookingId}`);
}

// Called from a Client Component button (vendor-checkin-button.tsx), same
// pattern as the signup wizard's location step — geolocation only exists in
// the browser, so this takes plain args instead of a <form>'s FormData.
export async function vendorCheckinAction(
  bookingId: string,
  lat: number | null,
  lng: number | null
) {
  if (!bookingId) return;
  const supabase = await createClient();
  await supabase.from("wedding_day_ops").upsert(
    {
      booking_id: bookingId,
      checked_in_at: new Date().toISOString(),
      checkin_lat: lat,
      checkin_lng: lng,
    },
    { onConflict: "booking_id" }
  );
  revalidatePath(`/vendor/dashboard/bookings/${bookingId}`);
}

export async function confirmCheckoutAction(formData: FormData) {
  const bookingId = String(formData.get("booking_id") ?? "");
  if (!bookingId) return;

  const supabase = await createClient();
  await supabase
    .from("wedding_day_ops")
    .upsert(
      { booking_id: bookingId, checked_out_at: new Date().toISOString() },
      { onConflict: "booking_id" }
    );
  revalidatePath(`/vendor/dashboard/bookings/${bookingId}`);
}

export async function updateProjectNotesAction(formData: FormData) {
  const bookingId = String(formData.get("booking_id") ?? "");
  const notes = String(formData.get("project_notes") ?? "");
  if (!bookingId) return;

  const supabase = await createClient();
  await supabase
    .from("wedding_day_ops")
    .upsert(
      { booking_id: bookingId, project_notes: notes.trim() || null },
      { onConflict: "booking_id" }
    );
  revalidatePath(`/vendor/dashboard/bookings/${bookingId}`);
}

export async function uploadDeliverableAction(formData: FormData) {
  const bookingId = String(formData.get("booking_id") ?? "");
  const category = String(formData.get("category") ?? "");
  const file = formData.get("file");
  const validCategories = DELIVERABLE_CATEGORIES.map((c) => c.key);

  if (
    !bookingId ||
    !validCategories.includes(category) ||
    !(file instanceof File) ||
    file.size === 0
  ) {
    redirect(
      `/vendor/dashboard/bookings/${bookingId}?error=` +
        encodeURIComponent("Choose a category and a file to upload.")
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/vendor/login");

  const safeName = (file as File).name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
  const path = `${bookingId}/${category}/${Date.now()}-${safeName}`;

  const { error: uploadError } = await supabase.storage
    .from("wedding-day-deliverables")
    .upload(path, file as File, { contentType: (file as File).type || undefined });

  if (uploadError) {
    redirect(
      `/vendor/dashboard/bookings/${bookingId}?error=` + encodeURIComponent(uploadError.message)
    );
  }

  await supabase.from("wedding_day_deliverables").insert({
    booking_id: bookingId,
    category: category as
      | "raw_photos"
      | "raw_videos"
      | "drone_footage"
      | "audio_files"
      | "backup_files",
    file_path: path,
    file_name: (file as File).name,
    uploaded_by: user!.id,
  });

  revalidatePath(`/vendor/dashboard/bookings/${bookingId}`);
  redirect(`/vendor/dashboard/bookings/${bookingId}`);
}

// Admin-only in the UI (only the admin booking page renders this form), even
// though RLS itself would allow any booking participant to log one.
export async function logIncidentAction(formData: FormData) {
  const bookingId = String(formData.get("booking_id") ?? "");
  const issueType = String(formData.get("issue_type") ?? "");
  const description = String(formData.get("description") ?? "").trim();
  const issue = getIncidentIssue(issueType);

  if (!bookingId || !issue) {
    redirect(
      `/admin/bookings/${bookingId}?error=` + encodeURIComponent("Choose a valid issue type.")
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  await supabase.from("wedding_day_incidents").insert({
    booking_id: bookingId,
    issue_type: issueType as
      | "vendor_running_late"
      | "equipment_failure"
      | "weather_disruption"
      | "guest_count_mismatch"
      | "vendor_no_show"
      | "payment_dispute_onsite",
    description: description || null,
    suggested_action: issue!.suggestedAction,
    escalated_to: issue!.escalatedTo,
    reported_by: user?.id,
  });

  revalidatePath(`/admin/bookings/${bookingId}`);
}

export async function resolveIncidentAction(formData: FormData) {
  const incidentId = String(formData.get("incident_id") ?? "");
  const bookingId = String(formData.get("booking_id") ?? "");
  if (!incidentId) return;

  const supabase = await createClient();
  await supabase
    .from("wedding_day_incidents")
    .update({ resolved_at: new Date().toISOString() })
    .eq("id", incidentId);

  revalidatePath(`/admin/bookings/${bookingId}`);
}
