import type { FeedbackItem } from "@/lib/types";

export function PublicFeedbackList({ items }: { items: FeedbackItem[] }) {
  if (!items.length) {
    return (
      <div className="rounded-xl border border-white/10 bg-background/20 p-4 text-sm text-muted-foreground">
        No approved feedback published yet.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.id} className="rounded-xl border border-white/10 bg-background/20 p-4">
          <div className="text-sm text-foreground">{item.comment}</div>
          <div className="mt-2 text-xs text-muted-foreground">
            {new Date(item.created_at).toLocaleDateString()} {item.is_featured ? "• Featured" : ""}
          </div>
        </div>
      ))}
    </div>
  );
}

