"use client";

import Link from "next/link";
import { useActionState } from "react";
import { register, type RegistrationState } from "./actions";
import { GAMES, GAME_MIN_AGE, MIN_AGE } from "./tournament";

const initialState: RegistrationState = { status: "idle" };

export function RegistrationForm() {
  const [state, formAction, pending] = useActionState(register, initialState);
  const errors = state.errors ?? {};
  const values = state.values ?? {};

  if (state.status === "success") {
    return (
      <div className="flex flex-col items-center gap-4 py-12 text-center" aria-live="polite">
        <div className="grid size-14 place-items-center rounded-full border border-accent/40 bg-accent/10 text-2xl text-accent">
          ✓
        </div>
        <h2 className="font-display text-2xl font-semibold tracking-wide">Slot locked in</h2>
        <p className="max-w-xs text-sm text-muted">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={formAction} noValidate className="flex flex-col gap-5">
      <Field label="Full name" error={errors.fullName}>
        <input
          name="fullName"
          autoComplete="name"
          placeholder="e.g. Tendai Moyo"
          defaultValue={values.fullName}
          aria-invalid={!!errors.fullName}
          className="input"
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-[1fr_7rem]">
        <Field label="Gamertag" error={errors.gamertag}>
          <input
            name="gamertag"
            autoComplete="nickname"
            placeholder="e.g. N1ghtOwl"
            defaultValue={values.gamertag}
            aria-invalid={!!errors.gamertag}
            className="input"
          />
        </Field>

        <Field label="Age" error={errors.age}>
          <input
            name="age"
            type="number"
            inputMode="numeric"
            min={MIN_AGE}
            max={120}
            placeholder={`${MIN_AGE}+`}
            defaultValue={values.age}
            aria-invalid={!!errors.age}
            className="input"
          />
        </Field>
      </div>

      <fieldset>
        <legend className="label">
          Games
          <span className="ml-2 normal-case tracking-normal text-muted/60">pick one or both</span>
        </legend>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {GAMES.map((game) => (
            <label key={game} className="chip flex-col gap-0 leading-tight">
              <input
                type="checkbox"
                name="games"
                value={game}
                defaultChecked={values.games?.includes(game)}
                className="sr-only"
              />
              {game}
              {GAME_MIN_AGE[game] > MIN_AGE && (
                <span className="font-mono text-[10px] opacity-60">{GAME_MIN_AGE[game]}+</span>
              )}
            </label>
          ))}
        </div>
        <ErrorText>{errors.games}</ErrorText>
      </fieldset>

      <div>
        <label className="flex cursor-pointer items-start gap-3 text-sm text-muted">
          <input
            type="checkbox"
            name="rules"
            defaultChecked={values.rules}
            className="mt-0.5 size-4 shrink-0 accent-[var(--accent)]"
          />
          <span>
            I agree to the{" "}
            <Link
              href="/rules"
              target="_blank"
              className="text-foreground underline decoration-accent/60 underline-offset-4 hover:text-accent"
            >
              tournament rules and code of conduct
            </Link>
            .
          </span>
        </label>
        <ErrorText>{errors.rules}</ErrorText>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="group relative mt-1 h-12 overflow-hidden rounded-lg bg-accent font-display text-sm font-semibold uppercase tracking-[0.2em] text-background transition hover:brightness-110 disabled:opacity-60"
      >
        {pending ? "Registering…" : "Claim your slot"}
      </button>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="label">{label}</span>
      {children}
      <ErrorText>{error}</ErrorText>
    </label>
  );
}

function ErrorText({ children }: { children?: string }) {
  if (!children) return null;
  return (
    <span role="alert" className="mt-1.5 block text-xs text-danger">
      {children}
    </span>
  );
}
