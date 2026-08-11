import type { Metadata } from "next";
import TravailleContent from "@/components/pages/TravailleContent";
import { buildMetadata } from "@/lib/seo";
import { getDict } from "@/i18n/dict";

export const metadata: Metadata = buildMetadata({
  ...getDict("en").meta.travaille,
  path: "/travaille",
  locale: "en",
});

export default function TravaillePageEn() {
  return <TravailleContent locale="en" />;
}
