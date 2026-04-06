"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

export function WeeklyReviewForm() {
  const [wins, setWins] = useState("");
  const [struggles, setStruggles] = useState("");
  const [c1, setC1] = useState("");
  const [c2, setC2] = useState("");
  const [c3, setC3] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/momentum/weekly-review");
      const data = await res.json();
      const r = data.review;
      if (r?.responsesJson && typeof r.responsesJson === "object") {
        const resp = r.responsesJson as { wins?: string; struggles?: string };
        setWins(resp.wins ?? "");
        setStruggles(resp.struggles ?? "");
      }
      if (r?.commitmentsJson && Array.isArray(r.commitmentsJson)) {
        const arr = r.commitmentsJson as string[];
        setC1(arr[0] ?? "");
        setC2(arr[1] ?? "");
        setC3(arr[2] ?? "");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function save() {
    setSaving(true);
    try {
      await fetch("/api/momentum/weekly-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          wins,
          struggles,
          commitments: [c1, c2, c3].filter(Boolean),
        }),
      });
      load();
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="text-sm text-muted-foreground">Loading this week&apos;s review…</p>;

  return (
    <div className="mx-auto max-w-lg space-y-4">
      <div className="space-y-2">
        <Label>Wins (skill, not busywork)</Label>
        <Textarea rows={4} value={wins} onChange={(e) => setWins(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label>Struggles / blockers</Label>
        <Textarea rows={3} value={struggles} onChange={(e) => setStruggles(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label>Next week — micro-commitments</Label>
        <Input value={c1} onChange={(e) => setC1(e.target.value)} placeholder="Commitment 1" />
        <Input value={c2} onChange={(e) => setC2(e.target.value)} placeholder="Commitment 2" />
        <Input value={c3} onChange={(e) => setC3(e.target.value)} placeholder="Commitment 3" />
      </div>
      <Button type="button" disabled={saving} onClick={save}>
        Save weekly review
      </Button>
    </div>
  );
}
