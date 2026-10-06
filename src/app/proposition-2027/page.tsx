import type { Metadata } from "next";
import { cookies } from "next/headers";
import PropositionGate from "@/components/PropositionGate";
import PropositionView from "@/components/PropositionView";
import { PROPOSITION_COOKIE, isValidToken } from "@/lib/propositionAuth";

// lit le cookie d'accès à chaque requête
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Proposition d’accompagnement photographique · Saison 2027",
  robots: { index: false, follow: false },
};

export default async function PropositionPage() {
  const store = await cookies();
  const granted = isValidToken(store.get(PROPOSITION_COOKIE)?.value);

  return <main>{granted ? <PropositionView /> : <PropositionGate />}</main>;
}
