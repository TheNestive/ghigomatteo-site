"use server";

import { cookies } from "next/headers";
import {
  PROPOSITION_COOKIE,
  PROPOSITION_PATH,
  accessToken,
  isValidCode,
} from "@/lib/propositionAuth";

export type UnlockState = { error: boolean };

export async function unlock(
  _prev: UnlockState,
  formData: FormData
): Promise<UnlockState> {
  const code = String(formData.get("code") || "");
  if (!isValidCode(code)) return { error: true };

  const store = await cookies();
  store.set(PROPOSITION_COOKIE, accessToken(code), {
    path: PROPOSITION_PATH,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 60,
  });
  return { error: false };
}
