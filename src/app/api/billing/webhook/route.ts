import { type NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { db } from "@/lib/db"
import type Stripe from "stripe"

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get("stripe-signature")!

    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret)

    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated":
        await handleSubscriptionChange(event.data.object as Stripe.Subscription)
        break

      case "customer.subscription.deleted":
        await handleSubscriptionCanceled(event.data.object as Stripe.Subscription)
        break

      case "invoice.payment_succeeded":
        await handlePaymentSucceeded(event.data.object as Stripe.Invoice)
        break

      case "invoice.payment_failed":
        await handlePaymentFailed(event.data.object as Stripe.Invoice)
        break
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 400 })
  }
}

async function handleSubscriptionChange(subscription: Stripe.Subscription) {
  const userId = subscription.metadata.userId
  const organizationId = subscription.metadata.organizationId

  if (subscription.metadata.product === "momentum" && userId) {
    await handleMomentumSubscriptionChange(subscription, userId)
    return
  }

  if (!userId) return

  const priceId = subscription.items.data[0]?.price.id
  let planType = "FREE"

  // Map price ID to plan type
  if (priceId === process.env.STRIPE_EDUCATOR_PRICE_ID) {
    planType = "EDUCATOR"
  } else if (priceId === process.env.STRIPE_INSTITUTION_PRICE_ID) {
    planType = "INSTITUTION"
  }

  // Update organization plan label if linked (Organization uses `plan` string)
  if (organizationId) {
    await db.organization.update({
      where: { id: organizationId },
      data: { plan: planType },
    })
  }
}

async function handleMomentumSubscriptionChange(subscription: Stripe.Subscription, userId: string) {
  const priceId = subscription.items.data[0]?.price.id
  let plan = await db.momentumBillingPlan.findFirst({
    where: { stripePriceId: priceId ?? "" },
  })
  if (!plan) {
    plan = await db.momentumBillingPlan.findFirst({
      where: { tier: "PRO" },
      orderBy: { createdAt: "asc" },
    })
  }
  if (!plan) return

  const customerId =
    typeof subscription.customer === "string" ? subscription.customer : subscription.customer.id

  const statusMap: Record<string, "ACTIVE" | "CANCELED" | "PAST_DUE" | "UNPAID" | "TRIALING"> = {
    active: "ACTIVE",
    canceled: "CANCELED",
    past_due: "PAST_DUE",
    unpaid: "UNPAID",
    trialing: "TRIALING",
  }
  const status = statusMap[subscription.status] ?? "ACTIVE"

  await db.momentumSubscription.upsert({
    where: { stripeSubscriptionId: subscription.id },
    create: {
      userId,
      planId: plan.id,
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscription.id,
      status,
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    },
    update: {
      status,
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    },
  })
}

async function handleSubscriptionCanceled(subscription: Stripe.Subscription) {
  const userId = subscription.metadata.userId
  const organizationId = subscription.metadata.organizationId

  if (subscription.metadata.product === "momentum" && userId) {
    await db.momentumSubscription.updateMany({
      where: { stripeSubscriptionId: subscription.id },
      data: { status: "CANCELED" },
    })
    return
  }

  if (!userId) return

  if (organizationId) {
    await db.organization.update({
      where: { id: organizationId },
      data: { plan: "FREE" },
    })
  }
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  // Log successful payment
  console.log("Payment succeeded for invoice:", invoice.id)
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  // Handle failed payment - could send notification email
  console.log("Payment failed for invoice:", invoice.id)
}
