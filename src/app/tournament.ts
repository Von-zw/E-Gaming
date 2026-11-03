export const EVENT = {
  name: "E-Gaming 2026",
  date: "28 Nov 2026",
  venue: "Joina City",
  prizes: "Gaming devices",
  format: "Individuals",
};

export const GAMES =["FC 27", "Mortal Kombat"] as const;
export type Game = (typeof GAMES)[number];

/** Minimum age to enter the tournament at all. */
export const MIN_AGE = 13;

/** Per-title minimum age (Mortal Kombat is rated 17+). */
export const GAME_MIN_AGE: Record<Game, number> = {
  "FC 27": MIN_AGE,
  "Mortal Kombat": 17,
};
