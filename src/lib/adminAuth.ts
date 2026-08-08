export const ADMIN_HEADER = "x-admin-key";

export function adminPassword(): string {
  return process.env.ADMIN_PASSWORD || "";
}

/** Vérifie l'en-tête d'authentification d'une requête d'API admin. */
export function isAuthorized(req: Request): boolean {
  const pwd = adminPassword();
  if (!pwd) return false;
  return req.headers.get(ADMIN_HEADER) === pwd;
}

export function unauthorized(): Response {
  return Response.json(
    { error: "Non autorisé" },
    { status: 401 }
  );
}
