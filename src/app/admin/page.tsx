"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { Img, Project } from "@/data/projects";
import { CATEGORY_LABELS, FEATURED_COUNT, GRID_COUNT, pad } from "@/data/projects";

const KEY_STORAGE = "gm_admin_key";

/* ---------- helpers ---------- */

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function move<T>(arr: T[], from: number, to: number): T[] {
  if (to < 0 || to >= arr.length) return arr;
  const copy = [...arr];
  const [item] = copy.splice(from, 1);
  copy.splice(to, 0, item);
  return copy;
}

/* ---------- composant ---------- */

export default function AdminPage() {
  const [adminKey, setAdminKey] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [projects, setProjects] = useState<Project[] | null>(null);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] =
    useState<Project["category"]>("evenement");
  // index de la photo en cours de glisser-déposer
  const [dragIdx, setDragIdx] = useState<number | null>(null);

  /* --- auth --- */
  useEffect(() => {
    const k = sessionStorage.getItem(KEY_STORAGE);
    if (k) setAdminKey(k);
  }, []);

  useEffect(() => {
    if (!adminKey) return;
    fetch("/api/admin/projects", { headers: { "x-admin-key": adminKey } })
      .then((r) => {
        if (r.status === 401) {
          sessionStorage.removeItem(KEY_STORAGE);
          setAdminKey(null);
          throw new Error("Session expirée");
        }
        return r.json();
      })
      .then(setProjects)
      .catch(() => setMessage("Impossible de charger les projets"));
  }, [adminKey]);

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  async function login() {
    setLoginError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setLoginError(data.error ?? "Erreur");
      return;
    }
    sessionStorage.setItem(KEY_STORAGE, password);
    setAdminKey(password);
  }

  /* --- mutations locales --- */
  function update(fn: (list: Project[]) => Project[]) {
    setProjects((prev) => (prev ? fn(prev) : prev));
    setDirty(true);
    setMessage("");
  }

  // --- appartenance bande / grille (champs `band` / `grid`) ---
  // renumérote 1..n les projets marqués, dans l'ordre de leur numéro courant
  function renumber(list: Project[], field: "band" | "grid"): Project[] {
    const marked = list
      .filter((p) => p[field] != null)
      .sort((a, b) => (a[field] as number) - (b[field] as number));
    const rank = new Map(marked.map((p, i) => [p.slug, i + 1]));
    return list.map((p) =>
      rank.has(p.slug) ? { ...p, [field]: rank.get(p.slug) } : p
    );
  }

  function toggleMembership(slug: string, field: "band" | "grid") {
    update((l) => {
      const isIn = l.find((p) => p.slug === slug)?.[field] != null;
      const cap = field === "band" ? FEATURED_COUNT : GRID_COUNT;
      if (!isIn && l.filter((p) => p[field] != null).length >= cap) return l;
      const next = l.map((p) => {
        if (p.slug !== slug) return p;
        const copy = { ...p };
        if (isIn) delete copy[field];
        else copy[field] = 999; // placé en fin, renuméroté juste après
        return copy;
      });
      return renumber(next, field);
    });
  }

  // déplace un projet marqué dans l'ordre de la bande / grille (échange les nos)
  function moveMembership(slug: string, field: "band" | "grid", dir: -1 | 1) {
    update((l) => {
      const marked = l
        .filter((p) => p[field] != null)
        .sort((a, b) => (a[field] as number) - (b[field] as number));
      const idx = marked.findIndex((p) => p.slug === slug);
      const j = idx + dir;
      if (idx < 0 || j < 0 || j >= marked.length) return l;
      const a = marked[idx].slug;
      const b = marked[j].slug;
      const na = marked[idx][field];
      const nb = marked[j][field];
      return l.map((p) =>
        p.slug === a
          ? { ...p, [field]: nb }
          : p.slug === b
            ? { ...p, [field]: na }
            : p
      );
    });
  }

  function patchSelected(patch: Partial<Project>) {
    if (!selectedSlug) return;
    update((list) =>
      list.map((p) => (p.slug === selectedSlug ? { ...p, ...patch } : p))
    );
  }

  async function save() {
    if (!projects || !adminKey) return;
    setSaving(true);
    setMessage("");
    const res = await fetch("/api/admin/projects", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-admin-key": adminKey,
      },
      body: JSON.stringify({ projects }),
    });
    setSaving(false);
    if (res.ok) {
      setDirty(false);
      setMessage("✓ Enregistré · les changements sont en ligne");
      // recharge la version normalisée par le serveur
      const fresh = await fetch("/api/admin/projects", {
        headers: { "x-admin-key": adminKey },
      }).then((r) => r.json());
      setProjects(fresh);
    } else {
      const data = await res.json().catch(() => ({}));
      setMessage(`Erreur : ${data.error ?? res.status}`);
    }
  }

  async function uploadFiles(files: FileList | null) {
    const sel = projects?.find((p) => p.slug === selectedSlug);
    if (!files?.length || !sel || !adminKey) return;
    setUploading(true);
    setMessage("");
    const form = new FormData();
    form.set("slug", sel.slug);
    form.set("category", sel.category);
    [...files].forEach((f) => form.append("files", f));
    const res = await fetch("/api/admin/upload", {
      method: "POST",
      headers: { "x-admin-key": adminKey },
      body: form,
    });
    setUploading(false);
    if (!res.ok) {
      setMessage("Erreur pendant l'envoi des photos");
      return;
    }
    const { added, errors } = (await res.json()) as {
      added: Img[];
      errors: string[];
    };
    if (added.length) {
      patchSelected({ images: [...sel.images, ...added] });
      setMessage(
        `✓ ${added.length} photo(s) ajoutée(s), pense à Enregistrer` +
          (errors.length ? ` (${errors.length} refusée(s))` : "")
      );
    } else {
      setMessage(errors.join(" · ") || "Aucune photo ajoutée");
    }
  }

  function addProject() {
    const title = newTitle.trim();
    if (!title || !projects) return;
    let slug = slugify(title);
    let n = 1;
    while (projects.some((p) => p.slug === slug)) slug = `${slugify(title)}-${n++}`;
    const project: Project = {
      slug,
      category: newCategory,
      title,
      label: title.toUpperCase(),
      year: String(new Date().getFullYear()),
      date: "",
      place: "",
      desc: "",
      link: null,
      cover: { src: "", w: 4, h: 3, o: "l" },
      coverAspect: "4/3",
      counts: { portrait: 0, landscape: 0, total: 0 },
      format: "landscape",
      images: [],
    };
    update((list) => [...list, project]);
    setSelectedSlug(slug);
    setNewTitle("");
  }

  /* ---------- rendu ---------- */

  if (!adminKey) {
    return (
      <main className="flex min-h-screen items-center justify-center px-5">
        <div className="w-full max-w-sm border border-line p-8">
          <p className="t-hud mb-6 text-muted">
            <span className="text-red">//</span>&nbsp;ADMIN · GHIGO MATTEO
          </p>
          <label className="t-hud mb-2 block text-faint" htmlFor="pwd">
            MOT DE PASSE
          </label>
          <input
            id="pwd"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && login()}
            className="mb-4 w-full border border-line bg-transparent px-3 py-2 text-ink outline-none focus:border-red"
          />
          {loginError && (
            <p className="t-hud mb-4 text-red">{loginError}</p>
          )}
          <button
            onClick={login}
            className="t-hud-md w-full cursor-pointer border border-red bg-red/15 px-4 py-3 text-ink transition-colors hover:bg-red/30"
          >
            ENTRER
          </button>
        </div>
      </main>
    );
  }

  if (!projects) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="t-hud text-muted">CHARGEMENT…</p>
      </main>
    );
  }

  const selected = projects.find((p) => p.slug === selectedSlug) ?? null;

  // bande / grille = projets marqués, ordonnés par leur numéro de slot
  const bandList = projects
    .filter((p) => p.band != null)
    .sort((a, b) => (a.band as number) - (b.band as number));
  const gridList = projects
    .filter((p) => p.grid != null)
    .sort((a, b) => (a.grid as number) - (b.grid as number));
  // orientation d'un slot de grille (miroir de GRID_ASPECTS côté accueil)
  const gridOrient = ["H", "V", "H", "V", "V", "H"];
  const visibleCount = projects.filter((p) => !p.hidden).length;

  return (
    <main className="min-h-screen px-5 pt-24 pb-40 md:px-8">
      {/* barre d'action */}
      <div className="fixed inset-x-0 bottom-0 z-50 flex items-center justify-between gap-4 border-t border-line bg-bg2/95 px-5 py-3 backdrop-blur md:px-8">
        <p className="t-hud text-muted">
          {dirty ? "● MODIFICATIONS NON ENREGISTRÉES" : message || "À JOUR"}
        </p>
        <button
          onClick={save}
          disabled={saving || !dirty}
          className={`t-hud-md cursor-pointer border px-6 py-2.5 transition-colors ${
            dirty
              ? "border-red bg-red/20 text-ink hover:bg-red/35"
              : "border-line text-faint"
          }`}
        >
          {saving ? "ENREGISTREMENT…" : "ENREGISTRER"}
        </button>
      </div>

      <h1 className="t-display mb-2 text-4xl">
        Admin <span className="text-red">//</span>
      </h1>
      <p className="mb-10 max-w-2xl text-sm text-muted">
        <strong className="text-ink">Bande</strong> et{" "}
        <strong className="text-ink">grille</strong> = des sélections : marque
        un projet avec <span className="text-ink">B</span> /{" "}
        <span className="text-ink">G</span> dans l&apos;index (6 max chacune),
        réordonne-les avec ↑↓. L&apos;<strong className="text-ink">index</strong>{" "}
        du bas suit l&apos;ordre de la liste (↑↓), indépendamment de la bande.
        L&apos;œil <span className="text-ink">●</span>/
        <span className="text-faint">◌</span> masque un projet de l&apos;index
        (il peut rester en bande). Modifie les infos, ajoute ou retire des
        photos, puis clique sur{" "}
        <strong className="text-ink">Enregistrer</strong>.
      </p>

      <div className="grid gap-10 lg:grid-cols-[380px_1fr]">
        {/* ------- liste ------- */}
        <section>
          {/* --- BANDE D'ACCUEIL (sélection marquée) --- */}
          <h2 className="t-hud mb-2 text-muted">
            <span className="text-red">//</span>&nbsp;BANDE D&apos;ACCUEIL{" "}
            <span className="text-faint">{bandList.length}/{FEATURED_COUNT}</span>
          </h2>
          <ol className="mb-6 border-t border-line-soft">
            {bandList.length === 0 && (
              <li className="t-hud border-b border-line-soft px-2 py-2 text-faint">
                Aucun projet. Marque-les avec « B » dans l&apos;index ci-dessous.
              </li>
            )}
            {bandList.map((p, i) => (
              <li
                key={p.slug}
                className="flex items-center gap-1.5 border-b border-line-soft px-2 py-1.5"
              >
                <span className="t-hud w-5 shrink-0 text-red">{i + 1}</span>
                <button
                  onClick={() => setSelectedSlug(p.slug)}
                  className="t-hud-md min-w-0 flex-1 cursor-pointer truncate text-left text-ink hover:text-red"
                >
                  {p.title || p.slug}
                </button>
                <button
                  onClick={() => moveMembership(p.slug, "band", -1)}
                  disabled={i === 0}
                  aria-label="Monter dans la bande"
                  className="cursor-pointer px-1 text-muted hover:text-ink disabled:opacity-25"
                >
                  ↑
                </button>
                <button
                  onClick={() => moveMembership(p.slug, "band", 1)}
                  disabled={i === bandList.length - 1}
                  aria-label="Descendre dans la bande"
                  className="cursor-pointer px-1 text-muted hover:text-ink disabled:opacity-25"
                >
                  ↓
                </button>
                <button
                  onClick={() => toggleMembership(p.slug, "band")}
                  title="Retirer de la bande"
                  className="cursor-pointer px-1 text-faint hover:text-red"
                >
                  ✕
                </button>
              </li>
            ))}
          </ol>

          {/* --- GRILLE « LA SUITE » (sélection marquée) --- */}
          <h2 className="t-hud mb-2 text-muted">
            <span className="text-red">//</span>&nbsp;GRILLE «&nbsp;LA
            SUITE&nbsp;»{" "}
            <span className="text-faint">{gridList.length}/{GRID_COUNT}</span>
          </h2>
          <ol className="mb-6 border-t border-line-soft">
            {gridList.length === 0 && (
              <li className="t-hud border-b border-line-soft px-2 py-2 text-faint">
                Aucun projet. Marque-les avec « G » dans l&apos;index ci-dessous.
              </li>
            )}
            {gridList.map((p, i) => (
              <li
                key={p.slug}
                className="flex items-center gap-1.5 border-b border-line-soft px-2 py-1.5"
              >
                <span className="t-hud w-5 shrink-0 text-red">{i + 1}</span>
                <span
                  title={
                    gridOrient[i] === "H" ? "Slot horizontal" : "Slot vertical"
                  }
                  className="t-hud w-4 shrink-0 text-center text-faint"
                >
                  {gridOrient[i] ?? ""}
                </span>
                <button
                  onClick={() => setSelectedSlug(p.slug)}
                  className="t-hud-md min-w-0 flex-1 cursor-pointer truncate text-left text-ink hover:text-red"
                >
                  {p.title || p.slug}
                </button>
                <button
                  onClick={() => moveMembership(p.slug, "grid", -1)}
                  disabled={i === 0}
                  aria-label="Monter dans la grille"
                  className="cursor-pointer px-1 text-muted hover:text-ink disabled:opacity-25"
                >
                  ↑
                </button>
                <button
                  onClick={() => moveMembership(p.slug, "grid", 1)}
                  disabled={i === gridList.length - 1}
                  aria-label="Descendre dans la grille"
                  className="cursor-pointer px-1 text-muted hover:text-ink disabled:opacity-25"
                >
                  ↓
                </button>
                <button
                  onClick={() => toggleMembership(p.slug, "grid")}
                  title="Retirer de la grille"
                  className="cursor-pointer px-1 text-faint hover:text-red"
                >
                  ✕
                </button>
              </li>
            ))}
          </ol>

          {/* --- INDEX (ordre de la liste, réordonnable) --- */}
          <h2 className="t-hud mb-2 text-muted">
            <span className="text-red">//</span>&nbsp;INDEX · ORDRE DES PROJETS{" "}
            <span className="text-faint">{visibleCount} visibles</span>
          </h2>
          <ol className="border-t border-line-soft">
            {projects.map((p, i) => {
              const bandFull =
                p.band == null &&
                projects.filter((x) => x.band != null).length >= FEATURED_COUNT;
              const gridFull =
                p.grid == null &&
                projects.filter((x) => x.grid != null).length >= GRID_COUNT;
              return (
                <li key={p.slug}>
                  <div
                    className={`flex items-center gap-1.5 border-b border-line-soft px-2 py-2 ${
                      p.slug === selectedSlug ? "bg-red/10" : ""
                    }`}
                  >
                    <span className="t-hud w-6 shrink-0 text-faint">
                      {pad(i + 1)}
                    </span>
                    <button
                      onClick={() => setSelectedSlug(p.slug)}
                      className="t-hud-md min-w-0 flex-1 cursor-pointer truncate text-left text-ink hover:text-red"
                    >
                      {p.title || p.slug}
                      {p.images.length === 0 && (
                        <span className="text-red"> · SANS PHOTO</span>
                      )}
                    </button>
                    <button
                      onClick={() => toggleMembership(p.slug, "band")}
                      disabled={bandFull}
                      title={
                        p.band != null
                          ? "Dans la bande · cliquer pour retirer"
                          : bandFull
                            ? "Bande pleine (6)"
                            : "Ajouter à la bande d'accueil"
                      }
                      className={`t-hud shrink-0 cursor-pointer rounded-sm border px-1 disabled:opacity-25 ${
                        p.band != null
                          ? "border-red bg-red/15 text-ink"
                          : "border-line-soft text-faint hover:text-ink"
                      }`}
                    >
                      B
                    </button>
                    <button
                      onClick={() => toggleMembership(p.slug, "grid")}
                      disabled={gridFull}
                      title={
                        p.grid != null
                          ? "Dans la grille · cliquer pour retirer"
                          : gridFull
                            ? "Grille pleine (6)"
                            : "Ajouter à la grille « La suite »"
                      }
                      className={`t-hud shrink-0 cursor-pointer rounded-sm border px-1 disabled:opacity-25 ${
                        p.grid != null
                          ? "border-red bg-red/15 text-ink"
                          : "border-line-soft text-faint hover:text-ink"
                      }`}
                    >
                      G
                    </button>
                    <button
                      title={
                        p.hidden
                          ? "Masqué de l'index · cliquer pour afficher"
                          : "Visible dans l'index · cliquer pour masquer"
                      }
                      onClick={() =>
                        update((l) =>
                          l.map((x) =>
                            x.slug === p.slug ? { ...x, hidden: !x.hidden } : x
                          )
                        )
                      }
                      className={`shrink-0 cursor-pointer px-1 ${
                        p.hidden ? "text-faint" : "text-ink"
                      }`}
                    >
                      {p.hidden ? "◌" : "●"}
                    </button>
                    <button
                      onClick={() => update((l) => move(l, i, i - 1))}
                      disabled={i === 0}
                      aria-label="Monter"
                      className="cursor-pointer px-1 text-muted hover:text-ink disabled:opacity-25"
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => update((l) => move(l, i, i + 1))}
                      disabled={i === projects.length - 1}
                      aria-label="Descendre"
                      className="cursor-pointer px-1 text-muted hover:text-ink disabled:opacity-25"
                    >
                      ↓
                    </button>
                  </div>
                </li>
              );
            })}
          </ol>

          {/* nouveau projet */}
          <div className="mt-6 border border-line p-4">
            <p className="t-hud mb-3 text-muted">NOUVEAU PROJET</p>
            <input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Titre du projet"
              className="mb-3 w-full border border-line bg-transparent px-3 py-2 text-sm text-ink outline-none focus:border-red"
            />
            <div className="flex gap-3">
              <select
                value={newCategory}
                onChange={(e) =>
                  setNewCategory(e.target.value as Project["category"])
                }
                className="flex-1 border border-line bg-bg px-2 py-2 text-sm text-ink outline-none"
              >
                {Object.entries(CATEGORY_LABELS).map(([v, l]) => (
                  <option key={v} value={v}>
                    {l}
                  </option>
                ))}
              </select>
              <button
                onClick={addProject}
                disabled={!newTitle.trim()}
                className="t-hud-md cursor-pointer border border-line px-4 py-2 text-ink hover:border-red disabled:opacity-30"
              >
                + CRÉER
              </button>
            </div>
          </div>
        </section>

        {/* ------- fiche projet ------- */}
        <section>
          {!selected ? (
            <p className="t-hud mt-10 text-faint">
              ← CLIQUE SUR UN PROJET POUR LE MODIFIER
            </p>
          ) : (
            <div>
              <div className="mb-6 flex items-center justify-between gap-4">
                <h2 className="t-hud text-muted">
                  <span className="text-red">//</span>&nbsp;
                  {selected.title.toUpperCase()}
                </h2>
                <button
                  onClick={() => {
                    if (
                      confirm(
                        `Supprimer le projet « ${selected.title} » ?\n(Les fichiers photos restent sur le serveur.)`
                      )
                    ) {
                      update((l) => l.filter((p) => p.slug !== selected.slug));
                      setSelectedSlug(null);
                    }
                  }}
                  className="t-hud cursor-pointer border border-line px-3 py-1.5 text-muted hover:border-red hover:text-red"
                >
                  SUPPRIMER LE PROJET
                </button>
              </div>

              {/* champs */}
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="TITRE (affiché en grand)">
                  <input
                    className={inputCls}
                    value={selected.title}
                    onChange={(e) => patchSelected({ title: e.target.value })}
                  />
                </Field>
                <Field label="LABEL DE CARTE (le « // NOM »)">
                  <input
                    className={inputCls}
                    value={selected.label}
                    onChange={(e) => patchSelected({ label: e.target.value })}
                  />
                </Field>
                <Field label="ANNÉE (index)">
                  <input
                    className={inputCls}
                    value={selected.year}
                    onChange={(e) => patchSelected({ year: e.target.value })}
                  />
                </Field>
                <Field label="CATÉGORIE">
                  <select
                    className={inputCls}
                    value={selected.category}
                    onChange={(e) =>
                      patchSelected({
                        category: e.target.value as Project["category"],
                      })
                    }
                  >
                    {Object.entries(CATEGORY_LABELS).map(([v, l]) => (
                      <option key={v} value={v}>
                        {l}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="DATE (texte libre, ex. « 25 & 26 août 2025 »)">
                  <input
                    className={inputCls}
                    value={selected.date}
                    onChange={(e) => patchSelected({ date: e.target.value })}
                  />
                </Field>
                <Field label="LIEU">
                  <input
                    className={inputCls}
                    value={selected.place}
                    onChange={(e) => patchSelected({ place: e.target.value })}
                  />
                </Field>
                <Field label="LIEN · TEXTE (ex. @artiste ou site.com)">
                  <input
                    className={inputCls}
                    value={selected.link?.label ?? ""}
                    onChange={(e) => {
                      const label = e.target.value;
                      patchSelected({
                        link: label
                          ? { label, href: selected.link?.href ?? "" }
                          : null,
                      });
                    }}
                  />
                </Field>
                <Field label="LIEN · URL (https://…)">
                  <input
                    className={inputCls}
                    value={selected.link?.href ?? ""}
                    onChange={(e) => {
                      const href = e.target.value;
                      patchSelected({
                        link: href
                          ? { href, label: selected.link?.label ?? href }
                          : selected.link?.label
                            ? { href: "", label: selected.link.label }
                            : null,
                      });
                    }}
                  />
                </Field>
              </div>
              <Field label="DESCRIPTION" className="mt-4">
                <textarea
                  className={`${inputCls} min-h-36 leading-relaxed`}
                  value={selected.desc}
                  onChange={(e) => patchSelected({ desc: e.target.value })}
                />
              </Field>

              {/* photos */}
              <div className="mt-10">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <h3 className="t-hud text-muted">
                    <span className="text-red">//</span>&nbsp;PHOTOS (
                    {selected.images.length}) · ★ = cover · ◆ = cover dans la
                    grille « La suite » · ◉ = montrée au survol · **glisse une
                    photo** (ou ← →) pour la déplacer
                  </h3>
                  <label className="t-hud-md cursor-pointer border border-line px-4 py-2 text-ink hover:border-red">
                    {uploading ? "ENVOI…" : "+ AJOUTER DES PHOTOS"}
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/avif"
                      multiple
                      hidden
                      disabled={uploading}
                      onChange={(e) => {
                        uploadFiles(e.target.files);
                        e.target.value = "";
                      }}
                    />
                  </label>
                </div>

                {selected.images.length === 0 ? (
                  <p className="t-hud border border-dashed border-line p-8 text-center text-faint">
                    AUCUNE PHOTO · LE PROJET N&apos;APPARAÎT PAS SUR LE SITE
                  </p>
                ) : (
                  <ul className="grid grid-cols-3 gap-3 sm:grid-cols-4 xl:grid-cols-6">
                    {selected.images.map((img, i) => {
                      const isCover = selected.cover?.src === img.src;
                      const isAlt = selected.altCover?.src === img.src;
                      return (
                        <li
                          key={img.src}
                          draggable
                          onDragStart={() => setDragIdx(i)}
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={(e) => {
                            e.preventDefault();
                            if (dragIdx === null || dragIdx === i) return;
                            patchSelected({
                              images: move(selected.images, dragIdx, i),
                            });
                            setDragIdx(null);
                          }}
                          onDragEnd={() => setDragIdx(null)}
                          className={`group/photo relative cursor-grab border transition-opacity active:cursor-grabbing ${
                            isCover ? "border-red" : "border-line-soft"
                          } ${dragIdx === i ? "opacity-40" : ""}`}
                        >
                          <Image
                            src={img.src}
                            alt=""
                            width={240}
                            height={240}
                            draggable={false}
                            className="pointer-events-none aspect-square w-full object-cover"
                          />
                          {isCover && (
                            <span className="t-hud absolute left-1 top-1 bg-red px-1.5 py-0.5 text-white">
                              COVER
                            </span>
                          )}
                          {img.hover && (
                            <span className="t-hud absolute right-1 top-1 bg-ink px-1.5 py-0.5 text-white">
                              HOVER
                            </span>
                          )}
                          {isAlt && (
                            <span
                              className={`t-hud absolute left-1 bg-ink/85 px-1.5 py-0.5 text-white ${
                                isCover ? "top-7" : "top-1"
                              }`}
                            >
                              GRILLE
                            </span>
                          )}
                          <div className="flex items-center justify-between bg-bg2 px-1 py-1">
                            <div className="flex items-center">
                              <button
                                title="Définir comme cover"
                                onClick={() => patchSelected({ cover: img })}
                                className={`t-hud cursor-pointer px-1 ${
                                  isCover
                                    ? "text-red"
                                    : "text-faint hover:text-ink"
                                }`}
                              >
                                ★
                              </button>
                              <button
                                title="Afficher au survol (carrousel de la carte)"
                                onClick={() =>
                                  patchSelected({
                                    images: selected.images.map((x) =>
                                      x.src === img.src
                                        ? { ...x, hover: !x.hover }
                                        : x
                                    ),
                                  })
                                }
                                className={`t-hud cursor-pointer px-1 ${
                                  img.hover
                                    ? "text-ink"
                                    : "text-faint hover:text-ink"
                                }`}
                              >
                                {img.hover ? "◉" : "○"}
                              </button>
                              <button
                                title="Cover dans la grille « La suite » (2e placement, évite le doublon avec la bande)"
                                onClick={() =>
                                  patchSelected({
                                    altCover: isAlt ? undefined : img,
                                  })
                                }
                                className={`t-hud cursor-pointer px-1 ${
                                  isAlt
                                    ? "text-ink"
                                    : "text-faint hover:text-ink"
                                }`}
                              >
                                ◆
                              </button>
                            </div>
                            <div className="flex">
                              <button
                                title="Reculer"
                                disabled={i === 0}
                                onClick={() =>
                                  patchSelected({
                                    images: move(selected.images, i, i - 1),
                                  })
                                }
                                className="cursor-pointer px-1 text-muted hover:text-ink disabled:opacity-25"
                              >
                                ←
                              </button>
                              <button
                                title="Avancer"
                                disabled={i === selected.images.length - 1}
                                onClick={() =>
                                  patchSelected({
                                    images: move(selected.images, i, i + 1),
                                  })
                                }
                                className="cursor-pointer px-1 text-muted hover:text-ink disabled:opacity-25"
                              >
                                →
                              </button>
                              <button
                                title="Retirer du projet"
                                onClick={() => {
                                  if (
                                    confirm(
                                      "Retirer cette photo du projet ?\n(Le fichier reste sur le serveur.)"
                                    )
                                  ) {
                                    patchSelected({
                                      images: selected.images.filter(
                                        (x) => x.src !== img.src
                                      ),
                                    });
                                  }
                                }}
                                className="cursor-pointer px-1 text-muted hover:text-red"
                              >
                                ✕
                              </button>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

const inputCls =
  "w-full border border-line bg-transparent px-3 py-2 text-sm text-ink outline-none focus:border-red";

function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="t-hud mb-1.5 block text-faint">{label}</span>
      {children}
    </label>
  );
}
