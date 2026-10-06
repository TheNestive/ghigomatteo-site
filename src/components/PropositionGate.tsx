"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect, useRef } from "react";
import { unlock, type UnlockState } from "@/app/proposition-2027/actions";
import { usePageReveals } from "@/lib/usePageReveals";

/** Écran d'accès : un seul champ code, pas d'email. */
export default function PropositionGate() {
  const rootRef = useRef<HTMLDivElement>(null);
  usePageReveals(rootRef);
  const router = useRouter();
  const [state, formAction, pending] = useActionState<UnlockState, FormData>(
    unlock,
    { error: false }
  );
  const submitted = useRef(false);

  useEffect(() => {
    if (submitted.current && !pending && !state.error) router.refresh();
  }, [state, pending, router]);

  return (
    <div
      ref={rootRef}
      className="mx-auto flex min-h-svh max-w-[1180px] items-center px-5 pt-32 pb-20 md:px-8"
    >
      <div className="relative grid w-full items-center gap-14 border-l border-line pl-5 md:grid-cols-[1.15fr_1fr] md:gap-16 md:pl-10">
        <span className="absolute top-0 -left-px h-14 w-px bg-red" />

        <div>
          <p data-fx-crumb className="t-caps mb-8 text-red">
            // Proposition d’accompagnement photographique
          </p>
          <h1 className="t-display text-[clamp(52px,8.4vw,132px)]">
            <span className="-my-[0.12em] block overflow-hidden py-[0.12em]">
              <span data-fx-title className="block">
                Saison 2027<span className="text-red">.</span>
              </span>
            </span>
          </h1>
        </div>

        <form
          data-fx-lead
          action={(fd) => {
            submitted.current = true;
            formAction(fd);
          }}
          className="rounded-md border border-line bg-bg2/60 p-6 md:p-8"
        >
          <div className="mb-8 flex items-center justify-between border-b border-line-soft pb-4">
            <span className="t-caps text-red">// Accès</span>
            <span className="t-caps text-faint">2027</span>
          </div>

          <label htmlFor="prop-code" className="t-caps mb-3 block text-muted">
            Code d’accès
          </label>
          <input
            id="prop-code"
            name="code"
            type="text"
            required
            autoFocus
            autoComplete="off"
            autoCapitalize="characters"
            spellCheck={false}
            placeholder="XXXXXXXX"
            aria-invalid={state.error || undefined}
            className={`w-full rounded-md border bg-bg px-4 py-3.5 text-[15px] font-semibold tracking-[0.22em] uppercase outline-none transition-colors placeholder:text-faint focus:border-ink ${
              state.error ? "border-red" : "border-line"
            }`}
          />
          <p
            role="alert"
            className={`t-caps mt-3 text-red transition-opacity ${
              state.error ? "opacity-100" : "opacity-0"
            }`}
          >
            Code invalide
          </p>

          <button
            type="submit"
            disabled={pending}
            className="t-caps-md mt-4 w-full rounded-md border border-red px-6 py-4 text-red transition-colors hover:bg-red hover:text-white disabled:opacity-50"
          >
            {pending ? "…" : "Accéder →"}
          </button>
        </form>
      </div>
    </div>
  );
}
