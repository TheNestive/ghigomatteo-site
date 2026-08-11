import HomeContent from "@/components/pages/HomeContent";

// données lues à chaque requête : l'ordre réglé dans /admin s'applique
// aussitôt, sans rebuild
export const dynamic = "force-dynamic";

export default function Home() {
  return <HomeContent locale="fr" />;
}
