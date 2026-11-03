import type { Metadata } from "next";
import Link from "next/link";
import { EVENT, GAME_MIN_AGE, MIN_AGE } from "../tournament";

export const metadata: Metadata = {
  title: `Rules & Code of Conduct | ${EVENT.name}`,
  description: `Tournament rules and player code of conduct for ${EVENT.name}.`,
};

type Section = { id: string; title: string; items: React.ReactNode[] };

const SECTIONS: Section[] = [
  {
    id: "general",
    title: "General rules",
    items: [
      <>
        {EVENT.name} takes place on <b>28 November 2026</b> at <b>{EVENT.venue}</b>. Prizes are
        gaming devices.
      </>,
      "All entries are individual. There are no teams, and you may not share your slot or swap in another player.",
      <>
        The tournament is open to players aged <b>{MIN_AGE} and over</b>. The Mortal Kombat
        bracket is <b>{GAME_MIN_AGE["Mortal Kombat"]}+ only</b>, in line with the game&apos;s age
        rating.
      </>,
      "Players under 18 need consent from a parent or guardian. Organisers may ask for proof of age at check-in.",
      "One registration per person. Registering with a false name or age leads to disqualification.",
      "Your gamertag must match the name you use in-game and must not be offensive. Changing it after you register needs an admin's approval.",
      "Check in at least 30 minutes before your first match. If you are not ready 10 minutes after your scheduled start time, you forfeit that match.",
      "You may bring your own controller or arcade stick. Macros, turbo functions and modified hardware are not allowed.",
      "If something goes wrong in a match, stop playing and call a tournament admin straight away. Admin decisions are final.",
      "Organisers may update these rules before the event. The version on this page is the one that applies.",
    ],
  },
  {
    id: "fc27",
    title: "FC 27",
    items: [
      "1v1 matches in a double-elimination bracket.",
      "Mode: Kick Off. Settings: 6-minute halves, Legendary difficulty, normal game speed. Extra time and penalties are on.",
      "You may use any club or national team. Custom or edited squads are not allowed.",
      "Only pause when the ball is out of play, at most twice per player per match. Pauses for technical problems do not count.",
      "If a match disconnects, an admin decides what happens. Before the first goal, the match restarts at 0–0. After a goal, the remaining time is replayed with the score carried over.",
    ],
  },
  {
    id: "mk",
    title: "Mortal Kombat",
    items: [
      "1v1 matches in a double-elimination bracket. Each set is best of 3 games, and Grand Finals are best of 5. The first player to win 2 rounds wins the game.",
      "Default tournament settings: 90-second round timer. The stage is picked at random for game 1, and the loser of each game picks the next stage.",
      "Game 1 character picks are double-blind if either player asks. After each game, the winner keeps their character and the loser may change.",
      "Pausing in the middle of a round without a valid reason costs you that round.",
      "Using a known glitch or exploit to gain an advantage leads to forfeiting the game.",
    ],
  },
  {
    id: "conduct",
    title: "Code of conduct",
    items: [
      "Treat every player, admin, spectator and venue member of staff with respect.",
      "Harassment, hate speech, discrimination, threats and excessive trash talk are not tolerated, in person or online.",
      "No cheating. This covers hacks, mods, exploits, sharing accounts, playing for someone else, and agreeing results in advance.",
      "No betting on any match you or your opponent are playing in.",
      "Follow the venue's rules. No alcohol or drugs: players under 18 will be at the event.",
      "Play fair and be a good sport. Shake hands or say “GG”, win or lose.",
    ],
  },
  {
    id: "penalties",
    title: "Penalties",
    items: [
      "Depending on how serious the breach is, admins may give a warning, take away a game or match, disqualify a player, or ban them from future events.",
      "A disqualified player forfeits any prizes they have not yet received.",
    ],
  },
];

export default function RulesPage() {
  return (
    <main className="relative flex-1 overflow-hidden px-4 py-16 sm:px-8">
      <div aria-hidden className="backdrop" />

      <article className="relative mx-auto flex w-full max-w-3xl flex-col gap-10">
        <header className="flex flex-col gap-5">
          <Link href="/" className="label w-fit transition hover:text-accent">
            ← Back to registration
          </Link>
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-line px-3 py-1 font-mono text-xs uppercase tracking-widest text-muted">
            <span className="size-1.5 rounded-full bg-(--accent-2)" />
            Draft
          </span>
          <h1 className="font-display text-4xl font-bold uppercase leading-[0.95] tracking-tight sm:text-6xl">
            Rules &amp; <span className="text-gradient">Code of Conduct</span>
          </h1>
          <nav className="flex flex-wrap gap-2">
            {SECTIONS.map(({ id, title }) => (
              <a key={id} href={`#${id}`} className="chip h-9 text-xs">
                {title}
              </a>
            ))}
          </nav>
        </header>

        {SECTIONS.map(({ id, title, items }) => (
          <section key={id} id={id} className="card scroll-mt-8">
            <h2 className="mb-5 font-display text-xl font-semibold tracking-wide">{title}</h2>
            <ol className="flex flex-col gap-3">
              {items.map((item, i) => (
                <li key={i} className="flex gap-4 text-sm leading-6 text-muted [&_b]:text-foreground">
                  <span className="w-5 shrink-0 pt-px font-mono text-xs text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ol>
          </section>
        ))}
      </article>
    </main>
  );
}
