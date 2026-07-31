-- Chapter: Vendor Terms & Conditions / Cancellation Policy consent.
-- Additive/safe to run on a live database.
--
-- The vendor application form now requires two separate checkboxes before
-- a vendor can request their OTP: one agreeing to the Wedyora Photography
-- Vendor Terms & Conditions, one agreeing to the Vendor Cancellation
-- Policy. Storing a timestamp for each (rather than just trusting the UI
-- checkbox was ticked) gives an auditable record of when a specific
-- vendor agreed to a specific version of each policy — the same reasoning
-- as timestamping payments, just for consent instead of money.

alter table public.vendor_profiles
  add column if not exists agreed_to_vendor_terms_at timestamptz,
  add column if not exists agreed_to_cancellation_policy_at timestamptz;
