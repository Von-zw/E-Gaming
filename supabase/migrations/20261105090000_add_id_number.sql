-- National ID: a Zimbabwean ID number so organisers can confirm who a player is at
-- check-in, stored as e.g. 63-123456 A 42. The format check mirrors the validation in
-- src/app/actions.ts. It only checks the shape: the check letter isn't verified.
--
-- Nullable because the ID is optional on the form, and registrations made before this
-- change have none.

alter table public.registrations
  add column id_number text
    constraint registrations_id_number_format
    check (id_number ~ '^[0-9]{2}-[0-9]{5,7} [A-Z] [0-9]{2}$');

-- The website may set the ID when inserting (still insert-only, no reads).
grant insert (id_number) on table public.registrations to anon;
