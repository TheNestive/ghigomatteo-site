import type { Metadata } from "next";
import ContactView from "@/components/ContactView";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Contact",
  description:
    "Un projet, une date, une idée ? Contactez Matteo Ghigo, photographe événementiel, corporate et lifestyle à Paris, disponible partout en France et à l'international.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <main>
      <ContactView />
    </main>
  );
}
