"use client";

import Link from "next/link";
import type { MonetizationStage, Project, ProjectCategory } from "@/lib/types";
import { ProgressBar } from "@/components/ProgressBar";
import { StatusBadge } from "@/components/StatusBadge";
import { trackClientEvent } from "@/lib/analytics/client";
import { getFingerprintFromCookies } from "@/components/FingerprintCookie";

function MonetizationChip({ stage }: { stage: MonetizationStage }) {
  const tone: Record<MonetizationStage, string> = {
    Free: "border-accent/25 bg-accent/10 text-accent",
    Paid: "border-accent2/25 bg-accent2/10 text-accent2",
    MVP: "border-white/15 bg-white/6 text-muted",
    Scaled: "border-accent2/20 bg-accent2/5 text-accent2",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold ${tone[stage]}`}
    >
      {stage}
    </span>
  );
}

function CategoryPill({ category }: { category: ProjectCategory }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/12 bg-white/5 px-3 py-1 text-[11px] font-semibold text-muted">
      {category}
    </span>
  );
}

export function ProjectCard({ project }: { project: Project }) {
  function trackOpen() {
    trackClientEvent({
      eventName: "project_open_click",
      projectSlug: project.slug,
      category: project.category,
      fingerprint: getFingerprintFromCookies() ?? undefined,
      source: "projects_grid",
    });
  }

  return (
    <article className="group relative rounded-2xl border border-white/10 bg-card/70 p-5 backdrop-blur transition-transform hover:-translate-y-1 hover:border-accent/25">
      <div className="absolute inset-0 -z-10 opacity-0 transition-opacity group-hover:opacity-100">
        <div className="eea-gridlines h-full w-full rounded-2xl" />
      </div>

      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <StatusBadge status={project.status} />
          <div className="flex items-center gap-2">
            <CategoryPill category={project.category} />
            <MonetizationChip stage={project.monetization_stage} />
          </div>
        </div>
      </div>

      <h3 className="mt-4 text-base font-semibold tracking-tight md:text-lg">{project.name}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{project.description}</p>

      <div className="mt-5">
        <ProgressBar value={project.progress} />
      </div>

      <div className="mt-6 flex items-center justify-between gap-4">
        <Link
          href={`/projects/${project.slug}`}
          onClick={trackOpen}
          className="inline-flex items-center justify-center rounded-full bg-accent px-4 py-2 text-sm font-semibold text-background shadow-[0_0_0_1px_rgba(36,246,255,0.35),0_0_24px_rgba(36,246,255,0.18)] transition hover:brightness-110"
        >
          Open Project
        </Link>
        <div className="hidden text-xs text-muted md:block">
          Next: <span className="font-mono text-foreground">{project.next_step}</span>
        </div>
      </div>
    </article>
  );
}

