import type { Metadata } from "next";
import TravailleView from "@/components/TravailleView";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Ma méthode",
  description:
    "Ma méthode de A à Z : shooting, editing Lightroom et Photoshop, double exposition signature, stories réseaux et livraison en galerie privée haute définition.",
  path: "/travaille",
});

export default function TravaillePage() {
  return (
    <main>
      <TravailleView />
    </main>
  );
}
