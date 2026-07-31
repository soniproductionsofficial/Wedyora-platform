# Wedyora Platform

The Wedyora booking platform: customers book wedding vendors, vendors apply
and get verified, and (in later phases) an AI matching engine assigns
vendors to bookings automatically. Built with Next.js (App Router) +
Supabase (auth, Postgres database, file storage) + Razorpay (payments).

The public-facing marketing pages (About, Services, Portfolio, Blog, FAQ,
Contact Us, and the legal pages) now live directly in this app under
`src/app/`, alongside the booking/vendor/admin functionality — there's no
separate static marketing site.

## Status: Phase 1 (MVP) — core loop built, not yet tested against a real database

What works right now (verified via `npm run build` + route smoke tests in
the dev sandbox, but NOT yet against a real Supabase/Razorpay project):

- Customer signup / login by phone number + SMS one-time code (Supabase
  Auth phone OTP — no email or password anywhere in the app)
- Vendor application form, also phone + OTP (creates a login + a `pending`
  vendor profile)
- Public vendor browsing page, filterable by category/city (only shows
  `approved` vendors)
- Admin panel (`/admin`) — approve/reject vendor applications, and manually
  assign an approved vendor + set the agreed price / advance amount on a
  booking (a manual stand-in for the future AI matching engine)
- Customer booking request form (`/book`) — category, date, city, guest
  count, budget range, notes
- Razorpay advance-payment checkout once a booking has a vendor assigned,
  with the server independently re-verifying the payment signature before
  marking anything as paid (never trusts the browser's word for it)
- Database schema + Row Level Security policies for profiles, vendors,
  packages, bookings, and payments (`supabase/migrations/0001_phase1_init.sql`)

**Making yourself an admin:** there's no public signup path to the `admin`
role (intentionally). Sign up as a normal customer first, then in the
Supabase SQL Editor run (phone number in E.164 format, e.g. `+919876543210`
— note Supabase stores it *without* a leading `+`, so match on the digits
only):

```sql
update public.profiles set role = 'admin'
where id = (select id from auth.users where phone = '919876543210');
```

**Phone OTP requires an SMS provider:** Supabase itself doesn't send text
messages — it needs to be connected to an SMS provider (Twilio is the
best-documented option) in the Supabase dashboard under
**Authentication → Providers → Phone**, the same way sending emails needed
Resend connected first. See `ACCOUNT_SETUP_GUIDE.md` for the exact steps.

Not built yet (tracked in the project task list):

- End-to-end test against a real Supabase project + real Razorpay test-mode
  checkout (next step once those accounts exist)
- Everything from later phases (AI vendor-matching engine, escrow/finance
  automation, wedding-day GPS operations, editing/QC workflow, BI dashboards)
  — deliberately deferred until the core booking loop is proven solid

## Getting Started Locally

```bash
npm install
cp .env.local.example .env.local   # fill in real Supabase/Razorpay keys
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Database Setup

The schema lives in `supabase/migrations/0001_phase1_init.sql`. Once you
have a Supabase project, run it via the Supabase SQL Editor (paste the file
contents and run) or the Supabase CLI (`supabase db push`).

**Important:** `0001_phase1_init.sql` starts by dropping every app table —
only run it once, on a fresh project. Any later file
(`0002_...`, `0003_...`, etc.) is additive (`add column if not exists`, safe
to run on a live database with real signups) and should be run once, in
order, the same way — paste into the SQL Editor and run.

- `0002_customer_registration_wizard.sql` — adds the profile fields for the
  multi-step signup wizard (email, language, wedding date/venue, budget).
- `0003_booking_workflow.sql` — adds a few more service categories (Album,
  Live Streaming, Invitations, Entertainment, Lighting, Flower Arrangement).
- `0004_vendor_registration_workflow.sql` — adds the vendor KYC/bank/team
  fields (PAN, Aadhaar, GST, bank details, team size, service areas,
  equipment) and creates the `vendor-portfolios` Storage bucket + policies
  for portfolio uploads. **This one needs one extra manual step** — after
  running the SQL, go to Storage in the Supabase dashboard and confirm a
  `vendor-portfolios` bucket exists (the SQL creates it, but it's worth
  eyeballing once) and is set to Public.
- `0005_vendor_journey.sql` — adds the `pending_vendor_acceptance` booking
  status (a vendor must now accept a lead before the customer is asked to
  pay), creates the `reviews` table (customer rates a vendor after a
  completed booking), and adds a `payout_status` column to `payments`
  (pending/released, tracked from Admin → Payouts).
- `0006_vendor_pricing_quote_structure.sql` — the big one. Splits every
  package's price into what the customer pays vs. what the vendor is paid
  (so Wedyora's margin is tracked, not implied); adds a platform-wide
  add-on price list (`add_ons`/`booking_add_ons`); adds four paid vendor
  registration plans with a registration fee + refundable security deposit
  (`vendor_profiles.plan`, a new `pending_payment` vendor status, and the
  `vendor_payments` ledger table); adds a performance bonus program
  (`vendor_profiles.successful_events_count`/`partner_tier`); adds a
  penalty policy (also logged in `vendor_payments`); and replaces the
  single payout flag on `payments` with a 5-stage `payout_milestones`
  schedule per booking (20/30/20/20/10). **Existing packages get
  auto-migrated** (their old `price` becomes `customer_price`, and
  `vendor_payout` defaults to the same value — i.e. 100% to the vendor —
  until you edit them with the real split).
- `0007_wedding_day_operations.sql` — the web-feasible subset of Wedding
  Day Operations: a pre-wedding checklist (separate customer/vendor items),
  an auto-generated Call Sheet (computed from existing booking data — no
  new table for it), a one-time vendor check-in (timestamp + optional
  location, not continuous tracking), an incident log (issue type →
  suggested action → escalation target), a checkout checklist +
  confirmation, and post-event file uploads (RAW photos/videos, drone
  footage, audio, backups). Live GPS map tracking, push notifications, and
  the "Operations Command Center" KPI dashboard are deliberately left out —
  the first two need a native mobile app, the third overlaps with the
  later Business Intelligence Dashboard chapter. **This one needs one
  extra manual step** — after running the SQL, go to Storage in the
  Supabase dashboard and confirm a `wedding-day-deliverables` bucket
  exists and is set to **Private** (not Public, unlike `vendor-portfolios`
  — these are raw wedding-day files, not public marketing photos).
- `0008_contact_messages.sql` — adds the `contact_messages` table backing
  the public Contact Us page, so submissions land somewhere you can read
  them (`/admin/contact-messages`) instead of needing an email service.
- `0009_vendor_agreement_consent.sql` — adds
  `agreed_to_vendor_terms_at`/`agreed_to_cancellation_policy_at` timestamp
  columns to `vendor_profiles`. The vendor application form now has two
  required checkboxes (Vendor Terms & Conditions, Vendor Cancellation
  Policy) linking to `/vendor-terms` and `/vendor-cancellation-policy`,
  each rendering the full text from your Word documents; applying without
  ticking both is blocked.

## Deployment

- **Hosting:** [Vercel](https://vercel.com) — connect this GitHub repo, add
  the environment variables from `.env.local.example` in the Vercel project
  settings, and it deploys automatically on every push.
- **Database/Auth/Storage:** [Supabase](https://supabase.com)
- **Payments:** [Razorpay](https://razorpay.com) (start in Test Mode)

See `ACCOUNT_SETUP_GUIDE.md` (delivered separately) for step-by-step account
setup instructions.
