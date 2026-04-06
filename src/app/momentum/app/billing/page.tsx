import { requireMomentumUser } from "@/lib/momentum/session";
import { hasActiveMomentumPro } from "@/lib/momentum/access";
import { MomentumBillingActions } from "@/components/momentum/MomentumBillingActions";
import { db } from "@/lib/db";

export default async function MomentumBillingPage() {
  const user = await requireMomentumUser();
  const pro = hasActiveMomentumPro(user);
  const sub = await db.momentumSubscription.findFirst({
    where: { userId: user.id },
    orderBy: { currentPeriodEnd: "desc" },
    include: { plan: true },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-foreground">Billing</h1>
      <p className="text-sm text-muted-foreground">
        Pro list price <strong className="text-foreground">$39/mo</strong> with 14-day trial. Founding offers use Stripe
        coupons.
      </p>
      {sub && (
        <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm">
          <div className="font-mono text-xs text-muted-foreground">Current</div>
          <div className="mt-1 text-foreground">
            {sub.plan.name} — {sub.status} (renews {sub.currentPeriodEnd.toISOString().slice(0, 10)})
          </div>
        </div>
      )}
      <MomentumBillingActions hasSubscription={!!sub} />
    </div>
  );
}
