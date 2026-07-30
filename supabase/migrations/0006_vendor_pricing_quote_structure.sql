-- Chapter: Vendor Pricing & Quote Structure.
-- Additive/safe to run on a live database with real signups.
--
-- This is a genuinely big schema change because the poster bundles six
-- systems together: (1) packages now track what Wedyora pays a vendor
-- separately from what the customer pays, so our margin is real instead of
-- implied; (2) vendors now join under one of four paid plans with a
-- registration fee + refundable security deposit; (3) a platform-wide
-- add-on price list; (4) a performance bonus program; (5) a penalty
-- policy; (6) a 5-stage phased payout schedule per booking instead of one
-- lump advance/final split.

-- ============================================================
-- 1. PACKAGES: customer price vs vendor payout (Wedyora's margin)
-- ============================================================

alter table public.packages rename column price to customer_price;
alter table public.packages add column if not exists vendor_payout numeric(10, 2);
alter table public.packages add column if not exists tier text
  check (tier in ('basic', 'premium', 'luxury'));

-- Existing packages (created before this chapter) don't have a payout
-- split yet — default them to 100% margin-free (vendor gets the full
-- customer price) so nothing silently breaks. Whoever manages that
-- package should update it with the real payout split.
update public.packages set vendor_payout = customer_price where vendor_payout is null;
alter table public.packages alter column vendor_payout set not null;

-- ============================================================
-- 2. BOOKINGS: lock in the vendor's total payout at assignment time,
-- same way agreed_price already locks in the customer's total.
-- ============================================================

alter table public.bookings add column if not exists agreed_vendor_payout numeric(10, 2);

-- ============================================================
-- 3. ADD-ON PRICING CATALOG (platform-wide, e.g. Pre-Wedding Shoot,
-- Haldi Coverage) — admin managed, attached to a booking at assignment.
-- ============================================================

create table if not exists public.add_ons (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  customer_price numeric(10, 2) not null,
  vendor_payout numeric(10, 2) not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

insert into public.add_ons (name, customer_price, vendor_payout) values
  ('Pre-Wedding Shoot', 25000, 17500),
  ('Haldi Coverage', 15000, 10500),
  ('Mehendi Coverage', 15000, 10500),
  ('Reception Coverage', 25000, 17500),
  ('Live Streaming', 20000, 14000),
  ('Instagram Reels Edit', 5000, 2500)
on conflict (name) do nothing;

alter table public.add_ons enable row level security;

drop policy if exists "add_ons: public read active" on public.add_ons;
create policy "add_ons: public read active" on public.add_ons
  for select using (is_active or public.is_admin());

drop policy if exists "add_ons: admin manages" on public.add_ons;
create policy "add_ons: admin manages" on public.add_ons
  for all using (public.is_admin());

-- Snapshot of price at the moment an add-on is attached to a booking, so a
-- later catalog price change doesn't retroactively change what's already
-- been agreed with a customer/vendor.
create table if not exists public.booking_add_ons (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings (id) on delete cascade,
  add_on_id uuid not null references public.add_ons (id),
  customer_price numeric(10, 2) not null,
  vendor_payout numeric(10, 2) not null,
  created_at timestamptz not null default now()
);

alter table public.booking_add_ons enable row level security;

drop policy if exists "booking_add_ons: read own booking" on public.booking_add_ons;
create policy "booking_add_ons: read own booking" on public.booking_add_ons
  for select using (
    exists (
      select 1 from public.bookings b
      where b.id = booking_id and (b.customer_id = auth.uid() or b.vendor_id = auth.uid())
    ) or public.is_admin()
  );

drop policy if exists "booking_add_ons: admin manages" on public.booking_add_ons;
create policy "booking_add_ons: admin manages" on public.booking_add_ons
  for all using (public.is_admin());

-- ============================================================
-- 4. VENDOR REGISTRATION PLANS, SECURITY DEPOSIT, PERFORMANCE TRACKING
-- ============================================================

alter type vendor_status add value if not exists 'pending_payment';

alter table public.vendor_profiles
  add column if not exists plan text
    check (plan in ('basic_verified', 'professional_partner', 'premium_partner', 'studio_partner')),
  add column if not exists security_deposit_amount numeric(10, 2),
  add column if not exists plan_paid_at timestamptz,
  add column if not exists plan_expires_at timestamptz,
  add column if not exists successful_events_count int not null default 0,
  add column if not exists partner_tier text not null default 'standard'
    check (partner_tier in ('standard', 'gold', 'platinum'));

-- ============================================================
-- 5. VENDOR LEDGER: registration fees, security deposits, annual
-- renewals, performance bonuses, and penalties all live here as one
-- ledger of money owed between Wedyora and a vendor.
-- ============================================================

create type vendor_payment_type as enum (
  'registration_fee', 'security_deposit', 'annual_renewal',
  'incentive_bonus', 'penalty', 'security_deposit_refund'
);
create type vendor_payment_direction as enum ('credit', 'debit');

create table if not exists public.vendor_payments (
  id uuid primary key default gen_random_uuid(),
  vendor_id uuid not null references public.vendor_profiles (id) on delete cascade,
  type vendor_payment_type not null,
  -- "credit" = Wedyora owes the vendor (bonus, deposit refund).
  -- "debit" = the vendor owes Wedyora (registration, deposit, renewal, penalty).
  direction vendor_payment_direction not null,
  amount numeric(10, 2) not null check (amount > 0),
  status text not null default 'pending' check (status in ('pending', 'paid', 'waived')),
  reason text,
  razorpay_order_id text,
  razorpay_payment_id text,
  created_by uuid references public.profiles (id),
  created_at timestamptz not null default now()
);

alter table public.vendor_payments enable row level security;

drop policy if exists "vendor_payments: vendor reads own" on public.vendor_payments;
create policy "vendor_payments: vendor reads own" on public.vendor_payments
  for select using (auth.uid() = vendor_id or public.is_admin());

-- No insert/update policy for regular users, on purpose: registration-fee
-- and security-deposit rows are created by the vendor application's own
-- server action (via the service-role client, right after the application
-- is submitted), and bonus/penalty rows only by an admin action (also via
-- the service-role client). A vendor can never insert their own bonus or
-- waive their own penalty from the browser.

-- ============================================================
-- 6. PAYOUT MILESTONES: the 5-stage phased payout schedule per booking
-- (20% booking confirmation / 30% wedding completed / 20% raw files
-- uploaded / 20% quality check approved / 10% final delivery), replacing
-- the earlier single payments.payout_status flag as the vendor payout
-- ledger's source of truth.
-- ============================================================

create table if not exists public.payout_milestones (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings (id) on delete cascade,
  milestone text not null check (milestone in (
    'booking_confirmation', 'wedding_completed', 'raw_files_uploaded',
    'quality_check_approved', 'customer_delivery_completed'
  )),
  sort_order int not null,
  percentage int not null,
  amount numeric(10, 2) not null,
  status text not null default 'pending' check (status in ('pending', 'released')),
  released_at timestamptz,
  created_at timestamptz not null default now(),
  unique (booking_id, milestone)
);

alter table public.payout_milestones enable row level security;

drop policy if exists "payout_milestones: read own booking" on public.payout_milestones;
create policy "payout_milestones: read own booking" on public.payout_milestones
  for select using (
    exists (
      select 1 from public.bookings b
      where b.id = booking_id and (b.vendor_id = auth.uid() or b.customer_id = auth.uid())
    ) or public.is_admin()
  );

-- No insert/update policy for regular users: rows are created when a
-- vendor accepts a lead (amount is computed server-side from
-- agreed_vendor_payout, never submitted by the browser) and released only
-- by an admin action — both via the service-role client, same reasoning
-- as `payments` above.
