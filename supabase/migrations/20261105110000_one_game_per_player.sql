-- Each player enters one game. The rule mirrors the validation in src/app/actions.ts.
--
-- NOT VALID applies it to new registrations only, so anyone who already registered for
-- both games stays in the table and this migration can't fail on those rows.

alter table public.registrations
  add constraint registrations_one_game
    check (not (plays_fc27 and plays_mortal_kombat)) not valid;
