"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { localizePath, stripLocale, localeFromPathname } from "@/i18n/config";
import { getDict } from "@/i18n/dict";

/**
 * Bascule FR / EN. Conserve la page courante : calcule l'URL française
 * (chemin nu) et anglaise (préfixe /en) à partir du pathname actuel, et
 * marque la locale active.
 */
export default function LocaleToggle({
  className = "",
}: {
  className?: string;
}) {
  const pathname = usePathname() || "/";
  const current = localeFromPathname(pathname);
  const t = getDict(current).localeToggle;

  const neutral = stripLocale(pathname);
  const frHref = localizePath(neutral, "fr");
  const enHref = localizePath(neutral, "en");

  const base = "t-caps transition-colors";
  const active = "text-ink";
  const idle = "text-faint hover:text-ink";

  return (
    <div
      className={`flex items-center gap-2 ${className}`}
      aria-label={t.ariaLabel}
    >
      <Link
        href={frHref}
        aria-current={current === "fr" ? "true" : undefined}
        className={`${base} ${current === "fr" ? active : idle}`}
      >
        {t.fr}
      </Link>
      <span aria-hidden className="text-faint">
        /
      </span>
      <Link
        href={enHref}
        aria-current={current === "en" ? "true" : undefined}
        className={`${base} ${current === "en" ? active : idle}`}
      >
        {t.en}
      </Link>
    </div>
  );
}
