"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import ProjectCard from "./ProjectCard";
import { pad, type Project } from "@/data/projects";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Arrivée directe sur les images, en très grand.
 * Desktop : section épinglée, le scroll vertical translate la bande.
 * Mobile : PAS d'épinglage (créait une immense zone de scroll « vide » et des
 * chevauchements au relâchement du pin). À la place, un carrousel natif à
 * swipe (scroll-snap), cartes visibles d'emblée.
 */
export default function HorizontalGallery({
  featured,
}: {
  featured: Project[];
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Desktop : largeur des cartes basée sur la zone RÉELLEMENT visible (hors
  // barre de défilement) pour que la marge de droite soit identique à gauche.
  useEffect(() => {
    if (isMobile) return;
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;
    const setW = () => {
      // 3 cartes + 10px de marge de chaque côté + 2 × 10px d'espacement
      const w = (section.clientWidth - 40) / 3;
      track.style.setProperty("--card-w", `${w}px`);
    };
    setW();
    window.addEventListener("resize", setW);
    return () => window.removeEventListener("resize", setW);
  }, [isMobile]);

  // Garde en DIRECT (pas l'état `isMobile`, encore false au 1er rendu) : ni le
  // pin ni l'entrée ne s'exécutent sur mobile. Sans ça, un pin fantôme
  // (spacer ~1800px = la « bande vide ») serait créé puis jamais nettoyé.
  const isMobileViewport = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(max-width: 767px)").matches;

  // --- entrée en scène (desktop) : hook SANS dépendances → joue UNE fois au
  //     montage. (Fusionné avec le hook du pin piloté par `isMobile`, ce tween
  //     différé était tué avant de jouer → cartes restées à opacity 0.) ---
  useGSAP(
    () => {
      if (isMobileViewport()) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const track = trackRef.current!;
      // attend la fin de l'intro « nom qui s'écrit » au tout premier chargement
      const introDelay = sessionStorage.getItem("gm_intro_seen") ? 0.15 : 2.15;
      const cards = track.querySelectorAll("a[href^='/projets/']");
      gsap.fromTo(
        cards,
        { x: 110, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1.2,
          stagger: 0.08,
          ease: "power4.out",
          delay: introDelay,
        }
      );
    },
    { scope: sectionRef }
  );

  // --- bande épinglée (desktop) : le scroll vertical translate le track ---
  useGSAP(
    () => {
      if (isMobileViewport()) return;

      const track = trackRef.current!;
      const section = sectionRef.current!;
      // largeur visible RÉELLE (hors barre de défilement) : sinon le track
      // s'arrête trop tôt et la dernière carte reste coupée à droite
      const dist = () => track.scrollWidth - section.clientWidth;

      const tween = gsap.to(track, {
        x: () => -dist(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${dist()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            if (barRef.current) {
              barRef.current.style.transform = `scaleX(${self.progress})`;
            }
            if (countRef.current) {
              const n = Math.min(
                featured.length,
                1 + Math.floor(self.progress * featured.length)
              );
              countRef.current.textContent = `${pad(n)} / ${pad(
                featured.length
              )}`;
            }
          },
        },
      });

      // Navigation clavier : quand une carte hors écran reçoit le focus,
      // on annule le scroll fantôme du conteneur épinglé et on saute à la
      // position de scroll correspondante.
      const onFocusIn = (e: FocusEvent) => {
        const card = (e.target as HTMLElement).closest<HTMLElement>(
          "a[href^='/projets/']"
        );
        if (!card) return;
        // ⚠️ uniquement au focus CLAVIER (Tab). Au CLIC souris, la carte reçoit
        // aussi le focus mais on ne veut PAS ce saut de scroll (il décalait la
        // bande juste avant la transition de page).
        if (!card.matches(":focus-visible")) return;
        section.scrollLeft = 0;
        const st = tween.scrollTrigger;
        if (!st) return;
        const ratio = card.offsetLeft / Math.max(1, dist());
        st.scroll(st.start + Math.min(1, ratio) * (st.end - st.start));
      };
      section.addEventListener("focusin", onFocusIn);
      return () => section.removeEventListener("focusin", onFocusIn);
    },
    { scope: sectionRef, dependencies: [isMobile] }
  );

  // Mobile : le carrousel natif alimente la barre de progression + le compteur.
  useEffect(() => {
    if (!isMobile || !countRef.current) return;
    countRef.current.textContent = `${pad(1)} / ${pad(featured.length)}`;
  }, [isMobile, featured.length]);

  const onMobileScroll = () => {
    const track = trackRef.current;
    if (!track) return;
    const max = track.scrollWidth - track.clientWidth;
    const p = max > 0 ? track.scrollLeft / max : 0;
    if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;
    if (countRef.current) {
      const n = Math.min(
        featured.length,
        1 + Math.round(p * (featured.length - 1))
      );
      countRef.current.textContent = `${pad(n)} / ${pad(featured.length)}`;
    }
  };

  return (
    <section
      ref={sectionRef}
      id="travail"
      data-header-light
      className={`relative overflow-hidden ${
        isMobile ? "h-[86svh]" : "h-[100svh]"
      }`}
    >
      <h1 className="sr-only">Ghigo Matteo · Photographe</h1>

      {/* pleine hauteur : les images occupent tout l'écran, le header
          flotte par-dessus. Mobile : swipe horizontal natif (scroll-snap). */}
      <div
        ref={trackRef}
        onScroll={isMobile ? onMobileScroll : undefined}
        data-lenis-prevent={isMobile ? "" : undefined}
        className={
          isMobile
            ? "flex h-full snap-x snap-mandatory gap-2.5 overflow-x-auto overflow-y-hidden p-2.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            : "flex h-full items-stretch gap-2.5 p-2.5 will-change-transform"
        }
        style={
          isMobile
            ? undefined
            : ({ "--card-w": "calc((100vw - 40px) / 3)" } as React.CSSProperties)
        }
      >
        {featured.map((p, i) => (
          <ProjectCard
            key={p.slug}
            project={p}
            index={i}
            priority={i < 2}
            aspect="3/4"
            preferCover
            sizes="(max-width: 768px) 86vw, 34vw"
            // mobile : ~pleine largeur, aperçu de la suivante pour inviter au
            // swipe (snap) ; desktop : 3 cartes translatées par le pin.
            className={
              isMobile
                ? "h-full w-[86vw] snap-start"
                : "h-full w-[90vw] md:w-[var(--card-w)]"
            }
          />
        ))}
      </div>

      {/* progression, réduite à un filet */}
      <div className="absolute inset-x-0 bottom-0 z-10 h-[2px]">
        <div
          ref={barRef}
          className="h-full origin-left bg-red"
          style={{ transform: "scaleX(0)" }}
        />
      </div>

      {/* compteur discret, en surimpression */}
      <span
        ref={countRef}
        className="t-caps absolute bottom-4 left-4 z-10 text-white/90"
        style={{ textShadow: "0 1px 8px rgba(0,0,0,.5)" }}
      >
        01
      </span>
    </section>
  );
}
