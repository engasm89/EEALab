import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function MomentumPricingPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-semibold text-foreground">Pricing</h1>
      <p className="mt-2 text-muted-foreground">
        Public list price matches the lab: <strong className="text-foreground">$39/mo</strong> for Pro. Founding
        members use Stripe coupons—no lifetime liability in the product layer.
      </p>
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="font-mono text-xs uppercase text-muted-foreground">Free</div>
          <div className="mt-2 text-2xl font-semibold">$0</div>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>Daily ritual (limited history)</li>
            <li>Starter path — first module</li>
            <li>Community read-only</li>
          </ul>
        </div>
        <div className="rounded-2xl border border-accent/30 bg-accent/5 p-6 eea-circuit-glow">
          <div className="font-mono text-xs uppercase text-accent">Pro</div>
          <div className="mt-2 text-2xl font-semibold">$39<span className="text-base font-normal text-muted-foreground">/mo</span></div>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>All self-serve paths & projects</li>
            <li>Weekly review & momentum analytics</li>
            <li>Community participation</li>
            <li>Async mentor Q&A queue</li>
          </ul>
          <Button asChild className="mt-6 w-full">
            <Link href="/momentum/app/billing">Subscribe</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
