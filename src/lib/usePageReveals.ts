"use client";

import type { RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Animations communes des pages secondaires :
 * - entrée : [data-fx-crumb] → [data-fx-title] (masque) → [data-fx-lead]
 * - au scroll : [data-reveal] en révélation « obturateur » + dé-zoom
 */
export function usePageReveals(rootRef: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      if (
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        return;
      }

      gsap
        .timeline({ defaults: { ease: "power4.out" } })
        .fromTo(
          "[data-fx-crumb]",
          { opacity: 0, y: -12 },
          { opacity: 1, y: 0, duration: 0.7 },
          0.05
        )
        .fromTo(
          "[data-fx-title]",
          { yPercent: 112 },
          { yPercent: 0, duration: 1.15 },
          0.15
        )
        .fromTo(
          "[data-fx-lead]",
          { opacity: 0, y: 26 },
          { opacity: 1, y: 0, duration: 0.9, stagger: 0.1 },
          0.55
        );

      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        const imgs = el.querySelectorAll("img");
        const tl = gsap.timeline({
          scrollTrigger: { trigger: el, start: "top 90%" },
          defaults: { ease: "power3.out" },
        });
        tl.fromTo(
          el,
          { clipPath: "inset(10% 5% 10% 5%)", opacity: 0 },
          { clipPath: "inset(0% 0% 0% 0%)", opacity: 1, duration: 1.1 }
        );
        if (imgs.length) {
          tl.fromTo(
            imgs,
            { scale: 1.15 },
            { scale: 1, duration: 1.5, clearProps: "transform" },
            0
          );
        }
      });
    },
    { scope: rootRef }
  );
}
