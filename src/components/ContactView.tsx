"use client";

import { useRef, useState } from "react";
import { usePageReveals } from "@/lib/usePageReveals";

const EMAIL = "matteo.ghigo@nestiveprod.com";
const CC = "thenestivepro@gmail.com"; // copie sur cette adresse aussi
const INSTAGRAM = "https://www.instagram.com/matteo.ghgo/";

const inputCls =
  "w-full rounded-md border border-line bg-transparent px-4 py-3.5 text-[15px] text-ink outline-none transition-colors placeholder:text-faint focus:border-ink";

export default function ContactView() {
  const rootRef = useRef<HTMLDivElement>(null);
  usePageReveals(rootRef);

  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [projet, setProjet] = useState("");
  const [date, setDate] = useState("");
  const [message, setMessage] = useState("");

  function envoyer(e: React.FormEvent) {
    e.preventDefault();
    const subject = `Projet de ${nom || "nouveau contact"}`;
    const lignes: string[] = [];
    if (nom) lignes.push(`Nom : ${nom}`);
    if (email) lignes.push(`Email : ${email}`);
    if (projet) lignes.push(`Projet : ${projet}`);
    if (date) lignes.push(`Date envisagée : ${date}`);
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
          Parlons de votre projet
        </p>
        <h1 className="t-display text-[clamp(44px,9vw,150px)]">
          <span className="-my-[0.12em] block overflow-hidden py-[0.12em]">
            <span data-fx-title className="block">
              Contact
            </span>
          </span>
        </h1>

        <p
          data-fx-lead
          className="mt-10 max-w-3xl text-[clamp(19px,2.6vw,30px)] leading-snug text-ink"
        >
          Si vous avez un projet, une date ou une idée, je suis disponible
          pour en discuter. Dites-moi ce que vous souhaitez créer, et nous
          le créerons ensemble.
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
            M’écrire à {EMAIL}
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
          <h2 className="t-caps-md text-ink">Ou laissez-moi un message</h2>
          <span className="t-caps hidden text-faint sm:inline">
            Réponse rapide, promis
          </span>
        </div>

        <form
          onSubmit={envoyer}
          className="grid max-w-4xl gap-4 md:grid-cols-2"
        >
          <label className="block">
            <span className="t-caps mb-2 block text-faint">Nom</span>
            <input
              className={inputCls}
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              placeholder="Votre nom"
              autoComplete="name"
              required
            />
          </label>
          <label className="block">
            <span className="t-caps mb-2 block text-faint">Email</span>
            <input
              type="email"
              className={inputCls}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="vous@exemple.com"
              autoComplete="email"
              required
            />
          </label>
          <label className="block">
            <span className="t-caps mb-2 block text-faint">
              Type de projet
            </span>
            <input
              className={inputCls}
              value={projet}
              onChange={(e) => setProjet(e.target.value)}
              placeholder="Festival, corporate, drone, shooting…"
            />
          </label>
          <label className="block">
            <span className="t-caps mb-2 block text-faint">
              Date envisagée
            </span>
            <input
              className={inputCls}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              placeholder="Ex. 12 septembre 2026, ou « flexible »"
            />
          </label>
          <label className="block md:col-span-2">
            <span className="t-caps mb-2 block text-faint">Message</span>
            <textarea
              className={`${inputCls} min-h-40 leading-relaxed`}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Racontez-moi votre projet…"
              required
            />
          </label>
          <div className="md:col-span-2">
            <button
              type="submit"
              className="t-caps-md cursor-pointer rounded-md border border-ink px-10 py-4 text-ink transition-colors hover:bg-ink hover:text-bg"
            >
              Envoyer&nbsp;→
            </button>
            <p className="t-caps mt-4 text-faint">
              Le bouton ouvre votre messagerie avec le message pré-rempli.
            </p>
          </div>
        </form>
      </section>

      {/* ---- meta ---- */}
      <section className="border-t border-line-soft px-5 py-14 md:px-8">
        <div className="t-caps flex flex-wrap items-center gap-x-10 gap-y-3 text-muted">
          <span>Paris&nbsp;·&nbsp;FR</span>
          <span>Disponible en France et à l’international</span>
          <span>Photo&nbsp;·&nbsp;Drone&nbsp;·&nbsp;Vidéo</span>
        </div>
      </section>
    </div>
  );
}
