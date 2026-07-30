-- Chapter: Website navigation ("Contact Us"). Additive/safe to run on a
-- live database.
--
-- A public contact form needs somewhere for submissions to land. Rather
-- than wiring up a transactional email service (nothing in this app sends
-- outbound email today — auth is phone/OTP only), submissions are stored
-- as rows an admin reviews on /admin/contact-messages, the same way vendor
-- applications already land in a table for admin review rather than an
-- inbox.

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  phone text,
  message text not null,
  status text not null default 'new' check (status in ('new', 'read', 'resolved')),
  created_at timestamptz not null default now()
);

alter table public.contact_messages enable row level security;

-- Anyone can submit the public contact form, logged in or not — this is
-- intentionally the one table in this app with a blanket insert policy,
-- since a website visitor asking a question has no account to check
-- ownership against.
drop policy if exists "contact_messages: anyone can submit" on public.contact_messages;
create policy "contact_messages: anyone can submit" on public.contact_messages
  for insert with check (true);

drop policy if exists "contact_messages: admin reads" on public.contact_messages;
create policy "contact_messages: admin reads" on public.contact_messages
  for select using (public.is_admin());

drop policy if exists "contact_messages: admin updates status" on public.contact_messages;
create policy "contact_messages: admin updates status" on public.contact_messages
  for update using (public.is_admin());
