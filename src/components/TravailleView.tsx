"use client";

import Image from "next/image";
import { useRef } from "react";
import { usePageReveals } from "@/lib/usePageReveals";
import BeforeAfter from "./BeforeAfter";
import ContactCta from "./ContactCta";

const ETAPES = [
  {
    img: "/site/accueil/TAYCPC-1.jpg",
    label: "Choix et retouche de la photo 1",
  },
  {
    img: "/site/accueil/TAYCPC-2.jpg",
    label: "Choix et retouche de la photo 2",
  },
  {
    img: "/site/accueil/TAYCPC-5.jpg",
    label: "Détourage et placement des éléments",
  },
  {
    img: "/site/accueil/TAYCPC-6.jpg",
    label: "Compositing et ajout des effets finaux",
  },
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

export default function TravailleView() {
  const rootRef = useRef<HTMLDivElement>(null);
  usePageReveals(rootRef);

  return (
    <div ref={rootRef}>
      {/* ---- entête ---- */}
      <section className="px-5 pt-28 pb-16 md:px-8 md:pt-36">
        <p data-fx-crumb className="t-caps mb-8 text-muted">
          Ma méthode
        </p>
        <h1 className="t-display max-w-[14ch] text-[clamp(40px,7.5vw,120px)]">
          <span className="-my-[0.12em] block overflow-hidden py-[0.12em]">
            <span data-fx-title className="block">
              Comment je travaille
            </span>
          </span>
        </h1>

        <p
          data-fx-lead
          className="mt-12 max-w-4xl text-[clamp(22px,3.2vw,40px)] leading-tight text-ink"
        >
          Ma façon de faire dépendra de{" "}
          <span className="text-red">votre projet</span> et de{" "}
          <span className="text-red">notre vision</span> des choses.
        </p>

        <div className="mt-12 grid gap-10 border-t border-line-soft pt-8 md:grid-cols-2">
          <p data-fx-lead className="max-w-xl text-[16px] leading-relaxed text-ink">
            <strong>Ma signature, c’est le travail en post-production.</strong>{" "}
            J’utilise souvent la double exposition, des superpositions et des
            textures pour donner une dimension plus profonde à la scène. Ce
            n’est pas un effet posé par-dessus : c’est ma manière de
            représenter la mémoire d’un moment, ce qui reste après, ce que
            l’on ressent encore quand tout est terminé.
          </p>
          <p data-fx-lead className="max-w-xl text-[15px] leading-relaxed text-muted">
            On ne se souvient jamais d’un concert de façon nette. On se
            souvient d’une ambiance, d’une silhouette, d’une lumière qui
            traverse la fumée. Une image qui ne documente pas juste
            l’événement, mais qui en prolonge l’émotion.
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
              alt="Portrait de Matteo Ghigo"
              fill
              sizes="(max-width: 768px) 98vw, 42vw"
              quality={90}
              className="object-cover"
            />
          </div>
          <div className="px-2.5 md:col-span-3 md:px-0 md:pr-8 md:pl-5">
            <p className="t-caps mb-4 text-faint">01 · Qui suis-je</p>
            <p className="max-w-xl text-[17px] leading-relaxed text-ink">
              Je suis photographe professionnel de 24 ans, et télépilote de
              drone certifié. Je travaille depuis la France, mais mon
              appareil voyage avec moi.
            </p>
            <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-muted">
              Que ce soit sur scène, en backstage ou en déplacement,
              j’accompagne les projets partout dans le monde.
            </p>
          </div>
        </div>
      </section>

      {/* ---- pendant le shooting ---- */}
      <section className="px-2.5 pb-20">
        <div className="grid items-center gap-6 md:grid-cols-5 md:gap-10">
          <div className="order-2 px-2.5 md:order-1 md:col-span-2 md:px-0 md:pl-8">
            <p className="t-caps mb-4 text-faint">02 · Pendant le shooting</p>
            <p className="max-w-md text-[16px] leading-relaxed text-ink">
              Pendant le shoot, je travaille avec du matériel adapté aux
              scènes rapides et aux lumières changeantes, mais le plus
              important reste <strong>l’instant</strong>.
            </p>
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-muted">
              Je me déplace, j’observe et je déclenche. S’il y a une scène,
              des artistes, des membres d’équipe, je prends le temps de
              m’adapter à leur rythme et à leur dynamique.
            </p>
          </div>
          <div
            data-reveal
            className="order-1 relative overflow-hidden rounded-md md:order-2 md:col-span-3 md:rounded-lg"
            style={{ aspectRatio: "16 / 9" }}
          >
            <Image
              src="/site/accueil/shooting-studio.webp"
              alt="En studio pendant un shooting"
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
          <SectionHead n="03" title="Avant / Après · Editing" />
          <p className="mb-10 max-w-2xl text-[15px] leading-relaxed text-muted">
            Je commence par <strong className="text-ink">Lightroom</strong>.
            C’est là que j’équilibre la lumière, les couleurs, les
            contrastes, que je donne une base cohérente à la série. Ensuite,
            je passe sur <strong className="text-ink">Photoshop</strong>.
            C’est là que mon style s’exprime vraiment.
          </p>
        </div>
        <div className="mx-auto max-w-135">
          <div data-reveal>
            <BeforeAfter
              before="/site/accueil/theodora-avant.webp"
              after="/site/accueil/theodora-apres.webp"
              aspect="2 / 3"
              sizes="(max-width: 768px) 96vw, 40vw"
            />
          </div>
          <p className="t-caps mt-4 text-center text-faint">
            Fais glisser pour comparer
          </p>
        </div>
      </section>

      {/* ---- le processus ---- */}
      <section className="px-2.5 pb-20">
        <div className="mx-2.5 md:mx-5">
          <SectionHead n="04" title="Le processus de création" />
          <p className="mb-10 max-w-2xl text-[15px] leading-relaxed text-muted">
            J’utilise la double exposition, les superpositions et les
            textures pour donner de la profondeur à l’image. L’idée n’est
            pas de «&nbsp;rajouter un effet&nbsp;», mais de retrouver la
            sensation du moment. Je travaille chaque image une par une,
            jusqu’à ce qu’elle soit équilibrée, vivante, et qu’elle porte
            l’émotion de ce qui a été vécu.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2.5 md:grid-cols-4">
          {ETAPES.map((e, i) => (
            <figure key={e.img} data-reveal>
              <div
                className="relative overflow-hidden rounded-md md:rounded-lg"
                style={{ aspectRatio: "4 / 5" }}
              >
                <Image
                  src={e.img}
                  alt={`Étape ${i + 1} · ${e.label}`}
                  fill
                  sizes="(max-width: 768px) 49vw, 25vw"
                  quality={90}
                  className="object-cover"
                />
              </div>
              <figcaption className="pt-3">
                <p className="t-caps text-red">
                  Étape {String(i + 1).padStart(2, "0")}
                </p>
                <p className="t-caps mt-1.5 text-muted">{e.label}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* ---- livraison ---- */}
      <section className="px-5 pb-24 md:px-8">
        <SectionHead n="05" title="Fin de projet & Livraison" />
        <div className="grid gap-10 md:grid-cols-2">
          <p className="max-w-xl text-[16px] leading-relaxed text-ink">
            Une fois les photos prêtes, j’envoie un{" "}
            <strong>lien privé</strong> vers une page dédiée sur mon site.
            Vous pouvez y visionner toutes les images, faire votre sélection
            et les télécharger en haute définition, directement.
          </p>
          <p className="max-w-xl text-[15px] leading-relaxed text-muted">
            La galerie peut être partagée facilement avec votre équipe ou
            vos partenaires. Tout est centralisé, clair, et disponible quand
            vous en avez besoin.
          </p>
        </div>
      </section>

      <ContactCta />
    </div>
  );
}
