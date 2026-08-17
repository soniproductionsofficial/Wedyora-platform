# MSG91 for Wedyora (replace Twilio)

Wedyora keeps **Supabase Auth** for generating/verifying OTPs and sessions.
MSG91 only **delivers** SMS and email via Auth Hooks.

## What changed in code

- `supabase/functions/sms-hook` — Send SMS hook → MSG91 Flow API
- `supabase/functions/email-hook` — Send Email hook → MSG91 Email API

Phone login / vendor apply / customer signup code stays the same
(`signInWithOtp` / `verifyOtp`).

## 1. MSG91 dashboard

1. Create/enable **SMS** (DLT-approved sender + Flow/template with an OTP variable).
2. Create/enable **Email** plan (verify domain, e.g. `wedyora.com`).
3. Copy **Auth Key**.

Suggested SMS template text (must match DLT approval):

```text
Your Wedyora verification code is ##otp##. Do not share it.
```

Flow variable name should match `MSG91_OTP_VAR` (default `otp`).

## 2. Deploy Edge Functions

```bash
supabase functions deploy sms-hook --no-verify-jwt --project-ref ykwprmuqecenbqinxpep
supabase functions deploy email-hook --no-verify-jwt --project-ref ykwprmuqecenbqinxpep
```

Set function secrets (Dashboard → Edge Functions → Secrets, or CLI):

```bash
supabase secrets set \
  MSG91_AUTH_KEY=your_auth_key \
  MSG91_FLOW_ID=your_flow_or_template_id \
  MSG91_EMAIL_DOMAIN=wedyora.com \
  MSG91_EMAIL_FROM=noreply@wedyora.com \
  MSG91_EMAIL_FROM_NAME=Wedyora \
  --project-ref ykwprmuqecenbqinxpep
```

Optional:

- `MSG91_OTP_VAR` (default `otp`)
- `MSG91_APP_VAR` / `MSG91_APP_NAME` if your Flow has a second variable
- `MSG91_EMAIL_TEMPLATE_ID` to force a MSG91 email template instead of HTML body

## 3. Turn on Auth Hooks (and turn off Twilio)

### Phone / SMS

1. [Auth → Providers → Phone](https://supabase.com/dashboard/project/ykwprmuqecenbqinxpep/auth/providers)
   - **Enable Phone** = ON
   - SMS provider can stay unused once the Send SMS hook is enabled
2. [Auth → Hooks](https://supabase.com/dashboard/project/ykwprmuqecenbqinxpep/auth/hooks)
   - Enable **Send SMS**
   - Type: HTTPS
   - URL: `https://ykwprmuqecenbqinxpep.supabase.co/functions/v1/sms-hook`
   - Generate secret → copy it
3. Set Edge secret `SEND_SMS_HOOK_SECRET` to that full value (`v1,whsec_…`)

### Email

1. Auth → Providers → **Email** = ON (needed for admin email/password + recovery)
2. Auth → Hooks → Enable **Send Email**
   - URL: `https://ykwprmuqecenbqinxpep.supabase.co/functions/v1/email-hook`
   - Generate secret → copy it
3. Set Edge secret `SEND_EMAIL_HOOK_SECRET`

You can remove Twilio credentials from the Phone provider after the SMS hook works.

## 4. Quick test

1. Vendor apply or `/login` with a real Indian mobile.
2. Confirm SMS arrives from your MSG91 sender.
3. Enter OTP → session should create as before.
4. Admin password reset / email confirmations should come from MSG91.

## Troubleshooting

| Symptom | Check |
| --- | --- |
| `sms_send_failed` / Twilio trial error | Send SMS hook not enabled, or still pointing at Twilio |
| Hook 401/500 | `SEND_*_HOOK_SECRET` mismatch (use full `v1,whsec_…` value) |
| MSG91 template error | Flow ID / variable name (`otp`) must match DLT template |
| Email not sending | Domain not verified in MSG91 Email; `MSG91_EMAIL_FROM` must be on that domain |

## Related docs

- Payments: [RAZORPAY_SETUP.md](./RAZORPAY_SETUP.md)
