import Image from "next/image";
import logo from "@/assets/e-gaming-2026-logo.png";
import { RegistrationForm } from "./registration-form";
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
            <span className="size-1.5 animate-pulse rounded-full bg-accent" />
            Registration open
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
              see you there!
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

        <section className="card">
          <div className="mb-6">
            <h2 className="font-display text-xl font-semibold tracking-wide">Player registration</h2>
            <p className="mt-1 text-sm text-muted">128 slots per bracket. Takes a minute.</p>
          </div>
          <RegistrationForm />
        </section>
      </div>
    </main>
  );
}
