"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

type Milestone = { id: string; title: string; sortOrder: number };
type Project = {
  id: string;
  status: string;
  template: { title: string; templateKey: string; milestones: Milestone[] };
  completions: { templateMilestoneId: string }[];
};

export function MomentumProjectsPanel({ templateKey }: { templateKey: string }) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [url, setUrl] = useState("");
  const [note, setNote] = useState("");
  const [milestoneId, setMilestoneId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/momentum/projects");
      const data = await res.json();
      const list = data.projects as Project[];
      const active = list.find((p) => p.status === "ACTIVE");
      setProject(active ?? null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function start() {
    await fetch("/api/momentum/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ templateKey }),
    });
    load();
  }

  async function toggleMilestone(mid: string, complete: boolean) {
    if (!project) return;
    await fetch(`/api/momentum/projects/${project.id}/milestone`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ templateMilestoneId: mid, complete }),
    });
    load();
  }

  async function submitEvidence() {
    if (!project) return;
    await fetch(`/api/momentum/projects/${project.id}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        templateMilestoneId: milestoneId,
        url: url || undefined,
        body: note || undefined,
      }),
    });
    setUrl("");
    setNote("");
    setMilestoneId(null);
    load();
  }

  if (loading) return <p className="text-sm text-muted-foreground">Loading project…</p>;

  if (!project) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/5 p-6">
        <p className="text-sm text-muted-foreground">Start the capstone to log milestones and evidence.</p>
        <Button className="mt-4" type="button" onClick={start}>
          Start project
        </Button>
      </div>
    );
  }

  const done = new Set(project.completions.map((c) => c.templateMilestoneId));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">{project.template.title}</h2>
        <p className="text-xs text-muted-foreground">Template: {project.template.templateKey}</p>
      </div>
      <ul className="space-y-2">
        {project.template.milestones.map((m) => (
          <li
            key={m.id}
            className="flex items-start justify-between gap-2 rounded-lg border border-white/10 bg-background/40 px-3 py-2"
          >
            <span className="text-sm text-foreground">{m.title}</span>
            <Button
              type="button"
              size="sm"
              variant={done.has(m.id) ? "secondary" : "default"}
              onClick={() => toggleMilestone(m.id, !done.has(m.id))}
            >
              {done.has(m.id) ? "Undo" : "Done"}
            </Button>
          </li>
        ))}
      </ul>
      <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-3">
        <div className="text-sm font-medium text-foreground">Submit evidence</div>
        <div className="space-y-1">
          <Label className="text-xs">Milestone (optional)</Label>
          <select
            className="flex h-9 w-full rounded-md border border-input bg-background px-2 text-sm"
            value={milestoneId ?? ""}
            onChange={(e) => setMilestoneId(e.target.value || null)}
          >
            <option value="">General</option>
            {project.template.milestones.map((m) => (
              <option key={m.id} value={m.id}>
                {m.title}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Link (repo, photo, doc)</Label>
          <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://…" />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Notes</Label>
          <Textarea rows={3} value={note} onChange={(e) => setNote(e.target.value)} />
        </div>
        <Button type="button" onClick={submitEvidence}>
          Save submission
        </Button>
      </div>
    </div>
  );
}
