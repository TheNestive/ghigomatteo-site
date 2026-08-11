"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import ProjectCard from "./ProjectCard";
import type { Project } from "@/data/projects";
import { localizePath, type Locale } from "@/i18n/config";
import { getDict } from "@/i18n/dict";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export interface GridItem {
  project: Project;
  aspect: "3/4" | "4/3";
  /** cover forcée (ex. version horizontale fournie) */
  coverSrc?: string;
}

/**
 * Grille éditoriale en 2 colonnes décalées, orientations mixtes h/v
 * définies explicitement (quinconce 2h+1v / 2v+1h). La colonne de droite
 * défile un peu plus vite (parallaxe). Mobile : une seule colonne.
 */
export default function VerticalGallery({
  items,
  startIndex,
  locale = "fr",
}: {
  items: GridItem[];
  startIndex: number;
  locale?: Locale;
}) {
  const wrapRef = useRef<HTMLElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const t = getDict(locale).home;
  const lp = (p: string) => localizePath(p, locale);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const colA = items.filter((_, i) => i % 2 === 0);
  const colB = items.filter((_, i) => i % 2 === 1);

  useGSAP(
    () => {
      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (reduced) return;

      if (!isMobile) {
        gsap.to("[data-col='b']", {
          y: () => -(window.innerHeight * 0.35),
          ease: "none",
          scrollTrigger: {
            trigger: wrapRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.2,
            invalidateOnRefresh: true,
          },
        });
      }

      // révélation type obturateur : le cadre s'ouvre, l'image dé-zoome
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        const img = el.querySelector("img");
        const tl = gsap.timeline({
          scrollTrigger: { trigger: el, start: "top 88%" },
          defaults: { ease: "power3.out" },
        });
        tl.fromTo(
          el,
          { clipPath: "inset(12% 6% 12% 6% round 8px)", opacity: 0 },
          {
            clipPath: "inset(0% 0% 0% 0% round 8px)",
            opacity: 1,
            duration: 1.1,
            clearProps: "clipPath",
          }
        );
        if (img) {
          tl.fromTo(
            img,
            { scale: 1.18 },
            { scale: 1, duration: 1.5, clearProps: "transform" },
            0
          );
        }
      });
    },
    { scope: wrapRef, dependencies: [isMobile] }
  );

  // bloc texte qui occupe le vide en fin de colonne droite.
  // Mobile : filet de séparation + marge → clairement « à part », pas collé à
  // la dernière photo. Desktop : intégré dans la colonne (pas de filet).
  const aboutBlock = (
    <div className="mt-8 flex flex-col justify-center border-t border-line-soft px-1.5 pt-16 pb-10 md:mt-0 md:min-h-[60vh] md:max-w-lg md:border-0 md:px-6 md:py-10">
      <p className="t-caps mb-6 text-faint">{t.aboutKicker}</p>
      <p className="text-[clamp(19px,2vw,26px)] leading-snug text-ink">
        {t.aboutLead}
      </p>
      <p className="mt-6 max-w-md text-[15px] leading-relaxed text-muted">
        {t.aboutBody}
      </p>
      <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
        <Link href={lp("/travaille")} className="t-caps-md link-line text-ink">
          {t.howIWork}
        </Link>
        <Link href={lp("/contact")} className="t-caps-md link-line text-ink">
          {t.contactMe}
        </Link>
      </div>
    </div>
  );

  // Mobile : le MÊME texte, mais sorti de la grille pour devenir une SECTION
  // autonome, à part entière → impossible qu'il se superpose à une image.
  const aboutMobile = (
    <section className="border-t border-line-soft px-5 pt-14 pb-16">
      <p className="t-caps mb-6 text-faint">{t.aboutKicker}</p>
      <p className="text-[clamp(20px,5.4vw,24px)] leading-snug text-ink">
        {t.aboutLead}
      </p>
      <p className="mt-6 max-w-md text-[15px] leading-relaxed text-muted">
        {t.aboutBody}
      </p>
      <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
        <Link href={lp("/travaille")} className="t-caps-md link-line text-ink">
          {t.howIWork}
        </Link>
        <Link href={lp("/contact")} className="t-caps-md link-line text-ink">
          {t.contactMe}
        </Link>
      </div>
    </section>
  );

  const card = (it: GridItem, globalIdx: number) => (
    <div key={it.project.slug + globalIdx} data-reveal className="w-full">
      <ProjectCard
        project={it.project}
        index={globalIdx}
        aspect={it.aspect}
        coverSrc={it.coverSrc}
        noHover
        noLink
        sizes="(max-width: 768px) 96vw, 60vw"
        className="w-full"
      />
    </div>
  );

  return (
    <>
      <section ref={wrapRef} className="relative px-2.5 pt-2.5 pb-4">
        <div className="mx-1.5 mb-3 flex items-baseline justify-between pt-2">
          <h2 className="t-caps text-muted">{t.suiteTitle}</h2>
          <span className="t-caps text-faint">
            {t.projectsCount(String(items.length).padStart(2, "0"))}
          </span>
        </div>

        {isMobile ? (
          /* Mobile : ordre séquentiel, une colonne (le texte est en dessous,
             dans sa propre section) */
          <div className="flex flex-col gap-2.5">
            {items.map((it, i) => card(it, startIndex + i))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2.5">
            {/* colonne gauche = 2h + 1v (plus courte) → le bloc texte comble
                l'écart de hauteur avec la colonne droite (2v + 1h) */}
            <div className="flex flex-col gap-2.5">
              {colA.map((it, i) => card(it, startIndex + i * 2))}
              {aboutBlock}
            </div>
            <div data-col="b" className="mt-[10vh] flex flex-col gap-2.5">
              {colB.map((it, i) => card(it, startIndex + i * 2 + 1))}
            </div>
          </div>
        )}
      </section>

      {/* Mobile uniquement : le bloc « qui suis-je » en section séparée. */}
      {isMobile && aboutMobile}
    </>
  );
}
