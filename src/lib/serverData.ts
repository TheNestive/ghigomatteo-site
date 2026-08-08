import { promises as fs } from "fs";
import path from "path";
import type { Img, Project } from "@/data/projects";

const FILE = path.join(process.cwd(), "src", "data", "projects.json");

export async function loadProjects(): Promise<Project[]> {
  const raw = await fs.readFile(FILE, "utf8");
  return JSON.parse(raw) as Project[];
}

/** Projets affichables sur le site public (au moins une photo). */
export async function loadPublicProjects(): Promise<Project[]> {
  const all = await loadProjects();
  return all.filter((p) => p.images.length > 0);
}

/** Recalcule les champs dérivés puis écrit le fichier (écriture atomique). */
export async function saveProjects(projects: Project[]): Promise<void> {
  const normalized = await Promise.all(projects.map(normalizeProject));
  const tmp = FILE + ".tmp";
  await fs.writeFile(tmp, JSON.stringify(normalized, null, 1), "utf8");
  await fs.rename(tmp, FILE);
}

async function coverFileExists(src: string): Promise<boolean> {
  if (!src.startsWith("/photos/")) return false;
  try {
    await fs.access(path.join(process.cwd(), "public", ...src.split("/").filter(Boolean)));
    return true;
  } catch {
    return false;
  }
}

export async function normalizeProject(p: Project): Promise<Project> {
  const images = p.images ?? [];
  let cover: Img | undefined = p.cover;
  // une cover hors galerie (ex. hero dédié de Tomorrowland) est conservée
  // tant que son fichier existe
  if (
    !cover ||
    !cover.src ||
    (!images.some((i) => i.src === cover!.src) &&
      !(await coverFileExists(cover.src)))
  ) {
    cover = images[0];
  }
  // cover secondaire (grille) : gardée si valide, sinon retirée
  let altCover: Img | undefined = p.altCover;
  if (
    altCover &&
    !images.some((i) => i.src === altCover!.src) &&
    !(await coverFileExists(altCover.src))
  ) {
    altCover = undefined;
  }
  const pc = images.filter((i) => i.o === "p").length;
  const lc = images.filter((i) => i.o === "l").length;
  const format =
    pc && lc && Math.min(pc, lc) / Math.max(pc, lc) > 0.25
      ? "mixed"
      : pc >= lc
        ? "portrait"
        : "landscape";
  return {
    ...p,
    images,
    cover: cover ?? { src: "", w: 4, h: 3, o: "l" },
    altCover,
    coverAspect: cover?.o === "p" ? "3/4" : "4/3",
    counts: { portrait: pc, landscape: lc, total: images.length },
    format,
  };
}
