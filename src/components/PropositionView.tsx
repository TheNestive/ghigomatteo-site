"use client";

import Image from "next/image";
import { useRef, type ReactNode } from "react";
import { usePageReveals } from "@/lib/usePageReveals";

/* Références citées dans « À propos » (vraies photos du portfolio). */
const REFERENCES = [
  { name: "Tomorrowland", src: "/photos/evenement/tomorrowland/TML-08.jpg" },
  { name: "Garorock", src: "/photos/evenement/garorock/GARO3-3.jpg" },
  { name: "Golden Coast", src: "/photos/evenement/macklemore/macklemore-07.jpg" },
  { name: "Les Déferlantes", src: "/photos/evenement/theodora/Sans-titre-1-1-.jpg" },
  {
    name: "Le Touquet Music Beach",
    src: "/photos/evenement/touquet/COVER__TOUQUETW-scaled.webp",
  },
];

const EVENTS = [
  ["06/02/27", "Orléans"],
  ["05/03/27", "Lorient"],
  ["09/04/27", "Parc Floral, Paris"],
  ["24/04/27", "Hippodrome de Vincennes"],
  ["19/06/27", "Saint-Quentin"],
  ["28/08/27", "Bordeaux"],
  ["06/11/27", "Hippodrome de Vincennes"],
  ["04/12/27", "Rennes"],
];

/* Ce que couvre une soirée : artistes, scène, public, ambiance, scénographie… */
const COVERAGE = [
  { src: "/photos/evenement/garorock/COVER__GAROROCK-1-scaled.jpg", alt: "Artiste" },
  { src: "/photos/evenement/garorock/GARO3-1.jpg", alt: "Public" },
  { src: "/photos/evenement/garorock/GARO3-6.jpg", alt: "Scénographie" },
  { src: "/photos/evenement/garorock/GARO3-18.jpg", alt: "Ambiance" },
];

const pad = (i: number) => String(i + 1).padStart(2, "0");

/** Section façon devis : rail vertical à gauche, label rouge, titre. */
function Section({
  index,
  title,
  children,
}: {
  index: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="mx-auto max-w-[1180px] px-5 py-20 md:px-8 md:py-28">
      <div className="relative border-l border-line pl-5 md:pl-10">
        <span className="absolute top-0 -left-px h-14 w-px bg-red" />
        <p className="t-caps mb-5 text-red">
          // {index}
        </p>
        <h2 className="t-display mb-12 text-[clamp(26px,5vw,76px)] md:mb-16">
          {title}
          <span className="text-red">.</span>
        </h2>
        {children}
      </div>
    </section>
  );
}

/** Ligne numérotée : numéro à gauche, texte à droite, filet en dessous. */
function Row({ n, children }: { n: number; children: ReactNode }) {
  return (
    <div className="grid gap-3 border-b border-line-soft py-7 first:border-t md:grid-cols-[9rem_1fr] md:gap-10 md:py-9">
      <span className="t-caps text-red">{pad(n)}</span>
      <div className="max-w-[62ch] text-[16px] leading-relaxed text-ink/80">
        {children}
      </div>
    </div>
  );
}

/** Montant : chiffre en grand, unité en petites caps. */
function Amount({ value, unit, size = "md" }: { value: string; unit: string; size?: "md" | "xl" }) {
  return (
    <span className="inline-flex items-baseline gap-2 whitespace-nowrap">
      <span
        className={`font-semibold tracking-[-0.03em] tabular-nums ${
          size === "xl"
            ? "text-[clamp(48px,7vw,104px)] leading-none"
            : "text-[clamp(22px,2.2vw,30px)] leading-none"
        }`}
      >
        {value}
      </span>
      <span
        className={
          size === "xl"
            ? "text-[clamp(18px,1.8vw,26px)] font-semibold text-muted"
            : "t-caps-md text-muted"
        }
      >
        {unit}
      </span>
    </span>
  );
}

export default function PropositionView() {
  const rootRef = useRef<HTMLDivElement>(null);
  usePageReveals(rootRef);

  return (
    <div ref={rootRef}>
      {/* ---- entête ---- */}
      <header>
        {/* bandeau image : fond du titre, sans occuper tout l'écran */}
        <div className="px-2.5 pt-2.5">
          <div
            data-header-light
            className="relative h-[58svh] min-h-[420px] overflow-hidden rounded-md md:h-[68svh] md:rounded-lg"
          >
            <Image
              src="/photos/evenement/garorock/-matteo.ghgo_GaroJ1_BigFLOetOli-68.jpg"
              alt="Public de festival au coucher du soleil"
              fill
              priority
              sizes="100vw"
              quality={90}
              className="object-cover object-[50%_60%]"
            />
            <div className="absolute inset-x-0 bottom-0">
              <div
                className="mx-auto max-w-[1180px] px-5 pb-8 text-white md:px-8 md:pb-12"
                style={{
                  textShadow:
                    "0 1px 3px rgba(0,0,0,.55), 0 2px 20px rgba(0,0,0,.45)",
                }}
              >
                <p data-fx-crumb className="t-caps mb-6 text-white">
                  <span className="text-red">//</span> Proposition
                  d’accompagnement photographique
                </p>
                <h1 className="t-display text-[clamp(52px,10vw,160px)]">
                  <span className="-my-[0.12em] block overflow-hidden py-[0.12em]">
                    <span data-fx-title className="block">
                      Saison 2027<span className="text-red">.</span>
                    </span>
                  </span>
                </h1>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-[1180px] px-5 md:px-8">
        <dl
          data-fx-lead
          className="mt-10 grid border-y border-line sm:grid-cols-3 md:mt-14"
        >
          {[
            ["Accompagnement 2027", "8 événements"],
            ["Budget", "4 500 € HT"],
            ["Par soirée", "≈ 80 photographies finales retouchées"],
          ].map(([k, v], i) => (
            <div
              key={k}
              className={`py-5 sm:px-6 sm:first:pl-0 ${
                i > 0 ? "border-t border-line-soft sm:border-t-0 sm:border-l" : ""
              }`}
            >
              <dt className="t-caps mb-2 text-muted">{k}</dt>
              <dd className="text-[15px] font-semibold">{v}</dd>
            </div>
          ))}
        </dl>
        </div>
      </header>

      {/* ---- 01 · à propos ---- */}
      <Section index="01" title="À propos">
        <p className="mb-14 max-w-[40ch] border-l-2 border-red pl-5 text-[clamp(20px,2.2vw,30px)] leading-[1.3] font-medium tracking-[-0.01em]">
          Je suis Matteo Ghigo, photographe professionnel et pilote drone,
          spécialisé dans la photographie de festivals, concerts et événements.
        </p>

        <Row n={0}>
          J’ai eu l’occasion de travailler sur des événements comme
          Tomorrowland, Garorock, Golden Coast, Les Déferlantes ou Le Touquet
          Music Beach, ainsi qu’avec de nombreux artistes parmi lesquels Major
          Lazer, J Balvin, Dimitri Vegas, Fisher, Ninho, etc..
        </Row>
        <Row n={1}>
          Mon objectif est de proposer une couverture à la fois esthétique,
          dynamique et pensée pour la communication des événements, tout en
          conservant une identité visuelle cohérente sur l’ensemble de la
          saison.
        </Row>

        <div className="mt-14 grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-5">
          {REFERENCES.map((r, i) => (
            <figure
              key={r.name}
              className="overflow-hidden rounded-md border border-line-soft bg-bg2"
            >
              <div
                data-reveal
                data-cursor-media
                className="relative aspect-[4/5] overflow-hidden"
              >
                <Image
                  src={r.src}
                  alt={r.name}
                  fill
                  sizes="(max-width: 768px) 50vw, 230px"
                  quality={90}
                  className="object-cover"
                />
              </div>
              <figcaption className="px-3.5 py-3">
                <span className="t-caps block text-red">{pad(i)}</span>
                <span className="mt-1 block text-[14px] font-semibold leading-tight">
                  {r.name}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </Section>

      {/* ---- 02 · accompagnement ---- */}
      <Section index="02" title="Accompagnement 2027">
        <p className="mb-10 max-w-[40ch] border-l-2 border-red pl-5 text-[clamp(20px,2.2vw,30px)] leading-[1.3] font-medium tracking-[-0.01em]">
          L’accompagnement comprend les 8 événements suivants :
        </p>

        <ol className="grid grid-cols-2 gap-px overflow-hidden rounded-md border border-line bg-line lg:grid-cols-4">
          {EVENTS.map(([date, place], i) => (
            <li
              key={date}
              className="group relative flex min-h-[150px] flex-col bg-bg p-4 transition-colors hover:bg-bg2 md:min-h-[176px] md:p-6"
            >
              <span className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-red transition-transform duration-500 group-hover:scale-x-100" />
              <span className="t-caps text-red">{pad(i)}</span>
              <p className="t-display mt-6 text-[clamp(17px,1.65vw,24px)] leading-[1.1] text-balance">
                {place}
              </p>
              <p className="mt-auto pt-5 text-[15px] font-semibold tabular-nums tracking-[0.04em] text-muted">
                {date}
              </p>
            </li>
          ))}
        </ol>

        <div className="mt-14">
          <Row n={0}>
            Pour chaque événement, la prestation comprend la couverture photo
            de la soirée : artistes, scène, public, ambiance, scénographie,
            backstage, partenaires et temps forts, selon les besoins définis en
            amont.
          </Row>
          <Row n={1}>
            Je livre généralement environ{" "}
            <span className="font-semibold text-ink">
              80 photographies finales retouchées
            </span>{" "}
            par soirée, en haute définition et dans des formats adaptés aux
            réseaux sociaux.
          </Row>
          <Row n={2}>
            Les images sont triées, sélectionnées et retouchées afin de
            conserver une direction artistique cohérente sur l’ensemble des
            événements.
          </Row>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-2.5 md:grid-cols-4">
          {COVERAGE.map((c) => (
            <div
              key={c.src}
              data-reveal
              data-cursor-media
              className="relative aspect-[4/5] overflow-hidden rounded-md"
            >
              <Image
                src={c.src}
                alt={c.alt}
                fill
                sizes="(max-width: 768px) 50vw, 290px"
                quality={90}
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </Section>

      {/* ---- 03 · budget ---- */}
      <Section index="03" title="Budget">
        <div className="flex flex-col gap-2.5">
          {/* tarif standard */}
          <div className="grid gap-5 rounded-md border border-line p-5 md:grid-cols-[3rem_1fr_auto] md:items-center md:gap-8 md:p-7">
            <span className="t-caps text-red">01</span>
            <p className="text-[18px] font-semibold">Tarif standard</p>
            <div className="md:text-right">
              <Amount value="600" unit="€ HT / soirée" />
              <p className="mt-2 text-[14px] text-muted">
                Soit pour 8 dates : <span className="font-semibold">4 800 € HT</span>
              </p>
            </div>
          </div>

          {/* forfait saison — bloc mis en avant */}
          <div className="rounded-md border border-red bg-red/[0.04] p-5 md:p-7">
            <div className="grid gap-5 md:grid-cols-[3rem_1fr_auto] md:items-center md:gap-8">
              <span className="t-caps text-red">02</span>
              <div>
                <p className="text-[18px] font-semibold">
                  Forfait accompagnement saison 2027
                </p>
                <p className="mt-1.5 max-w-[46ch] text-[14px] leading-relaxed text-muted">
                  Dans le cadre d’un engagement sur l’ensemble des 8 événements :
                </p>
              </div>
              <div className="md:text-right">
                <Amount value="4 500" unit="€ HT" />
              </div>
            </div>
            <p className="mt-6 border-t border-red/25 pt-5 text-[14px] leading-relaxed text-ink/80 md:ml-[5rem]">
              Ce forfait comprend l’ensemble des prises de vue, le tri, les
              retouches, les exports et la livraison des photos.
            </p>
          </div>
        </div>
      </Section>

      {/* ---- 04 · VHR ---- */}
      <Section index="04" title="VHR / Frais de déplacement">
        <Row n={0}>
          Les frais de déplacement, transport, hébergement et repas sont pris
          en charge directement par l’organisateur pour chacune des dates
          nécessitant un déplacement.
        </Row>
        <Row n={1}>
          Le cas échéant, ces frais pourront également être avancés puis
          refacturés au réel sur justificatifs.
        </Row>
      </Section>

      {/* ---- total ---- */}
      <section className="mx-auto max-w-[1180px] px-5 pb-28 md:px-8 md:pb-36">
        <div className="flex flex-col gap-8 rounded-md border-2 border-red p-6 md:flex-row md:items-center md:justify-between md:p-10">
          <div>
            <p className="t-caps mb-3 text-red">// 05 · Total</p>
            <p className="text-[clamp(22px,2.4vw,32px)] leading-tight font-semibold">
              8 événements <span className="text-red">–</span>
            </p>
            <p className="mt-2 text-[15px] text-muted">
              + VHR pris en charge par l’organisateur
            </p>
          </div>
          <Amount value="4 500" unit="€ HT" size="xl" />
        </div>
      </section>
    </div>
  );
}
