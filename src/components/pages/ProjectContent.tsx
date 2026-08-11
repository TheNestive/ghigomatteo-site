import { notFound } from "next/navigation";
import { loadPublicProjects } from "@/lib/serverData";
import ProjectView from "@/components/ProjectView";
import JsonLd from "@/components/JsonLd";
import { siteJsonLd, projectJsonLd } from "@/lib/seo";
import { localizeProject } from "@/i18n/projects.en";
import type { Locale } from "@/i18n/config";

/**
 * Contenu d'une page projet, partagé par les routes FR et EN.
 * La logique « projet suivant » est identique (on saute les projets
 * masqués ; le dernier visible boucle vers Tomorrowland Winter).
 */
export default async function ProjectContent({
  slug,
  locale = "fr",
}: {
  slug: string;
  locale?: Locale;
}) {
  const projects = await loadPublicProjects();
  const index = projects.findIndex((p) => p.slug === slug);
  if (index === -1) notFound();

  const visible = projects.filter((p) => !p.hidden);
  const flagship =
    visible.find((p) => p.slug === "tomorrowland-winter") ?? visible[0];
  const vIndex = visible.findIndex((p) => p.slug === slug);
  const next =
    vIndex === -1 || vIndex === visible.length - 1
      ? flagship
      : visible[vIndex + 1];

  const project = localizeProject(projects[index], locale);

  return (
    <main>
      <JsonLd data={siteJsonLd(locale)} />
      <JsonLd data={projectJsonLd(project, slug, locale)} />
      <ProjectView
        project={project}
        index={index}
        total={projects.length}
        next={next}
        locale={locale}
      />
    </main>
  );
}
