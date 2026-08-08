"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import projectsData from "@/data/projects.json";

const DURATION = 680;
const EASE = "cubic-bezier(0.76, 0, 0.24, 1)";

const STATIC_LABELS: Record<string, string> = {
  "/": "Accueil",
  "/drone": "Drone",
  "/travaille": "Méthode",
  "/lastwork": "Dernier projet",
  "/contact": "Contact",
};

/** Nom lisible de la destination affiché au centre du voile. */
function destinationLabel(href: string): string {
  const path = href.split("#")[0] || "/";
  if (STATIC_LABELS[path]) return STATIC_LABELS[path];
  const m = path.match(/^\/projets\/(.+)$/);
  if (m) {
    const p = (projectsData as { slug: string; title: string }[]).find(
      (x) => x.slug === m[1]
    );
    if (p) return p.title;
  }
  return "";
}

/**
 * Transition entre les pages : un voile crème monte recouvrir l'écran
 * (bords en vague), avec le nom de la destination au centre, puis se
 * lève sur la nouvelle page. (Transitions CSS natives.)
 */
export default function PageTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const veilRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLSpanElement>(null);
  const pendingRef = useRef<string | null>(null);
  const pathnameRef = useRef(pathname);
  pathnameRef.current = pathname;

  // interception des clics sur les liens internes
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element).closest?.("a");
      if (!a) return;
      const href = a.getAttribute("href");
      if (!href || !href.startsWith("/")) return;
      if (a.target === "_blank" || a.hasAttribute("download")) return;

      const targetPath = href.split("#")[0] || "/";
      // même page (ancre, scroll) → comportement normal
      if (targetPath === pathnameRef.current) return;
      if (
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        return;
      }

      e.preventDefault();
      e.stopPropagation();
      if (pendingRef.current) return;
      pendingRef.current = href;

      const veil = veilRef.current!;
      const title = titleRef.current!;
      title.textContent = destinationLabel(href);

      veil.style.transition = "none";
      veil.style.transform = "translateY(112%)";
      veil.style.display = "block";
      title.style.transition = "none";
      title.style.opacity = "0";
      title.style.transform = "translate(-50%, calc(-50% + 26px))";
      // reflow pour ancrer l'état de départ avant la transition
      void veil.offsetHeight;

      veil.style.transition = `transform ${DURATION}ms ${EASE}`;
      veil.style.transform = "translateY(0%)";
      // le titre monte et apparaît une fois le voile presque en place
      title.style.transition = `opacity 420ms ease ${DURATION * 0.45}ms, transform 620ms ${EASE} ${DURATION * 0.4}ms`;
      title.style.opacity = "1";
      title.style.transform = "translate(-50%, -50%)";

      window.setTimeout(() => router.push(href), DURATION + 30);
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [router]);

  // révélation une fois la nouvelle page montée
  useEffect(() => {
    if (!pendingRef.current) return;
    const targetPath = pendingRef.current.split("#")[0] || "/";
    if (targetPath !== pathname) return;
    pendingRef.current = null;

    const veil = veilRef.current!;
    const title = titleRef.current!;
    window.setTimeout(() => {
      title.style.transition = "opacity 260ms ease";
      title.style.opacity = "0";
      veil.style.transition = `transform ${DURATION + 140}ms ${EASE}`;
      veil.style.transform = "translateY(-112%)";
      window.setTimeout(() => {
        veil.style.display = "none";
      }, DURATION + 190);
    }, 100);
  }, [pathname]);

  return (
    <div ref={veilRef} aria-hidden="true" className="gm-veil">
      <span ref={titleRef} className="gm-veil-title" />
    </div>
  );
}
