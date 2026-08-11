import { loadPublicProjects } from "@/lib/serverData";
import HorizontalGallery from "@/components/HorizontalGallery";
import VerticalGallery, { type GridItem } from "@/components/VerticalGallery";
import ZoomParallax from "@/components/ZoomParallax";
import IndexList from "@/components/IndexList";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { siteJsonLd } from "@/lib/seo";
import type { Locale } from "@/i18n/config";

const BAND_COUNT = 6;
const GRID_COUNT = 6;
// motif d'orientation de la grille (quinconce) : colonne gauche = slots
// 0,2,4 → 2 paysages + 1 portrait ; colonne droite = slots 1,3,5 → 2
// portraits + 1 paysage. L'orientation dépend du slot, pas du projet.
const GRID_ASPECTS: ("3/4" | "4/3")[] = [
  "4/3",
  "3/4",
  "4/3",
  "3/4",
  "3/4",
  "4/3",
];

/**
 * Contenu de l'accueil, partagé par la route FR (/) et EN (/en).
 * La locale est passée à chaque composant porteur de texte.
 */
export default async function HomeContent({
  locale = "fr",
}: {
  locale?: Locale;
}) {
  const all = await loadPublicProjects();

  // Bande et grille = SÉLECTIONS marquées dans /admin (champs `band` / `grid`),
  // ordonnées par leur numéro de slot, indépendantes de l'ordre de la liste.
  const featured = all
    .filter((p) => p.band != null)
    .sort((a, b) => (a.band ?? 0) - (b.band ?? 0))
    .slice(0, BAND_COUNT);

  const grid: GridItem[] = all
    .filter((p) => p.grid != null)
    .sort((a, b) => (a.grid ?? 0) - (b.grid ?? 0))
    .slice(0, GRID_COUNT)
    .map((project, i) => ({
      project,
      aspect: GRID_ASPECTS[i] ?? "4/3",
      coverSrc: project.altCover?.src,
    }));

  // Index = tous les projets visibles, dans l'ORDRE de la liste (réordonnable
  // à la souris dans /admin) ; les masqués (◌) en sortent.
  const visible = all.filter((p) => !p.hidden);

  return (
    <main>
      <JsonLd data={siteJsonLd(locale)} />

      {/* SC.01 · arrivée : images en grand, le scroll part à droite */}
      <HorizontalGallery featured={featured} locale={locale} />

      {/* SC.02 · ça descend : grille éditoriale, orientations mixtes */}
      <VerticalGallery
        items={grid}
        startIndex={featured.length}
        locale={locale}
      />

      {/* SC.03 · zoom dans une seule image */}
      <ZoomParallax />

      {/* INDEX · tous les projets visibles, replié par défaut */}
      <IndexList items={visible} locale={locale} />

      {/* Footer : section pleine en flux normal (wordmark géant). */}
      <Footer locale={locale} />
    </main>
  );
}
