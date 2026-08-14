-- KYC document uploads (PAN / Aadhaar scans) + bank name for payouts.
-- Document files live in a PRIVATE storage bucket; only the vendor and
-- admins can read them. Paths are stored on vendor_profiles (not public URLs).

alter table public.vendor_profiles
  add column if not exists bank_name text,
  add column if not exists pan_document_path text,
  add column if not exists aadhaar_document_path text;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'vendor-kyc',
  'vendor-kyc',
  false,
  10485760, -- 10 MB
  array['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
)
on conflict (id) do nothing;

-- Path convention: <auth.uid()>/<doc-type>-<timestamp>.<ext>
drop policy if exists "vendor kyc: vendor and admin read" on storage.objects;
create policy "vendor kyc: vendor and admin read"
  on storage.objects for select
  using (
    bucket_id = 'vendor-kyc'
    and (
      public.is_admin()
      or (storage.foldername(name))[1] = auth.uid()::text
    )
  );

drop policy if exists "vendor kyc: vendor uploads own" on storage.objects;
create policy "vendor kyc: vendor uploads own"
  on storage.objects for insert
  with check (
    bucket_id = 'vendor-kyc'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "vendor kyc: vendor updates own" on storage.objects;
create policy "vendor kyc: vendor updates own"
  on storage.objects for update
  using (
    bucket_id = 'vendor-kyc'
    and (
      public.is_admin()
      or (storage.foldername(name))[1] = auth.uid()::text
    )
  )
  with check (
    bucket_id = 'vendor-kyc'
    and (
      public.is_admin()
      or (storage.foldername(name))[1] = auth.uid()::text
    )
  );

drop policy if exists "vendor kyc: vendor deletes own" on storage.objects;
create policy "vendor kyc: vendor deletes own"
  on storage.objects for delete
  using (
    bucket_id = 'vendor-kyc'
    and (
      public.is_admin()
      or (storage.foldername(name))[1] = auth.uid()::text
    )
  );
