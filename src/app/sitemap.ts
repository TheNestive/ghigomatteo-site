import type { MetadataRoute } from "next";
import { loadPublicProjects } from "@/lib/serverData";
import { SITE_URL } from "@/lib/seo";

// force-dynamic : le sitemap reflète les projets courants (l'admin peut en
// ajouter sans rebuild).
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await loadPublicProjects();
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/travaille`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/drone`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/lastwork`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: `${SITE_URL}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.6 },
  ];

  const projectRoutes: MetadataRoute.Sitemap = projects.map((p) => ({
    url: `${SITE_URL}/projets/${p.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
    // sitemap image : aide au référencement des photos (Google Images)
    images: p.images.slice(0, 20).map((i) => `${SITE_URL}${i.src}`),
  }));

  return [...staticRoutes, ...projectRoutes];
}
