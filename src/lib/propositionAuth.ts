import { createHash } from "node:crypto";

/** Accès à la proposition « Saison 2027 » : code unique défini en variable d'env. */
export const PROPOSITION_PATH = "/proposition-2027";
export const PROPOSITION_COOKIE = "gm_prop_2027";

export function propositionCode(): string {
  return (process.env.PROPOSITION_2027_CODE || "").trim();
}

const normalize = (code: string) => code.trim().toUpperCase();

/** Empreinte stockée dans le cookie : changer le code invalide les accès existants. */
export function accessToken(code: string): string {
  return createHash("sha256")
    .update(`gm-proposition-2027:${normalize(code)}`)
    .digest("hex");
}

export function isValidCode(input: string): boolean {
  const code = propositionCode();
  if (!code) return false;
  return normalize(input) === normalize(code);
}

export function isValidToken(token: string | undefined): boolean {
  const code = propositionCode();
  if (!code || !token) return false;
  return token === accessToken(code);
}
