import type { BuildLogEntry } from "@/lib/types";

export function BuildLogTimeline({ entries }: { entries: BuildLogEntry[] }) {
  if (!entries.length) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-muted">
        No build logs yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {entries.map((e, idx) => {
        const when = new Date(e.created_at).toLocaleString(undefined, {
          year: "numeric",
          month: "short",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        });

        return (
          <div key={e.id} className="group relative rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="absolute left-5 top-5 hidden h-[calc(100%_-_20px)] w-[1px] bg-white/10 group-first:block" />
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="text-xs font-semibold text-muted">
                  {when} {e.phase ? `• ${e.phase}` : ""}
                </div>
                <div className="text-sm leading-relaxed text-foreground">{e.message}</div>
              </div>
              <div className="mt-1 hidden h-3 w-3 rounded-full border border-accent/40 bg-accent/10 eea-circuit-glow sm:block" />
            </div>
            {idx === entries.length - 1 ? <div className="mt-2 text-xs text-muted">Latest update</div> : null}
          </div>
        );
      })}
    </div>
  );
}

