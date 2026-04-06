import { db } from "@/lib/db";
import { requireAdminRole } from "@/lib/auth/admin";
import { createMomentumLessonAction, publishMomentumTrackAction } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default async function AdminMomentumPage() {
  await requireAdminRole();
  const tracks = await db.momentumTrack.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      modules: {
        orderBy: { sortOrder: "asc" },
        include: { _count: { select: { lessons: true } } },
      },
    },
  });

  type TrackRow = (typeof tracks)[number];
  type ModuleOption = { id: string; label: string };
  const modules: ModuleOption[] = tracks.flatMap((t: TrackRow) =>
    t.modules.map((m: TrackRow["modules"][number]) => ({ id: m.id, label: `${t.title} → ${m.title}` })),
  );

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Momentum CMS</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Tracks and lessons live in Postgres. Seed baseline content with{" "}
          <code className="rounded bg-white/10 px-1">node prisma/seed-momentum.mjs</code>.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Tracks</h2>
        <ul className="space-y-3">
          {tracks.map((t: TrackRow) => (
            <li key={t.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <div className="font-medium text-foreground">{t.title}</div>
                  <div className="text-xs text-muted-foreground">
                    /{t.slug} · {t.published ? "published" : "draft"} · {t.modules.length} modules
                  </div>
                </div>
                <form action={publishMomentumTrackAction} className="flex items-center gap-2">
                  <input type="hidden" name="trackId" value={t.id} />
                  <label className="flex items-center gap-2 text-xs text-muted-foreground">
                    <input type="checkbox" name="published" defaultChecked={t.published} />
                    Published
                  </label>
                  <Button type="submit" size="sm" variant="secondary">
                    Save
                  </Button>
                </form>
              </div>
              <ul className="mt-2 text-xs text-muted-foreground">
                {t.modules.map((m: TrackRow["modules"][number]) => (
                  <li key={m.id}>
                    {m.title} ({m._count.lessons} lessons)
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Add lesson</h2>
        <form action={createMomentumLessonAction} className="max-w-xl space-y-3 rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="space-y-1">
            <Label className="text-xs">Module</Label>
            <select
              name="moduleId"
              required
              className="flex h-9 w-full rounded-md border border-input bg-background px-2 text-sm"
            >
              <option value="">Select module</option>
              {modules.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Title</Label>
            <Input name="title" required placeholder="Lesson title" />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Slug (URL)</Label>
            <Input name="slug" required placeholder="my-lesson-slug" />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Est. minutes</Label>
            <Input name="estMinutes" type="number" defaultValue={15} />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Content (markdown-lite: **bold**, lists with - )</Label>
            <Textarea name="contentMd" rows={8} placeholder="Lesson body" />
          </div>
          <Button type="submit">Create lesson</Button>
        </form>
      </section>
    </div>
  );
}
