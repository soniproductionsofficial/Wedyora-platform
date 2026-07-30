-- Chapter: Vendor Journey (full vendor dashboard).
-- Additive/safe to run on a live database with real signups.

-- A vendor must now accept a lead before it moves to "awaiting payment"
-- (poster steps 11-13: Lead Assigned -> Review Lead -> Accept/Reject).
-- Previously admin assignment went straight to "awaiting_payment" with no
-- vendor confirmation step at all — a real gap versus both this poster and
-- the earlier Operations Team Workflow poster's "Vendor Confirmation" step.
alter type booking_status add value if not exists 'pending_vendor_acceptance';

-- Reviews: a customer can rate/review a vendor once their booking is
-- completed. One review per booking. Public read (so a vendor's rating
-- can show up on their listing later), write restricted to the actual
-- customer on their own completed booking.
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null unique references public.bookings (id) on delete cascade,
  customer_id uuid not null references public.profiles (id),
  vendor_id uuid not null references public.vendor_profiles (id),
  rating int not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz not null default now()
);

alter table public.reviews enable row level security;

drop policy if exists "reviews: public read" on public.reviews;
create policy "reviews: public read" on public.reviews for select using (true);

drop policy if exists "reviews: customer insert own completed booking" on public.reviews;
create policy "reviews: customer insert own completed booking" on public.reviews
  for insert with check (
    auth.uid() = customer_id
    and exists (
      select 1 from public.bookings b
      where b.id = booking_id and b.customer_id = auth.uid() and b.status = 'completed'
    )
  );

-- Minimal payout ledger flag. Tracks "collected from the customer, not yet
-- released to the vendor" vs "released" so the vendor Payouts page and an
-- admin control have something real to show. Actual bank-transfer
-- automation is a later Finance Workflow chapter — this just tracks
-- status; writes go through the service-role client only, same as every
-- other payments write in this schema (see api/payments/verify/route.ts).
alter table public.payments
  add column if not exists payout_status text not null default 'pending'
    check (payout_status in ('pending', 'released'));
