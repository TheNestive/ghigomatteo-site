import DroneView from "@/components/DroneView";
import JsonLd from "@/components/JsonLd";
import { siteJsonLd } from "@/lib/seo";
import type { Locale } from "@/i18n/config";

/** Contenu de la page Drone, partagé par les routes FR et EN. */
export default function DroneContent({
  locale = "fr",
}: {
  locale?: Locale;
}) {
  return (
    <main>
      <JsonLd data={siteJsonLd(locale)} />
      <DroneView locale={locale} />
    </main>
  );
}
