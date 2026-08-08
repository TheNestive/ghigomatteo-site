import { adminPassword } from "@/lib/adminAuth";

export async function POST(req: Request) {
  const { password } = await req.json().catch(() => ({ password: "" }));
  const pwd = adminPassword();
  if (!pwd) {
    return Response.json(
      { error: "ADMIN_PASSWORD non configuré sur le serveur" },
      { status: 500 }
    );
  }
  if (password !== pwd) {
    return Response.json({ error: "Mot de passe incorrect" }, { status: 401 });
  }
  return Response.json({ ok: true });
}
