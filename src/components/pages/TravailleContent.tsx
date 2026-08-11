import TravailleView from "@/components/TravailleView";
import JsonLd from "@/components/JsonLd";
import { siteJsonLd } from "@/lib/seo";
import type { Locale } from "@/i18n/config";

/** Contenu de la page Méthode, partagé par les routes FR et EN. */
export default function TravailleContent({
  locale = "fr",
}: {
  locale?: Locale;
}) {
  return (
    <main>
      <JsonLd data={siteJsonLd(locale)} />
      <TravailleView locale={locale} />
    </main>
  );
}
