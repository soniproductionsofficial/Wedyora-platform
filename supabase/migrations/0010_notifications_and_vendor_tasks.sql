-- In-app notifications (vendor/customer alerts when leads are assigned,
-- applications are reviewed, etc.) plus assignable vendor tasks per booking.
-- Additive / safe to run on a live database.

-- ============================================================
-- 1. NOTIFICATIONS
-- ============================================================

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  body text not null,
  link text,
  kind text not null default 'info'
    check (kind in ('info', 'lead', 'payment', 'approval', 'task')),
  booking_id uuid references public.bookings (id) on delete set null,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists notifications_user_id_created_at_idx
  on public.notifications (user_id, created_at desc);

alter table public.notifications enable row level security;

drop policy if exists "notifications: self read" on public.notifications;
create policy "notifications: self read" on public.notifications
  for select using (auth.uid() = user_id or public.is_admin());

drop policy if exists "notifications: self update read_at" on public.notifications;
create policy "notifications: self update read_at" on public.notifications
  for update using (auth.uid() = user_id or public.is_admin());

-- Inserts only via service-role from server actions (no public insert policy).

-- ============================================================
-- 2. VENDOR TASKS (assigned when Wedyora matches a vendor to a booking)
-- ============================================================

create table if not exists public.vendor_tasks (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings (id) on delete cascade,
  vendor_id uuid not null references public.vendor_profiles (id) on delete cascade,
  title text not null,
  sort_order int not null default 0,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists vendor_tasks_vendor_id_idx
  on public.vendor_tasks (vendor_id);

create index if not exists vendor_tasks_booking_id_idx
  on public.vendor_tasks (booking_id);

alter table public.vendor_tasks enable row level security;

drop policy if exists "vendor_tasks: vendor or customer or admin read" on public.vendor_tasks;
create policy "vendor_tasks: vendor or customer or admin read" on public.vendor_tasks
  for select using (
    auth.uid() = vendor_id
    or public.is_admin()
    or exists (
      select 1 from public.bookings b
      where b.id = booking_id and b.customer_id = auth.uid()
    )
  );

drop policy if exists "vendor_tasks: vendor completes own" on public.vendor_tasks;
create policy "vendor_tasks: vendor completes own" on public.vendor_tasks
  for update using (auth.uid() = vendor_id or public.is_admin());

-- Inserts/deletes via service-role from admin assignment action.
