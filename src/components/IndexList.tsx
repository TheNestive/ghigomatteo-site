"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import {
  CATEGORY_LABELS,
  INDEX_COLLAPSED,
  pad,
  type Project,
} from "@/data/projects";

/**
 * Index complet des projets : lignes typographiques,
 * aperçu de la cover qui suit le curseur au survol.
 */
export default function IndexList({ items }: { items: Project[] }) {
  const [active, setActive] = useState<Project | null>(null);
  const [expanded, setExpanded] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const rootRef = useRef<HTMLElement>(null);

  const visible = expanded ? items : items.slice(0, INDEX_COLLAPSED);
  const hiddenCount = items.length - INDEX_COLLAPSED;

  // entrée en cascade des lignes visibles au premier passage
  useGSAP(
    () => {
      if (
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        return;
      }
      gsap.utils
        .toArray<HTMLElement>("[data-index-row]")
        .forEach((el) => {
          gsap.fromTo(
            el,
            { opacity: 0, y: 28 },
            {
              opacity: 1,
              y: 0,
              duration: 0.85,
              ease: "power3.out",
              scrollTrigger: { trigger: el, start: "top 94%" },
            }
          );
        });
    },
    { scope: rootRef }
  );

  const onMove = (e: React.MouseEvent) => {
    const el = previewRef.current;
    if (!el) return;
    el.style.transform = `translate(${e.clientX + 24}px, ${
      e.clientY - el.offsetHeight / 2
    }px)`;
  };

  return (
    <section
      ref={rootRef}
      className="relative px-5 py-28 md:px-8"
      onMouseMove={onMove}
    >
      <div className="mb-12 flex items-baseline justify-between border-t border-line-soft pt-5">
        <h2 className="t-caps-md text-ink">Index · Tous les projets</h2>
        <span className="t-caps text-faint">
          {String(items.length).padStart(2, "0")}
        </span>
      </div>

      <ol>
        {visible.map((p, i) => (
          <li key={p.slug} data-index-row>
            <Link
              href={`/projets/${p.slug}`}
              className="group flex items-baseline gap-4 border-b border-line-soft py-4 transition-colors hover:border-line md:gap-8"
              onMouseEnter={() => setActive(p)}
              onMouseLeave={() => setActive(null)}
            >
              <span className="t-hud w-8 shrink-0 text-faint">
                {pad(i + 1)}
              </span>
              <span className="t-display text-[clamp(22px,3.4vw,52px)] text-ink transition-colors group-hover:text-red">
                {p.title}
              </span>
              <span className="t-hud hidden shrink-0 text-faint md:ml-auto md:inline">
                {CATEGORY_LABELS[p.category].toUpperCase()}
              </span>
              <span className="t-hud ml-auto w-20 shrink-0 text-right text-muted md:ml-0">
                {p.year}
              </span>
            </Link>
          </li>
        ))}
      </ol>

      {/* Voir plus / voir moins */}
      {hiddenCount > 0 && (
        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={() => {
              setExpanded((e) => !e);
              requestAnimationFrame(() => ScrollTrigger.refresh());
            }}
            className="t-caps-md cursor-pointer rounded-md border border-line px-8 py-3.5 text-ink transition-colors hover:border-red hover:text-red"
          >
            {expanded
              ? "VOIR MOINS ↑"
              : `VOIR PLUS · ${hiddenCount} AUTRES PROJETS ↓`}
          </button>
        </div>
      )}

      {/* Aperçu flottant */}
      <div
        ref={previewRef}
        className="pointer-events-none fixed left-0 top-0 z-50 hidden md:block"
        style={{
          opacity: active ? 1 : 0,
          transition: "opacity .25s ease",
        }}
      >
        {active && (
          <div
            className="relative w-[22vw] max-w-90 overflow-hidden rounded-lg"
            style={{
              aspectRatio: active.coverAspect === "3/4" ? "3 / 4" : "4 / 3",
            }}
          >
            <Image
              src={active.cover.src}
              alt=""
              fill
              sizes="22vw"
              className="object-cover"
            />
            <span
              className="t-caps absolute bottom-2.5 left-2.5 text-white"
              style={{ textShadow: "0 1px 8px rgba(0,0,0,.55)" }}
            >
              <span className="text-red">//</span> {active.label}
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
