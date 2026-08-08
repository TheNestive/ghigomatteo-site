import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { loadPublicProjects } from "@/lib/serverData";
import ProjectView from "@/components/ProjectView";
import JsonLd from "@/components/JsonLd";
import { buildMetadata, projectJsonLd } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const projects = await loadPublicProjects();
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  return buildMetadata({
    title: project.title,
    description: project.desc.slice(0, 160),
    path: `/projets/${slug}`,
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

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const projects = await loadPublicProjects();
  const index = projects.findIndex((p) => p.slug === slug);
  if (index === -1) notFound();

  return (
    <main>
      <JsonLd data={projectJsonLd(projects[index], slug)} />
      <ProjectView
        project={projects[index]}
        index={index}
        total={projects.length}
        next={projects[(index + 1) % projects.length]}
      />
    </main>
  );
}
