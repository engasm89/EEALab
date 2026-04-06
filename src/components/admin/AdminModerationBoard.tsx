"use client";

import { useState } from "react";

type FeedbackRow = { id: string; comment: string; created_at: string; visibility_status?: string; is_featured?: boolean };
type RequestRow = { id: string; request_text: string; status: string; created_at: string };
type EventRow = { id: string; event_type: string; created_at: string; payload: Record<string, unknown> };

export function AdminModerationBoard({
  feedbackRows,
  requestRows,
  eventRows,
}: {
  feedbackRows: FeedbackRow[];
  requestRows: RequestRow[];
  eventRows: EventRow[];
}) {
  const [msg, setMsg] = useState<string | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [feedbackFilter, setFeedbackFilter] = useState<"pending" | "approved" | "rejected" | "all">("pending");
  const [sort, setSort] = useState<"newest" | "oldest">("newest");

  async function moderateFeedback(id: string, visibility: "approved" | "rejected") {
    const res = await fetch(`/api/admin/feedback/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visibility_status: visibility }),
    });
    setMsg(res.ok ? "Feedback updated." : await res.text());
  }

  async function moveRequest(id: string, status: "planned" | "in_progress" | "shipped" | "rejected") {
    const res = await fetch(`/api/admin/feature-requests/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setMsg(res.ok ? "Feature request updated." : await res.text());
  }

  async function bulk(action: "approve" | "reject") {
    if (!selected.length) return;
    const res = await fetch("/api/admin/moderation/bulk", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: selected, action }),
    });
    setMsg(res.ok ? "Bulk moderation applied." : await res.text());
  }

  const filteredFeedback = feedbackRows
    .filter((r) => (feedbackFilter === "all" ? true : (r.visibility_status ?? "pending") === feedbackFilter))
    .filter((r) => r.comment.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) =>
      sort === "newest"
        ? b.created_at.localeCompare(a.created_at)
        : a.created_at.localeCompare(b.created_at)
    );

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <h2 className="text-lg font-semibold">Pending Feedback</h2>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search feedback"
            className="rounded-xl border border-white/10 bg-background/20 px-3 py-1 text-xs"
          />
          <select value={feedbackFilter} onChange={(e) => setFeedbackFilter(e.target.value as typeof feedbackFilter)} className="rounded-xl border border-white/10 bg-background/20 px-3 py-1 text-xs">
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="all">All</option>
          </select>
          <select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)} className="rounded-xl border border-white/10 bg-background/20 px-3 py-1 text-xs">
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
          </select>
          <button onClick={() => void bulk("approve")} className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-background">Bulk approve</button>
          <button onClick={() => void bulk("reject")} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs">Bulk reject</button>
        </div>
        <div className="mt-3 space-y-3">
          {filteredFeedback.length ? (
            filteredFeedback.map((row) => (
              <div key={row.id} className="rounded-xl border border-white/10 bg-background/20 p-4">
                <label className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={selected.includes(row.id)}
                    onChange={(e) =>
                      setSelected((curr) =>
                        e.target.checked ? [...curr, row.id] : curr.filter((x) => x !== row.id)
                      )
                    }
                  />
                  Select
                </label>
                <div className="text-sm">{row.comment}</div>
                <div className="mt-2 flex gap-2">
                  <button onClick={() => void moderateFeedback(row.id, "approved")} className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-background">Approve</button>
                  <button onClick={() => void moderateFeedback(row.id, "rejected")} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs">Reject</button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No pending feedback.</p>
          )}
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <h2 className="text-lg font-semibold">Feature Requests Lifecycle</h2>
        <div className="mt-3 space-y-3">
          {requestRows.length ? (
            requestRows.map((row) => (
              <div key={row.id} className="rounded-xl border border-white/10 bg-background/20 p-4">
                <div className="text-sm">{row.request_text}</div>
                <div className="mt-1 text-xs text-muted-foreground">Current: {row.status}</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(["planned", "in_progress", "shipped", "rejected"] as const).map((s) => (
                    <button key={s} onClick={() => void moveRequest(row.id, s)} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs">
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No submitted feature requests.</p>
          )}
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <h2 className="text-lg font-semibold">Activity Timeline</h2>
        <div className="mt-3 space-y-2">
          {eventRows.length ? (
            eventRows.slice(0, 30).map((row) => (
              <div key={row.id} className="rounded-xl border border-white/10 bg-background/20 p-3">
                <div className="text-xs text-muted-foreground">{new Date(row.created_at).toLocaleString()}</div>
                <div className="text-sm">{row.event_type}</div>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No timeline events yet.</p>
          )}
        </div>
      </section>

      {msg ? <div className="text-sm text-muted-foreground">{msg}</div> : null}
    </div>
  );
}

