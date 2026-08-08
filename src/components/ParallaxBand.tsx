"use client";

import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Bande « background parallax » (inspiré d'olivierlarose/background-image-parallax) :
 * l'image, sur-dimensionnée dans un cadre en overflow-hidden, dérive
 * verticalement au scroll pendant que le contenu défile par-dessus.
 * Réservée aux images fortes (paysage) des pages projet.
 */
export default function ParallaxBand({
  src,
  alt,
  caption,
}: {
  src: string;
  alt: string;
  caption?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.fromTo(
        ref.current!.querySelector("[data-pbg]"),
        { yPercent: -12 },
        {
          yPercent: 12,
          ease: "none",
          scrollTrigger: {
            trigger: ref.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );
    },
    { scope: ref }
  );

  return (
    <div
      ref={ref}
      data-reveal
      data-header-light
      className="relative h-[46vh] w-full overflow-hidden rounded-md md:h-[62vh] md:rounded-lg"
    >
      <div
        data-pbg
        className="absolute -top-[14%] left-0 h-[128%] w-full will-change-transform"
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes="100vw"
          quality={90}
          className="object-cover"
        />
      </div>
      {caption && (
        <p className="t-caps-md absolute bottom-5 left-5 z-1 max-w-[60vw] text-white mix-blend-difference md:bottom-7 md:left-8">
          {caption}
        </p>
      )}
    </div>
  );
}
