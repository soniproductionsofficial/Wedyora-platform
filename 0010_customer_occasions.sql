-- Occasions: the type of event a customer is booking for (haldi, sangeet,
-- maternity shoot, newborn shoot, etc.) -- separate from `service_categories`,
-- which is *what service* they need (photography, catering, etc.). A single
-- booking now optionally records both: "I need Photography (service) for my
-- Sangeet (occasion)".
--
-- Additive/safe to run on a live database with real signups: creates one new
-- table, seeds it, and adds one new nullable column to `bookings`. Nothing
-- existing is touched or made required.

create table if not exists public.occasions (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  phase text not null check (phase in ('pre_wedding', 'wedding', 'post_wedding', 'life_event')),
  sort_order int not null default 0
);

alter table public.occasions enable row level security;

drop policy if exists "occasions: public read" on public.occasions;
create policy "occasions: public read" on public.occasions
  for select using (true);

insert into public.occasions (name, slug, phase, sort_order)
select * from (
  values
    ('Roka / Engagement', 'roka-engagement', 'pre_wedding', 10),
    ('Ring Ceremony', 'ring-ceremony', 'pre_wedding', 20),
    ('Pre-Wedding Shoot', 'pre-wedding-shoot', 'pre_wedding', 30),
    ('Haldi', 'haldi', 'pre_wedding', 40),
    ('Mehendi', 'mehendi-event', 'pre_wedding', 50),
    ('Sangeet', 'sangeet', 'pre_wedding', 60),
    ('Bachelor / Bachelorette Party', 'bachelor-bachelorette-party', 'pre_wedding', 70),
    ('Tilak Ceremony', 'tilak-ceremony', 'pre_wedding', 80),
    ('Wedding Day', 'wedding-day', 'wedding', 90),
    ('Reception', 'reception', 'wedding', 100),
    ('Post-Wedding Shoot', 'post-wedding-shoot', 'post_wedding', 110),
    ('Griha Pravesh', 'griha-pravesh', 'post_wedding', 120),
    ('Maternity Shoot', 'maternity-shoot', 'life_event', 130),
    ('Baby Shower / Godh Bharai', 'baby-shower-godh-bharai', 'life_event', 140),
    ('Newborn Shoot', 'newborn-shoot', 'life_event', 150),
    ('Naming Ceremony', 'naming-ceremony', 'life_event', 160),
    ('First Birthday', 'first-birthday', 'life_event', 170),
    ('Milestone Birthday', 'milestone-birthday', 'life_event', 180),
    ('Anniversary', 'anniversary', 'life_event', 190),
    ('Housewarming', 'housewarming', 'life_event', 200)
) as new_occasions(name, slug, phase, sort_order)
where not exists (
  select 1 from public.occasions o where o.slug = new_occasions.slug
);

alter table public.bookings
  add column if not exists occasion_id uuid references public.occasions (id);
