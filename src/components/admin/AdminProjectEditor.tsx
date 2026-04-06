"use client";

import { useState } from "react";
import { AdminAssetUploader } from "@/components/admin/AdminAssetUploader";

type AdminProject = {
  id: string;
  name: string;
  slug: string;
  status: "idea" | "building" | "testing" | "live";
  category: "SaaS" | "Embedded Systems" | "AI Tools" | "Courses" | "Experiments";
  progress: number;
  description: string;
  problem: string;
  why: string;
  next_step: string;
  monetization_stage: "Free" | "Paid" | "MVP" | "Scaled";
  tech_stack: string[];
  demo_type: "iframe" | "screenshots" | "external";
  demo_url?: string | null;
  demo_embed_url?: string | null;
  screenshot_urls: string[];
  repo_url?: string | null;
  course_waitlist_url?: string | null;
  beta_url?: string | null;
  client_inquiry_url?: string | null;
};

export function AdminProjectEditor({ project }: { project: AdminProject }) {
  const [form, setForm] = useState(project);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  const set = <K extends keyof AdminProject>(key: K, value: AdminProject[K]) => setForm((f) => ({ ...f, [key]: value }));

  async function save() {
    setStatus("saving");
    setMessage(null);
    const res = await fetch(`/api/admin/projects/${project.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (!res.ok) {
      setStatus("error");
      setMessage(await res.text());
      return;
    }
    setStatus("saved");
    setMessage("Saved");
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <h2 className="text-lg font-semibold">Overview</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <Input label="Name" value={form.name} onChange={(v) => set("name", v)} />
          <Input label="Slug" value={form.slug} onChange={(v) => set("slug", v)} />
          <Select
            label="Status"
            value={form.status}
            options={["idea", "building", "testing", "live"]}
            onChange={(v) => set("status", v as AdminProject["status"])}
          />
          <Select
            label="Category"
            value={form.category}
            options={["SaaS", "Embedded Systems", "AI Tools", "Courses", "Experiments"]}
            onChange={(v) => set("category", v as AdminProject["category"])}
          />
          <Input
            label="Progress (0-100)"
            value={String(form.progress)}
            onChange={(v) => set("progress", Number(v) || 0)}
          />
          <Select
            label="Monetization stage"
            value={form.monetization_stage}
            options={["Free", "Paid", "MVP", "Scaled"]}
            onChange={(v) => set("monetization_stage", v as AdminProject["monetization_stage"])}
          />
        </div>
        <Textarea label="Description" value={form.description} onChange={(v) => set("description", v)} />
        <Textarea label="Problem" value={form.problem} onChange={(v) => set("problem", v)} />
        <Textarea label="Why it exists" value={form.why} onChange={(v) => set("why", v)} />
        <Textarea label="Next step" value={form.next_step} onChange={(v) => set("next_step", v)} />
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <h2 className="text-lg font-semibold">Tech + Media + Monetization Links</h2>
        <Input
          label="Tech stack (comma-separated)"
          value={form.tech_stack.join(", ")}
          onChange={(v) => set("tech_stack", v.split(",").map((x) => x.trim()).filter(Boolean))}
        />
        <Select
          label="Demo type"
          value={form.demo_type}
          options={["iframe", "screenshots", "external"]}
          onChange={(v) => set("demo_type", v as AdminProject["demo_type"])}
        />
        <Input label="Demo URL" value={form.demo_url ?? ""} onChange={(v) => set("demo_url", v || null)} />
        <Input
          label="Demo Embed URL"
          value={form.demo_embed_url ?? ""}
          onChange={(v) => set("demo_embed_url", v || null)}
        />
        <Input
          label="Screenshot URLs (comma-separated)"
          value={(form.screenshot_urls ?? []).join(", ")}
          onChange={(v) => set("screenshot_urls", v.split(",").map((x) => x.trim()).filter(Boolean))}
        />
        <Input label="Repo URL" value={form.repo_url ?? ""} onChange={(v) => set("repo_url", v || null)} />
        <Input
          label="Course waitlist URL"
          value={form.course_waitlist_url ?? ""}
          onChange={(v) => set("course_waitlist_url", v || null)}
        />
        <Input label="Paid beta URL" value={form.beta_url ?? ""} onChange={(v) => set("beta_url", v || null)} />
        <Input
          label="Client inquiry URL"
          value={form.client_inquiry_url ?? ""}
          onChange={(v) => set("client_inquiry_url", v || null)}
        />
      </section>

      {process.env.NEXT_PUBLIC_ENABLE_UPLOAD_PIPELINE !== "false" ? (
        <AdminAssetUploader projectId={project.id} />
      ) : null}

      <div className="flex items-center gap-3">
        <button onClick={save} className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-background">
          {status === "saving" ? "Saving..." : "Save project"}
        </button>
        {message ? <span className="text-sm text-muted">{message}</span> : null}
      </div>
    </div>
  );
}

function Input({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="text-xs text-muted">{label}</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} className="mt-1 w-full rounded-xl border border-white/10 bg-background/30 px-3 py-2 text-sm" />
    </label>
  );
}

function Textarea({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block mt-3">
      <span className="text-xs text-muted">{label}</span>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3} className="mt-1 w-full rounded-xl border border-white/10 bg-background/30 px-3 py-2 text-sm" />
    </label>
  );
}

function Select({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-xs text-muted">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-xl border border-white/10 bg-background/30 px-3 py-2 text-sm"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}

