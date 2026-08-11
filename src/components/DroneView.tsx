"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { usePageReveals } from "@/lib/usePageReveals";
import ContactCta from "./ContactCta";
import { localizePath, type Locale } from "@/i18n/config";
import { getDict } from "@/i18n/dict";

/* Visuels + liens des prestations (le texte vient du dictionnaire, par index). */
const PRESTATION_MEDIA = [
  { img: "/site/drone/1.webp", href: "/projets/dj-snake" },
  {
    img: "/photos/lifestyle/ibiza/COVER__IBIZA-19-scaled.jpg",
    href: "/projets/ibiza",
  },
  { img: "/site/drone/ITALIEW.webp", href: "/projets/italie" },
];

export default function DroneView({ locale = "fr" }: { locale?: Locale }) {
  const rootRef = useRef<HTMLDivElement>(null);
  usePageReveals(rootRef);
  const t = getDict(locale).drone;
  const lp = (p: string) => localizePath(p, locale);

  const PRESTATIONS = PRESTATION_MEDIA.map((m, i) => ({
    ...m,
    ...t.prestations[i],
  }));

  return (
    <div ref={rootRef}>
      {/* ---- cover (vue aérienne, plein cadre tout en haut) ---- */}
      <section
        data-header-light
        className="relative h-[76vh] w-full overflow-hidden md:h-[92vh]"
      >
        <Image
          src="/site/drone/cover-garo.jpg"
          alt={t.coverAlt}
          fill
          priority
          sizes="100vw"
          quality={90}
          className="object-cover"
        />
      </section>

      {/* ---- entête ---- */}
      <section className="px-5 pt-16 pb-12 md:px-8 md:pt-20">
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

        <div className="mt-12 grid gap-10 border-t border-line-soft pt-8 md:grid-cols-2">
          <p
            data-fx-lead
            className="max-w-xl text-[17px] leading-relaxed text-ink"
            dangerouslySetInnerHTML={{ __html: t.leadHtml }}
          />
          <p data-fx-lead className="max-w-xl text-[15px] leading-relaxed text-muted">
            {t.lead2}
          </p>
        </div>
      </section>

      {/* ---- hero ---- */}
      <section className="mx-2.5">
        <div
          data-reveal
          data-header-light
          className="relative h-[64vh] overflow-hidden rounded-md md:h-[86vh] md:rounded-lg"
        >
          <Image
            src="/site/drone/HERO1-converti-depuis-png.webp"
            alt={t.heroAlt}
            fill
            sizes="100vw"
            quality={90}
            className="object-cover"
          />
        </div>
      </section>

      {/* ---- prestations ---- */}
      <section className="px-2.5 py-20">
        <div className="mx-2.5 mb-4 flex items-baseline justify-between border-t border-line-soft pt-5 md:mx-5">
          <h2 className="t-caps-md text-ink">{t.servicesTitle}</h2>
          <span className="t-caps text-faint">03</span>
        </div>
        <p className="mx-2.5 mb-14 max-w-2xl text-[15px] leading-relaxed text-muted md:mx-5">
          {t.servicesIntro}
        </p>

        <div className="flex flex-col gap-16 md:gap-20">
          {PRESTATIONS.map((p, i) => (
            <div
              key={p.title}
              className={`grid items-center gap-6 md:grid-cols-5 md:gap-10 ${
                i % 2 === 1 ? "" : ""
              }`}
            >
              <div
                data-reveal
                className={`relative overflow-hidden rounded-md md:rounded-lg ${
                  i % 2 === 0 ? "md:col-span-3" : "md:col-span-3 md:order-2"
                }`}
                style={{ aspectRatio: "16 / 10" }}
              >
                <Image
                  src={p.img}
                  alt={p.title}
                  fill
                  sizes="(max-width: 768px) 98vw, 62vw"
                  quality={90}
                  className="object-cover"
                />
                <span
                  className="t-caps-md absolute bottom-3.5 left-4 text-white"
                  style={{
                    textShadow:
                      "0 1px 3px rgba(0,0,0,.55), 0 2px 16px rgba(0,0,0,.45)",
                  }}
                >
                  <span className="text-red">//</span>&nbsp;{p.title}
                </span>
              </div>

              <div
                className={`px-2.5 md:col-span-2 md:px-0 ${
                  i % 2 === 1 ? "md:order-1 md:pl-5" : "md:pr-5"
                }`}
              >
                <p className="t-caps mb-4 text-faint">
                  {t.serviceLabel} {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="t-display mb-5 text-[clamp(24px,3vw,44px)] text-ink">
                  {p.title}
                </h3>
                <p className="mb-6 max-w-md text-[15px] leading-relaxed text-muted">
                  {p.text}
                </p>
                <Link
                  href={lp(p.href)}
                  className="t-caps-md link-line text-ink"
                >
                  {t.see}&nbsp;: {p.example}&nbsp;→
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <ContactCta locale={locale} />
    </div>
  );
}
