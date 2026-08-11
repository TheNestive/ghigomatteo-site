/* ------------------------------------------------------------------ *
 * i18n : configuration de base (locales, helpers de chemin).
 * FR = langue par défaut, servie à la racine ("/").
 * EN = servie sous le préfixe "/en".
 * ------------------------------------------------------------------ */

export type Locale = "fr" | "en";

export const locales = ["fr", "en"] as const;
export const defaultLocale: Locale = "fr";

/** Retire le préfixe de locale d'un pathname ("/en/drone" → "/drone"). */
export function stripLocale(pathname: string): string {
  if (pathname === "/en") return "/";
  if (pathname.startsWith("/en/")) return pathname.slice(3);
  return pathname || "/";
}

/**
 * Localise un chemin NEUTRE (sans préfixe) vers la locale demandée.
 * - en → préfixe "/en" ("/" → "/en", "/drone" → "/en/drone")
 * - fr → chemin nu (le préfixe éventuel est retiré)
 * Les ancres et query (#..., ?...) sont préservées telles quelles.
 */
export function localizePath(path: string, locale: Locale): string {
  const sepIdx = path.search(/[#?]/);
  const pathname = sepIdx === -1 ? path : path.slice(0, sepIdx);
  const rest = sepIdx === -1 ? "" : path.slice(sepIdx);
  const neutral = stripLocale(pathname);

  if (locale === "en") {
    const p = neutral === "/" ? "/en" : `/en${neutral}`;
    return p + rest;
  }
  return neutral + rest;
}

/** Déduit la locale à partir d'un pathname ("/en/..." → "en", sinon "fr"). */
export function localeFromPathname(pathname: string | null | undefined): Locale {
  if (!pathname) return defaultLocale;
  return pathname === "/en" || pathname.startsWith("/en/") ? "en" : "fr";
}
