/** Injecte un bloc JSON-LD (données structurées schema.org) dans le <head>/DOM.
    Server component : rendu côté serveur, lisible par les crawlers. */
export default function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
