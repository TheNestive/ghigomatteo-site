import type { Metadata } from "next";
import { loadPublicProjects } from "@/lib/serverData";
import ProjectContent from "@/components/pages/ProjectContent";
import { buildMetadata } from "@/lib/seo";
import { localizeProject } from "@/i18n/projects.en";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const projects = await loadPublicProjects();
  const found = projects.find((p) => p.slug === slug);
  if (!found) return {};
  const project = localizeProject(found, "en");
  return buildMetadata({
    title: project.title,
    description: project.desc.slice(0, 160),
    path: `/projets/${slug}`,
    locale: "en",
    images: project.cover?.src
      ? [
          {
            url: project.cover.src,
            width: project.cover.w,
            height: project.cover.h,
            alt: project.title,
          },
        ]
      : undefined,
  });
}

export default async function ProjectPageEn({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <ProjectContent slug={slug} locale="en" />;
}
