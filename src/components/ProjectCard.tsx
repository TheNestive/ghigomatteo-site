"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { pad, type Img, type Project } from "@/data/projects";
import { localizePath, type Locale } from "@/i18n/config";

const MAX_SLIDES = 8;

interface Props {
  project: Project;
  index: number;
  /** locale pour localiser le lien vers la page projet */
  locale?: Locale;
  /** classes de dimensionnement du cadre (hauteur OU largeur) */
  className?: string;
  sizes?: string;
  priority?: boolean;
  /** force le format d'affichage (choisit une image de la bonne
      orientation quand c'est possible) */
  aspect?: "3/4" | "4/3";
  /** affiche toujours la cover choisie du projet (recadrée dans le cadre),
      sans jamais lui substituer une autre image portrait/paysage */
  preferCover?: boolean;
  /** force l'image de cover (prioritaire sur tout le reste) */
  coverSrc?: string;
  /** carte figée : pas de carrousel ni de zoom Ken Burns au survol */
  noHover?: boolean;
  /** carte NON cliquable : rendue en <div> (pas de lien vers le projet) */
  noLink?: boolean;
}

function pickDisplayCover(project: Project, aspect?: "3/4" | "4/3"): Img {
  if (!aspect || project.coverAspect === aspect) return project.cover;
  const want = aspect === "3/4" ? "p" : "l";
  return project.images.find((i) => i.o === want) ?? project.cover;
}

/**
 * Carte projet : image arrondie, nom en surimpression en bas,
 * mini-carrousel au survol, clic → page projet.
 */
export default function ProjectCard({
  project,
  locale = "fr",
  className = "",
  sizes = "60vw",
  priority = false,
  aspect,
  preferCover = false,
  coverSrc,
  noHover = false,
  noLink = false,
}: Props) {
  const [hover, setHover] = useState(false);
  const [armed, setArmed] = useState(false);
  const [idx, setIdx] = useState(0);
  const linkRef = useRef<HTMLAnchorElement>(null);

  // carrousel au survol : uniquement les images marquées `hover` dans
  // /admin ; si aucune n'est marquée, on garde tout le lot (compat)
  const marked = project.images.filter((i) => i.hover);
  const slides = (marked.length ? marked : project.images).slice(0, MAX_SLIDES);
  const displayCover = preferCover
    ? project.cover
    : pickDisplayCover(project, aspect);
  const coverImgSrc = coverSrc ?? displayCover.src;
  const ratio = (aspect ?? project.coverAspect) === "3/4" ? "3 / 4" : "4 / 3";

  useEffect(() => {
    if (!hover || slides.length < 2) return;
    const id = setInterval(() => {
      // les cartes bougent sous un curseur immobile (scroll horizontal) :
      // mouseleave ne se déclenche pas, on re-vérifie le survol réel
      if (linkRef.current && !linkRef.current.matches(":hover")) {
        setHover(false);
        return;
      }
      setIdx((i) => (i + 1) % slides.length);
    }, 1500);
    return () => clearInterval(id);
  }, [hover, slides.length]);

  const wrapClass = `relative block shrink-0 overflow-hidden rounded-md bg-bg2 md:rounded-lg ${
    noHover ? "" : "group"
  } ${className}`;

  const inner = (
    <>
      {/* Calque Ken Burns : c'est LUI qui zoome (en continu au survol), pas
          les images, sinon le zoom repartirait de zéro à chaque changement */}
      <div className="gm-kenburns absolute inset-0">
        {/* Cover, reste visible sous le carrousel */}
        <Image
          src={coverImgSrc}
          alt={project.title}
          fill
          sizes={sizes}
          quality={90}
          priority={priority}
          className="object-cover"
        />

        {/* Carrousel de survol : simple fondu, le zoom vient du calque */}
        {armed &&
          slides.map((img, i) => (
            <Image
              key={img.src}
              src={img.src}
              alt=""
              fill
              sizes={sizes}
              quality={90}
              className="object-cover transition-opacity duration-300"
              style={{
                opacity: hover && i === idx ? 1 : 0,
                zIndex: 1,
              }}
            />
          ))}
      </div>

      {/* Nom centré en bas, façon galerie */}
      <span
        className="t-display absolute bottom-4 left-1/2 z-3 -translate-x-1/2 text-center text-[clamp(15px,1.5vw,24px)] whitespace-nowrap text-white"
        style={{
          textShadow:
            "0 1px 3px rgba(0,0,0,.55), 0 2px 20px rgba(0,0,0,.45)",
        }}
      >
        <span className="text-red">//</span>&nbsp;{project.label}
      </span>

      {/* compteur du carrousel */}
      <span
        className="t-caps absolute right-4 bottom-4.5 z-3 text-white/85 transition-opacity duration-300"
        style={{
          opacity: hover && slides.length > 1 ? 1 : 0,
          textShadow: "0 1px 8px rgba(0,0,0,.5)",
        }}
      >
        {pad(idx + 1)}&nbsp;/&nbsp;{pad(slides.length)}
      </span>
    </>
  );

  // carte NON cliquable (grille) : simple <div>, aucun lien
  if (noLink) {
    return (
      <div className={wrapClass} style={{ aspectRatio: ratio }}>
        {inner}
      </div>
    );
  }

  return (
    <Link
      ref={linkRef}
      href={localizePath(`/projets/${project.slug}`, locale)}
      data-cursor-media
      className={wrapClass}
      style={{ aspectRatio: ratio }}
      onPointerEnter={(e) => {
        // carte figée (grille) : pas de carrousel
        if (noHover) return;
        // tactile : le tap doit rester une pure navigation
        if (e.pointerType !== "mouse") return;
        setArmed(true);
        setIdx(0);
        setHover(true);
      }}
      onPointerLeave={() => setHover(false)}
      aria-label={project.title}
    >
      {inner}
    </Link>
  );
}
