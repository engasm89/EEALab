import Stripe from "stripe"

const stripeSecret =
  process.env.STRIPE_SECRET_KEY ?? "sk_test_build_placeholder_not_for_production_000000000000"

export const stripe = new Stripe(stripeSecret, {
  apiVersion: "2025-02-24.acacia",
  typescript: true,
})

export const SUBSCRIPTION_PLANS = {
  FREE: {
    id: "free",
    name: "Free",
    price: 0,
    priceId: null,
    features: ["5 lab runs per month", "Basic simulations", "Community support", "Public labs only"],
    limits: {
      labRuns: 5,
      storageGB: 0.1,
      concurrentSessions: 1,
    },
  },
  EDUCATOR: {
    id: "educator",
    name: "Educator",
    price: 29,
    priceId: process.env.STRIPE_EDUCATOR_PRICE_ID,
    features: [
      "500 lab runs per month",
      "All simulations",
      "Priority support",
      "Private labs",
      "Student management",
      "Progress tracking",
    ],
    limits: {
      labRuns: 500,
      storageGB: 5,
      concurrentSessions: 10,
    },
  },
  INSTITUTION: {
    id: "institution",
    name: "Institution",
    price: 199,
    priceId: process.env.STRIPE_INSTITUTION_PRICE_ID,
    features: [
      "Unlimited lab runs",
      "All simulations",
      "Dedicated support",
      "Custom branding",
      "LTI integration",
      "Advanced analytics",
      "Multi-tenant management",
    ],
    limits: {
      labRuns: -1, // unlimited
      storageGB: 100,
      concurrentSessions: 100,
    },
  },
} as const

export type SubscriptionPlan = keyof typeof SUBSCRIPTION_PLANS
