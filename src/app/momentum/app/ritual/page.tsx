import { RitualForm } from "@/components/momentum/RitualForm";
import { requireMomentumUser } from "@/lib/momentum/session";

export default async function MomentumRitualPage() {
  await requireMomentumUser();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Daily ritual</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Brain dump → daily highlight → micro-commitment. Low-energy days still count toward continuity.
        </p>
      </div>
      <RitualForm />
    </div>
  );
}
