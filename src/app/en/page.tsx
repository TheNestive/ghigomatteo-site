import type { Metadata } from "next";
import HomeContent from "@/components/pages/HomeContent";
import { buildMetadata } from "@/lib/seo";
import { getDict } from "@/i18n/dict";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildMetadata({
  ...getDict("en").meta.home,
  path: "/",
  locale: "en",
  titleAbsolute: true,
});

export default function HomeEn() {
  return <HomeContent locale="en" />;
}
