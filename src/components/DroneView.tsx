"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { usePageReveals } from "@/lib/usePageReveals";
import ContactCta from "./ContactCta";

const PRESTATIONS = [
  {
    title: "Événementiel",
    text: "En événementiel, le drone permet de montrer l’énergie de l’ensemble. Les foules, les mouvements, l’architecture du lieu, l’ampleur de la scène. C’est une manière de raconter ce que l’œil ne peut pas saisir depuis le sol : l’instant dans sa globalité.",
    img: "/site/drone/1.webp",
    exemple: { label: "DJ Snake x Netflix", href: "/projets/dj-snake" },
  },
  {
    title: "Lieux & Immobilier",
    text: "Pour l’architecture, l’hôtellerie, l’immobilier ou la valorisation d’un espace, le drone met en avant les volumes, les lignes, la relation du lieu avec son environnement. Il permet d’avoir une image claire, structurée, élégante, et surtout compréhensible d’un seul regard.",
    img: "/photos/lifestyle/ibiza/COVER__IBIZA-19-scaled.jpg",
    exemple: { label: "Ibiza estate", href: "/projets/ibiza" },
  },
  {
    title: "Nature & Paysages",
    text: "Dans la nature, le drone ouvre la scène. Il révèle ce qui dépasse notre échelle : les textures du terrain, les courbes, les couleurs, le mouvement de l’eau ou du vent. C’est une manière de montrer la beauté d’un lieu sans l’interrompre.",
    img: "/site/drone/ITALIEW.webp",
    exemple: { label: "Vulcano, en Sicile", href: "/projets/italie" },
  },
];

export default function DroneView() {
  const rootRef = useRef<HTMLDivElement>(null);
  usePageReveals(rootRef);

  return (
    <div ref={rootRef}>
      {/* ---- cover (vue aérienne, plein cadre tout en haut) ---- */}
      <section
        data-header-light
        className="relative h-[76vh] w-full overflow-hidden md:h-[92vh]"
      >
        <Image
          src="/site/drone/cover-garo.jpg"
          alt="Vue aérienne au drone d'un festival de nuit, foule immense sous les lumières"
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
          Prises de vue aériennes
        </p>
        <h1 className="t-display text-[clamp(44px,9vw,150px)]">
          <span className="-my-[0.12em] block overflow-hidden py-[0.12em]">
            <span data-fx-title className="block">
              Drone
            </span>
          </span>
        </h1>

        <div className="mt-12 grid gap-10 border-t border-line-soft pt-8 md:grid-cols-2">
          <p data-fx-lead className="max-w-xl text-[17px] leading-relaxed text-ink">
            Je suis <strong>télépilote pro certifié</strong> pour l’usage de
            drones en France et à l’international. Cela me permet de réaliser
            des prises de vue aériennes en toute <strong>sécurité</strong>,
            dans le <strong>respect des réglementations</strong> en vigueur,
            y compris en zones contrôlées et lors d’événements.
          </p>
          <p data-fx-lead className="max-w-xl text-[15px] leading-relaxed text-muted">
            Le drone permet de raconter autrement : prendre de la hauteur,
            dévoiler l’ampleur d’un lieu, d’un public, d’une ambiance ou
            d’un paysage. C’est une perspective qui donne de l’espace et une
            nouvelle façon de ressentir la scène.
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
            alt="Vue aérienne au drone"
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
          <h2 className="t-caps-md text-ink">Mes prestations drone</h2>
          <span className="t-caps text-faint">03</span>
        </div>
        <p className="mx-2.5 mb-14 max-w-2xl text-[15px] leading-relaxed text-muted md:mx-5">
          De la fluidité cinématique à l’intensité du FPV, j’utilise les deux
          types de drones pour créer des images aériennes qui mêlent
          précision, énergie et émotion, au service de chaque projet.
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
                  Prestation {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="t-display mb-5 text-[clamp(24px,3vw,44px)] text-ink">
                  {p.title}
                </h3>
                <p className="mb-6 max-w-md text-[15px] leading-relaxed text-muted">
                  {p.text}
                </p>
                <Link
                  href={p.exemple.href}
                  className="t-caps-md link-line text-ink"
                >
                  Voir&nbsp;: {p.exemple.label}&nbsp;→
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <ContactCta />
    </div>
  );
}
