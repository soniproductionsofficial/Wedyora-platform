import { createAdminClient } from "@/lib/supabase/server";

export type NotificationKind =
  | "info"
  | "lead"
  | "payment"
  | "approval"
  | "task";

export async function createNotification(input: {
  userId: string;
  title: string;
  body: string;
  kind?: NotificationKind;
  link?: string | null;
  bookingId?: string | null;
}) {
  // Service-role: notifications have no insert RLS policy for regular users.
  const admin = createAdminClient();
  const { error } = await admin.from("notifications").insert({
    user_id: input.userId,
    title: input.title,
    body: input.body,
    kind: input.kind ?? "info",
    link: input.link ?? null,
    booking_id: input.bookingId ?? null,
  });

  if (error) {
    console.error("Failed to create notification:", error.message);
  }
}

export const DEFAULT_VENDOR_TASKS = [
  "Confirm availability and equipment for the event date",
  "Review the call sheet and venue details",
  "Check in on the wedding day via the booking page",
  "Upload raw deliverables after the event",
];
