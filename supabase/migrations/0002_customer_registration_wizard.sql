-- Adds the extra profile fields collected by the multi-step customer
-- registration wizard (Chapter 3 of the business plan): email, preferred
-- language, wedding date, wedding venue, budget range, and an optional
-- location capture. All nullable/optional — every step past "name" can be
-- skipped, so a customer who doesn't know their wedding date yet, or
-- declines location access, still ends up with a usable account.

alter table public.profiles
  add column if not exists email text,
  add column if not exists preferred_language text not null default 'en',
  add column if not exists wedding_date date,
  add column if not exists wedding_venue_name text,
  add column if not exists budget_min integer,
  add column if not exists budget_max integer,
  add column if not exists location_lat double precision,
  add column if not exists location_lng double precision,
  add column if not exists onboarding_completed_at timestamptz;
