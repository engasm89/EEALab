import type { FeatureRequest, FeatureRequestStatus } from "@/lib/types";

const order: FeatureRequestStatus[] = ["planned", "in_progress", "shipped", "submitted", "rejected"];
const labels: Record<FeatureRequestStatus, string> = {
  submitted: "Submitted",
  planned: "Planned",
  in_progress: "In Progress",
  shipped: "Shipped",
  rejected: "Rejected",
};

export function FeatureRequestBoard({ requests }: { requests: FeatureRequest[] }) {
  if (!requests.length) {
    return (
      <div className="rounded-xl border border-white/10 bg-background/20 p-4 text-sm text-muted-foreground">
        No feature requests yet.
      </div>
    );
  }

  return (
    <div className="grid gap-3 md:grid-cols-2">
      {order.map((status) => {
        const group = requests.filter((r) => r.status === status);
        if (!group.length) return null;
        return (
          <div key={status} className="rounded-xl border border-white/10 bg-background/20 p-4">
            <div className="text-sm font-semibold">{labels[status]}</div>
            <div className="mt-2 space-y-2">
              {group.slice(0, 4).map((r) => (
                <div key={r.id} className="rounded-lg border border-white/10 bg-background/30 p-3 text-xs text-muted-foreground">
                  <div className="text-sm text-foreground">{r.request_text}</div>
                  {r.public_note ? <div className="mt-1">{r.public_note}</div> : null}
                  {r.target_release ? <div className="mt-1">Target: {r.target_release}</div> : null}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

