import type { Project } from "@/lib/types";
import { ProjectCard } from "@/components/ProjectCard";

export function ProjectsGridSection({ projects }: { projects: Project[] }) {
  return (
    <section id="projects" className="mx-auto w-full max-w-6xl px-4 pb-12">
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="text-xs font-semibold tracking-wide text-accent">ACTIVE BUILDS</div>
          <h2 className="mt-3 text-2xl font-semibold">Unfinished? No. In-progress with receipts.</h2>
          <p className="mt-2 text-sm text-muted">
            Every project has a problem, a measurable next step, and a build log you can follow.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((p) => (
          <ProjectCard key={p.id} project={p} />
        ))}
      </div>
    </section>
  );
}

