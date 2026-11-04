"use server";

import { randomInt } from "node:crypto";
import { getSupabase } from "@/lib/supabase";
import { GAMES, GAME_MIN_AGE, MIN_AGE, type Game } from "./tournament";

type Field = "fullName" | "phone" | "gamertag" | "age" | "games" | "rules";

export type RegistrationValues = {
  fullName?: string;
  phone?: string;
  gamertag?: string;
  age?: string;
  games?: string[];
  rules?: boolean;
};

export type RegistrationState = {
  status: "idle" | "error" | "success";
  message?: string;
  /** Set on success: the code the player shows at the venue. */
  entryCode?: string;
  errors?: Partial<Record<Field, string>>;
  values?: RegistrationValues;
};

const isGame = (value: string): value is Game => (GAMES as readonly string[]).includes(value);

// No 0/O, 1/I/L so codes are easy to read out and type at the door.
const CODE_ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";
const randomChunk = () =>
  Array.from({ length: 4 }, () => CODE_ALPHABET[randomInt(CODE_ALPHABET.length)]).join("");
/** e.g. EG26-7KQM-4XPA (must match the check constraint in supabase/migrations). */
const generateEntryCode = () => `EG26-${randomChunk()}-${randomChunk()}`;

export async function register(
  _prev: RegistrationState,
  formData: FormData,
): Promise<RegistrationState> {
  const values = {
    fullName: String(formData.get("fullName") ?? "").trim().replace(/\s+/g, " "),
    // Stored digits-only so "077 123-4567" and "0771234567" look the same to organisers.
    phone: String(formData.get("phone") ?? "").replace(/[\s().-]/g, ""),
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
  if (!/^\+?\d{7,15}$/.test(values.phone))
    errors.phone = "Enter a valid phone number";
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

  const supabase = getSupabase();

  // Retry with a fresh code in the (very unlikely) case a code is already taken.
  for (let attempt = 0; attempt < 3; attempt++) {
    const entryCode = generateEntryCode();
    const { error } = await supabase.from("registrations").insert({
      full_name: values.fullName,
      phone: values.phone,
      gamertag: values.gamertag,
      age,
      plays_fc27: games.includes("FC 27"),
      plays_mortal_kombat: games.includes("Mortal Kombat"),
      accepted_rules: true,
      entry_code: entryCode,
    });

    if (!error) {
      return {
        status: "success",
        message: `You're in, ${values.gamertag}. Registered for ${games.join(" and ")}.`,
        entryCode,
        values,
      };
    }

    // 23505 = unique violation; the message names the index that clashed.
    if (error.code === "23505" && error.message.includes("registrations_gamertag_key")) {
      return {
        status: "error",
        errors: { gamertag: "That gamertag is already registered" },
        values,
      };
    }
    if (error.code === "23505" && error.message.includes("registrations_entry_code_key")) continue;

    console.error("Supabase insert failed", error);
    break;
  }

  return {
    status: "error",
    message: "We couldn't save your registration. Please try again in a moment.",
    values,
  };
}
