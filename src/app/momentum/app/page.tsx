import Link from "next/link";
import { requireMomentumUser } from "@/lib/momentum/session";
import { db } from "@/lib/db";
import type { MomentumLessonProgress } from "@prisma/client";
import { getPublishedTrackWithLessons } from "@/lib/momentum/content";
import { gentleConsistencyScore, momentumScoreApprox } from "@/lib/momentum/insights";
import { hasActiveMomentumPro } from "@/lib/momentum/access";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function MomentumDashboardPage() {
  const user = await requireMomentumUser();
  await db.momentumProfile.upsert({
    where: { userId: user.id },
    create: { userId: user.id },
    update: {},
  });

  const day = new Date();
  const utcDay = new Date(Date.UTC(day.getUTCFullYear(), day.getUTCMonth(), day.getUTCDate()));
  const todayRitual = await db.momentumDailyRitual.findUnique({
    where: { userId_day: { userId: user.id, day: utcDay } },
  });

  const track = await getPublishedTrackWithLessons();
  const progressList: MomentumLessonProgress[] = track
    ? await db.momentumLessonProgress.findMany({
        where: { userId: user.id, lesson: { module: { trackId: track.id } } },
      })
    : [];
  const progressByLesson = new Map<string, MomentumLessonProgress>(
    progressList.map((p) => [p.lessonId, p]),
  );

  let nextLesson: { id: string; title: string; slug: string } | null = null;
  if (track) {
    outer: for (const mod of track.modules) {
      for (const lesson of mod.lessons) {
        const pr = progressByLesson.get(lesson.id);
        if (!pr || pr.status !== "COMPLETED") {
          nextLesson = { id: lesson.id, title: lesson.title, slug: lesson.slug };
          break outer;
        }
      }
    }
  }

  const activeProject = await db.momentumUserProject.findFirst({
    where: { userId: user.id, status: "ACTIVE" },
    include: {
      template: { include: { milestones: { orderBy: { sortOrder: "asc" } } } },
      completions: true,
    },
  });

  const consistency = await gentleConsistencyScore(user.id);
  const momentum = await momentumScoreApprox(user.id);
  const pro = hasActiveMomentumPro(user);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          {pro ? "Pro active." : "Upgrade for full paths, projects, and community."}
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-white/10 bg-white/5">
          <CardHeader className="pb-2">
            <CardDescription>Momentum score</CardDescription>
            <CardTitle className="font-mono text-3xl text-accent">{momentum}</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">Approximation from ritual, lessons, milestones, reviews (14d).</CardContent>
        </Card>
        <Card className="border-white/10 bg-white/5">
          <CardHeader className="pb-2">
            <CardDescription>14-day consistency</CardDescription>
            <CardTitle className="font-mono text-3xl text-accent2">{consistency}%</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">Gentle streak: days with a completed ritual.</CardContent>
        </Card>
        <Card className="border-white/10 bg-white/5">
          <CardHeader className="pb-2">
            <CardDescription>Today&apos;s ritual</CardDescription>
            <CardTitle className="text-lg">{todayRitual?.completedAt ? "Done" : "Open"}</CardTitle>
          </CardHeader>
          <CardContent>
            <Button asChild size="sm" variant="secondary">
              <Link href="/momentum/app/ritual">{todayRitual?.completedAt ? "Edit ritual" : "Start ritual"}</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-white/10 bg-white/5">
          <CardHeader>
            <CardTitle>Continue learning</CardTitle>
            <CardDescription>Next step in your path</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {track && nextLesson ? (
              <>
                <p className="text-sm text-foreground">{nextLesson.title}</p>
                <Button asChild size="sm">
                  <Link href={`/momentum/app/paths/${track.slug}/${nextLesson.slug}`}>Open lesson</Link>
                </Button>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">No published path yet. Run seed or add content in admin.</p>
            )}
          </CardContent>
        </Card>
        <Card className="border-white/10 bg-white/5">
          <CardHeader>
            <CardTitle>Active project</CardTitle>
            <CardDescription>Hands-on evidence</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {activeProject ? (
              <>
                <p className="text-sm text-foreground">{activeProject.template.title}</p>
                <p className="text-xs text-muted-foreground">
                  {activeProject.completions.length}/{activeProject.template.milestones.length} milestones checked
                </p>
                <Button asChild size="sm" variant="secondary">
                  <Link href="/momentum/app/projects">View project</Link>
                </Button>
              </>
            ) : (
              <>
                <p className="text-sm text-muted-foreground">Start the capstone template when you&apos;re ready.</p>
                <Button asChild size="sm">
                  <Link href="/momentum/app/projects">Projects</Link>
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
