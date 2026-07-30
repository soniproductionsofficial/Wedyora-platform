-- Chapter 5 (Vendor Registration Workflow): the extra KYC/business fields
-- the poster's flow collects that the original simplified vendor
-- application didn't (PAN, Aadhaar, GST, bank details for payouts, team
-- size, service areas, and a start-availability date), plus a real storage
-- bucket + policies for portfolio uploads (vendor_profiles.portfolio_urls
-- has existed since day one, but nothing ever wrote to it — there was no
-- upload step before this chapter).
--
-- Additive/safe to run on a live database with real signups.
--
-- A note on sensitivity: pan_number/aadhaar_number are real government ID
-- numbers. Row Level Security already restricts vendor_profiles so only
-- the vendor themselves and admins can read these columns (see
-- "vendors: self update own pending fields" / admin policies in
-- 0001_phase1_init.sql) — nobody else, including other vendors or
-- customers, can query them. Worth keeping in mind for any future feature
-- that displays vendor_profiles data publicly: never select these two
-- columns on a public-facing query.

alter table public.vendor_profiles
  add column if not exists pan_number text,
  add column if not exists aadhaar_number text,
  add column if not exists gst_number text,
  add column if not exists bank_account_holder_name text,
  add column if not exists bank_account_number text,
  add column if not exists bank_ifsc text,
  add column if not exists team_size integer,
  add column if not exists service_areas text[] default '{}',
  add column if not exists available_from date,
  add column if not exists equipment_details text;

-- Storage bucket for portfolio photos/work samples. Public read (so a
-- vendor's portfolio can show up on their public profile/listing later),
-- but a vendor can only write inside their own folder (path prefixed with
-- their own user id), enforced the same way RLS enforces every other
-- "vendor manages own" rule in this schema.
insert into storage.buckets (id, name, public)
values ('vendor-portfolios', 'vendor-portfolios', true)
on conflict (id) do nothing;

drop policy if exists "vendor portfolio: public read" on storage.objects;
create policy "vendor portfolio: public read"
  on storage.objects for select
  using (bucket_id = 'vendor-portfolios');

drop policy if exists "vendor portfolio: vendor manages own" on storage.objects;
create policy "vendor portfolio: vendor manages own"
  on storage.objects for all
  using (
    bucket_id = 'vendor-portfolios'
    and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id = 'vendor-portfolios'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
