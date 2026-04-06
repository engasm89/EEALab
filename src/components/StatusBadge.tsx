import type { ProjectStatus } from "@/lib/types";

const statusConfig: Record<ProjectStatus, { label: string; tone: "accent" | "accent2" | "muted" }> = {
  idea: { label: "Idea", tone: "muted" },
  building: { label: "Building", tone: "accent" },
  testing: { label: "Testing", tone: "accent2" },
  live: { label: "Live", tone: "accent2" },
};

export function StatusBadge({ status }: { status: ProjectStatus }) {
  const cfg = statusConfig[status];
  const base =
    "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold tracking-wide";

  if (cfg.tone === "accent") {
    return <span className={`${base} border-accent/35 bg-accent/10 text-accent`}>{cfg.label}</span>;
  }
  if (cfg.tone === "accent2") {
    return <span className={`${base} border-accent2/35 bg-accent2/10 text-accent2`}>{cfg.label}</span>;
  }

  return <span className={`${base} border-white/15 bg-white/5 text-muted`}>{cfg.label}</span>;
}

