import { isAuthorized, unauthorized } from "@/lib/adminAuth";
import { loadProjects, saveProjects } from "@/lib/serverData";
import type { Project } from "@/data/projects";

export async function GET(req: Request) {
  if (!isAuthorized(req)) return unauthorized();
  return Response.json(await loadProjects());
}

export async function PUT(req: Request) {
  if (!isAuthorized(req)) return unauthorized();

  const body = await req.json().catch(() => null);
  const projects = body?.projects as Project[] | undefined;

  if (!Array.isArray(projects)) {
    return Response.json({ error: "Corps invalide" }, { status: 400 });
  }
  for (const p of projects) {
    if (!p || typeof p.slug !== "string" || !p.slug || !Array.isArray(p.images)) {
      return Response.json(
        { error: `Projet invalide : ${p?.slug ?? "?"}` },
        { status: 400 }
      );
    }
  }
  const slugs = new Set(projects.map((p) => p.slug));
  if (slugs.size !== projects.length) {
    return Response.json({ error: "Slugs en double" }, { status: 400 });
  }

  await saveProjects(projects);
  return Response.json({ ok: true, count: projects.length });
}
