"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function submitContactMessageAction(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!name || !message || (!email && !phone)) {
    redirect(
      "/contact?error=" +
        encodeURIComponent(
          "Please share your name, a way to reach you (email or phone), and your message."
        )
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.from("contact_messages").insert({
    name,
    email: email || null,
    phone: phone || null,
    message,
  });

  if (error) {
    redirect("/contact?error=" + encodeURIComponent("Something went wrong — please try again."));
  }

  redirect("/contact?success=1");
}

// Admin-only in the UI (RLS backs this — see migration 0008's "contact_messages:
// admin updates status" policy, so a non-admin caller's update simply fails).
export async function markContactMessageStatusAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!id || !["new", "read", "resolved"].includes(status)) return;

  const supabase = await createClient();
  await supabase
    .from("contact_messages")
    .update({ status: status as "new" | "read" | "resolved" })
    .eq("id", id);

  revalidatePath("/admin/contact-messages");
}
