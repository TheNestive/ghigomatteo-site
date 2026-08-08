export type Orient = "p" | "l" | "s";

export interface Img {
  src: string;
  w: number;
  h: number;
  o: Orient;
  group?: string;
  /** true = cette image fait partie du carrousel au survol de la carte.
      Si aucune image d'un projet n'est marquée, tout le carrousel s'affiche
      (compat). Réglable dans /admin. */
  hover?: boolean;
}

export interface Project {
  slug: string;
  category: "evenement" | "corporate" | "lifestyle";
  title: string;
  label: string;
  year: string;
  date: string;
  place: string;
  desc: string;
  link: { label: string; href: string } | null;
  cover: Img;
  /** cover « secondaire » utilisée quand le projet apparaît dans la grille
      « La suite » (évite le doublon avec la bande d'accueil). Choisie dans
      /admin. Si absente, la grille recadre la cover principale. */
  altCover?: Img;
  coverAspect: "3/4" | "4/3";
  counts: { portrait: number; landscape: number; total: number };
  format: "portrait" | "landscape" | "mixed";
  images: Img[];
  /** projet à dominante vidéo : la page affiche un lecteur / placeholder
      à la place de la galerie photo. `vimeo` = id numérique de la vidéo
      Vimeo (embed iframe) ; `src` = fichier vidéo direct ; sinon placeholder. */
  video?: { placeholder?: boolean; src?: string; vimeo?: string; label?: string };
  /** masqué de l'index « Tous les projets » (reste accessible via la bande /
      la grille / son URL). Réglable dans /admin. */
  hidden?: boolean;
  /** position (1..N) dans la bande d'accueil ; absent = pas dans la bande.
      Indépendant de l'ordre de l'index. Réglable dans /admin. */
  band?: number;
  /** position (1..N) dans la grille « La suite » ; absent = pas dans la
      grille. L'orientation vient du slot (quinconce). Réglable dans /admin. */
  grid?: number;
}

/** Nombre de projets dans la bande horizontale d'accueil. */
export const FEATURED_COUNT = 6;
/** Nombre de projets dans la grille verticale « La suite du travail ». */
export const GRID_COUNT = 6;
/** Lignes visibles de l'index avant le bouton « Voir plus ». */
export const INDEX_COLLAPSED = 10;

export const CATEGORY_LABELS: Record<Project["category"], string> = {
  evenement: "Événement",
  corporate: "Corporate",
  lifestyle: "Lifestyle",
};

/** Numéro type HUD : "04" */
export function pad(n: number): string {
  return String(n).padStart(2, "0");
}
