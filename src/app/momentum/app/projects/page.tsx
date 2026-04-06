import { requireMomentumUser } from "@/lib/momentum/session";
import { db } from "@/lib/db";
import { MomentumProjectsPanel } from "@/components/momentum/MomentumProjectsPanel";

export default async function MomentumProjectsPage() {
  await requireMomentumUser();
  const template = await db.momentumProjectTemplate.findFirst({
    where: { templateKey: "first-embedded-build" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Projects & labs</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Milestones, evidence, and submissions—engineering practice, not passive video.
        </p>
      </div>
      {template ? (
        <MomentumProjectsPanel templateKey={template.templateKey} />
      ) : (
        <p className="text-sm text-muted-foreground">No project template. Run `node prisma/seed-momentum.mjs`.</p>
      )}
    </div>
  );
}
