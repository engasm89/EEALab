import type { Metadata } from "next"
import Link from "next/link"
import { CookieSignInForm } from "@/components/auth/cookie-signin-form"
import { GuestLoginButton } from "@/components/auth/guest-login-button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Beaker } from "lucide-react"
import { GUEST_LOGIN_ENABLED } from "@/lib/platform-access"

export const metadata: Metadata = {
  title: "Sign In - Labs",
  description: "Sign in to your Labs account",
}

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-2">
            <Beaker className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">Labs</span>
          </div>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle>Welcome back</CardTitle>
            <CardDescription>Sign in to your account to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <CookieSignInForm redirectTo="/virtual-labs/dashboard" />
            {GUEST_LOGIN_ENABLED ? (
              <div className="mt-3">
                <GuestLoginButton redirectTo="/virtual-labs/dashboard" />
              </div>
            ) : null}
            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">Don't have an account? </span>
              <Link href="/virtual-labs/auth/signup" className="text-primary hover:underline">
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
