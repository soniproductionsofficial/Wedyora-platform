# Wedyora Platform

The Wedyora booking platform: customers book wedding vendors, vendors apply
and get verified, and (in later phases) an AI matching engine assigns
vendors to bookings automatically. Built with Next.js (App Router) +
Supabase (auth, Postgres database, file storage) + Razorpay (payments).

This is the actual application — not the public marketing site
(`wedyora_site/wedyora.html`, deployed separately on standard web hosting).

## Status: Phase 1 (MVP) — core loop built, not yet tested against a real database

What works right now (verified via `npm run build` + route smoke tests in
the dev sandbox, but NOT yet against a real Supabase/Razorpay project):

- Customer signup / login (Supabase Auth)
- Vendor application form (creates a login + a `pending` vendor profile)
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
Supabase SQL Editor run:

```sql
update public.profiles set role = 'admin'
where id = (select id from auth.users where email = 'you@example.com');
```

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

## Deployment

- **Hosting:** [Vercel](https://vercel.com) — connect this GitHub repo, add
  the environment variables from `.env.local.example` in the Vercel project
  settings, and it deploys automatically on every push.
- **Database/Auth/Storage:** [Supabase](https://supabase.com)
- **Payments:** [Razorpay](https://razorpay.com) (start in Test Mode)

See `ACCOUNT_SETUP_GUIDE.md` (delivered separately) for step-by-step account
setup instructions.
