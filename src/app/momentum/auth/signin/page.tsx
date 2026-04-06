import type { Metadata } from "next";
import Link from "next/link";
import { CookieSignInForm } from "@/components/auth/cookie-signin-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Sign in — Kaizen Momentum",
  description: "Sign in to Kaizen Momentum",
};

export default function MomentumSignInPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <Card className="border-white/10 bg-card/80">
          <CardHeader className="text-center">
            <CardTitle>Kaizen Momentum</CardTitle>
            <CardDescription>Sign in to continue your engineering ritual</CardDescription>
          </CardHeader>
          <CardContent>
            <CookieSignInForm redirectTo="/momentum/app" />
            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">No account? </span>
              <Link href="/virtual-labs/auth/signup" className="text-primary hover:underline">
                Sign up via Labs
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
