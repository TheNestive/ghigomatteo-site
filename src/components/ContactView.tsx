"use client";

import { useRef, useState } from "react";
import { usePageReveals } from "@/lib/usePageReveals";
import type { Locale } from "@/i18n/config";
import { getDict } from "@/i18n/dict";

const EMAIL = "matteo.ghigo@nestiveprod.com";
const CC = "thenestivepro@gmail.com"; // copie sur cette adresse aussi
const INSTAGRAM = "https://www.instagram.com/matteo.ghgo/";

const inputCls =
  "w-full rounded-md border border-line bg-transparent px-4 py-3.5 text-[15px] text-ink outline-none transition-colors placeholder:text-faint focus:border-ink";

export default function ContactView({
  locale = "fr",
}: {
  locale?: Locale;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  usePageReveals(rootRef);
  const t = getDict(locale).contact;

  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [projet, setProjet] = useState("");
  const [date, setDate] = useState("");
  const [message, setMessage] = useState("");

  function envoyer(e: React.FormEvent) {
    e.preventDefault();
    const subject = t.mailSubject(nom || t.mailNewContact);
    const lignes: string[] = [];
    if (nom) lignes.push(`${t.mailNom} : ${nom}`);
    if (email) lignes.push(`${t.mailEmail} : ${email}`);
    if (projet) lignes.push(`${t.mailProjet} : ${projet}`);
    if (date) lignes.push(`${t.mailDate} : ${date}`);
    lignes.push("", message);
    const body = lignes.join("\n");
    // ouvre la messagerie du visiteur, adressée aux deux boîtes
    window.location.href = `mailto:${EMAIL}?cc=${CC}&subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  }

  return (
    <div ref={rootRef}>
      {/* ---- entête ---- */}
      <section className="px-5 pt-28 pb-10 md:px-8 md:pt-36">
        <p data-fx-crumb className="t-caps mb-8 text-muted">
          {t.crumb}
        </p>
        <h1 className="t-display text-[clamp(44px,9vw,150px)]">
          <span className="-my-[0.12em] block overflow-hidden py-[0.12em]">
            <span data-fx-title className="block">
              {t.title}
            </span>
          </span>
        </h1>

        <p
          data-fx-lead
          className="mt-10 max-w-3xl text-[clamp(19px,2.6vw,30px)] leading-snug text-ink"
        >
          {t.lead}
        </p>

        {/* actions directes */}
        <div
          data-fx-lead
          className="mt-12 flex flex-col gap-3 sm:flex-row sm:gap-4"
        >
          <a
            href={`mailto:${EMAIL}`}
            className="t-caps-md rounded-md border border-ink bg-ink px-8 py-4 text-center text-bg transition-opacity hover:opacity-80"
          >
            {t.writeMe(EMAIL)}
          </a>
          <a
            href={INSTAGRAM}
            target="_blank"
            rel="noopener noreferrer"
            className="t-caps-md rounded-md border border-ink px-8 py-4 text-center text-ink transition-colors hover:bg-ink hover:text-bg"
          >
            Instagram @matteo.ghgo&nbsp;↗
          </a>
        </div>
      </section>

      {/* ---- formulaire ---- */}
      <section className="px-5 pb-24 md:px-8">
        <div className="mb-10 flex items-baseline justify-between border-t border-line-soft pt-5">
          <h2 className="t-caps-md text-ink">{t.formHead}</h2>
          <span className="t-caps hidden text-faint sm:inline">
            {t.quickReply}
          </span>
        </div>

        <form
          onSubmit={envoyer}
          className="grid max-w-4xl gap-4 md:grid-cols-2"
        >
          <label className="block">
            <span className="t-caps mb-2 block text-faint">{t.fieldNom}</span>
            <input
              className={inputCls}
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              placeholder={t.phNom}
              autoComplete="name"
              required
            />
          </label>
          <label className="block">
            <span className="t-caps mb-2 block text-faint">{t.fieldEmail}</span>
            <input
              type="email"
              className={inputCls}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.phEmail}
              autoComplete="email"
              required
            />
          </label>
          <label className="block">
            <span className="t-caps mb-2 block text-faint">
              {t.fieldProjet}
            </span>
            <input
              className={inputCls}
              value={projet}
              onChange={(e) => setProjet(e.target.value)}
              placeholder={t.phProjet}
            />
          </label>
          <label className="block">
            <span className="t-caps mb-2 block text-faint">
              {t.fieldDate}
            </span>
            <input
              className={inputCls}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              placeholder={t.phDate}
            />
          </label>
          <label className="block md:col-span-2">
            <span className="t-caps mb-2 block text-faint">{t.fieldMessage}</span>
            <textarea
              className={`${inputCls} min-h-40 leading-relaxed`}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t.phMessage}
              required
            />
          </label>
          <div className="md:col-span-2">
            <button
              type="submit"
              className="t-caps-md cursor-pointer rounded-md border border-ink px-10 py-4 text-ink transition-colors hover:bg-ink hover:text-bg"
            >
              {t.send}
            </button>
            <p className="t-caps mt-4 text-faint">{t.formHint}</p>
          </div>
        </form>
      </section>

      {/* ---- meta ---- */}
      <section className="border-t border-line-soft px-5 py-14 md:px-8">
        <div className="t-caps flex flex-wrap items-center gap-x-10 gap-y-3 text-muted">
          <span>Paris&nbsp;·&nbsp;FR</span>
          <span>{t.metaAvailable}</span>
          <span>{t.metaDisciplines}</span>
        </div>
      </section>
    </div>
  );
}
