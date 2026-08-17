import { Webhook } from "https://esm.sh/standardwebhooks@1.0.0";

/**
 * Supabase Auth "Send SMS" hook → MSG91 Flow API.
 *
 * Supabase still generates/verifies the OTP; this function only delivers it.
 * Configure in Dashboard → Authentication → Hooks → Send SMS (HTTPS):
 *   https://<project-ref>.supabase.co/functions/v1/sms-hook
 *
 * Required secrets (Edge Function env):
 *   SEND_SMS_HOOK_SECRET  – from Auth Hooks UI (v1,whsec_…)
 *   MSG91_AUTH_KEY
 *   MSG91_FLOW_ID         – DLT-approved Flow / template id
 *
 * Optional:
 *   MSG91_OTP_VAR         – recipient variable name for OTP (default: otp)
 *   MSG91_APP_VAR         – optional second template variable name
 *   MSG91_APP_NAME        – value for that second variable (default: Wedyora)
 */

type HookPayload = {
  user: { phone?: string };
  sms: { otp: string };
};

function digitsOnly(phone: string): string {
  return phone.replace(/[^\d]/g, "");
}

function toMsg91Mobile(phone: string): string {
  const digits = digitsOnly(phone);
  if (digits.length === 10) return `91${digits}`;
  if (digits.length === 12 && digits.startsWith("91")) return digits;
  if (digits.startsWith("91")) return digits;
  return digits;
}

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const hookSecret = Deno.env.get("SEND_SMS_HOOK_SECRET");
  const authKey = Deno.env.get("MSG91_AUTH_KEY");
  const flowId = Deno.env.get("MSG91_FLOW_ID") ?? Deno.env.get("MSG91_SMS_TEMPLATE_ID");

  if (!hookSecret || !authKey || !flowId) {
    return jsonError(500, "MSG91 SMS hook is missing required secrets.");
  }

  const payload = await req.text();
  const headers = Object.fromEntries(req.headers);
  const secret = hookSecret.replace(/^v1,whsec_/, "");

  try {
    const wh = new Webhook(secret);
    const { user, sms } = wh.verify(payload, headers) as HookPayload;
    const otp = sms?.otp;
    const phone = user?.phone;

    if (!otp || !phone) {
      return jsonError(400, "Hook payload missing phone or OTP.");
    }

    const mobile = toMsg91Mobile(phone);
    const otpVar = Deno.env.get("MSG91_OTP_VAR") ?? "otp";
    const appVar = Deno.env.get("MSG91_APP_VAR");
    const appName = Deno.env.get("MSG91_APP_NAME") ?? "Wedyora";

    const recipient: Record<string, string> = {
      mobiles: mobile,
      [otpVar]: otp,
    };
    if (appVar) recipient[appVar] = appName;

    const res = await fetch("https://control.msg91.com/api/v5/flow/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authkey: authKey,
      },
      body: JSON.stringify({
        template_id: flowId,
        short_url: "0",
        recipients: [recipient],
      }),
    });

    const bodyText = await res.text();
    if (!res.ok) {
      console.error("MSG91 SMS failed", res.status, bodyText);
      return jsonError(res.status, `MSG91 SMS failed: ${bodyText}`);
    }

    return new Response(JSON.stringify({}), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("sms-hook error", error);
    return jsonError(500, `Failed to send SMS: ${String(error)}`);
  }
});

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
