import type { MetadataRoute } from "next";
import { loadPublicProjects } from "@/lib/serverData";
import { SITE_URL } from "@/lib/seo";
import { localizePath } from "@/i18n/config";

// force-dynamic : le sitemap reflète les projets courants (l'admin peut en
// ajouter sans rebuild).
export const dynamic = "force-dynamic";

const STATIC_ROUTES = [
  { path: "/", changeFrequency: "monthly", priority: 1 },
  { path: "/travaille", changeFrequency: "monthly", priority: 0.7 },
  { path: "/drone", changeFrequency: "monthly", priority: 0.7 },
  { path: "/lastwork", changeFrequency: "weekly", priority: 0.6 },
  { path: "/contact", changeFrequency: "yearly", priority: 0.6 },
] as const;

/** URL absolue d'un chemin localisé ("/" → racine, "/en" → /en, etc.). */
const abs = (path: string) =>
  path === "/" ? `${SITE_URL}/` : `${SITE_URL}${path}`;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await loadPublicProjects();
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  // Chaque route est émise pour les DEUX locales (racine + /en), chacune
  // portant ses alternates hreflang { fr, en }.
  for (const r of STATIC_ROUTES) {
    const frUrl = abs(localizePath(r.path, "fr"));
    const enUrl = abs(localizePath(r.path, "en"));
    const languages = { fr: frUrl, en: enUrl };
    entries.push({
      url: frUrl,
      lastModified: now,
      changeFrequency: r.changeFrequency,
      priority: r.priority,
      alternates: { languages },
    });
    entries.push({
      url: enUrl,
      lastModified: now,
      changeFrequency: r.changeFrequency,
      priority: r.priority,
      alternates: { languages },
    });
  }

  for (const p of projects) {
    const path = `/projets/${p.slug}`;
    const frUrl = abs(localizePath(path, "fr"));
    const enUrl = abs(localizePath(path, "en"));
    const languages = { fr: frUrl, en: enUrl };
    // sitemap image : aide au référencement des photos (Google Images)
    const images = p.images.slice(0, 20).map((i) => `${SITE_URL}${i.src}`);
    entries.push({
      url: frUrl,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
      images,
      alternates: { languages },
    });
    entries.push({
      url: enUrl,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
      images,
      alternates: { languages },
    });
  }

  return entries;
}
