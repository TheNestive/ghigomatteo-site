"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const INTRO_KEY = "gm_intro_seen";
const NAME = "GHIGO MATTEO";

/**
 * Intro d'arrivée : le nom s'écrit lettre par lettre, puis le voile se
 * lève. Jouée une fois par session.
 */
export default function IntroLoader() {
  const [show, setShow] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      sessionStorage.setItem(INTRO_KEY, "1");
      return;
    }
    if (!sessionStorage.getItem(INTRO_KEY)) {
      setShow(true);
    }
  }, []);

  // filet de sécurité : si l'animation GSAP ne se termine pas (rAF gelé,
  // onglet en arrière-plan…), on lève quand même le voile → jamais bloqué.
  useEffect(() => {
    if (!show) return;
    const t = window.setTimeout(() => {
      sessionStorage.setItem(INTRO_KEY, "1");
      document.body.style.overflow = "";
      setShow(false);
    }, 3200);
    return () => window.clearTimeout(t);
  }, [show]);

  useGSAP(
    () => {
      if (!show) return;
      const root = rootRef.current!;
      document.body.style.overflow = "hidden";

      gsap
        .timeline({
          onComplete: () => {
            sessionStorage.setItem(INTRO_KEY, "1");
            document.body.style.overflow = "";
            setShow(false);
          },
        })
        .fromTo(
          root.querySelectorAll("[data-intro-char]"),
          { yPercent: 120 },
          {
            yPercent: 0,
            duration: 0.65,
            stagger: 0.045,
            ease: "power4.out",
          },
          0.25
        )
        .to(
          root,
          { yPercent: -100, duration: 0.85, ease: "power4.inOut" },
          1.6
        );

      return () => {
        document.body.style.overflow = "";
      };
    },
    { scope: rootRef, dependencies: [show] }
  );

  if (!show) return null;

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-200 flex flex-col items-center justify-center bg-bg"
      aria-hidden="true"
    >
      <p
        className="t-display flex overflow-hidden py-[0.1em] text-[clamp(30px,6.5vw,104px)] text-ink"
        aria-label={NAME}
      >
        {NAME.split("").map((c, i) => (
          <span
            key={i}
            data-intro-char
            className="inline-block whitespace-pre"
          >
            {c}
          </span>
        ))}
      </p>
    </div>
  );
}
