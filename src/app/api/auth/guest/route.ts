import { type NextRequest, NextResponse } from "next/server";
import { createGuestPayload, generateToken } from "@/lib/lab-auth";
import { GUEST_LOGIN_ENABLED } from "@/lib/platform-access";

export async function POST(request: NextRequest) {
  if (!GUEST_LOGIN_ENABLED) {
    return NextResponse.json({ error: "Guest login is disabled" }, { status: 403 });
  }

  const { redirectTo } = (await request.json().catch(() => ({}))) as { redirectTo?: string };
  const token = generateToken(createGuestPayload());
  const response = NextResponse.json({ ok: true, redirectTo: redirectTo || "/" });
  response.cookies.set("auth-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24,
  });
  return response;
}
