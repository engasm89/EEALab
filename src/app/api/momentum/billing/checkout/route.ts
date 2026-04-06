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

  const plan = await db.momentumBillingPlan.findFirst({
    where: { tier: "PRO" },
    orderBy: { createdAt: "asc" },
  });
  const priceId = plan?.stripePriceId ?? process.env.STRIPE_MOMENTUM_PRO_PRICE_ID;
  if (!priceId || priceId.includes("placeholder")) {
    return NextResponse.json(
      { error: "Stripe price not configured. Set STRIPE_MOMENTUM_PRO_PRICE_ID or seed momentum_billing_plans." },
      { status: 503 },
    );
  }

  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user?.email) return NextResponse.json({ error: "User email missing" }, { status: 400 });

  const existing = await db.momentumSubscription.findFirst({
    where: { userId, status: { in: ["ACTIVE", "TRIALING"] } },
  });

  let customerId = existing?.stripeCustomerId;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      name: user.name ?? undefined,
      metadata: { userId, product: "momentum" },
    });
    customerId = customer.id;
  }

  const base = process.env.NEXTAUTH_URL ?? process.env.VERCEL_URL ?? "http://localhost:3000";
  const origin = base.startsWith("http") ? base : `https://${base}`;

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${origin}/momentum/app/billing?checkout=success`,
    cancel_url: `${origin}/momentum/app/billing?checkout=cancel`,
    subscription_data: {
      trial_period_days: 14,
      metadata: { userId, product: "momentum" },
    },
    metadata: { userId, product: "momentum" },
  });

  return NextResponse.json({ url: session.url });
}
