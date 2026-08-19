import { Webhook } from "https://esm.sh/standardwebhooks@1.0.0";

/**
 * Supabase Auth "Send Email" hook → MSG91 Email API.
 *
 * Configure in Dashboard → Authentication → Hooks → Send Email (HTTPS):
 *   https://<project-ref>.supabase.co/functions/v1/email-hook
 *
 * Required secrets:
 *   SEND_EMAIL_HOOK_SECRET – from Auth Hooks UI (v1,whsec_…)
 *   MSG91_AUTH_KEY
 *   MSG91_EMAIL_DOMAIN     – verified sending domain in MSG91
 *   MSG91_EMAIL_FROM       – from address on that domain (e.g. noreply@wedyora.com)
 *
 * Optional:
 *   MSG91_EMAIL_FROM_NAME  – default "Wedyora"
 *   MSG91_EMAIL_TEMPLATE_ID – if set, uses MSG91 template; else sends HTML body
 */

type EmailHookPayload = {
  user: { email?: string };
  email_data: {
    token?: string;
    token_hash?: string;
    redirect_to?: string;
    email_action_type?: string;
    site_url?: string;
  };
};

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const hookSecret = Deno.env.get("SEND_EMAIL_HOOK_SECRET");
  const authKey = Deno.env.get("MSG91_AUTH_KEY");
  const domain = Deno.env.get("MSG91_EMAIL_DOMAIN");
  const fromEmail = Deno.env.get("MSG91_EMAIL_FROM");
  const fromName = Deno.env.get("MSG91_EMAIL_FROM_NAME") ?? "Wedyora";
  const templateId = Deno.env.get("MSG91_EMAIL_TEMPLATE_ID");

  if (!hookSecret || !authKey || !domain || !fromEmail) {
    return jsonError(500, "MSG91 email hook is missing required secrets.");
  }

  const payload = await req.text();
  const headers = Object.fromEntries(req.headers);
  const secret = hookSecret.replace(/^v1,whsec_/, "");

  try {
    const wh = new Webhook(secret);
    const { user, email_data } = wh.verify(payload, headers) as EmailHookPayload;
    const to = user?.email;
    if (!to) return jsonError(400, "Hook payload missing email.");

    const action = email_data?.email_action_type ?? "email";
    const token = email_data?.token ?? "";
    const siteUrl = email_data?.site_url ?? "https://www.wedyora.com";
    const redirectTo = email_data?.redirect_to ?? siteUrl;
    const subject = subjectForAction(action);

    const confirmUrl =
      email_data?.token_hash
        ? `${siteUrl}/auth/v1/verify?token=${email_data.token_hash}&type=${action}&redirect_to=${encodeURIComponent(redirectTo)}`
        : redirectTo;

    const html = `
      <div style="font-family:Arial,sans-serif;line-height:1.5;color:#111">
        <h2 style="margin:0 0 12px">Wedyora</h2>
        <p>${bodyForAction(action)}</p>
        ${token ? `<p style="font-size:28px;letter-spacing:6px;font-weight:700">${token}</p>` : ""}
        <p><a href="${confirmUrl}">Continue</a></p>
        <p style="color:#666;font-size:12px">If you did not request this, you can ignore this email.</p>
      </div>
    `;

    const body = templateId
      ? {
          recipients: [
            {
              to: [{ email: to, name: to }],
              variables: {
                otp: token,
                token,
                action,
                confirm_url: confirmUrl,
                app_name: "Wedyora",
              },
            },
          ],
          from: { name: fromName, email: fromEmail },
          domain,
          template_id: templateId,
        }
      : {
          recipients: [
            {
              to: [{ email: to, name: to }],
            },
          ],
          from: { name: fromName, email: fromEmail },
          domain,
          subject,
          html,
        };

    const res = await fetch("https://control.msg91.com/api/v5/email/send", {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        authkey: authKey,
      },
      body: JSON.stringify(body),
    });

    const bodyText = await res.text();
    if (!res.ok) {
      console.error("MSG91 email failed", res.status, bodyText);
      return jsonError(res.status, `MSG91 email failed: ${bodyText}`);
    }

    return new Response(JSON.stringify({}), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("email-hook error", error);
    return jsonError(500, `Failed to send email: ${String(error)}`);
  }
});

function subjectForAction(action: string): string {
  switch (action) {
    case "signup":
      return "Confirm your Wedyora email";
    case "recovery":
      return "Reset your Wedyora password";
    case "magiclink":
      return "Your Wedyora sign-in link";
    case "email_change":
      return "Confirm your new Wedyora email";
    default:
      return "Wedyora verification";
  }
}

function bodyForAction(action: string): string {
  switch (action) {
    case "signup":
      return "Use this code or link to confirm your email for Wedyora.";
    case "recovery":
      return "Use this code or link to reset your Wedyora password.";
    case "magiclink":
      return "Use this code or link to sign in to Wedyora.";
    case "email_change":
      return "Use this code or link to confirm your email change.";
    default:
      return "Your Wedyora verification details are below.";
  }
}

function jsonError(status: number, message: string) {
  return new Response(
    JSON.stringify({
      error: { http_code: status, message },
    }),
    {
      status,
      headers: { "Content-Type": "application/json" },
    },
  );
}
