"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import {
  pad,
  type Img,
  type Project,
} from "@/data/projects";
import { localizePath, type Locale } from "@/i18n/config";
import { getDict } from "@/i18n/dict";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type ProjectDict = ReturnType<typeof getDict>["project"];

/* Vue « global » : image courante centrée en grand, avec un aperçu GRISÉ de
   l'image précédente et suivante qui dépassent à gauche et à droite. Swipe,
   flèches, clavier et clic sur une voisine pour parcourir la série. */
function GlobalGallery({
  images,
  title,
  t,
}: {
  images: Img[];
  title: string;
  t: ProjectDict;
}) {
  const [idx, setIdx] = useState(0);
  const startX = useRef<number | null>(null);
  const dragged = useRef(false);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  const go = (d: number) =>
    setIdx((i) => Math.min(images.length - 1, Math.max(0, i + d)));

  const altFor = (img: Img) =>
    `${title}${img.group ? `, ${img.group}` : ""}`;

  // centre l'image active dans le viewport : les voisines dépassent aux bords.
  useLayoutEffect(() => {
    const vp = viewportRef.current;
    const track = trackRef.current;
    if (!vp || !track) return;
    const measure = () => {
      const slide = track.children[idx] as HTMLElement | undefined;
      if (!slide) return;
      setOffset(vp.clientWidth / 2 - (slide.offsetLeft + slide.offsetWidth / 2));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(vp);
    return () => ro.disconnect();
  }, [idx, images]);

  return (
    <div data-reveal className="select-none">
      {/* scène : hauteur bornée, les voisines débordent (masquées par overflow) */}
      <div
        ref={viewportRef}
        className="touch-pan-y overflow-hidden outline-none"
        tabIndex={0}
        role="region"
        aria-label={t.ariaGallery(title, pad(idx + 1), pad(images.length))}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") go(1);
          if (e.key === "ArrowLeft") go(-1);
        }}
        onPointerDown={(e) => {
          startX.current = e.clientX;
          dragged.current = false;
          (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
        }}
        onPointerUp={(e) => {
          if (startX.current == null) return;
          const d = e.clientX - startX.current;
          startX.current = null;
          dragged.current = Math.abs(d) > 8;
          if (d < -50) go(1);
          else if (d > 50) go(-1);
        }}
        onPointerCancel={() => (startX.current = null)}
      >
        <div
          ref={trackRef}
          className="flex items-center gap-3 md:gap-5"
          style={{
            transform: `translateX(${offset}px)`,
            transition: "transform 650ms cubic-bezier(0.2, 0.8, 0.2, 1)",
          }}
        >
          {images.map((img, i) => {
            const active = i === idx;
            return (
              <button
                type="button"
                key={img.src}
                tabIndex={-1}
                aria-label={t.ariaViewImage(pad(i + 1))}
                aria-current={active}
                onClick={() => {
                  if (dragged.current) return; // ignore le clic après un swipe
                  setIdx(i);
                }}
                className={`relative h-[52vh] shrink-0 cursor-pointer overflow-hidden rounded-md transition-[opacity,filter] duration-500 md:h-[64vh] md:rounded-lg ${
                  active ? "" : "opacity-60 saturate-[.55] hover:opacity-85"
                }`}
                style={{ aspectRatio: `${img.w} / ${img.h}` }}
              >
                <Image
                  src={img.src}
                  alt={altFor(img)}
                  fill
                  sizes="(max-width: 768px) 82vw, 60vw"
                  quality={90}
                  className="pointer-events-none object-cover"
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* contrôles */}
      <div className="mt-5 flex items-center justify-center gap-7">
        <button
          type="button"
          onClick={() => go(-1)}
          disabled={idx === 0}
          aria-label={t.ariaPrev}
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-line text-[15px] text-ink transition-colors hover:border-ink disabled:opacity-25"
        >
          ←
        </button>
        <span className="t-caps w-24 text-center text-muted">
          {pad(idx + 1)}&nbsp;/&nbsp;{pad(images.length)}
        </span>
        <button
          type="button"
          onClick={() => go(1)}
          disabled={idx === images.length - 1}
          aria-label={t.ariaNext}
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-line text-[15px] text-ink transition-colors hover:border-ink disabled:opacity-25"
        >
          →
        </button>
      </div>
    </div>
  );
}

/* Vue « mosaïque » : vraie masonry équilibrée (images à leur ratio, jamais
   recadrées). Chaque image est placée dans la colonne la plus COURTE à cet
   instant (algorithme type Pinterest) → les colonnes gardent des hauteurs
   proches, pas de gros trou d'un côté. Le départage se fait sur la colonne la
   plus à gauche, donc la 1re rangée se lit toujours de gauche à droite. */
function MosaicGallery({
  images,
  title,
  cols,
}: {
  images: Img[];
  title: string;
  /** nombre de colonnes, décidé par le parent (0 avant mesure). */
  cols: number;
}) {
  const n = cols || 2; // avant mesure : 2 colonnes (mobile-first, comme l'original)

  // répartition masonry équilibrée : on parcourt les images DANS L'ORDRE et on
  // pose chacune dans la colonne la plus courte (hauteur relative = ratio h/w,
  // + une constante pour le gap/la légende). Égalité → colonne la plus à gauche,
  // donc la 1re rangée se lit de gauche à droite tout en gardant l'équilibre.
  const columns = useMemo(() => {
    const buckets: Img[][] = Array.from({ length: n }, () => []);
    const heights = new Array(n).fill(0);
    const GAP_RATIO = 0.06; // gap + légende, en fraction de la largeur de colonne
    for (const img of images) {
      let s = 0;
      for (let k = 1; k < n; k++) if (heights[k] < heights[s]) s = k;
      buckets[s].push(img);
      heights[s] += img.h / img.w + GAP_RATIO;
    }
    return buckets;
  }, [images, n]);

  return (
    <div className="flex items-start gap-2.5">
      {columns.map((col, ci) => (
        <div key={ci} className="flex min-w-0 flex-1 flex-col gap-2.5">
          {col.map((img) => (
            <div
              key={img.src}
              data-reveal
              className="group overflow-hidden rounded-md md:rounded-lg"
            >
              <div
                className="relative w-full"
                style={{ aspectRatio: `${img.w} / ${img.h}` }}
              >
                <Image
                  src={img.src}
                  alt={`${title}${img.group ? `, ${img.group}` : ""}`}
                  fill
                  sizes="(max-width: 768px) 46vw, (max-width: 1024px) 31vw, 23vw"
                  quality={90}
                  className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.05]"
                />
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default function ProjectView({
  project,
  index,
  total,
  next,
  locale = "fr",
}: {
  project: Project;
  index: number;
  total: number;
  next: Project;
  locale?: Locale;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const d = getDict(locale);
  const t = d.project;
  const categoryLabels = d.common.categories;

  // groupes (Tomorrowland) ou galerie simple
  const grouped = useMemo(() => {
    const groups = new Map<string | undefined, Img[]>();
    for (const img of project.images) {
      const key = img.group;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(img);
    }
    return [...groups.entries()];
  }, [project.images]);

  const sectionNames = useMemo(
    () => grouped.map(([g]) => g).filter((g): g is string => g != null),
    [grouped]
  );
  const hasSections = sectionNames.length > 1;

  const [view, setView] = useState<"mosaique" | "global">("mosaique");
  // arrivée toujours sur « Tout » (pas sur le premier groupe)
  const [section, setSection] = useState<string>("all");

  // « Tout » : ordre brut du backend (project.images), sans regroupement par
  // catégorie. Une section précise : uniquement les images de ce groupe, dans
  // leur ordre backend.
  const activeImages =
    section === "all"
      ? project.images
      : project.images.filter((img) => img.group === section);

  // nombre de colonnes de la mosaïque (2 / 3 / 4), mesuré sur le conteneur de
  // la galerie. Piloté ICI (et non dans MosaicGallery) pour pouvoir l'ajouter
  // aux dépendances de la révélation : au passage 2 → 4 colonnes, les reveals se
  // recalculent sur la BONNE disposition (sinon des images restent invisibles).
  const galleryRef = useRef<HTMLDivElement>(null);
  const [cols, setCols] = useState(0);
  useLayoutEffect(() => {
    const el = galleryRef.current;
    if (!el) return;
    const update = () => {
      const w = el.clientWidth;
      setCols(w >= 1024 ? 4 : w >= 680 ? 3 : 2);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // --- entête (une seule fois) ---
  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      // le texte monte d'en dessous à l'arrivée
      gsap
        .timeline({ defaults: { ease: "power4.out" } })
        .fromTo(
          "[data-pv-crumb]",
          { opacity: 0, y: -12 },
          { opacity: 1, y: 0, duration: 0.7 },
          0.05
        )
        .fromTo(
          "[data-pv-title]",
          { yPercent: 112 },
          { yPercent: 0, duration: 1.15 },
          0.15
        )
        .fromTo(
          "[data-pv-meta] > div",
          { opacity: 0, y: 26 },
          { opacity: 1, y: 0, duration: 0.8, stagger: 0.08 },
          0.55
        )
        .fromTo(
          "[data-pv-desc]",
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.9 },
          0.75
        );
    },
    { scope: rootRef }
  );

  // --- galerie : re-joue à chaque changement de vue / section / format ---
  useGSAP(
    () => {
      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      // le texte de section change → petit fondu
      const txt = rootRef.current?.querySelector("[data-section-text]");
      if (txt && !reduced) {
        gsap.fromTo(
          txt,
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
        );
      }

      if (!reduced) {
        // révélation « obturateur »
        gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
          const imgs = el.querySelectorAll("img");
          const tl = gsap.timeline({
            scrollTrigger: { trigger: el, start: "top 92%" },
            defaults: { ease: "power3.out" },
          });
          // `round 8px` : les coins restent arrondis PENDANT l'animation
          // (sinon coins carrés qui grandissent → puis saut vers le
          // border-radius arrondi). clearProps rend un repos net.
          tl.fromTo(
            el,
            { clipPath: "inset(10% 5% 10% 5% round 8px)", opacity: 0 },
            {
              clipPath: "inset(0% 0% 0% 0% round 8px)",
              opacity: 1,
              duration: 1,
              clearProps: "clipPath",
            }
          );
          if (imgs.length) {
            tl.fromTo(
              imgs,
              { scale: 1.12 },
              { scale: 1, duration: 1.4, clearProps: "transform" },
              0
            );
          }
        });
      }

      ScrollTrigger.refresh();
    },
    { scope: rootRef, dependencies: [view, section, cols], revertOnUpdate: true }
  );

  return (
    <div ref={rootRef}>
      {/* ---- entête ---- */}
      <section className="px-5 pt-28 pb-10 md:px-8 md:pt-36">
        <p
          data-pv-crumb
          className="t-caps mb-8 flex items-center gap-4 text-muted"
        >
          <Link href={localizePath("/#travail", locale)} className="link-line">
            {t.backWork}
          </Link>
          <span className="text-faint">·</span>
          {t.projectN(pad(index + 1), pad(total))}
          <span className="text-faint">·</span>
          {categoryLabels[project.category]}
        </p>

        <h1 className="t-display max-w-[15ch] text-[clamp(30px,8.5vw,150px)]">
          <span className="-my-[0.12em] block overflow-hidden py-[0.12em]">
            <span data-pv-title className="block">
              {project.title}
            </span>
          </span>
        </h1>

        <div
          data-pv-meta
          className="mt-10 grid grid-cols-2 gap-6 border-t border-line-soft pt-6 md:grid-cols-4"
        >
          <div>
            <p className="t-hud mb-1 text-faint">{t.metaDate}</p>
            <p className="t-hud-md text-ink">{project.date}</p>
          </div>
          <div>
            <p className="t-hud mb-1 text-faint">{t.metaPlace}</p>
            <p className="t-hud-md text-ink">{project.place}</p>
          </div>
          <div>
            <p className="t-hud mb-1 text-faint">{t.metaImages}</p>
            <p className="t-hud-md text-ink">{pad(project.counts.total)}</p>
          </div>
          <div>
            <p className="t-hud mb-1 text-faint">{t.metaLink}</p>
            {project.link ? (
              <a
                href={project.link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="t-hud-md link-line w-fit text-ink"
              >
                {project.link.label.toUpperCase()} ↗
              </a>
            ) : (
              <p className="t-hud-md text-faint">·</p>
            )}
          </div>
        </div>

        <p
          data-pv-desc
          className="mt-10 max-w-2xl text-[15px] leading-relaxed whitespace-pre-line text-muted"
        >
          {project.desc}
        </p>
      </section>

      {/* ---- vidéo : Vimeo (embed), fichier direct, ou placeholder ---- */}
      {project.video && (
        <section className="px-2.5 pb-10">
          <div
            data-reveal
            className="group relative overflow-hidden rounded-md md:rounded-lg"
            style={{ aspectRatio: "16 / 9" }}
          >
            {project.video.vimeo ? (
              <iframe
                src={`https://player.vimeo.com/video/${project.video.vimeo}?title=0&byline=0&portrait=0&dnt=1`}
                title={`${project.title} · aftermovie`}
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 h-full w-full"
              />
            ) : project.video.src ? (
              <video
                src={project.video.src}
                controls
                playsInline
                poster={project.cover.src}
                className="h-full w-full object-cover"
              />
            ) : (
              <>
                <Image
                  src={project.cover.src}
                  alt={project.title}
                  fill
                  sizes="100vw"
                  quality={90}
                  className="scale-105 object-cover blur-[2px] brightness-[0.6]"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 text-center text-white">
                  <span className="flex h-16 w-16 items-center justify-center rounded-full border border-white/70 text-xl">
                    ▶
                  </span>
                  <span
                    className="t-caps-md"
                    style={{ textShadow: "0 1px 10px rgba(0,0,0,.5)" }}
                  >
                    {project.video.label ?? t.videoComing}
                  </span>
                </div>
              </>
            )}
          </div>
        </section>
      )}

      {/* ---- galerie ---- */}
      {!project.video && (
      <section className="px-2.5 py-14">
        {/* barre de contrôle : sections (bulles) + bascule de vue */}
        <div className="mb-8 flex flex-col gap-5 px-1.5 md:flex-row md:items-center md:justify-between">
          {hasSections ? (
            <SlideTabs
              items={[
                { value: "all", label: t.tabAll },
                ...sectionNames.map((n) => ({
                  value: n,
                  label: t.sectionLabels[n] ?? n,
                })),
              ]}
              value={section}
              onChange={setSection}
              variant="chips"
              ariaLabel={t.ariaSections}
            />
          ) : (
            <span className="t-caps text-faint">
              {t.imagesCount(pad(project.counts.total))}
            </span>
          )}

          <SlideTabs
            items={[
              { value: "mosaique", label: t.tabMosaic },
              { value: "global", label: t.tabGlobal },
            ]}
            value={view}
            onChange={(v) => setView(v as "mosaique" | "global")}
            variant="segmented"
            ariaLabel={t.ariaFormat}
          />
        </div>

        {/* texte de présentation qui change selon la section choisie */}
        {hasSections && section !== "all" && t.sectionTexts[section] && (
          <p
            key={section}
            data-section-text
            className="mb-8 max-w-2xl px-1.5 text-[15px] leading-relaxed text-muted"
          >
            {t.sectionTexts[section]}
          </p>
        )}

        <div ref={galleryRef} className="flex flex-col gap-2.5">
          {view === "global" ? (
            <GlobalGallery images={activeImages} title={project.title} t={t} />
          ) : (
            <MosaicGallery
              images={activeImages}
              title={project.title}
              cols={cols}
            />
          )}
        </div>
      </section>
      )}

      {/* ---- projet suivant ---- */}
      {/* projet suivant, texte seul (pas d'image de fond) */}
      <Link
        href={localizePath(`/projets/${next.slug}`, locale)}
        className="group block border-t border-line-soft px-5 py-20 md:px-8"
      >
        <p className="t-caps-md mb-5 text-muted">{t.nextProject}</p>
        <p className="t-display text-[clamp(40px,7.5vw,120px)] text-ink transition-colors group-hover:text-red">
          {next.title}&nbsp;→
        </p>
      </Link>
    </div>
  );
}

/* Onglets avec indicateur noir glissant (mini-animation de switch).
   variant "chips" = bulles ; "segmented" = bascule compacte encadrée. */
function SlideTabs({
  items,
  value,
  onChange,
  variant,
  ariaLabel,
}: {
  items: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
  variant: "chips" | "segmented";
  ariaLabel: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [ind, setInd] = useState({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    ready: false,
  });
  // pas d'animation au 1er rendu : l'indicateur est peint en place par le
  // layout-effect (armed=false), puis on arme la transition pour les clics
  const [armed, setArmed] = useState(false);
  useEffect(() => {
    setArmed(true);
  }, []);

  useLayoutEffect(() => {
    const measure = () => {
      const wrap = wrapRef.current;
      if (!wrap) return;
      const el = [...wrap.querySelectorAll<HTMLElement>("[data-val]")].find(
        (b) => b.dataset.val === value
      );
      if (el)
        setInd({
          left: el.offsetLeft,
          top: el.offsetTop,
          width: el.offsetWidth,
          height: el.offsetHeight,
          ready: true,
        });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [value, items]);

  const seg = variant === "segmented";
  return (
    <div
      ref={wrapRef}
      role="tablist"
      aria-label={ariaLabel}
      className={`relative flex flex-wrap ${
        seg
          ? "shrink-0 gap-0 rounded-full border border-line-soft p-1"
          : "gap-2"
      }`}
    >
      <span
        aria-hidden
        className={`absolute rounded-full bg-ink ${
          armed ? "transition-all duration-300 ease-out" : ""
        }`}
        style={{
          left: ind.left,
          top: ind.top,
          width: ind.width,
          height: ind.height,
          opacity: ind.ready ? 1 : 0,
        }}
      />
      {items.map((it) => {
        const active = it.value === value;
        return (
          <button
            key={it.value}
            type="button"
            role="tab"
            aria-selected={active}
            data-val={it.value}
            onClick={() => onChange(it.value)}
            className={`t-caps relative z-1 rounded-full transition-colors duration-300 ${
              seg ? "px-4 py-1.5" : "border px-4 py-2"
            } ${
              active
                ? `text-bg ${seg ? "" : "border-transparent"}`
                : `text-muted hover:text-ink ${
                    seg ? "" : "border-line-soft"
                  }`
            }`}
          >
            {it.label}
          </button>
        );
      })}
    </div>
  );
}
