-- Contact number: a phone/WhatsApp number so organisers can reach players about
-- brackets and match times. The format check mirrors the validation in src/app/actions.ts.
--
-- Nullable because registrations made before this change have no number, and so the
-- live site keeps working until the new form is deployed. The form always requires it.

alter table public.registrations
  add column phone text
    constraint registrations_phone_format check (phone ~ '^\+?[0-9]{7,15}$');

-- The website may set the number when inserting (still insert-only, no reads).
grant insert (phone) on table public.registrations to anon;
