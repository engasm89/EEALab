import { type NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/lab-auth";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";

function userIdFromRequest(request: NextRequest): string | null {
  const token = request.cookies.get("auth-token")?.value;
  if (!token) return null;
  const p = verifyToken(token) as { id?: string } | null;
  return p?.id ?? null;
}

export async function POST(request: NextRequest) {
  const userId = userIdFromRequest(request);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const sub = await db.momentumSubscription.findFirst({
    where: { userId },
    orderBy: { currentPeriodEnd: "desc" },
  });
  if (!sub?.stripeCustomerId) {
    return NextResponse.json({ error: "No billing customer" }, { status: 400 });
  }

  const base = process.env.NEXTAUTH_URL ?? process.env.VERCEL_URL ?? "http://localhost:3000";
  const origin = base.startsWith("http") ? base : `https://${base}`;

  const portal = await stripe.billingPortal.sessions.create({
    customer: sub.stripeCustomerId,
    return_url: `${origin}/momentum/app/billing`,
  });

  return NextResponse.json({ url: portal.url });
}
