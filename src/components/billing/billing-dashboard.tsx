"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CreditCard, Calendar, TrendingUp, AlertCircle } from "lucide-react"
import { SUBSCRIPTION_PLANS } from "@/lib/stripe"
import { useState } from "react"

interface BillingDashboardProps {
  user: {
    id: string
    subscriptionPlan: string
    subscriptionStatus: string | null
    subscriptionCurrentPeriodEnd: Date | null
    labRuns: Array<{ id: string }>
    organization: {
      name: string
    } | null
  }
}

export function BillingDashboard({ user }: BillingDashboardProps) {
  const [loading, setLoading] = useState(false)

  const currentPlan =
    SUBSCRIPTION_PLANS[user.subscriptionPlan as keyof typeof SUBSCRIPTION_PLANS] || SUBSCRIPTION_PLANS.FREE
  const monthlyRuns = user.labRuns.length
  const runLimit = currentPlan.limits.labRuns
  const usagePercentage = runLimit > 0 ? (monthlyRuns / runLimit) * 100 : 0

  const handleManageSubscription = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/billing/create-portal-session", {
        method: "POST",
      })
      const { url } = await response.json()
      if (url) window.location.href = url
    } catch (error) {
      console.error("Failed to create portal session:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>
      case "trialing":
        return <Badge className="bg-blue-100 text-blue-800">Trial</Badge>
      case "canceled":
        return <Badge className="bg-red-100 text-red-800">Canceled</Badge>
      default:
        return <Badge variant="secondary">Free</Badge>
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Billing & Usage</h1>
        <p className="text-gray-600">Manage your subscription and monitor your usage</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Plan</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentPlan.name}</div>
            <div className="flex items-center gap-2 mt-2">
              {getStatusBadge(user.subscriptionStatus)}
              <span className="text-sm text-gray-500">${currentPlan.price}/month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lab Runs This Month</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{monthlyRuns}</div>
            <div className="text-sm text-gray-500">{runLimit > 0 ? `of ${runLimit} included` : "Unlimited"}</div>
            {runLimit > 0 && <Progress value={usagePercentage} className="mt-2" />}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Billing Date</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {user.subscriptionCurrentPeriodEnd
                ? new Date(user.subscriptionCurrentPeriodEnd).toLocaleDateString()
                : "N/A"}
            </div>
            <p className="text-sm text-gray-500">
              {user.subscriptionStatus === "trialing" ? "Trial ends" : "Renews automatically"}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Plan Features</CardTitle>
            <CardDescription>What's included in your {currentPlan.name} plan</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {currentPlan.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  {feature}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Manage Subscription</CardTitle>
            <CardDescription>Update payment methods, view invoices, or cancel your subscription</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {user.subscriptionPlan === "FREE" ? (
              <div>
                <p className="text-sm text-gray-600 mb-4">Upgrade to unlock more features and higher usage limits.</p>
                <Button asChild>
                  <a href="/virtual-labs/pricing">View Plans</a>
                </Button>
              </div>
            ) : (
              <div>
                <p className="text-sm text-gray-600 mb-4">
                  Manage your billing details, payment methods, and download invoices.
                </p>
                <Button onClick={handleManageSubscription} disabled={loading}>
                  {loading ? "Loading..." : "Manage Subscription"}
                </Button>
              </div>
            )}

            {usagePercentage > 80 && runLimit > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-yellow-800">
                  <AlertCircle className="h-4 w-4" />
                  <span className="font-medium">Usage Warning</span>
                </div>
                <p className="text-sm text-yellow-700 mt-1">
                  You've used {usagePercentage.toFixed(0)}% of your monthly lab runs. Consider upgrading to avoid
                  interruptions.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
