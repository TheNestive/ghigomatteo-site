import type { Metadata } from "next";
import DroneContent from "@/components/pages/DroneContent";
import { buildMetadata } from "@/lib/seo";
import { getDict } from "@/i18n/dict";

export const metadata: Metadata = buildMetadata({
  ...getDict("en").meta.drone,
  path: "/drone",
  locale: "en",
});

export default function DronePageEn() {
  return <DroneContent locale="en" />;
}
