import Link from "next/link";
import { notFound } from "next/navigation";
import { requireMomentumUser } from "@/lib/momentum/session";
import { getLessonBySlugs } from "@/lib/momentum/content";
import { db } from "@/lib/db";
import { LessonMarkdown } from "@/components/momentum/LessonMarkdown";
import { CompleteLessonButton } from "@/components/momentum/CompleteLessonButton";
import { Button } from "@/components/ui/button";

type Props = { params: Promise<{ trackSlug: string; lessonSlug: string }> };

export default async function MomentumLessonPage({ params }: Props) {
  const user = await requireMomentumUser();
  const { trackSlug, lessonSlug } = await params;
  const row = await getLessonBySlugs(trackSlug, lessonSlug);
  if (!row) notFound();

  const { track, lesson } = row;

  await db.momentumLessonProgress.upsert({
    where: { userId_lessonId: { userId: user.id, lessonId: lesson.id } },
    create: { userId: user.id, lessonId: lesson.id, status: "IN_PROGRESS" },
    update: { status: "IN_PROGRESS" },
  });

  const prog = await db.momentumLessonProgress.findUnique({
    where: { userId_lessonId: { userId: user.id, lessonId: lesson.id } },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <Link href="/momentum/app/paths" className="text-muted-foreground hover:text-foreground">
          Paths
        </Link>
        <span className="text-muted-foreground">/</span>
        <span className="text-foreground">{track.title}</span>
      </div>
      <h1 className="text-2xl font-semibold text-foreground">{lesson.title}</h1>
      <p className="text-xs text-muted-foreground">~{lesson.estMinutes} min · {lesson.type}</p>
      <LessonMarkdown content={lesson.contentMd} />
      <div className="flex flex-wrap gap-2 pt-4">
        {prog?.status !== "COMPLETED" ? (
          <CompleteLessonButton lessonId={lesson.id} />
        ) : (
          <span className="text-sm text-accent2">Lesson completed</span>
        )}
        <Button asChild variant="outline" size="sm">
          <Link href="/momentum/app/paths">Back to path</Link>
        </Button>
      </div>
    </div>
  );
}
