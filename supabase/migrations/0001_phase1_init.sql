-- Wedyora Platform — Phase 1 (MVP) schema, RESET + REBUILD version.
-- Safe to run any number of times on this project: it first drops
-- anything left over from a previous attempt (nothing valuable is lost —
-- this project has no real signups/bookings yet), then rebuilds everything
-- from scratch in one go.

-- ============================================================
-- 0. RESET — drop anything from a previous partial run
-- ============================================================

drop table if exists public.payments cascade;
drop table if exists public.bookings cascade;
drop table if exists public.packages cascade;
drop table if exists public.vendor_profiles cascade;
drop table if exists public.service_categories cascade;
drop table if exists public.profiles cascade;

drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user() cascade;
drop function if exists public.is_admin() cascade;

drop type if exists payment_status cascade;
drop type if exists payment_type cascade;
drop type if exists booking_status cascade;
drop type if exists vendor_status cascade;
drop type if exists user_role cascade;

-- ============================================================
-- 1. ROLES & PROFILES
-- ============================================================

create type user_role as enum ('customer', 'vendor', 'admin');

-- One row per auth.users user, created automatically on signup (see trigger below).
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role user_role not null default 'customer',
  full_name text,
  phone text,
  city text,
  created_at timestamptz not null default now()
);

-- Auto-create a profile row whenever someone signs up via Supabase Auth.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    coalesce((new.raw_user_meta_data ->> 'role')::user_role, 'customer')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- 2. SERVICE CATEGORIES (seed data — photography, catering, etc.)
-- ============================================================

create table public.service_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique
);

insert into public.service_categories (name, slug) values
  ('Photography', 'photography'),
  ('Videography', 'videography'),
  ('Drone Coverage', 'drone'),
  ('Decoration', 'decoration'),
  ('Makeup', 'makeup'),
  ('Catering', 'catering'),
  ('Venue', 'venue'),
  ('Mehendi', 'mehendi'),
  ('Music', 'music'),
  ('Priest Services', 'priest'),
  ('Transportation', 'transportation');

-- ============================================================
-- 3. VENDORS
-- ============================================================

create type vendor_status as enum ('pending', 'approved', 'rejected', 'suspended');

create table public.vendor_profiles (
  id uuid primary key references public.profiles (id) on delete cascade,
  business_name text not null,
  category_id uuid not null references public.service_categories (id),
  city text not null,
  bio text,
  experience_years int,
  portfolio_urls text[] default '{}',
  status vendor_status not null default 'pending',
  reviewed_by uuid references public.profiles (id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

-- A vendor's bookable packages (kept simple for phase 1: flat price per package).
create table public.packages (
  id uuid primary key default gen_random_uuid(),
  vendor_id uuid not null references public.vendor_profiles (id) on delete cascade,
  title text not null,
  description text,
  price numeric(10, 2) not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ============================================================
-- 4. BOOKINGS
-- ============================================================

create type booking_status as enum (
  'pending_assignment', -- customer submitted, no vendor assigned yet
  'awaiting_payment',    -- vendor assigned, waiting on advance payment
  'confirmed',           -- advance paid
  'in_progress',         -- event day / service being delivered
  'completed',
  'cancelled'
);

create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.profiles (id),
  category_id uuid not null references public.service_categories (id),
  package_id uuid references public.packages (id),
  vendor_id uuid references public.vendor_profiles (id),
  event_date date not null,
  city text not null,
  guest_count int,
  budget_min numeric(10, 2),
  budget_max numeric(10, 2),
  special_requirements text,
  status booking_status not null default 'pending_assignment',
  assigned_by uuid references public.profiles (id),
  assigned_at timestamptz,
  -- Set by the admin (later: the AI matching engine) at assignment time,
  -- since the customer only specifies a budget RANGE at booking time, not
  -- a fixed price. advance_amount is what actually gets charged via Razorpay.
  agreed_price numeric(10, 2),
  advance_amount numeric(10, 2),
  created_at timestamptz not null default now()
);

-- ============================================================
-- 5. PAYMENTS
-- ============================================================

create type payment_status as enum ('created', 'paid', 'failed', 'refunded');
create type payment_type as enum ('advance', 'final');

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings (id) on delete cascade,
  type payment_type not null default 'advance',
  razorpay_order_id text,
  razorpay_payment_id text,
  amount numeric(10, 2) not null,
  currency text not null default 'INR',
  status payment_status not null default 'created',
  created_at timestamptz not null default now()
);

-- ============================================================
-- 6. ROW LEVEL SECURITY
-- ============================================================

alter table public.profiles enable row level security;
alter table public.vendor_profiles enable row level security;
alter table public.packages enable row level security;
alter table public.bookings enable row level security;
alter table public.payments enable row level security;
alter table public.service_categories enable row level security;

-- Helper: is the current logged-in user an admin?
create function public.is_admin()
returns boolean
language sql security definer set search_path = public stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- profiles: everyone can read their own row; admins read/update all.
create policy "profiles: self read" on public.profiles
  for select using (auth.uid() = id or public.is_admin());
create policy "profiles: self update" on public.profiles
  for update using (auth.uid() = id or public.is_admin());

-- service_categories: readable by anyone (needed for public browsing pages).
create policy "categories: public read" on public.service_categories
  for select using (true);

-- vendor_profiles: vendor manages their own row; anyone can view APPROVED
-- vendors (for customer-facing browsing); admin sees/edits everything.
create policy "vendors: public read approved" on public.vendor_profiles
  for select using (status = 'approved' or auth.uid() = id or public.is_admin());
create policy "vendors: self insert" on public.vendor_profiles
  for insert with check (auth.uid() = id);
create policy "vendors: self update own pending fields" on public.vendor_profiles
  for update using (auth.uid() = id or public.is_admin());

-- packages: public read of active packages from approved vendors; vendor manages own.
create policy "packages: public read" on public.packages
  for select using (
    is_active and exists (
      select 1 from public.vendor_profiles v
      where v.id = vendor_id and v.status = 'approved'
    ) or exists (
      select 1 from public.vendor_profiles v
      where v.id = vendor_id and v.id = auth.uid()
    ) or public.is_admin()
  );
create policy "packages: vendor manages own" on public.packages
  for all using (
    exists (select 1 from public.vendor_profiles v where v.id = vendor_id and v.id = auth.uid())
    or public.is_admin()
  );

-- bookings: customer sees/creates their own; assigned vendor sees theirs; admin sees all.
create policy "bookings: customer read own" on public.bookings
  for select using (
    auth.uid() = customer_id
    or auth.uid() = vendor_id
    or public.is_admin()
  );
create policy "bookings: customer insert own" on public.bookings
  for insert with check (auth.uid() = customer_id);
create policy "bookings: admin/vendor update" on public.bookings
  for update using (public.is_admin() or auth.uid() = vendor_id);

-- payments: read-only for the booking's customer/vendor/admin.
-- NOTE: inserts/updates are intentionally NOT allowed for regular users —
-- payment records are only ever written by server-side code (using the
-- service role key) after verifying a real Razorpay signature/webhook.
-- This prevents anyone from faking a "paid" status from the browser.
create policy "payments: read own booking" on public.payments
  for select using (
    exists (
      select 1 from public.bookings b
      where b.id = booking_id
        and (b.customer_id = auth.uid() or b.vendor_id = auth.uid())
    )
    or public.is_admin()
  );
