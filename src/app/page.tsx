import Image from "next/image";
import logo from "@/assets/e-gaming-2026-logo.png";
import { EVENT } from "./tournament";

const DETAILS = [
  { label: "Date", value: EVENT.date },
  { label: "Venue", value: EVENT.venue },
  { label: "Prize pool", value: EVENT.prizes },
  { label: "Format", value: EVENT.format },
];

export default function Home() {
  return (
    <main className="relative flex flex-1 items-center justify-center overflow-hidden px-4 py-12 sm:px-8 lg:py-6">
      <div aria-hidden className="backdrop" />

      <div className="relative grid w-full max-w-5xl grid-cols-1 items-center gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        <section className="flex min-w-0 flex-col gap-8 lg:gap-6">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-line px-3 py-1 font-mono text-xs uppercase tracking-widest text-muted">
            <span className="size-1.5 rounded-full bg-muted" />
            Registration closed
          </span>

          <div>
            <Image
              src={logo}
              alt="Rev Your E-Gaming, powered by Revive"
              loading="eager"
              sizes="(min-width: 1024px) 520px, 100vw"
              // On desktop the logo's height follows the screen height so the page fits without scrolling.
              className="logo -ml-2 w-full max-w-130 lg:h-[min(30vh,337px)] lg:w-auto"
            />
            <h1 className="mt-4 font-display text-4xl font-bold uppercase leading-[0.95] tracking-tight sm:text-5xl">
              E-Gaming <span className="text-gradient">2026</span>
            </h1>
            <p className="mt-4 max-w-md text-base leading-7 text-muted">
              FC 27 and Mortal Kombat!!!. Solo players only, one champion per title.
              Open to all skill levels bring your best and play for gaming gear.
              <span className="font-bold">SEE YOU THERE!</span>
            </p>
          </div>

          <dl className="grid max-w-md grid-cols-2 border-t border-line">
            {DETAILS.map(({ label, value }, i) => (
              <div
                key={label}
                className={`border-b border-line py-4 lg:py-3 ${i % 2 ? "pl-4 border-l" : "pr-4"}`}
              >
                <dt className="font-mono text-[11px] uppercase tracking-widest text-muted">
                  {label}
                </dt>
                <dd className="mt-1 font-display text-lg font-semibold">{value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="card" aria-labelledby="spots-full">
          <h2 id="spots-full" className="font-display text-xl font-semibold tracking-wide">
            Sorry, all spots are full
          </h2>
          <div className="mt-4 flex flex-col gap-4 text-sm leading-6 text-muted">
            <p>
              Thank you for the huge response to {EVENT.name}. Every slot in both brackets has
              been taken, so registration is now closed and we can&apos;t accept any more players.
            </p>
            <p>
              We&apos;re sorry if you missed out. We really wanted to fit everyone in, and
              we hope to see you at the next one.
            </p>
            <p>
              <span className="font-semibold text-foreground">Already registered?</span> Your
              place is safe. Bring your entry code to {EVENT.venue} on {EVENT.date}.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
