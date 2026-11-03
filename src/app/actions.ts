"use server";

import { GAMES, GAME_MIN_AGE, MIN_AGE, type Game } from "./tournament";

type Field = "fullName" | "gamertag" | "age" | "games" | "rules";

export type RegistrationValues = {
  fullName?: string;
  gamertag?: string;
  age?: string;
  games?: string[];
  rules?: boolean;
};

export type RegistrationState = {
  status: "idle" | "error" | "success";
  message?: string;
  errors?: Partial<Record<Field, string>>;
  values?: RegistrationValues;
};

const isGame = (value: string): value is Game => (GAMES as readonly string[]).includes(value);

export async function register(
  _prev: RegistrationState,
  formData: FormData,
): Promise<RegistrationState> {
  const values = {
    fullName: String(formData.get("fullName") ?? "").trim().replace(/\s+/g, " "),
    gamertag: String(formData.get("gamertag") ?? "").trim(),
    age: String(formData.get("age") ?? "").trim(),
    games: formData.getAll("games").map(String),
    rules: formData.get("rules") === "on",
  };

  const errors: RegistrationState["errors"] = {};
  const age = Number(values.age);
  const games = values.games.filter(isGame);

  if (values.fullName.length < 2 || values.fullName.length > 60)
    errors.fullName = "Enter your full name";
  if (!/^[\w.-]{3,16}$/.test(values.gamertag))
    errors.gamertag = "3–16 characters: letters, numbers, . _ -";

  if (!/^\d{1,3}$/.test(values.age) || age > 120) {
    errors.age = "Enter your age in years";
  } else if (age < MIN_AGE) {
    errors.age = `Players must be at least ${MIN_AGE}`;
  }

  if (games.length === 0) {
    errors.games = "Pick at least one game";
  } else if (!errors.age) {
    const tooYoung = games.find((game) => age < GAME_MIN_AGE[game]);
    if (tooYoung) errors.games = `${tooYoung} is ${GAME_MIN_AGE[tooYoung]}+ only`;
  }

  if (!values.rules) errors.rules = "You must accept the rules to compete";

  if (Object.keys(errors).length > 0) {
    return { status: "error", errors, values };
  }

  // TODO: persist the registration (database, sheet, email, etc.)

  return {
    status: "success",
    message: `You're in, ${values.gamertag}. Registered for ${games.join(" and ")}.`,
    values,
  };
}
