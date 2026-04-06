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

  if (!userId) return

  const priceId = subscription.items.data[0]?.price.id
  let planType = "FREE"

  // Map price ID to plan type
  if (priceId === process.env.STRIPE_EDUCATOR_PRICE_ID) {
    planType = "EDUCATOR"
  } else if (priceId === process.env.STRIPE_INSTITUTION_PRICE_ID) {
    planType = "INSTITUTION"
  }

  // Update user subscription
  await db.user.update({
    where: { id: userId },
    data: {
      stripeSubscriptionId: subscription.id,
      subscriptionStatus: subscription.status,
      subscriptionPlan: planType,
      subscriptionCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
    },
  })

  // Update organization if exists
  if (organizationId) {
    await db.organization.update({
      where: { id: organizationId },
      data: {
        subscriptionPlan: planType,
        subscriptionStatus: subscription.status,
      },
    })
  }
}

async function handleSubscriptionCanceled(subscription: Stripe.Subscription) {
  const userId = subscription.metadata.userId
  const organizationId = subscription.metadata.organizationId

  if (!userId) return

  await db.user.update({
    where: { id: userId },
    data: {
      subscriptionStatus: "canceled",
      subscriptionPlan: "FREE",
    },
  })

  if (organizationId) {
    await db.organization.update({
      where: { id: organizationId },
      data: {
        subscriptionPlan: "FREE",
        subscriptionStatus: "canceled",
      },
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
