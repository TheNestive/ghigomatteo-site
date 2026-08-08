import type { Metadata } from "next";
import { loadPublicProjects } from "@/lib/serverData";
import LastworkView from "@/components/LastworkView";
import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildMetadata({
  title: "Dernier projet",
  description:
    "Mon dernier projet : Tomorrowland Winter 2026 à l'Alpe d'Huez. Scènes, artistes, festivaliers et activations de marque, entre montagne et musique.",
  path: "/lastwork",
});

export default async function LastworkPage() {
  const projects = await loadPublicProjects();
  const project =
    projects.find((p) => p.slug === "tomorrowland-winter") ?? projects[0];

  return (
    <main>
      <LastworkView project={project} />
    </main>
  );
}
