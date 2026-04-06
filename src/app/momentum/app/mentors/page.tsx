import { requireMomentumUser } from "@/lib/momentum/session";

export default async function MomentumMentorsPage() {
  await requireMomentumUser();
  const calUrl = process.env.NEXT_PUBLIC_CAL_MOMENTUM_URL ?? "";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Office hours</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Book a slot with the team. Set <code className="rounded bg-white/10 px-1">NEXT_PUBLIC_CAL_MOMENTUM_URL</code>{" "}
          to your Cal.com (or other) embed URL.
        </p>
      </div>
      {calUrl ? (
        <div className="aspect-[4/3] min-h-[480px] w-full overflow-hidden rounded-xl border border-white/10 bg-black/20">
          <iframe title="Office hours" src={calUrl} className="h-full w-full border-0" />
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-white/20 bg-white/5 p-8 text-center text-sm text-muted-foreground">
          Calendar embed not configured. Add your public scheduling link to env and reload.
        </div>
      )}
    </div>
  );
}
