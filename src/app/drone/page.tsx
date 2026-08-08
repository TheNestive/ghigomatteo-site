import type { Metadata } from "next";
import DroneView from "@/components/DroneView";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Photographe & télépilote drone certifié",
  description:
    "Prises de vue aériennes par drone pour l'événementiel, l'immobilier et la nature. Télépilote certifié basé à Paris, disponible en France et à l'international.",
  path: "/drone",
});

export default function DronePage() {
  return (
    <main>
      <DroneView />
    </main>
  );
}
