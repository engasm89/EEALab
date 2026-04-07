import { type NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/lab-auth";
import { GUEST_LOGIN_ENABLED, GUEST_READ_ONLY } from "@/lib/platform-access";

export type AuthActor = {
  id: string;
  email?: string;
  name?: string;
  guest?: boolean;
};

export function getAuthActorFromRequest(request: NextRequest): AuthActor | null {
  const token = request.cookies.get("auth-token")?.value;
  if (!token) return null;
  const payload = verifyToken(token) as AuthActor | null;
  if (!payload?.id) return null;
  return payload;
}

export function isGuestActor(actor: AuthActor | null): boolean {
  return Boolean(actor?.guest);
}

export function blockGuestWrite(request: NextRequest): NextResponse | null {
  if (!GUEST_LOGIN_ENABLED || !GUEST_READ_ONLY) return null;
  const actor = getAuthActorFromRequest(request);
  if (isGuestActor(actor)) {
    return NextResponse.json(
      { error: "Guest mode is read-only. Disable guest mode or sign in with a real account to write." },
      { status: 403 },
    );
  }
  return null;
}
