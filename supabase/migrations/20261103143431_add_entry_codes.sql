-- Entry codes: every registration gets a unique code (e.g. EG26-7KQM-4XPA) that the
-- player shows at the venue. The website generates the code; organisers look it up
-- in the dashboard on the day.

alter table public.registrations
  add column entry_code text
    constraint registrations_entry_code_format check (entry_code ~ '^EG26-[0-9A-Z]{4}-[0-9A-Z]{4}$');

-- Give any rows created before this change (e.g. test entries) a code too.
update public.registrations
set entry_code = 'EG26-'
  || upper(substr(md5(random()::text || id::text), 1, 4)) || '-'
  || upper(substr(md5(random()::text || id::text), 5, 4))
where entry_code is null;

alter table public.registrations alter column entry_code set not null;

-- Codes must be unique; codes are always upper case so a plain unique index is enough.
create unique index registrations_entry_code_key on public.registrations (entry_code);

-- The website may set the code when inserting (still insert-only, no reads).
grant insert (entry_code) on table public.registrations to anon;
