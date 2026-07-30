-- Chapter 4 (Booking Workflow): a few service categories the poster's
-- "Customer Searches" step lists that weren't seeded yet. (bookings.package_id
-- already existed since migration 0001 — an assigned booking has always
-- pointed at a specific package row, it just had nothing to point to until
-- now, since nothing created packages before this chapter.)
-- Additive/safe to run on a live database with real signups.

insert into public.service_categories (name, slug)
select * from (
  values
    ('Album Design', 'album'),
    ('Live Streaming', 'live-streaming'),
    ('Invitations', 'invitation'),
    ('Entertainment', 'entertainment'),
    ('Lighting', 'lighting'),
    ('Flower Arrangement', 'flower-arrangement')
) as new_categories(name, slug)
where not exists (
  select 1 from public.service_categories sc where sc.slug = new_categories.slug
);
