"use client";

import { usePathname } from "next/navigation";
import { stripLocale } from "@/i18n/config";
import LocaleToggle from "./LocaleToggle";

/**
 * Bascule FR / EN en bas de CHAQUE page (sauf l'accueil, qui a déjà le toggle
 * dans son footer, et l'admin). Rendue dans le layout, après le contenu.
 */
export default function GlobalLocaleBar() {
  const pathname = usePathname() || "/";
  const neutral = stripLocale(pathname);
  if (neutral === "/" || neutral.startsWith("/admin")) return null;

  return (
    <div className="footer-panel flex justify-center border-t border-line-soft px-5 py-8 md:px-8">
      <LocaleToggle />
    </div>
  );
}
