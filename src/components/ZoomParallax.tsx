"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface ZoomImg {
  src: string;
  scale: number;
  /** décalage du cadre par rapport au centre (offset direct, non doublé) */
  top?: string;
  left?: string;
  w?: string;
  /** hauteur en vh, RÉSERVÉ à l'image centrale (le « plongeon ») : w en vw +
      h en vh → au zoom max elle remplit TOUT l'écran quelle que soit sa forme
      (large, court…). À ne PAS utiliser pour la grappe (déformerait). */
  h?: string;
  /** ratio L/H FIXE, pour la GRAPPE (largeur en vmin) : garde chaque cadre au
      bon ratio quel que soit le format (pas de lamelles). Ignoré si `h` défini. */
  aspect?: number;
  /** image de PLONGÉE (le centre) : cadre à sa taille FINALE (100vw×100vh),
      animé de scale 1/z → 1 (on RÉDUIT au lieu d'agrandir). Résultat : l'image
      est rasterisée à pleine résolution (1920px) et jamais agrandie par le
      transform → nette au zoom (au lieu d'un petit bitmap étiré = flou). */
  dive?: boolean;
}

// Composition d'olivierlarose/zoom-parallax (positions éprouvées).
// ⚠️ Scales PLAFONNÉS (≤6) : plusieurs covers ne sont qu'en 1080-1350px,
// et un scale trop haut les agrandit au-delà de leur résolution → pixels.
// ⚠️ Tout est en `vmin` (pas de mix vw/vh) pour que la grappe garde sa
// disposition quel que soit le format d'écran (large, court, portrait), elle
// se met simplement à l'échelle de la plus petite dimension, centrée. Les
// valeurs = l'équivalent exact du rendu 16:9 d'avant (largeurs ×16/9, décalages
// verticaux inchangés) → identique sur 16:9, jamais déformé ailleurs.
const IMAGES: ZoomImg[] = [
  // image centrale, celle dans laquelle on plonge (mainstage Tomorrowland).
  // cadre à sa taille FINALE (100vw×100vh) + réduite au repos (scale 1/4 → 1)
  // → rendue à pleine résolution, nette. `scale` = facteur de réduction.
  {
    src: "/photos/evenement/tomorrowland-winter/milieu.jpg",
    scale: 4,
    w: "100vw",
    h: "100vh",
    dive: true,
  },
  {
    src: "/photos/evenement/tomorrowland-winter/02-scenes/Scene07.webp",
    scale: 5,
    top: "-30vmin",
    left: "8.9vmin",
    w: "62.2vmin",
    aspect: 2.07,
  },
  {
    src: "/photos/evenement/francis-mercier/COVER__Francis-mercier-5.jpg",
    scale: 5,
    top: "-10vmin",
    left: "-44.4vmin",
    w: "35.6vmin",
    aspect: 0.79,
  },
  {
    src: "/photos/evenement/riles/COVER__Riles-4-scaled.jpg",
    scale: 4,
    left: "48.9vmin",
    w: "44.4vmin",
    aspect: 16 / 9,
  },
  {
    // DJ Snake, la rouge (scène Garorock, jets d'étincelles)
    src: "/photos/evenement/dj-snake/DJ-SNAKE-1.jpg",
    scale: 5,
    top: "27.5vmin",
    left: "8.9vmin",
    w: "35.6vmin",
    aspect: 1.42,
  },
  {
    // chanteuse, photo 1350×1080 (1.25:1)
    src: "/photos/evenement/ascendant-vierge/COVER__Ascendant-vierge-4.jpg",
    scale: 4,
    top: "27.5vmin",
    left: "-40vmin",
    w: "32vmin",
    aspect: 1.25,
  },
  {
    src: "/photos/evenement/garorock/COVER__GAROROCK-1-scaled.jpg",
    scale: 6,
    top: "22.5vmin",
    left: "44.4vmin",
    w: "26.7vmin",
    aspect: 16 / 9,
  },
];

/**
 * Zoom-parallax : conteneur de 300vh, viewport sticky, chaque image
 * grossit à une vitesse différente, on plonge dans l'image centrale.
 * ⚠️ Desktop uniquement : sur mobile l'effet épinglé + scrub rame et les
 * cadres se chevauchent → on rend à la place une simple pile d'images.
 */
export default function ZoomParallax() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useGSAP(
    () => {
      // Mobile : PAS de pin (ça rame au tactile), mais un léger Ken Burns au
      // scroll sur chaque image (dézoome 1.18 → 1 en passant) → on garde une
      // sensation de « zoom » fluide et sûre, sans épinglage.
      if (isMobile) {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches)
          return;
        gsap.utils.toArray<HTMLElement>("[data-zoom-mobile]").forEach((box) => {
          const im = box.querySelector("img");
          if (!im) return;
          gsap.fromTo(
            im,
            { scale: 1.18 },
            {
              scale: 1,
              ease: "none",
              scrollTrigger: {
                trigger: box,
                start: "top bottom",
                end: "center center",
                scrub: true,
              },
            }
          );
        });
        return;
      }
      const els = gsap.utils.toArray<HTMLElement>("[data-zoom]");
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
        },
      });
      els.forEach((el) => {
        const z = Number(el.dataset.zoom);
        if (el.dataset.dive === "true") {
          // image de plongée : cadre à taille finale, on RÉDUIT (1/z → 1) →
          // rasterisée à pleine résolution, jamais agrandie → nette
          tl.fromTo(el, { scale: 1 / z }, { scale: 1, ease: "none" }, 0);
        } else {
          tl.to(el, { scale: z, ease: "none" }, 0);
        }
        // coins arrondis au début → carrés à la fin : le border-radius est
        // agrandi par le scale, donc on l'anime vers 0 pour que l'image
        // remplisse l'écran à bords francs (pas un « rectangle arrondi »)
        const frame = el.querySelector<HTMLElement>("[data-zoom-frame]");
        if (frame) tl.to(frame, { borderRadius: 0, ease: "none" }, 0);
      });
    },
    { scope: wrapRef, dependencies: [isMobile] }
  );

  // --- Mobile : uniquement l'image centrale (milieu), centrée, léger Ken
  //     Burns au scroll. (Le « plongeon » multi-images ne passe pas sur tel.)
  if (isMobile) {
    const center = IMAGES[0]; // milieu, mainstage Tomorrowland
    return (
      <div
        ref={wrapRef}
        className="flex items-center justify-center px-2.5 py-8"
      >
        <div
          data-zoom-mobile
          className="relative w-full overflow-hidden rounded-lg"
          // ⚠️ IMAGES[0] n'a pas de `aspect` (côté desktop il utilise h:100vh) →
          // sur mobile on fixe le ratio réel de l'image (1920×1080 = 16/9),
          // sinon le cadre s'écrase à 0px de haut = une grosse bande vide.
          style={{ aspectRatio: "16 / 9" }}
        >
          <Image
            src={center.src}
            alt=""
            fill
            sizes="96vw"
            quality={90}
            className="object-cover"
            loading="lazy"
          />
        </div>
      </div>
    );
  }

  return (
    <div ref={wrapRef} className="relative h-[300vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        {IMAGES.map((img, i) => (
          <div
            key={img.src}
            data-zoom={img.scale}
            data-dive={img.dive ? "true" : undefined}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div
              data-zoom-frame
              // positionnement façon olivierlarose/zoom-parallax : le cadre
              // est en `position: relative` et décalé par top/left. Le centre
              // (dive) prend 100vw SANS cap max-w (il doit remplir l'écran) ;
              // la grappe garde le cap 92vw.
              className={`relative overflow-hidden rounded-md md:rounded-lg ${
                img.dive
                  ? "w-(--zw)"
                  : "w-[calc(var(--zw)*2.2)] max-w-[92vw] md:w-(--zw)"
              }`}
              style={
                {
                  "--zw": img.w ?? "25vw",
                  // centre (h défini) : hauteur en vh → remplit l'écran au zoom.
                  // grappe (h absent) : hauteur via aspect-ratio fixe → aucune
                  // déformation. (undefined = propriété non appliquée.)
                  height: img.h,
                  aspectRatio: img.h ? undefined : String(img.aspect),
                  top: img.top,
                  left: img.left,
                } as React.CSSProperties
              }
            >
              <Image
                src={img.src}
                alt=""
                fill
                /* dive : cadre = 100vw à pleine échelle → on demande 100vw (le
                   navigateur charge la source 1920px). Grappe : largeur finale
                   = cadre × zoom, sinon version trop petite → pixels. */
                sizes={
                  img.dive
                    ? "100vw"
                    : `${Math.min(
                        Math.round(parseFloat(img.w ?? "25") * img.scale * 1.3),
                        280
                      )}vw`
                }
                quality={95}
                className="object-cover"
                priority={i === 0}
                // chargées d'avance (sinon, sous le zoom, une image non
                // encore chargée est invisible → on ne la voit pas « bouger »)
                loading={i === 0 ? undefined : "eager"}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
