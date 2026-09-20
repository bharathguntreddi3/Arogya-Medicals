-- ============================================================================
-- Arogya Medicals — website admin setup (final version)
--
-- Run once in Supabase: Dashboard → SQL Editor → New query → paste all → Run.
-- Safe to run again later (it won't duplicate anything or wipe saved settings).
-- Then do STEP 8 at the bottom to make your own account the admin.
--
-- What this creates:
--   • site_settings  – everything the admin panel edits (banner, ribbon, store hours,
--                      contact details, payments, discount & offers, images, gallery)
--   • site_admins    – which login accounts are allowed to change them
--   • site-images    – storage folder for uploaded hero / poster / gallery photos
--   • enquiries      – messages from the website's contact form (admin inbox)
--   • site_events    – anonymous click counts for the Statistics tab
--   • security rules – visitors can only READ settings (and add enquiries/clicks);
--                      only admins can change settings or read enquiries/statistics
-- ============================================================================


-- STEP 1. Settings table ------------------------------------------------------
-- One row per admin-panel section. `value` holds that section's settings as JSON.
-- Rows are created the first time you save each section in the admin panel;
-- until then the website uses its built-in defaults.

create table if not exists public.site_settings (
  id          text primary key,
  value       jsonb not null default '{}'::jsonb,
  updated_at  timestamptz not null default now(),
  updated_by  uuid references auth.users (id) on delete set null
);

-- Only the known sections, and no oversized values.
alter table public.site_settings drop constraint if exists site_settings_id_check;
alter table public.site_settings add constraint site_settings_id_check
  check (id in ('notice', 'ribbon', 'hours', 'contact', 'payments', 'offer', 'images', 'gallery'));

alter table public.site_settings drop constraint if exists site_settings_value_size;
alter table public.site_settings add constraint site_settings_value_size
  check (pg_column_size(value) < 20000);

-- Record when and by whom each section was last changed.
create or replace function public.touch_site_settings()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  new.updated_by := auth.uid();
  return new;
end;
$$;

drop trigger if exists site_settings_touch on public.site_settings;
create trigger site_settings_touch
  before insert or update on public.site_settings
  for each row execute function public.touch_site_settings();


-- STEP 2. Admin list ----------------------------------------------------------
-- Having a login is not enough: an account must also be listed here.
-- Accounts can only be added here via SQL (step 8), never through the website.

create table if not exists public.site_admins (
  user_id  uuid primary key references auth.users (id) on delete cascade,
  added_at timestamptz not null default now()
);

alter table public.site_admins add column if not exists added_at timestamptz not null default now();

-- "Is the signed-in user an admin?" — used by all the rules below.
-- security definer lets it read site_admins without exposing that table.
create or replace function public.is_site_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.site_admins where user_id = (select auth.uid()));
$$;

revoke execute on function public.is_site_admin() from public, anon;
grant execute on function public.is_site_admin() to authenticated;


-- STEP 3. Security rules for settings -----------------------------------------

alter table public.site_settings enable row level security;
alter table public.site_admins enable row level security;
-- (site_admins has no policies at all: nobody can read or change it through the website.)

-- clean up rule names used by earlier versions of this script
drop policy if exists "Admins can see themselves" on public.site_admins;
drop policy if exists "Anyone can read site settings" on public.site_settings;
drop policy if exists "Admins can add site settings" on public.site_settings;
drop policy if exists "Admins can change site settings" on public.site_settings;
drop policy if exists "Admins can delete site settings" on public.site_settings;

-- Everyone (including visitors who aren't signed in) can READ settings —
-- the website needs them to show hours, phone numbers, the banner, etc.
create policy "Anyone can read site settings"
  on public.site_settings for select
  using (true);

-- Only admins can CREATE, CHANGE or DELETE settings.
create policy "Admins can add site settings"
  on public.site_settings for insert
  to authenticated
  with check (public.is_site_admin());

create policy "Admins can change site settings"
  on public.site_settings for update
  to authenticated
  using (public.is_site_admin())
  with check (public.is_site_admin());

create policy "Admins can delete site settings"
  on public.site_settings for delete
  to authenticated
  using (public.is_site_admin());


-- STEP 4. Image storage (hero image, offer poster, gallery) -------------------
-- A public folder: anyone can VIEW the images (they're on the website),
-- only admins can upload, replace or delete. Max 5 MB, images only.
-- (The admin panel shrinks photos to ~100–300 KB before uploading anyway.)

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('site-images', 'site-images', true, 5242880, array['image/webp', 'image/jpeg', 'image/png'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Admins can list site images" on storage.objects;
drop policy if exists "Admins can upload site images" on storage.objects;
drop policy if exists "Admins can replace site images" on storage.objects;
drop policy if exists "Admins can delete site images" on storage.objects;

create policy "Admins can list site images"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'site-images' and public.is_site_admin());

create policy "Admins can upload site images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'site-images' and public.is_site_admin());

create policy "Admins can replace site images"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'site-images' and public.is_site_admin())
  with check (bucket_id = 'site-images' and public.is_site_admin());

create policy "Admins can delete site images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'site-images' and public.is_site_admin());


-- STEP 5. Starting banner (switched off) --------------------------------------

insert into public.site_settings (id, value)
values ('notice', '{"enabled": false, "tone": "holiday", "en": "", "te": "", "until": null}')
on conflict (id) do nothing;


-- STEP 6. Enquiries inbox ----------------------------------------------------
-- Every contact-form message is saved here as well as opening WhatsApp.
-- Visitors can only ADD a message (they can't read anyone's); admins can read,
-- mark handled and delete.

create table if not exists public.enquiries (
  id          uuid primary key default gen_random_uuid(),
  name        text not null check (char_length(name) between 1 and 80),
  phone       text not null check (char_length(phone) between 7 and 20),
  message     text not null check (char_length(message) between 1 and 500),
  lang        text not null default 'en' check (lang in ('en', 'te')),
  handled     boolean not null default false,
  handled_at  timestamptz,
  created_at  timestamptz not null default now()
);

create index if not exists enquiries_created_at_idx on public.enquiries (created_at desc);

-- New messages always start as "to do" with the real time, whatever the sender claims,
-- plus a simple flood guard: at most 30 new messages per hour across the whole site.
create or replace function public.guard_new_enquiry()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if (select count(*) from public.enquiries where created_at > now() - interval '1 hour') >= 30 then
    raise exception 'Too many enquiries right now, please try again later';
  end if;
  new.created_at := now();
  new.handled := false;
  new.handled_at := null;
  return new;
end;
$$;

drop trigger if exists enquiries_guard on public.enquiries;
create trigger enquiries_guard
  before insert on public.enquiries
  for each row execute function public.guard_new_enquiry();

alter table public.enquiries enable row level security;

drop policy if exists "Anyone can send an enquiry" on public.enquiries;
drop policy if exists "Admins can read enquiries" on public.enquiries;
drop policy if exists "Admins can update enquiries" on public.enquiries;
drop policy if exists "Admins can delete enquiries" on public.enquiries;

create policy "Anyone can send an enquiry"
  on public.enquiries for insert
  to anon, authenticated
  with check (true);

create policy "Admins can read enquiries"
  on public.enquiries for select
  to authenticated
  using (public.is_site_admin());

create policy "Admins can update enquiries"
  on public.enquiries for update
  to authenticated
  using (public.is_site_admin())
  with check (public.is_site_admin());

create policy "Admins can delete enquiries"
  on public.enquiries for delete
  to authenticated
  using (public.is_site_admin());


-- STEP 7. Click statistics ----------------------------------------------------
-- One row per visit / button tap. Stored: the kind of action, the time, and three
-- broad categories (phone or computer, site language, and for visits how they
-- arrived: direct / search / social / other). Nothing that identifies anyone —
-- no IP address, no name, no exact referring page.
-- Visitors can only ADD rows; only admins can see the totals.

create table if not exists public.site_events (
  id          bigint generated always as identity primary key,
  kind        text not null,
  device      text,
  lang        text,
  source      text,
  created_at  timestamptz not null default now()
);

-- (added in later versions of this script — safe on an existing table)
alter table public.site_events add column if not exists device text;
alter table public.site_events add column if not exists lang text;
alter table public.site_events add column if not exists source text;

alter table public.site_events drop constraint if exists site_events_kind_check;
alter table public.site_events add constraint site_events_kind_check check (kind in
  ('visit', 'call', 'whatsapp', 'directions', 'prescription', 'review', 'enquiry', 'map', 'gallery',
   'ribbon_close'));
alter table public.site_events drop constraint if exists site_events_device_check;
alter table public.site_events add constraint site_events_device_check
  check (device is null or device in ('mobile', 'desktop'));
alter table public.site_events drop constraint if exists site_events_lang_check;
alter table public.site_events add constraint site_events_lang_check
  check (lang is null or lang in ('en', 'te'));
alter table public.site_events drop constraint if exists site_events_source_check;
alter table public.site_events add constraint site_events_source_check
  check (source is null or source in ('direct', 'search', 'social', 'other'));

create index if not exists site_events_created_at_idx on public.site_events (created_at);
create index if not exists site_events_kind_idx on public.site_events (kind);

-- The time is always the server's, so nobody can back-date clicks.
create or replace function public.stamp_site_event()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.created_at := now();
  return new;
end;
$$;

drop trigger if exists site_events_stamp on public.site_events;
create trigger site_events_stamp
  before insert on public.site_events
  for each row execute function public.stamp_site_event();

alter table public.site_events enable row level security;

drop policy if exists "Anyone can record a click" on public.site_events;
drop policy if exists "Admins can read clicks" on public.site_events;
drop policy if exists "Admins can delete clicks" on public.site_events;

create policy "Anyone can record a click"
  on public.site_events for insert
  to anon, authenticated
  with check (true);

create policy "Admins can read clicks"
  on public.site_events for select
  to authenticated
  using (public.is_site_admin());

create policy "Admins can delete clicks"
  on public.site_events for delete
  to authenticated
  using (public.is_site_admin());

-- Daily totals per action (India time) for the Statistics tab. Returns nothing for non-admins.
create or replace function public.site_event_counts(days int default 30)
returns table (day date, kind text, total bigint)
language sql
stable
security definer
set search_path = ''
as $$
  select (e.created_at at time zone 'Asia/Kolkata')::date as day, e.kind, count(*) as total
  from public.site_events e
  where public.is_site_admin()
    and e.created_at >= now() - make_interval(days => least(greatest(days, 1), 366))
  group by 1, 2
  order by 1;
$$;

revoke execute on function public.site_event_counts(int) from public, anon;
grant execute on function public.site_event_counts(int) to authenticated;

-- All-time totals per action, and when counting started. Admins only.
create or replace function public.site_event_totals()
returns table (kind text, total bigint, first_at timestamptz)
language sql
stable
security definer
set search_path = ''
as $$
  select e.kind, count(*) as total, min(e.created_at) as first_at
  from public.site_events e
  where public.is_site_admin()
  group by e.kind;
$$;

revoke execute on function public.site_event_totals() from public, anon;
grant execute on function public.site_event_totals() to authenticated;

-- Breakdowns for the Statistics tab over the last N days (India time). Admins only.
--   device / lang / source : per action kind
--   weekday (0 = Sunday)   : per action kind
--   hour (0–23)            : per action kind
create or replace function public.site_event_breakdown(days int default 30)
returns table (dimension text, value text, kind text, total bigint)
language sql
stable
security definer
set search_path = ''
as $$
  with recent as (
    select e.kind, e.device, e.lang, e.source, (e.created_at at time zone 'Asia/Kolkata') as local_time
    from public.site_events e
    where public.is_site_admin()
      and e.created_at >= now() - make_interval(days => least(greatest(days, 1), 366))
  )
  select 'device', coalesce(device, 'unknown'), kind, count(*) from recent group by 2, 3
  union all
  select 'lang', coalesce(lang, 'unknown'), kind, count(*) from recent group by 2, 3
  union all
  select 'source', coalesce(source, 'unknown'), kind, count(*) from recent where kind = 'visit' group by 2, 3
  union all
  select 'weekday', extract(dow from local_time)::int::text, kind, count(*) from recent group by 2, 3
  union all
  select 'hour', extract(hour from local_time)::int::text, kind, count(*) from recent group by 2, 3;
$$;

revoke execute on function public.site_event_breakdown(int) from public, anon;
grant execute on function public.site_event_breakdown(int) to authenticated;


-- STEP 8. Make your account the admin -----------------------------------------
-- First create your login: Authentication → Users → Add user → Create new user
-- (tick "Auto Confirm User"). Then replace the email below with yours,
-- remove the two dashes at the start of the 3 lines, select just those lines and Run.
--
-- insert into public.site_admins (user_id)
-- select id from auth.users where email = 'your-admin-email@example.com'
-- on conflict do nothing;
--
-- Check it worked (should show your email):
-- select u.email, a.added_at from public.site_admins a join auth.users u on u.id = a.user_id;
