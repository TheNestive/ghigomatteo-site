"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { localizePath, localeFromPathname } from "@/i18n/config";
import { getDict } from "@/i18n/dict";

/**
 * Header épuré : nom centré, navigation aux extrémités.
 * Chaque bloc de texte choisit noir ou blanc selon la luminosité RÉELLE
 * du fond juste derrière lui (échantillonnage pixel), toujours lisible,
 * sans toucher le fond, sans ombre, sans inversion de couleur.
 */
export default function Header() {
  const ref = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const locale = localeFromPathname(pathname);
  const t = getDict(locale).header;
  const lp = (p: string) => localizePath(p, locale);
  const NAV_LINKS = [
    { href: lp("/#travail"), label: t.navTravail },
    { href: lp("/drone"), label: t.navDrone },
    { href: lp("/travaille"), label: t.navMethode },
    { href: lp("/lastwork"), label: t.navLastwork },
    { href: lp("/contact"), label: t.navContact },
  ];

  // ferme le menu à la navigation
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // bloque le scroll du body quand le menu plein écran est ouvert
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    const header = ref.current;
    if (!header) return;
    const blur = document.querySelector<HTMLElement>(".header-blur");
    const clusters = [
      ...header.querySelectorAll<HTMLElement>("[data-h-cluster]"),
    ];
    const canvas = document.createElement("canvas");
    canvas.width = 6;
    canvas.height = 6;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });

    // luminosité perçue (0 = noir, 1 = blanc)
    const relLum = (r: number, g: number, b: number) =>
      (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;

    // luminosité du pixel d'une image (object-fit: cover) sous (x, y)
    const sampleImage = (
      img: HTMLImageElement,
      x: number,
      y: number
    ): number | null => {
      const rect = img.getBoundingClientRect();
      const nw = img.naturalWidth;
      const nh = img.naturalHeight;
      if (!nw || !nh || !ctx) return null;
      const scale = Math.max(rect.width / nw, rect.height / nh);
      const dw = nw * scale;
      const dh = nh * scale;
      let ix = (x - rect.left - (rect.width - dw) / 2) / scale;
      let iy = (y - rect.top - (rect.height - dh) / 2) / scale;
      ix = Math.max(0, Math.min(nw - 6, ix - 3));
      iy = Math.max(0, Math.min(nh - 6, iy - 3));
      try {
        ctx.drawImage(img, ix, iy, 6, 6, 0, 0, 6, 6);
        const d = ctx.getImageData(0, 0, 6, 6).data;
        let s = 0;
        let n = 0;
        for (let i = 0; i < d.length; i += 4) {
          s += relLum(d[i], d[i + 1], d[i + 2]);
          n++;
        }
        return n ? s / n : null;
      } catch {
        return null; // image cross-origin non lisible → fallback
      }
    };

    // luminosité du fond sous (x, y)
    const bgLum = (x: number, y: number): number => {
      const el = document.elementFromPoint(x, y);
      if (!el) return 1;
      const img =
        el.tagName === "IMG"
          ? (el as HTMLImageElement)
          : el.querySelector?.("img");
      if (img) {
        const l = sampleImage(img as HTMLImageElement, x, y);
        if (l != null) return l;
      }
      // sinon : première couleur de fond opaque en remontant
      let n: Element | null = el;
      while (n) {
        const bg = getComputedStyle(n).backgroundColor;
        const m = bg.match(/rgba?\(([^)]+)\)/);
        if (m) {
          const p = m[1].split(",").map((v) => parseFloat(v));
          const a = p[3] ?? 1;
          if (a > 0.5) return relLum(p[0], p[1], p[2]);
        }
        n = n.parentElement;
      }
      return 1; // par défaut : fond clair → texte noir
    };

    // mémoire de l'état pour l'hystérésis (évite le clignotement sur les
    // fonds à fort contraste)
    const state = new WeakMap<HTMLElement, "dark" | "light">();

    const update = () => {
      // on masque le header aux clics le temps de lire ce qu'il y a dessous
      const prevH = header.style.pointerEvents;
      const prevB = blur?.style.pointerEvents;
      header.style.pointerEvents = "none";
      if (blur) blur.style.pointerEvents = "none";

      for (const cl of clusters) {
        const r = cl.getBoundingClientRect();
        if (!r.width) continue;
        const y = Math.max(2, Math.min(window.innerHeight - 2, r.top + r.height / 2));
        // moyenne sur 5 points répartis sur la largeur du bloc
        let sum = 0;
        let cnt = 0;
        for (let k = 0; k < 5; k++) {
          const x = Math.max(
            2,
            Math.min(window.innerWidth - 2, r.left + (r.width * (k + 0.5)) / 5)
          );
          sum += bgLum(x, y);
          cnt++;
        }
        const lum = cnt ? sum / cnt : 1;
        // hystérésis : seuils décalés selon l'état courant
        const prev = state.get(cl) ?? (lum > 0.5 ? "light" : "dark");
        const next =
          prev === "dark"
            ? lum > 0.6
              ? "light"
              : "dark"
            : lum < 0.4
              ? "dark"
              : "light";
        state.set(cl, next);
        cl.style.color = next === "light" ? "#141413" : "#ffffff";
      }

      header.style.pointerEvents = prevH;
      if (blur) blur.style.pointerEvents = prevB ?? "";
    };

    update();
    // relance quand les images finissent de charger
    const imgs = [...document.querySelectorAll("img")];
    imgs.forEach((im) => im.addEventListener("load", update));
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    const id = window.setInterval(update, 400);
    return () => {
      imgs.forEach((im) => im.removeEventListener("load", update));
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      window.clearInterval(id);
    };
  }, [pathname]);

  return (
    <>
      {/* flou progressif subtil derrière la nav (que en haut) */}
      <div className="header-blur" aria-hidden="true" />
      <header
        ref={ref}
        className="site-header header-enter fixed inset-x-0 top-0 z-100"
      >
        <div className="grid grid-cols-3 items-center px-5 py-5 md:px-8">
          {/* gauche : cellule TOUJOURS présente (garde la colonne), nav
              desktop dedans, vide sur mobile (le menu est à droite) */}
          <div className="justify-self-start">
            <nav
              data-h-cluster
              className="hidden items-center gap-4 md:flex md:gap-6"
            >
              <Link href={lp("/#travail")} className="t-caps-md link-line">
                {t.navTravail}
              </Link>
              <Link href={lp("/drone")} className="t-caps-md link-line">
                {t.navDrone}
              </Link>
              <Link href={lp("/travaille")} className="t-caps-md link-line">
                {t.navMethode}
              </Link>
            </nav>
          </div>

          <Link
            href={lp("/")}
            data-h-cluster
            className="t-display justify-self-center text-[17px] tracking-[0.14em] transition-opacity hover:opacity-70 md:text-[19px]"
          >
            Ghigo&nbsp;Matteo
          </Link>

          {/* droite : nav desktop OU bouton hamburger (mobile) */}
          <div className="flex items-center justify-end justify-self-end">
            <nav
              data-h-cluster
              className="hidden items-center gap-4 md:flex md:gap-6"
            >
              <Link href={lp("/lastwork")} className="t-caps-md link-line">
                {t.navLastwork}
              </Link>
              <Link href={lp("/contact")} className="t-caps-md link-line">
                {t.navContact}
              </Link>
            </nav>
            <button
              type="button"
              data-h-cluster
              onClick={() => setMenuOpen(true)}
              aria-label={t.openMenu}
              aria-expanded={menuOpen}
              className="flex cursor-pointer flex-col items-end gap-[5px] py-1 md:hidden"
            >
              <span className="block h-px w-6 bg-current" />
              <span className="block h-px w-6 bg-current" />
            </button>
          </div>
        </div>
      </header>

      {/* --- menu plein écran (mobile uniquement) --- */}
      <div
        aria-hidden={!menuOpen}
        className={`fixed inset-0 z-[110] flex flex-col bg-bg px-5 py-5 transition-opacity duration-300 md:hidden ${
          menuOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="t-display text-[17px] tracking-[0.14em] text-ink">
            Ghigo&nbsp;Matteo
          </span>
          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            aria-label={t.closeMenu}
            className="t-caps-md link-line cursor-pointer text-ink"
          >
            {t.close}
          </button>
        </div>
        <nav className="flex flex-1 flex-col justify-center gap-5">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="t-display text-[clamp(34px,10vw,52px)] leading-none text-ink transition-colors hover:text-red"
            >
              <span className="text-red">//</span>&nbsp;{l.label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
