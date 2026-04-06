import { WeeklyReviewForm } from "@/components/momentum/WeeklyReviewForm";
import { requireMomentumUser } from "@/lib/momentum/session";

export default async function MomentumWeeklyReviewPage() {
  await requireMomentumUser();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Weekly review</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Reflect, name reality, and set three small commitments. Feeds your momentum score.
        </p>
      </div>
      <WeeklyReviewForm />
    </div>
  );
}
