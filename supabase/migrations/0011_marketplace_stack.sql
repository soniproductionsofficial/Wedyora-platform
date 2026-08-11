-- Marketplace stack (React + Express) tables.
-- Prefixed with marketplace_ so they coexist with the Next.js public schema.

create table if not exists public.marketplace_users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  password_hash text not null,
  name text not null,
  phone text,
  role text not null check (role in ('customer', 'vendor', 'admin')),
  avatar_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.marketplace_vendors (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.marketplace_users (id) on delete cascade,
  business_name text not null,
  bio text,
  category text not null,
  city text not null default '',
  portfolio_urls text[] not null default '{}',
  rating numeric(3,2) not null default 0,
  review_count int not null default 0,
  deposit_amount numeric(12,2) not null default 0,
  deposit_paid boolean not null default false,
  wallet_balance numeric(12,2) not null default 0,
  plan_tier text not null default 'basic'
    check (plan_tier in ('basic', 'premium', 'pro')),
  is_verified boolean not null default false,
  verification_status text not null default 'pending'
    check (verification_status in ('pending', 'approved', 'rejected')),
  services text[] not null default '{}',
  price_min numeric(12,2),
  price_max numeric(12,2),
  available_dates text[] not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists public.marketplace_customers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.marketplace_users (id) on delete cascade,
  city text,
  bookings_count int not null default 0,
  total_spent numeric(12,2) not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.marketplace_services (
  id uuid primary key default gen_random_uuid(),
  vendor_id uuid not null references public.marketplace_vendors (id) on delete cascade,
  name text not null,
  description text,
  price numeric(12,2) not null,
  category text not null,
  duration_hours numeric(6,2),
  created_at timestamptz not null default now()
);

create table if not exists public.marketplace_bookings (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.marketplace_customers (id) on delete cascade,
  vendor_id uuid references public.marketplace_vendors (id) on delete set null,
  event_date date not null,
  location text not null,
  event_type text not null default 'Wedding',
  services jsonb not null default '[]',
  budget_min numeric(12,2),
  budget_max numeric(12,2),
  total_amount numeric(12,2) not null default 0,
  status text not null default 'pending'
    check (status in ('pending', 'matched', 'awaiting_vendor', 'confirmed', 'completed', 'cancelled')),
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.marketplace_payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.marketplace_users (id) on delete cascade,
  booking_id uuid references public.marketplace_bookings (id) on delete set null,
  amount numeric(12,2) not null,
  type text not null check (type in ('booking', 'deposit', 'payout', 'refund')),
  status text not null default 'pending'
    check (status in ('pending', 'paid', 'failed', 'refunded')),
  provider text not null default 'mock' check (provider in ('mock', 'razorpay', 'stripe')),
  provider_id text,
  created_at timestamptz not null default now()
);

create table if not exists public.marketplace_tasks (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.marketplace_bookings (id) on delete cascade,
  vendor_id uuid not null references public.marketplace_vendors (id) on delete cascade,
  description text not null,
  status text not null default 'pending'
    check (status in ('pending', 'in_progress', 'completed')),
  assigned_at timestamptz not null default now(),
  completed_at timestamptz
);

create table if not exists public.marketplace_notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.marketplace_users (id) on delete cascade,
  type text not null,
  message text not null,
  link text,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.marketplace_messages (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid references public.marketplace_bookings (id) on delete cascade,
  sender_id uuid not null references public.marketplace_users (id) on delete cascade,
  receiver_id uuid not null references public.marketplace_users (id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);

create index if not exists marketplace_vendors_category_idx on public.marketplace_vendors (category);
create index if not exists marketplace_vendors_city_idx on public.marketplace_vendors (city);
create index if not exists marketplace_bookings_customer_idx on public.marketplace_bookings (customer_id);
create index if not exists marketplace_bookings_vendor_idx on public.marketplace_bookings (vendor_id);
create index if not exists marketplace_notifications_user_idx on public.marketplace_notifications (user_id, created_at desc);

alter table public.marketplace_users enable row level security;
alter table public.marketplace_vendors enable row level security;
alter table public.marketplace_customers enable row level security;
alter table public.marketplace_services enable row level security;
alter table public.marketplace_bookings enable row level security;
alter table public.marketplace_payments enable row level security;
alter table public.marketplace_tasks enable row level security;
alter table public.marketplace_notifications enable row level security;
alter table public.marketplace_messages enable row level security;

-- Service-role backend owns writes; allow public read of verified vendors/services.
drop policy if exists "marketplace_vendors public read verified" on public.marketplace_vendors;
create policy "marketplace_vendors public read verified" on public.marketplace_vendors
  for select using (is_verified = true);

drop policy if exists "marketplace_services public read" on public.marketplace_services;
create policy "marketplace_services public read" on public.marketplace_services
  for select using (
    exists (
      select 1 from public.marketplace_vendors v
      where v.id = vendor_id and v.is_verified = true
    )
  );
