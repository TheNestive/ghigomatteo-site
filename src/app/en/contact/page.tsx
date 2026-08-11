import type { Metadata } from "next";
import ContactContent from "@/components/pages/ContactContent";
import { buildMetadata } from "@/lib/seo";
import { getDict } from "@/i18n/dict";

export const metadata: Metadata = buildMetadata({
  ...getDict("en").meta.contact,
  path: "/contact",
  locale: "en",
});

export default function ContactPageEn() {
  return <ContactContent locale="en" />;
}
