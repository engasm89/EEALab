"use client";

import { useState } from "react";
import { getFingerprintFromCookies } from "@/components/FingerprintCookie";
import { getAttributionSnapshot } from "@/lib/analytics/attribution";

export function LeadCaptureForm({ slug }: { slug: string }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [leadType, setLeadType] = useState<"course_waitlist" | "paid_beta" | "client_inquiry">("course_waitlist");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [msg, setMsg] = useState<string | null>(null);
  const [honeypot, setHoneypot] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMsg(null);
    const fingerprint = getFingerprintFromCookies() ?? "unknown";
    const attribution = getAttributionSnapshot();
    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slug,
        leadType,
        name,
        email,
        note,
        fingerprint,
        honeypot,
        ...attribution,
      }),
    });
    if (!res.ok) {
      setStatus("error");
      setMsg(await res.text());
      return;
    }
    setStatus("success");
    setMsg("Thanks. We will follow up.");
  }

  return (
    <form onSubmit={submit} className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="text-sm font-semibold">Get involved</div>
      <select value={leadType} onChange={(e) => setLeadType(e.target.value as typeof leadType)} className="w-full rounded-xl border border-white/10 bg-background/30 px-3 py-2 text-sm">
        <option value="course_waitlist">Join course waitlist</option>
        <option value="paid_beta">Request paid beta access</option>
        <option value="client_inquiry">Start client inquiry</option>
      </select>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name (optional)" className="w-full rounded-xl border border-white/10 bg-background/30 px-3 py-2 text-sm" />
      <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full rounded-xl border border-white/10 bg-background/30 px-3 py-2 text-sm" />
      <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} placeholder="Context or requirements" className="w-full rounded-xl border border-white/10 bg-background/30 px-3 py-2 text-sm" />
      <input
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
      />
      <button disabled={status === "loading"} className="w-full rounded-xl bg-accent px-3 py-2 text-sm font-semibold text-background disabled:opacity-60">
        {status === "loading" ? "Submitting..." : "Submit"}
      </button>
      {msg ? <div className="text-xs text-muted">{msg}</div> : null}
    </form>
  );
}

