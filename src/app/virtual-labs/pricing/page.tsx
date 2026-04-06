import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Zap, Users, Building } from "lucide-react"
import { SUBSCRIPTION_PLANS } from "@/lib/stripe"
import Link from "next/link"

export default function PricingPage() {
  const plans = Object.values(SUBSCRIPTION_PLANS)

  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case "free":
        return <Zap className="h-6 w-6" />
      case "educator":
        return <Users className="h-6 w-6" />
      case "institution":
        return <Building className="h-6 w-6" />
      default:
        return <Zap className="h-6 w-6" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Plan</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Start with our free plan and upgrade as you grow. All plans include access to our simulation engine.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card key={plan.id} className={`relative ${index === 1 ? "border-blue-500 shadow-lg scale-105" : ""}`}>
              {index === 1 && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500">Most Popular</Badge>
              )}

              <CardHeader className="text-center pb-8">
                <div className="flex justify-center mb-4 text-blue-600">{getPlanIcon(plan.id)}</div>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription className="text-sm text-gray-500">
                  {plan.id === "free" && "Perfect for trying out our platform"}
                  {plan.id === "educator" && "Ideal for individual educators"}
                  {plan.id === "institution" && "Built for schools and organizations"}
                </CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  <span className="text-gray-500">/month</span>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </CardContent>

              <CardFooter>
                <Button
                  asChild
                  className={`w-full ${index === 1 ? "bg-blue-600 hover:bg-blue-700" : ""}`}
                  variant={index === 1 ? "default" : "outline"}
                >
                  <Link href={plan.id === "free" ? "/virtual-labs/auth/signup" : `/checkout?plan=${plan.id}`}>
                    {plan.id === "free" ? "Get Started Free" : "Start Free Trial"}
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="text-center mt-16">
          <p className="text-gray-600 mb-4">All paid plans include a 14-day free trial. No credit card required.</p>
          <p className="text-sm text-gray-500">
            Need a custom plan?{" "}
            <Link href="/virtual-labs/support/contact" className="text-blue-600 hover:underline">
              Contact us
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
