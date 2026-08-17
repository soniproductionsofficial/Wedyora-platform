import { getVendorPlan } from "@/lib/vendor-plans";

/**
 * Sends a registration-success email after Razorpay payment.
 * Uses RESEND_API_KEY when configured; otherwise logs and no-ops so payment
 * never fails because of mail delivery.
 */
export async function sendVendorRegistrationSuccessEmail(opts: {
  to: string;
  name: string;
  businessName: string;
  planKey: string | null;
}): Promise<void> {
  const plan = getVendorPlan(opts.planKey);
  const subject = "Wedyora vendor registration successful";
  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.5;color:#151515">
      <h1 style="color:#880e4f">Registration successful</h1>
      <p>Hi ${escapeHtml(opts.name || "there")},</p>
      <p>
        Your payment was received and your Wedyora vendor registration for
        <strong>${escapeHtml(opts.businessName || "your business")}</strong>
        is complete.
      </p>
      <p>
        Plan: <strong>${escapeHtml(plan?.label ?? "Vendor")}</strong>
        ${plan ? ` (valid ${plan.validityMonths} months)` : ""}.
      </p>
      <p>
        Our team will review your application shortly. You can open your
        vendor dashboard anytime at
        <a href="https://www.wedyora.com/vendor/dashboard">wedyora.com/vendor/dashboard</a>.
      </p>
      <p style="color:#6b6b6b;font-size:13px">— Team Wedyora</p>
    </div>
  `;

  const resendKey = process.env.RESEND_API_KEY;
  const from =
    process.env.VENDOR_EMAIL_FROM ||
    process.env.RESEND_FROM ||
    "Wedyora <onboarding@resend.dev>";

  if (!resendKey) {
    console.info(
      "[vendor-email] RESEND_API_KEY not set; skipping success email to",
      opts.to
    );
    return;
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [opts.to],
      subject,
      html,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    console.error("[vendor-email] Resend failed:", res.status, body);
  }
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
