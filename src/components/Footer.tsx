"use client";

import Image from "next/image";

/* logos clients (blancs sur fond transparent → passés en foncé au rendu) */
const CLIENTS = [
  "Frame-15-1",
  "Frame-16-1",
  "Frame-17-1",
  "Frame-18-1",
  "Frame-19-1",
  "Frame-20-1",
  "Frame-21-1",
  "Frame-23-1",
  "Frame-18-2",
  "tml",
].map((n) => `/site/branding/${n}.png`);

const EMAIL = "matteo.ghigo@nestiveprod.com";
const INSTAGRAM = "https://www.instagram.com/matteo.ghgo/";

/* lieux photographiés — point rouge sur la France (base). Réels (projets) +
   quelques villes monde pour peupler la carte. */
const MARKERS: { lng: number; lat: number; name: string; red?: boolean }[] = [
  { name: "France", lng: 2.5, lat: 48, red: true },
  // Europe
  { name: "Belgique", lng: 4.5, lat: 50.9 },
  { name: "Royaume-Uni", lng: -0.1, lat: 51.5 },
  { name: "Pays-Bas", lng: 4.9, lat: 52.4 },
  { name: "Allemagne", lng: 13.4, lat: 52.5 },
  { name: "Espagne (Ibiza)", lng: 1.4, lat: 38.9 },
  { name: "Portugal", lng: -9.1, lat: 38.7 },
  { name: "Italie (Monza)", lng: 12.5, lat: 43 },
  { name: "Grèce (Mykonos)", lng: 25.3, lat: 37.4 },
  // Amériques
  { name: "New York", lng: -74, lat: 40.7 },
  { name: "Los Angeles", lng: -118.2, lat: 34 },
  { name: "Miami", lng: -80.2, lat: 25.8 },
  { name: "Montréal", lng: -73.6, lat: 45.5 },
  { name: "Mexique", lng: -87, lat: 20.5 },
  { name: "São Paulo", lng: -46.6, lat: -23.5 },
  { name: "Buenos Aires", lng: -58.4, lat: -34.6 },
  // Afrique / Moyen-Orient
  { name: "Marrakech", lng: -8, lat: 31.6 },
  { name: "Le Caire", lng: 31.2, lat: 30 },
  { name: "Johannesburg", lng: 28, lat: -26.2 },
  { name: "Dubaï / Abu Dhabi", lng: 55, lat: 24.8 },
  // Asie / Océanie
  { name: "Mumbai", lng: 72.8, lat: 19 },
  { name: "Bangkok", lng: 100.5, lat: 13.7 },
  { name: "Indonésie", lng: 112, lat: -7 },
  { name: "Tokyo", lng: 139.7, lat: 35.7 },
  { name: "Sydney", lng: 151.2, lat: -33.9 },
];
const mapPos = (lng: number, lat: number) => ({
  left: `${((lng + 180) / 360) * 100}%`,
  top: `${((90 - lat) / 180) * 100}%`,
});

export default function Footer() {
  const toTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  const year = new Date().getFullYear();

  return (
    <footer id="contact" className="footer-panel relative overflow-hidden text-ink">
      {/* ---- clients : label à gauche, logos qui défilent dans une bande à
           droite (~30%). Deux groupes IDENTIQUES → l'animation glisse d'un groupe
           (-50%), boucle continue sans saut ; fondu aux bords. ---- */}
      <div className="flex items-center gap-6 border-b border-line-soft px-5 py-6 md:px-8">
        <p className="t-caps shrink-0 text-faint">
          Ils m&apos;ont fait confiance
        </p>
        <div
          className="ml-auto w-[52%] overflow-hidden md:mr-[16%] md:w-[32%]"
          style={{
            WebkitMaskImage:
              "linear-gradient(to right, transparent, #000 12%, #000 88%, transparent)",
            maskImage:
              "linear-gradient(to right, transparent, #000 12%, #000 88%, transparent)",
          }}
        >
          <div className="gm-marquee flex w-max items-center">
            {[0, 1].map((g) => (
              <div
                key={g}
                aria-hidden={g === 1 ? true : undefined}
                className="flex shrink-0 items-center"
              >
                {Array.from({ length: 2 })
                  .flatMap(() => CLIENTS)
                  .map((src, i) => (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      key={i}
                      src={src}
                      alt=""
                      className="mr-14 h-7 w-auto shrink-0 opacity-50 [filter:brightness(0)] md:h-8"
                    />
                  ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ---- image + coordonnées + carte ---- */}
      <div className="grid gap-10 px-5 py-16 md:grid-cols-[240px_1fr_320px] md:gap-12 md:px-8">
        {/* image */}
        <div
          className="relative w-full max-w-[300px] overflow-hidden rounded-md md:w-[240px]"
          style={{ aspectRatio: "4 / 3" }}
        >
          <Image
            src="/photos/evenement/tomorrowland/TML-08.jpg"
            alt="Mainstage de Tomorrowland en pleine performance, par Ghigo Matteo"
            fill
            sizes="(max-width: 768px) 90vw, 240px"
            quality={90}
            className="object-cover"
          />
        </div>

        {/* coordonnées */}
        <div className="grid grid-cols-2 gap-x-10 gap-y-8">
          <div>
            <p className="t-caps mb-2.5 text-faint">Studio</p>
            <p className="text-[15px] leading-snug text-ink">Paris, France</p>
            <p className="text-[15px] leading-snug text-muted">
              Itinérance mondiale
            </p>
          </div>
          <div>
            <p className="t-caps mb-2.5 text-faint">Email</p>
            <a
              href={`mailto:${EMAIL}`}
              className="link-line text-[15px] break-all text-ink"
            >
              {EMAIL}
            </a>
          </div>
          <div>
            <p className="t-caps mb-2.5 text-faint">Disponible</p>
            <p className="text-[15px] leading-snug text-ink">France · Europe</p>
            <p className="text-[15px] leading-snug text-ink">Monde entier</p>
          </div>
          <div>
            <p className="t-caps mb-2.5 text-faint">Réseaux</p>
            <a
              href={INSTAGRAM}
              target="_blank"
              rel="noopener noreferrer"
              className="link-line text-[15px] text-ink"
            >
              Instagram @matteo.ghgo&nbsp;↗
            </a>
            <p className="mt-1.5 text-[15px] leading-snug text-muted">
              Photo · Drone · Vidéo
            </p>
          </div>
        </div>

        {/* carte du monde en pointillés */}
        <div className="w-full md:w-[320px]">
          <p className="t-caps mb-4 text-faint">Là où j&apos;ai photographié</p>
          <div className="relative w-full" style={{ aspectRatio: "2 / 1" }}>
            <div
              aria-hidden
              className="absolute inset-0 text-ink/25"
              style={{
                backgroundColor: "currentColor",
                WebkitMaskImage: "url(/site/world-dots.svg)",
                maskImage: "url(/site/world-dots.svg)",
                WebkitMaskSize: "contain",
                maskSize: "contain",
                WebkitMaskRepeat: "no-repeat",
                maskRepeat: "no-repeat",
                WebkitMaskPosition: "center",
                maskPosition: "center",
              }}
            />
            {MARKERS.map((m, i) => (
              <span
                key={i}
                title={m.name}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={mapPos(m.lng, m.lat)}
              >
                {m.red && (
                  <span className="absolute top-1/2 left-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full bg-red/60 motion-reduce:hidden" />
                )}
                <span
                  className={`relative block rounded-full ${
                    m.red ? "h-2.5 w-2.5 bg-red" : "h-1.5 w-1.5 bg-ink"
                  }`}
                />
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ---- barre légale ---- */}
      <div className="flex flex-col items-start gap-3 border-t border-line-soft px-5 py-5 md:flex-row md:items-center md:justify-between md:px-8">
        <p className="t-caps text-faint">
          © {year} Ghigo Matteo · Tous droits réservés
        </p>
        <p className="t-caps text-faint">
          Photographe · Télépilote drone certifié
        </p>
        <button
          type="button"
          onClick={toTop}
          className="group/top t-caps flex cursor-pointer items-center gap-2 text-muted transition-colors hover:text-ink"
        >
          Retour en haut
          <span className="transition-transform duration-300 group-hover/top:-translate-y-0.5">
            ↑
          </span>
        </button>
      </div>

      {/* ---- grand wordmark « matteo », en bas à gauche (la descente vide est
           rognée par l'overflow du footer → pas de bande claire dessous) ---- */}
      <div className="px-5 pt-4 pb-6 md:px-8">
        <span className="block whitespace-nowrap font-[family-name:var(--font-rinter)] text-[clamp(60px,18vw,260px)] leading-[0.9] font-extrabold tracking-[-0.03em] text-ink lowercase">
          matteo
        </span>
      </div>
    </footer>
  );
}
