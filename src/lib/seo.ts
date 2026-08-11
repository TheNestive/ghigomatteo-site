import type { Metadata } from "next";
import type { Project } from "@/data/projects";
import { localizePath, type Locale } from "@/i18n/config";

export type OgImage = {
  url: string;
  width?: number;
  height?: number;
  alt?: string;
};

/* ------------------------------------------------------------------ *
 * Constantes SEO (source unique). Domaine de production = ghigomatteo.com.
 * ------------------------------------------------------------------ */
export const SITE_URL = "https://ghigomatteo.com";
export const SITE_NAME = "Ghigo Matteo";
/** nom réel de la personne (prénom + nom) */
export const PERSON_NAME = "Matteo Ghigo";
export const EMAIL = "matteo.ghigo@nestiveprod.com";
export const INSTAGRAM = "https://www.instagram.com/matteo.ghgo/";
export const LOGO_PATH = "/site/branding/cropped-Frame-9-1.png";

export const DEFAULT_TITLE =
  "Ghigo Matteo · Photographe événementiel, corporate & drone";
export const DEFAULT_DESCRIPTION =
  "Matteo Ghigo, photographe et télépilote drone basé à Paris. Production photo et vidéo pour festivals, artistes, marques et agences, en France et à l'international.";

/** Équivalents anglais (utilisés par le layout /en et les métadonnées EN). */
export const DEFAULT_TITLE_EN =
  "Ghigo Matteo · Event, corporate & drone photographer";
export const DEFAULT_DESCRIPTION_EN =
  "Matteo Ghigo, photographer and licensed drone pilot based in Paris. Photo and video production for festivals, artists, brands and agencies, in France and worldwide.";

/** image de partage par défaut : le mainstage de Tomorrowland Winter (16:9). */
export const DEFAULT_OG_IMAGE: OgImage = {
  url: "/photos/evenement/tomorrowland-winter/hero-tmwl-winter.webp",
  width: 2560,
  height: 1440,
};

export const KEYWORDS = [
  "photographe événementiel",
  "photographe festival",
  "photographe concert",
  "photographe corporate",
  "photographe lifestyle",
  "photographe drone",
  "télépilote drone",
  "photographe Paris",
  "reportage photo événement",
  "aftermovie",
  "Ghigo Matteo",
  "Matteo Ghigo",
];

/** transforme un chemin relatif en URL absolue (JSON-LD, images sociales). */
export function absoluteUrl(path: string): string {
  if (/^https?:\/\//.test(path)) return path;
  return `${SITE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}

/* ------------------------------------------------------------------ *
 * Métadonnées d'une page. `path` = chemin NEUTRE (sans préfixe de
 * locale, ex. "/drone"). `locale` détermine le canonical localisé, la
 * locale Open Graph et les alternates hreflang (fr-FR, en, x-default).
 * `titleAbsolute` pour l'accueil.
 * ------------------------------------------------------------------ */
export function buildMetadata(opts: {
  title: string;
  description: string;
  path: string;
  images?: OgImage[];
  titleAbsolute?: boolean;
  locale?: Locale;
}): Metadata {
  const {
    title,
    description,
    path,
    images,
    titleAbsolute,
    locale = "fr",
  } = opts;
  const canonical = localizePath(path, locale);
  const frPath = localizePath(path, "fr");
  const enPath = localizePath(path, "en");
  const ogTitle = titleAbsolute ? title : `${title} · ${SITE_NAME}`;
  const ogImages = (images ?? [DEFAULT_OG_IMAGE]).map((i) => ({
    url: i.url,
    width: i.width,
    height: i.height,
    alt: i.alt ?? ogTitle,
  }));

  return {
    title: titleAbsolute ? { absolute: title } : title,
    description,
    alternates: {
      canonical,
      languages: {
        "fr-FR": frPath,
        en: enPath,
        "x-default": frPath,
      },
    },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: locale === "en" ? "en_US" : "fr_FR",
      url: canonical,
      title: ogTitle,
      description,
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
      images: ogImages.map((i) => i.url),
    },
  };
}

/* ------------------------------------------------------------------ *
 * JSON-LD global : WebSite + Person + ProfessionalService.
 * Injecté dans le layout, donc présent sur toutes les pages.
 * ------------------------------------------------------------------ */
export function siteJsonLd(locale: Locale = "fr") {
  const personId = `${SITE_URL}/#person`;
  const businessId = `${SITE_URL}/#business`;
  const inLanguage = locale === "en" ? "en" : "fr-FR";

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
        inLanguage,
        publisher: { "@id": personId },
      },
      {
        "@type": "Person",
        "@id": personId,
        name: PERSON_NAME,
        alternateName: SITE_NAME,
        url: SITE_URL,
        image: absoluteUrl(LOGO_PATH),
        email: `mailto:${EMAIL}`,
        jobTitle: "Photographe",
        sameAs: [INSTAGRAM],
        worksFor: { "@id": businessId },
        knowsAbout: [
          "Photographie de festival",
          "Photographie de concert",
          "Photographie corporate",
          "Photographie lifestyle",
          "Prise de vue par drone",
          "Captation vidéo",
        ],
        address: {
          "@type": "PostalAddress",
          addressLocality: "Paris",
          addressCountry: "FR",
        },
      },
      {
        "@type": "ProfessionalService",
        "@id": businessId,
        name: `${SITE_NAME} · Photographe`,
        url: SITE_URL,
        image: absoluteUrl(DEFAULT_OG_IMAGE.url),
        email: `mailto:${EMAIL}`,
        priceRange: "€€",
        founder: { "@id": personId },
        provider: { "@id": personId },
        sameAs: [INSTAGRAM],
        areaServed: ["France", "International"],
        serviceType: [
          "Photographie événementielle",
          "Photographie corporate",
          "Photographie lifestyle",
          "Prise de vue par drone",
          "Captation vidéo",
        ],
        address: {
          "@type": "PostalAddress",
          addressLocality: "Paris",
          addressCountry: "FR",
        },
      },
    ],
  };
}

/* ------------------------------------------------------------------ *
 * JSON-LD d'un projet : galerie d'images (+ VideoObject si Vimeo),
 * fil d'Ariane, rattachée à la Person.
 * ------------------------------------------------------------------ */
export function projectJsonLd(
  project: Project,
  slug: string,
  locale: Locale = "fr"
) {
  const url = absoluteUrl(localizePath(`/projets/${slug}`, locale));
  const homeUrl = absoluteUrl(localizePath("/", locale));
  const inLanguage = locale === "en" ? "en" : "fr-FR";
  const homeName = locale === "en" ? "Home" : "Accueil";
  const graph: Record<string, unknown>[] = [
    {
      "@type": "ImageGallery",
      "@id": `${url}#gallery`,
      name: `${project.title} · ${SITE_NAME}`,
      headline: project.title,
      description: project.desc,
      url,
      inLanguage,
      datePublished: `${project.year}-01-01`,
      author: { "@id": `${SITE_URL}/#person` },
      ...(project.place
        ? { locationCreated: { "@type": "Place", name: project.place } }
        : {}),
      image: project.images.slice(0, 12).map((i) => absoluteUrl(i.src)),
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${url}#breadcrumb`,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: homeName,
          item: homeUrl,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: project.title,
          item: url,
        },
      ],
    },
  ];

  if (project.video?.vimeo) {
    graph.push({
      "@type": "VideoObject",
      name: `${project.title} · Aftermovie`,
      description: project.desc,
      thumbnailUrl: absoluteUrl(project.cover.src),
      uploadDate: `${project.year}-01-01`,
      embedUrl: `https://player.vimeo.com/video/${project.video.vimeo}`,
      contentUrl: `https://vimeo.com/${project.video.vimeo}`,
    });
  }

  return { "@context": "https://schema.org", "@graph": graph };
}
