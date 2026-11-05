-- Ban list: players on this list can't register. Organisers manage it in the Supabase
-- dashboard (add a row to ban, delete the row to lift the ban).
--
-- Every column filled in on a row is matched on its own, so a banned player is refused
-- if any one of their details matches. Spacing, case and phone prefixes don't matter:
-- 63-123456 A 42 = 63123456a42 and 077 123 4567 = +263771234567.
-- Leave full_name empty for very common names, or anyone sharing that name is refused too.
--
-- The website can't read this table. The check runs inside the database on every insert,
-- so it can't be skipped by calling the API directly.

create table public.banned_players (
  id bigint generated always as identity primary key,
  full_name text,
  id_number text,
  phone text,
  gamertag text,
  notes text,
  created_at timestamptz not null default now(),

  constraint banned_players_has_a_detail
    check (coalesce(full_name, id_number, phone, gamertag) is not null)
);

comment on table public.banned_players is 'Players who may not register. Private: never exposed to the website.';

alter table public.banned_players enable row level security;

revoke all on table public.banned_players from anon, authenticated;
grant select, insert, update, delete on table public.banned_players to service_role;

-- Security definer so the check can read the list while the website's role can't.
-- Empty search_path, with every name schema-qualified, so it can't be redirected.
create function public.refuse_banned_players()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if exists (
    select 1
    from public.banned_players as b
    where
      lower(regexp_replace(btrim(b.full_name), '\s+', ' ', 'g'))
        = lower(regexp_replace(btrim(new.full_name), '\s+', ' ', 'g'))
      or upper(regexp_replace(b.id_number, '[^0-9A-Za-z]', '', 'g'))
        = upper(regexp_replace(new.id_number, '[^0-9A-Za-z]', '', 'g'))
      -- The last 9 digits are the same with or without 0, 263 or +263 in front.
      or right(regexp_replace(b.phone, '[^0-9]', '', 'g'), 9)
        = right(regexp_replace(new.phone, '[^0-9]', '', 'g'), 9)
      or lower(btrim(b.gamertag)) = lower(new.gamertag)
  ) then
    -- src/app/actions.ts looks for this code. The wording never says why.
    raise exception 'Registration refused' using errcode = 'EG001';
  end if;

  return new;
end;
$$;

revoke execute on function public.refuse_banned_players() from public, anon, authenticated;

create trigger registrations_refuse_banned_players
  before insert on public.registrations
  for each row
  execute function public.refuse_banned_players();
