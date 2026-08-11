"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import type { Project } from "@/data/projects";
import { usePageReveals } from "@/lib/usePageReveals";
import ContactCta from "./ContactCta";
import { localizePath, type Locale } from "@/i18n/config";
import { getDict } from "@/i18n/dict";

/** Sélection d'images pour l'aperçu (une par univers du projet). */
const TASTE = [
  "/photos/evenement/tomorrowland-winter/02-scenes/Scene07.webp",
  "/photos/evenement/tomorrowland-winter/03-artistes/Artistes01.webp",
  "/photos/evenement/tomorrowland-winter/04-festivaliers/Festivaliers05.webp",
  "/photos/evenement/tomorrowland-winter/05-atmosphere/DA05.webp",
  "/photos/evenement/tomorrowland-winter/06-exemple-de-set/B2B03.webp",
  "/photos/evenement/tomorrowland-winter/01-activations-partenaires/Activation05.webp",
];

export default function LastworkView({
  project,
  locale = "fr",
}: {
  project: Project;
  locale?: Locale;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  usePageReveals(rootRef);
  const t = getDict(locale).lastwork;
  const projectHref = localizePath(`/projets/${project.slug}`, locale);

  return (
    <div ref={rootRef}>
      {/* ---- entête ---- */}
      <section className="px-5 pt-28 pb-12 md:px-8 md:pt-36">
        <p data-fx-crumb className="t-caps mb-8 text-muted">
          {t.crumb}
        </p>
        <h1 className="t-display text-[clamp(30px,7vw,116px)]">
          <span className="-my-[0.12em] block overflow-hidden py-[0.12em]">
            <span data-fx-title className="block">
              {project.title} {project.year}
            </span>
          </span>
        </h1>

        <div className="mt-12 grid gap-8 border-t border-line-soft pt-8 md:grid-cols-3">
          <div data-fx-lead>
            <p className="t-caps mb-1.5 text-faint">{t.dateLabel}</p>
            <p className="t-caps-md text-ink">{project.date}</p>
          </div>
          <div data-fx-lead>
            <p className="t-caps mb-1.5 text-faint">{t.placeLabel}</p>
            <p className="t-caps-md text-ink">{project.place}</p>
          </div>
          <div data-fx-lead>
            <p className="t-caps mb-1.5 text-faint">{t.imagesLabel}</p>
            <p className="t-caps-md text-ink">
              {String(project.counts.total).padStart(2, "0")}
            </p>
          </div>
        </div>

        <p
          data-fx-lead
          className="mt-10 max-w-2xl text-[15px] leading-relaxed whitespace-pre-line text-muted"
        >
          {project.desc}
        </p>
      </section>

      {/* ---- hero ---- */}
      <section className="mx-2.5">
        <Link
          href={projectHref}
          data-cursor-media
          className="group block"
        >
          <div
            data-reveal
            data-header-light
            className="relative h-[64vh] overflow-hidden rounded-md md:h-[88vh] md:rounded-lg"
          >
            <Image
              src={project.cover.src}
              alt={project.title}
              fill
              priority
              sizes="100vw"
              quality={90}
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.015]"
            />
            <span
              className="t-caps-md absolute bottom-4 left-4 text-white"
              style={{
                textShadow:
                  "0 1px 3px rgba(0,0,0,.55), 0 2px 16px rgba(0,0,0,.45)",
              }}
            >
              <span className="text-red">//</span>&nbsp;{project.label}
            </span>
          </div>
        </Link>
      </section>

      {/* ---- aperçu ---- */}
      <section className="px-2.5 py-20">
        <div className="mx-2.5 mb-10 flex items-baseline justify-between border-t border-line-soft pt-5 md:mx-5">
          <h2 className="t-caps-md text-ink">{t.previewHead}</h2>
          <span className="t-caps text-faint">
            {t.imagesTotal(String(project.counts.total).padStart(2, "0"))}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2.5 md:grid-cols-3">
          {TASTE.map((src) => (
            <Link
              key={src}
              href={projectHref}
              data-reveal
              data-cursor-media
              className="group relative block overflow-hidden rounded-md md:rounded-lg"
              style={{ aspectRatio: "4 / 3" }}
            >
              <Image
                src={src}
                alt={project.title}
                fill
                sizes="(max-width: 768px) 49vw, 33vw"
                quality={90}
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
              />
            </Link>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <Link
            href={projectHref}
            className="t-caps-md rounded-md border border-ink px-8 py-4 text-ink transition-colors hover:bg-ink hover:text-bg"
          >
            {t.discover}
          </Link>
        </div>
      </section>

      <ContactCta locale={locale} />
    </div>
  );
}
