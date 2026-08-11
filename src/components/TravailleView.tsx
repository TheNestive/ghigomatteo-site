"use client";

import Image from "next/image";
import { useRef } from "react";
import { usePageReveals } from "@/lib/usePageReveals";
import BeforeAfter from "./BeforeAfter";
import ContactCta from "./ContactCta";
import type { Locale } from "@/i18n/config";
import { getDict } from "@/i18n/dict";

const ETAPE_IMAGES = [
  "/site/accueil/TAYCPC-1.jpg",
  "/site/accueil/TAYCPC-2.jpg",
  "/site/accueil/TAYCPC-5.jpg",
  "/site/accueil/TAYCPC-6.jpg",
];

function SectionHead({
  n,
  title,
}: {
  n: string;
  title: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex items-baseline justify-between border-t border-line-soft pt-5">
      <h2 className="t-display text-[clamp(24px,3.4vw,48px)] text-ink">
        {title}
      </h2>
      <span className="t-caps text-faint">{n}</span>
    </div>
  );
}

export default function TravailleView({
  locale = "fr",
}: {
  locale?: Locale;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  usePageReveals(rootRef);
  const t = getDict(locale).travaille;

  return (
    <div ref={rootRef}>
      {/* ---- entête ---- */}
      <section className="px-5 pt-28 pb-16 md:px-8 md:pt-36">
        <p data-fx-crumb className="t-caps mb-8 text-muted">
          {t.crumb}
        </p>
        <h1 className="t-display max-w-[14ch] text-[clamp(40px,7.5vw,120px)]">
          <span className="-my-[0.12em] block overflow-hidden py-[0.12em]">
            <span data-fx-title className="block">
              {t.title}
            </span>
          </span>
        </h1>

        <p
          data-fx-lead
          className="mt-12 max-w-4xl text-[clamp(22px,3.2vw,40px)] leading-tight text-ink"
          dangerouslySetInnerHTML={{ __html: t.leadHtml }}
        />

        <div className="mt-12 grid gap-10 border-t border-line-soft pt-8 md:grid-cols-2">
          <p
            data-fx-lead
            className="max-w-xl text-[16px] leading-relaxed text-ink"
            dangerouslySetInnerHTML={{ __html: t.sig1Html }}
          />
          <p data-fx-lead className="max-w-xl text-[15px] leading-relaxed text-muted">
            {t.sig2}
          </p>
        </div>
      </section>

      {/* ---- qui suis-je ---- */}
      <section className="px-2.5 pb-20">
        <div className="grid items-center gap-6 md:grid-cols-5 md:gap-10">
          <div
            data-reveal
            className="relative overflow-hidden rounded-md md:col-span-2 md:rounded-lg"
            style={{ aspectRatio: "3 / 4" }}
          >
            <Image
              src="/site/accueil/bonnnn.webp"
              alt={t.portraitAlt}
              fill
              sizes="(max-width: 768px) 98vw, 42vw"
              quality={90}
              className="object-cover"
            />
          </div>
          <div className="px-2.5 md:col-span-3 md:px-0 md:pr-8 md:pl-5">
            <p className="t-caps mb-4 text-faint">{t.whoLabel}</p>
            <p className="max-w-xl text-[17px] leading-relaxed text-ink">
              {t.whoBody1}
            </p>
            <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-muted">
              {t.whoBody2}
            </p>
          </div>
        </div>
      </section>

      {/* ---- pendant le shooting ---- */}
      <section className="px-2.5 pb-20">
        <div className="grid items-center gap-6 md:grid-cols-5 md:gap-10">
          <div className="order-2 px-2.5 md:order-1 md:col-span-2 md:px-0 md:pl-8">
            <p className="t-caps mb-4 text-faint">{t.shootLabel}</p>
            <p
              className="max-w-md text-[16px] leading-relaxed text-ink"
              dangerouslySetInnerHTML={{ __html: t.shootBody1Html }}
            />
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-muted">
              {t.shootBody2}
            </p>
          </div>
          <div
            data-reveal
            className="order-1 relative overflow-hidden rounded-md md:order-2 md:col-span-3 md:rounded-lg"
            style={{ aspectRatio: "16 / 9" }}
          >
            <Image
              src="/site/accueil/shooting-studio.webp"
              alt={t.shootAlt}
              fill
              sizes="(max-width: 768px) 98vw, 62vw"
              quality={90}
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* ---- editing avant / après ---- */}
      <section className="px-2.5 pb-20">
        <div className="mx-2.5 md:mx-5">
          <SectionHead n="03" title={t.editHead} />
          <p
            className="mb-10 max-w-2xl text-[15px] leading-relaxed text-muted"
            dangerouslySetInnerHTML={{ __html: t.editIntroHtml }}
          />
        </div>
        <div className="mx-auto max-w-135">
          <div data-reveal>
            <BeforeAfter
              before="/site/accueil/theodora-avant.webp"
              after="/site/accueil/theodora-apres.webp"
              aspect="2 / 3"
              sizes="(max-width: 768px) 96vw, 40vw"
              locale={locale}
            />
          </div>
          <p className="t-caps mt-4 text-center text-faint">
            {t.dragToCompare}
          </p>
        </div>
      </section>

      {/* ---- le processus ---- */}
      <section className="px-2.5 pb-20">
        <div className="mx-2.5 md:mx-5">
          <SectionHead n="04" title={t.processHead} />
          <p
            className="mb-10 max-w-2xl text-[15px] leading-relaxed text-muted"
            dangerouslySetInnerHTML={{ __html: t.processIntroHtml }}
          />
        </div>
        <div className="grid grid-cols-2 gap-2.5 md:grid-cols-4">
          {ETAPE_IMAGES.map((img, i) => (
            <figure key={img} data-reveal>
              <div
                className="relative overflow-hidden rounded-md md:rounded-lg"
                style={{ aspectRatio: "4 / 5" }}
              >
                <Image
                  src={img}
                  alt={`${t.stepWord} ${i + 1} · ${t.etapes[i]}`}
                  fill
                  sizes="(max-width: 768px) 49vw, 25vw"
                  quality={90}
                  className="object-cover"
                />
              </div>
              <figcaption className="pt-3">
                <p className="t-caps text-red">
                  {t.stepWord} {String(i + 1).padStart(2, "0")}
                </p>
                <p className="t-caps mt-1.5 text-muted">{t.etapes[i]}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* ---- livraison ---- */}
      <section className="px-5 pb-24 md:px-8">
        <SectionHead n="05" title={t.deliveryHead} />
        <div className="grid gap-10 md:grid-cols-2">
          <p
            className="max-w-xl text-[16px] leading-relaxed text-ink"
            dangerouslySetInnerHTML={{ __html: t.deliveryBody1Html }}
          />
          <p className="max-w-xl text-[15px] leading-relaxed text-muted">
            {t.deliveryBody2}
          </p>
        </div>
      </section>

      <ContactCta locale={locale} />
    </div>
  );
}
