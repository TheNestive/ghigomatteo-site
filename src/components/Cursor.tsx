"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const INTERACTIVE =
  "a, button, [role='button'], label, input, select, textarea, [data-cursor]";

/**
 * Curseur custom : point central + anneau segmenté (4 arcs).
 * Au survol d'un élément interactif : grossit et tourne sur lui-même.
 * Désactivé sur tactile et dans l'admin.
 */
export default function Cursor() {
  const pathname = usePathname();
  const wrapRef = useRef<HTMLDivElement>(null);
  const isAdmin = pathname.startsWith("/admin");

  useEffect(() => {
    if (isAdmin) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const el = wrapRef.current;
    if (!el) return;

    document.documentElement.classList.add("has-cursor");

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let tx = x;
    let ty = y;
    let raf = 0;
    let frame = 0;

    // --- luminosité réelle du fond sous le curseur → réticule blanc/noir ---
    const canvas = document.createElement("canvas");
    canvas.width = 4;
    canvas.height = 4;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    const relLum = (r: number, g: number, b: number) =>
      (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;

    const sampleImage = (
      img: HTMLImageElement,
      px: number,
      py: number
    ): number | null => {
      const r = img.getBoundingClientRect();
      const nw = img.naturalWidth;
      const nh = img.naturalHeight;
      if (!nw || !nh || !ctx) return null;
      const scale = Math.max(r.width / nw, r.height / nh);
      let ix = (px - r.left - (r.width - nw * scale) / 2) / scale;
      let iy = (py - r.top - (r.height - nh * scale) / 2) / scale;
      ix = Math.max(0, Math.min(nw - 4, ix - 2));
      iy = Math.max(0, Math.min(nh - 4, iy - 2));
      try {
        ctx.drawImage(img, ix, iy, 4, 4, 0, 0, 4, 4);
        const d = ctx.getImageData(0, 0, 4, 4).data;
        let s = 0;
        let n = 0;
        for (let i = 0; i < d.length; i += 4) {
          s += relLum(d[i], d[i + 1], d[i + 2]);
          n++;
        }
        return n ? s / n : null;
      } catch {
        return null;
      }
    };

    const bgLum = (px: number, py: number): number => {
      const under = document.elementFromPoint(px, py);
      if (!under) return 1;
      const img =
        under.tagName === "IMG"
          ? (under as HTMLImageElement)
          : under.querySelector?.("img");
      // ⚠️ n'échantillonner l'image QUE si le curseur est réellement au-dessus
      // d'elle. Sinon (curseur sur une zone claire d'un conteneur qui a une
      // image ailleurs) on lisait un pixel de bord sombre → curseur blanc sur
      // fond blanc.
      if (img) {
        const r = (img as HTMLImageElement).getBoundingClientRect();
        if (px >= r.left && px <= r.right && py >= r.top && py <= r.bottom) {
          const l = sampleImage(img as HTMLImageElement, px, py);
          if (l != null) return l;
        }
      }
      let node: Element | null = under;
      while (node) {
        const bg = getComputedStyle(node).backgroundColor;
        const m = bg.match(/rgba?\(([^)]+)\)/);
        if (m) {
          const p = m[1].split(",").map((v) => parseFloat(v));
          if ((p[3] ?? 1) > 0.5) return relLum(p[0], p[1], p[2]);
        }
        node = node.parentElement;
      }
      return 1;
    };

    const onMove = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      el.style.opacity = "1";
    };
    const onLeave = () => {
      el.style.opacity = "0";
    };
    const isTextual = (t: Element) => {
      const a = t.closest?.(INTERACTIVE);
      // pas d'animation sur les liens-images (cartes, heros),
      // seulement sur les liens et boutons textuels
      return !!a && !t.closest?.("[data-cursor-media]");
    };
    const onOver = (e: MouseEvent) => {
      if (isTextual(e.target as Element)) {
        el.classList.add("cursor-hover");
      }
    };
    const onOut = (e: MouseEvent) => {
      if ((e.target as Element).closest?.(INTERACTIVE)) {
        el.classList.remove("cursor-hover");
      }
    };

    const loop = () => {
      x += (tx - x) * 0.22;
      y += (ty - y) * 0.22;
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      // échantillonnage throttlé (~toutes les 4 frames) du fond réel, avec
      // hystérésis (seuils décalés) pour éviter le clignotement sur les
      // fonds à fort contraste
      if (frame++ % 4 === 0) {
        const lum = bgLum(tx, ty);
        const dark = el.classList.contains("cursor-on-dark");
        if (dark && lum > 0.6) el.classList.remove("cursor-on-dark");
        else if (!dark && lum < 0.4) el.classList.add("cursor-on-dark");
      }
      raf = requestAnimationFrame(loop);
    };
    loop();

    document.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver, { passive: true });
    document.addEventListener("mouseout", onOut, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.classList.remove("has-cursor");
    };
  }, [isAdmin]);

  if (isAdmin) return null;

  return (
    <div ref={wrapRef} className="gm-cursor" aria-hidden="true">
      <div className="gm-cursor-inner">
        {/* réticule de visée : point fin + anneau discret en 4 arcs,
            façon collimateur d'autofocus */}
        <svg viewBox="0 0 32 32" width="30" height="30">
          <circle cx="16" cy="16" r="2.4" fill="currentColor" />
          <circle
            cx="16"
            cy="16"
            r="12.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
            strokeDasharray="14.6 5.03"
            strokeDashoffset="17.1"
          />
        </svg>
      </div>
    </div>
  );
}
