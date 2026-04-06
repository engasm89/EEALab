"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, CreditCard, Shield, Check } from "lucide-react"
import { SUBSCRIPTION_PLANS } from "@/lib/stripe"

export default function CheckoutPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [userLoading, setUserLoading] = useState(true)

  const planId = searchParams.get("plan") as keyof typeof SUBSCRIPTION_PLANS
  const plan = planId ? SUBSCRIPTION_PLANS[planId] : null

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/me")
        if (response.ok) {
          const userData = await response.json()
          setUser(userData)
        } else {
          router.push("/virtual-labs/auth/signin?callbackUrl=" + encodeURIComponent("/checkout?plan=" + planId))
        }
      } catch (error) {
        router.push("/virtual-labs/auth/signin?callbackUrl=" + encodeURIComponent("/checkout?plan=" + planId))
      } finally {
        setUserLoading(false)
      }
    }

    checkAuth()
  }, [router, planId])

  const handleCheckout = async () => {
    if (!plan || !user) return

    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/billing/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId: plan.priceId }),
      })

      const { url, error: apiError } = await response.json()

      if (apiError) {
        setError(apiError)
        return
      }

      if (url) {
        window.location.href = url
      }
    } catch (err) {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (!plan) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Invalid Plan</CardTitle>
            <CardDescription>The selected plan was not found.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <a href="/virtual-labs/pricing">View Pricing</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (userLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Subscription</h1>
            <p className="text-gray-600">Start your 14-day free trial today. Cancel anytime.</p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {plan.name} Plan
                <span className="text-2xl font-bold">${plan.price}/month</span>
              </CardTitle>
              <CardDescription>Everything you need to run engaging lab simulations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-500" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-blue-700 mb-2">
                  <Shield className="h-5 w-5" />
                  <span className="font-medium">14-Day Free Trial</span>
                </div>
                <p className="text-sm text-blue-600">
                  You won't be charged until your trial ends. Cancel anytime during the trial period.
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              <Button onClick={handleCheckout} disabled={loading} className="w-full" size="lg">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Start Free Trial"
                )}
              </Button>

              <p className="text-xs text-gray-500 text-center">
                By continuing, you agree to our Terms of Service and Privacy Policy. Powered by Stripe.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
