import { promises as fs } from "fs";
import path from "path";
import sharp from "sharp";
import { isAuthorized, unauthorized } from "@/lib/adminAuth";
import type { Img } from "@/data/projects";

const ALLOWED_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);
const ALLOWED_CATEGORIES = new Set(["evenement", "corporate", "lifestyle"]);

function sanitize(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .replace(/-+/g, "-");
}

export async function POST(req: Request) {
  if (!isAuthorized(req)) return unauthorized();

  const form = await req.formData();
  const slug = sanitize(String(form.get("slug") ?? ""));
  const category = String(form.get("category") ?? "");
  const files = form.getAll("files") as File[];

  if (!slug || !ALLOWED_CATEGORIES.has(category)) {
    return Response.json(
      { error: "slug ou catégorie manquant" },
      { status: 400 }
    );
  }
  if (!files.length) {
    return Response.json({ error: "Aucun fichier" }, { status: 400 });
  }

  const dir = path.join(process.cwd(), "public", "photos", category, slug);
  await fs.mkdir(dir, { recursive: true });

  const added: Img[] = [];
  const errors: string[] = [];

  for (const file of files) {
    const ext = path.extname(file.name).toLowerCase();
    if (!ALLOWED_EXT.has(ext)) {
      errors.push(`${file.name} : format non supporté`);
      continue;
    }
    try {
      const buffer = Buffer.from(await file.arrayBuffer());
      const meta = await sharp(buffer).metadata();
      if (!meta.width || !meta.height) {
        errors.push(`${file.name} : image illisible`);
        continue;
      }

      let base = sanitize(path.basename(file.name, ext));
      let filename = `${base}${ext}`;
      let n = 1;
      while (
        await fs.access(path.join(dir, filename)).then(() => true, () => false)
      ) {
        filename = `${base}-${n++}${ext}`;
      }

      await fs.writeFile(path.join(dir, filename), buffer);
      added.push({
        src: `/photos/${category}/${slug}/${filename}`,
        w: meta.width,
        h: meta.height,
        o: meta.height > meta.width ? "p" : meta.width > meta.height ? "l" : "s",
      });
    } catch {
      errors.push(`${file.name} : échec de l'enregistrement`);
    }
  }

  return Response.json({ added, errors });
}
