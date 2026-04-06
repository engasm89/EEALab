"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

export function RitualForm() {
  const [brainDump, setBrainDump] = useState("");
  const [highlight, setHighlight] = useState("");
  const [micro, setMicro] = useState("");
  const [lowEnergy, setLowEnergy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/momentum/ritual");
      const data = await res.json();
      const r = data.ritual;
      if (r) {
        setBrainDump(r.brainDump ?? "");
        setHighlight(r.highlightText ?? "");
        setMicro(r.microCommitment ?? "");
        setLowEnergy(r.mode === "low_energy");
        setDone(!!r.completedAt);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function save(partial: boolean) {
    setSaving(true);
    try {
      await fetch("/api/momentum/ritual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brainDump,
          highlightText: highlight,
          microCommitment: micro,
          mode: lowEnergy ? "low_energy" : "normal",
          finalize: !partial,
        }),
      });
      if (!partial) setDone(true);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="text-sm text-muted-foreground">Loading today&apos;s ritual…</p>;
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3">
        <div>
          <div className="text-sm font-medium text-foreground">Low-energy mode</div>
          <div className="text-xs text-muted-foreground">Ritual-only or lighter steps still count.</div>
        </div>
        <Switch checked={lowEnergy} onCheckedChange={setLowEnergy} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="bd">Brain dump</Label>
        <Textarea
          id="bd"
          rows={4}
          value={brainDump}
          onChange={(e) => setBrainDump(e.target.value)}
          placeholder="What’s on your mind? Worries, ideas, blockers…"
          className="resize-y"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="hl">Daily highlight</Label>
        <Textarea
          id="hl"
          rows={2}
          value={highlight}
          onChange={(e) => setHighlight(e.target.value)}
          placeholder="One observable outcome for today"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="mc">Micro-commitment (10–25 min)</Label>
        <Textarea
          id="mc"
          rows={2}
          value={micro}
          onChange={(e) => setMicro(e.target.value)}
          placeholder="Specific step you can finish in one sitting"
        />
      </div>
      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="secondary" disabled={saving} onClick={() => save(true)}>
          Save draft
        </Button>
        <Button type="button" disabled={saving} onClick={() => save(false)}>
          {done ? "Update completion" : "Complete ritual"}
        </Button>
      </div>
      {done && <p className="text-sm text-accent2">Today&apos;s ritual is marked complete. Momentum is continuity, not perfection.</p>}
    </div>
  );
}
