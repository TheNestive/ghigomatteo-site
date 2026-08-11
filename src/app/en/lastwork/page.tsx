import type { Metadata } from "next";
import LastworkContent from "@/components/pages/LastworkContent";
import { buildMetadata } from "@/lib/seo";
import { getDict } from "@/i18n/dict";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildMetadata({
  ...getDict("en").meta.lastwork,
  path: "/lastwork",
  locale: "en",
});

export default function LastworkPageEn() {
  return <LastworkContent locale="en" />;
}
