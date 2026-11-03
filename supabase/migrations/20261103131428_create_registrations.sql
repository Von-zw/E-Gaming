-- Player registrations for E-Gaming 2026.
--
-- Access model: the website (server action, publishable key, `anon` role) may only
-- INSERT new registrations. Nobody can read, change or delete rows through the
-- Data API; organisers view entries in the Supabase dashboard.
-- The checks mirror the form validation in src/app/actions.ts so the rules hold
-- even if someone calls the API directly.

create table public.registrations (
  id bigint generated always as identity primary key,
  full_name text not null
    check (full_name = btrim(full_name) and char_length(full_name) between 2 and 60),
  gamertag text not null
    check (gamertag ~ '^[A-Za-z0-9_.-]{3,16}$'),
  age smallint not null
    check (age between 13 and 120),
  plays_fc27 boolean not null default false,
  plays_mortal_kombat boolean not null default false,
  accepted_rules boolean not null
    check (accepted_rules),
  created_at timestamptz not null default now(),

  constraint registrations_pick_a_game check (plays_fc27 or plays_mortal_kombat),
  constraint registrations_mortal_kombat_17_plus check (not plays_mortal_kombat or age >= 17)
);

comment on table public.registrations is 'E-Gaming 2026 player registrations (insert-only from the website).';

-- One registration per gamertag, ignoring case ("N1ghtOwl" = "n1ghtowl").
create unique index registrations_gamertag_key on public.registrations (lower(gamertag));

-- Lock the table down, then open exactly what the website needs.
alter table public.registrations enable row level security;

revoke all on table public.registrations from anon, authenticated;
grant insert (full_name, gamertag, age, plays_fc27, plays_mortal_kombat, accepted_rules)
  on table public.registrations to anon;
grant select, insert, update, delete on table public.registrations to service_role;

create policy "Players can register"
  on public.registrations
  for insert
  to anon
  with check (accepted_rules);
