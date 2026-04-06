import Link from "next/link";
import { requireMomentumUser } from "@/lib/momentum/session";
import { getPublishedTrackWithLessons } from "@/lib/momentum/content";
import { db } from "@/lib/db";
import type { MomentumLessonProgress } from "@prisma/client";

export default async function MomentumPathsPage() {
  const user = await requireMomentumUser();
  const track = await getPublishedTrackWithLessons();
  const progress: MomentumLessonProgress[] = track
    ? await db.momentumLessonProgress.findMany({
        where: { userId: user.id },
      })
    : [];
  const done = new Set(progress.filter((p: MomentumLessonProgress) => p.status === "COMPLETED").map((p) => p.lessonId));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-foreground">Learning paths</h1>
      {!track ? (
        <p className="text-sm text-muted-foreground">No published track. Seed content or publish from admin.</p>
      ) : (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-medium text-foreground">{track.title}</h2>
            <p className="text-sm text-muted-foreground">{track.description}</p>
          </div>
          {track.modules.map((mod: (typeof track.modules)[number]) => (
            <div key={mod.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="font-mono text-xs uppercase text-muted-foreground">{mod.title}</div>
              <ul className="mt-3 space-y-2">
                {mod.lessons.map((lesson: (typeof mod.lessons)[number]) => (
                  <li key={lesson.id}>
                    <Link
                      href={`/momentum/app/paths/${track.slug}/${lesson.slug}`}
                      className="flex items-center justify-between text-sm text-accent hover:text-accent/90"
                    >
                      <span>{lesson.title}</span>
                      <span className="text-xs text-muted-foreground">{done.has(lesson.id) ? "Done" : `${lesson.estMinutes} min`}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
