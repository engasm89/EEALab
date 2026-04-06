import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function MomentumMarketingPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <p className="font-mono text-xs font-semibold uppercase tracking-widest text-accent">Kaizen Momentum</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
        Your engineering growth operating system
      </h1>
      <p className="mt-4 text-lg text-muted-foreground">
        Small daily rituals, structured paths, and real projects—so you stop drowning in tutorials and start
        building embedded, IoT, and robotics skill that survives real life.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button asChild>
          <Link href="/momentum/auth/signin">Open the app</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/momentum/pricing">Pricing</Link>
        </Button>
      </div>
      <div className="mt-14 rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="font-mono text-sm font-semibold text-accent2">Daily ritual</h2>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
          <li>
            <strong className="text-foreground">Brain dump</strong> — clear mental RAM
          </li>
          <li>
            <strong className="text-foreground">Daily highlight</strong> — one observable outcome
          </li>
          <li>
            <strong className="text-foreground">Micro-commitment</strong> — 10–25 minutes, shippable
          </li>
        </ol>
      </div>
    </div>
  );
}
