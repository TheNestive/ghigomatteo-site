import ContactView from "@/components/ContactView";
import JsonLd from "@/components/JsonLd";
import { siteJsonLd } from "@/lib/seo";
import type { Locale } from "@/i18n/config";

/** Contenu de la page Contact, partagé par les routes FR et EN. */
export default function ContactContent({
  locale = "fr",
}: {
  locale?: Locale;
}) {
  return (
    <main>
      <JsonLd data={siteJsonLd(locale)} />
      <ContactView locale={locale} />
    </main>
  );
}
