"use client";

import { useEffect, useRef, useState } from "react";
import { EVENT } from "./tournament";

/** Opens as a modal as soon as it mounts (i.e. right after a successful registration). */
export function EntryCodeDialog({ code, message }: { code: string; message?: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="entry-code-title"
      className="dialog fixed inset-0 m-auto h-fit w-[calc(100%-2rem)] max-w-md rounded-2xl border border-line bg-[#10132c] p-0 text-foreground shadow-2xl backdrop:bg-black/70 backdrop:backdrop-blur-sm"
    >
      <div className="flex flex-col items-center gap-5 p-6 text-center sm:p-8">
        <div className="grid size-14 place-items-center rounded-full border border-accent/40 bg-accent/10 text-2xl text-accent">
          ✓
        </div>

        <div>
          <h2 id="entry-code-title" className="font-display text-2xl font-semibold tracking-wide">
            Registration successful
          </h2>
          {message && <p className="mt-1.5 text-sm text-muted">{message}</p>}
        </div>

        <EntryCode code={code} />

        <div
          role="alert"
          className="flex gap-3 rounded-lg border border-accent-2/40 bg-accent-2/10 px-4 py-3 text-left text-sm leading-6 text-accent-2"
        >
          <span aria-hidden className="text-base leading-6">⚠</span>
          <p>
            <b className="font-semibold">Don&apos;t lose this code.</b> You&apos;ll need it to enter at{" "}
            {EVENT.venue} on {EVENT.date}. Take a screenshot or write it down now, because it
            won&apos;t be shown again after you leave this page.
          </p>
        </div>

        <form method="dialog" className="w-full">
          <button
            autoFocus
            className="h-12 w-full rounded-lg bg-accent font-display text-sm font-semibold uppercase tracking-[0.2em] text-background transition hover:brightness-110"
          >
            I&apos;ve saved my code
          </button>
        </form>
      </div>
    </dialog>
  );
}

/** The code in large type with a copy button. Also used on the card behind the modal. */
export function EntryCode({ code }: { code: string }) {
  const [copied, setCopied] = useState<"idle" | "copied" | "failed">("idle");

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied("copied");
    } catch {
      setCopied("failed");
    }
  }

  return (
    <div className="w-full">
      <p className="label">Your entry code</p>
      <div className="mt-2 flex items-center gap-2 rounded-xl border border-dashed border-accent/50 bg-accent/5 p-2 pl-4">
        <code className="flex-1 select-all text-left font-mono text-xl font-semibold tracking-[0.15em] text-foreground sm:text-2xl">
          {code}
        </code>
        <button
          type="button"
          onClick={copy}
          className="h-10 shrink-0 rounded-lg border border-line bg-white/5 px-3 text-xs font-medium text-foreground transition hover:border-accent/60 hover:text-accent"
        >
          {copied === "copied" ? "Copied ✓" : "Copy"}
        </button>
      </div>
      <p aria-live="polite" className="mt-1.5 min-h-4 text-xs text-muted">
        {copied === "failed" && "Couldn't copy. Select the code and copy it manually."}
      </p>
    </div>
  );
}
