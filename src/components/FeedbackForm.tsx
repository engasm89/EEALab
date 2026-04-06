"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getFingerprintFromCookies } from "@/components/FingerprintCookie";
import { getAttributionSnapshot } from "@/lib/analytics/attribution";

function setFingerprintCookieIfMissing() {
  const existing = getFingerprintFromCookies();
  if (existing) return existing;

  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  document.cookie = `eea_fingerprint=${encodeURIComponent(id)}; path=/; max-age=31536000; samesite=lax`;
  return id;
}

export function FeedbackForm({ slug }: { slug: string }) {
  const router = useRouter();
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [honeypot, setHoneypot] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const safe = comment.trim();
    if (safe.length < 5) return;

    setStatus("submitting");
    setErrorMsg(null);

    try {
      const fingerprint = setFingerprintCookieIfMissing();
      const attribution = getAttributionSnapshot();
      const res = await fetch("/api/projects/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, fingerprint, comment: safe, honeypot, ...attribution }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to submit feedback");
      }

      setStatus("success");
      router.refresh();
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="text-sm font-semibold">What should I improve?</div>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={4}
        className="w-full rounded-xl border border-white/10 bg-background/30 px-4 py-3 text-sm outline-none focus:border-accent/40"
        placeholder="Be specific. If you tried the demo, tell me what confused you or what would make it usable."
      />
      <button
        type="submit"
        disabled={status === "submitting" || comment.trim().length < 5}
        className="inline-flex w-full items-center justify-center rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-background shadow-[0_0_0_1px_rgba(36,246,255,0.35)] disabled:opacity-60"
      >
        {status === "submitting" ? "Sending..." : "Submit feedback"}
      </button>
      <input
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
      />
      {status === "success" ? (
        <div className="rounded-xl border border-accent/25 bg-accent/10 p-3 text-sm text-foreground">
          Feedback sent. Thanks for pushing the build forward.
        </div>
      ) : null}
      {status === "error" ? (
        <div className="rounded-xl border border-red-400/25 bg-red-400/10 p-3 text-sm text-foreground">
          {errorMsg ?? "Could not submit. Try again."}
        </div>
      ) : null}
    </form>
  );
}

