<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Cursor Cloud specific instructions

Wedyora is a single Next.js 16 (App Router) app backed by **Supabase**
(Postgres + Auth + Storage) and Razorpay. There is one local process to run
(`npm run dev`, port 3000); Supabase is the one hard dependency and runs as a
local Docker stack via the Supabase CLI. There is no automated test suite —
`npm run lint` and `npm run build` are the quality gates (`next build` also
typechecks).

Startup (Docker daemon + Supabase are NOT auto-started on a fresh VM boot; the
CLI/images and `.env.local` persist in the snapshot, so this is fast):

- `./scripts/dev-up.sh` — idempotent; starts `dockerd`, runs `supabase start`
  (applies all `supabase/migrations`), and writes `.env.local` if missing.
- `npm run dev` — starts the app at http://localhost:3000. Supabase Studio is
  at http://127.0.0.1:54323.
- If `supabase start` is run manually instead of via the script, it needs
  `SUPABASE_AUTH_SMS_TWILIO_AUTH_TOKEN` set to any non-empty value (see below).

Non-obvious gotchas:

- **Phone OTP auth, no real SMS.** All login/signup is phone + SMS OTP (no
  passwords). Locally, `supabase/config.toml` `[auth.sms.test_otp]` maps test
  numbers to a fixed code — use phone `9876543210` (or `9876500001` /
  `9876500002`) with code `123456`. `normalizePhone` prepends `+91`; Supabase
  stores the number without the leading `+`.
- **Twilio is enabled with dummy credentials on purpose.** GoTrue refuses phone
  OTP unless a provider is enabled (`phone_provider_disabled`), so Twilio is
  turned on in config only to flip that switch; `test_otp` numbers short-circuit
  before any real Twilio call, so no SMS is sent. Restarting Supabase manually
  therefore requires the `SUPABASE_AUTH_SMS_TWILIO_AUTH_TOKEN` env var.
- **`auto_expose_new_tables = true` is required locally.** The SQL migrations
  add RLS policies but no explicit GRANTs to the `anon`/`authenticated` Data API
  roles, relying on Supabase's legacy auto-expose behaviour. The newer CLI
  default revokes this, which surfaces as `permission denied for table ...`
  (e.g. an empty service dropdown on `/book`). This is already set in
  `supabase/config.toml`; if you edit that flag, run `supabase db reset` (or
  `supabase stop --no-backup && supabase start`) so grants re-apply to existing
  tables.
- **Becoming an admin** (`/admin`) has no signup path — sign up as a customer,
  then in Studio's SQL editor run:
  `update public.profiles set role='admin' where id=(select id from auth.users where phone='919876543210');`
- **Payments** need real Razorpay test keys in `.env.local`; the rest of the app
  (auth, booking, admin) works with the placeholder keys.
