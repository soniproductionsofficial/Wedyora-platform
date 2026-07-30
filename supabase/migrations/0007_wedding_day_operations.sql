-- Chapter: Wedding Day Operations (web-feasible subset only).
-- Additive/safe to run on a live database with real signups.
--
-- The full "Wedding Day Operations" poster also covers live GPS map
-- tracking, push notifications, and an "Operations Command Center" KPI
-- dashboard — all deliberately left out of this migration. Live tracking
-- and push notifications need a native mobile app (a browser tab can't
-- track location in the background); the KPI dashboard overlaps with the
-- later Business Intelligence Dashboard chapter, so it isn't duplicated
-- here. What's below is exactly the subset that's a real website feature:
-- a pre-wedding checklist, an auto-generated call sheet (computed from
-- existing booking data, so it needs no new table), a one-time vendor
-- check-in, an incident log, a checkout checklist/confirmation, and
-- post-event file uploads.
--
-- Like the vendor incentive tiers and penalty issues added in the Vendor
-- Pricing & Quote Structure chapter, the checklist items and incident
-- issue types below are a fixed list defined in code
-- (src/lib/wedding-day-ops.ts), not rows in an admin-editable table — the
-- same simplification already used for those, kept consistent here.

-- ============================================================
-- 1. WEDDING DAY OPS: one row per booking — pre-wedding checklists,
-- check-in/out timestamps, and free-text project notes.
-- ============================================================

create table if not exists public.wedding_day_ops (
  booking_id uuid primary key references public.bookings (id) on delete cascade,
  customer_checklist_done text[] not null default '{}',
  vendor_checklist_done text[] not null default '{}',
  checked_in_at timestamptz,
  checkin_lat numeric,
  checkin_lng numeric,
  checkout_checklist_done text[] not null default '{}',
  checked_out_at timestamptz,
  project_notes text,
  created_at timestamptz not null default now()
);

alter table public.wedding_day_ops enable row level security;

-- No money involved here (unlike vendor_payments/payout_milestones), so
-- this uses the same regular ownership-based policy as packages/reviews
-- rather than routing writes through the service-role client.
drop policy if exists "wedding_day_ops: booking participants manage" on public.wedding_day_ops;
create policy "wedding_day_ops: booking participants manage" on public.wedding_day_ops
  for all using (
    exists (
      select 1 from public.bookings b
      where b.id = booking_id and (b.customer_id = auth.uid() or b.vendor_id = auth.uid())
    ) or public.is_admin()
  );

-- ============================================================
-- 2. INCIDENT LOG: issue type -> suggested action -> escalation target,
-- snapshotted from the fixed list in code at the moment it's logged (same
-- snapshot idea as booking_add_ons, so a later change to the suggested
-- text doesn't rewrite history). The UI only exposes logging from the
-- admin booking page, but RLS allows any booking participant so a vendor
-- could log one too if that's ever opened up later.
-- ============================================================

create table if not exists public.wedding_day_incidents (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings (id) on delete cascade,
  issue_type text not null check (issue_type in (
    'vendor_running_late', 'equipment_failure', 'weather_disruption',
    'guest_count_mismatch', 'vendor_no_show', 'payment_dispute_onsite'
  )),
  description text,
  suggested_action text,
  escalated_to text,
  reported_by uuid references public.profiles (id),
  resolved_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.wedding_day_incidents enable row level security;

drop policy if exists "wedding_day_incidents: booking participants manage" on public.wedding_day_incidents;
create policy "wedding_day_incidents: booking participants manage" on public.wedding_day_incidents
  for all using (
    exists (
      select 1 from public.bookings b
      where b.id = booking_id and (b.customer_id = auth.uid() or b.vendor_id = auth.uid())
    ) or public.is_admin()
  );

-- ============================================================
-- 3. DELIVERABLES: post-event file uploads (RAW photos/videos, drone
-- footage, audio, backups). Project notes are a plain text field on
-- wedding_day_ops above, not a file.
-- ============================================================

create table if not exists public.wedding_day_deliverables (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings (id) on delete cascade,
  category text not null check (category in (
    'raw_photos', 'raw_videos', 'drone_footage', 'audio_files', 'backup_files'
  )),
  file_path text not null,
  file_name text not null,
  uploaded_by uuid references public.profiles (id),
  created_at timestamptz not null default now()
);

alter table public.wedding_day_deliverables enable row level security;

drop policy if exists "wedding_day_deliverables: booking participants manage" on public.wedding_day_deliverables;
create policy "wedding_day_deliverables: booking participants manage" on public.wedding_day_deliverables
  for all using (
    exists (
      select 1 from public.bookings b
      where b.id = booking_id and (b.customer_id = auth.uid() or b.vendor_id = auth.uid())
    ) or public.is_admin()
  );

-- ============================================================
-- 4. STORAGE: unlike vendor-portfolios (public marketing photos), these
-- are raw wedding-day deliverables — the bucket is PRIVATE. Reads go
-- through createSignedUrl() in application code, never getPublicUrl().
-- Path convention: <booking_id>/<category>/<timestamp>-<filename>, so
-- (storage.foldername(name))[1] is the booking_id for matching against
-- the bookings table (there's no auth.uid() folder prefix like
-- vendor-portfolios uses, since a booking has two people who need access,
-- not one).
-- ============================================================

insert into storage.buckets (id, name, public)
values ('wedding-day-deliverables', 'wedding-day-deliverables', false)
on conflict (id) do nothing;

drop policy if exists "wedding day deliverables: booking participants read" on storage.objects;
create policy "wedding day deliverables: booking participants read"
  on storage.objects for select
  using (
    bucket_id = 'wedding-day-deliverables'
    and (
      public.is_admin()
      or exists (
        select 1 from public.bookings b
        where b.id::text = (storage.foldername(name))[1]
          and (b.customer_id = auth.uid() or b.vendor_id = auth.uid())
      )
    )
  );

drop policy if exists "wedding day deliverables: vendor uploads own booking" on storage.objects;
create policy "wedding day deliverables: vendor uploads own booking"
  on storage.objects for all
  using (
    bucket_id = 'wedding-day-deliverables'
    and (
      public.is_admin()
      or exists (
        select 1 from public.bookings b
        where b.id::text = (storage.foldername(name))[1] and b.vendor_id = auth.uid()
      )
    )
  )
  with check (
    bucket_id = 'wedding-day-deliverables'
    and (
      public.is_admin()
      or exists (
        select 1 from public.bookings b
        where b.id::text = (storage.foldername(name))[1] and b.vendor_id = auth.uid()
      )
    )
  );
