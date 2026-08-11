"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { localeFromPathname } from "@/i18n/config";

/**
 * Met à jour l'attribut <html lang> côté client selon le pathname :
 * "en" sous /en, "fr" ailleurs. Le layout garde lang="fr" en statique
 * (valeur par défaut), ce composant l'ajuste à la navigation.
 */
export default function HtmlLang() {
  const pathname = usePathname();

  useEffect(() => {
    document.documentElement.lang = localeFromPathname(pathname);
  }, [pathname]);

  return null;
}
