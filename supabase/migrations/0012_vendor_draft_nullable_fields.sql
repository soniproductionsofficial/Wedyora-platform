-- Allow draft vendor rows after phone OTP (business name + phone only)
-- before the full application details are collected.
alter table public.vendor_profiles
  alter column category_id drop not null,
  alter column city drop not null;
