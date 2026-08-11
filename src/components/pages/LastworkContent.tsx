import { loadPublicProjects } from "@/lib/serverData";
import LastworkView from "@/components/LastworkView";
import JsonLd from "@/components/JsonLd";
import { siteJsonLd } from "@/lib/seo";
import { localizeProject } from "@/i18n/projects.en";
import type { Locale } from "@/i18n/config";

/** Contenu de la page « dernier projet », partagé par les routes FR et EN. */
export default async function LastworkContent({
  locale = "fr",
}: {
  locale?: Locale;
}) {
  const projects = await loadPublicProjects();
  const project =
    projects.find((p) => p.slug === "tomorrowland-winter") ?? projects[0];

  return (
    <main>
      <JsonLd data={siteJsonLd(locale)} />
      <LastworkView project={localizeProject(project, locale)} locale={locale} />
    </main>
  );
}
