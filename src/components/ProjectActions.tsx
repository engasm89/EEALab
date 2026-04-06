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

export function ProjectActions({
  slug,
  upvotes,
  featureRequests,
}: {
  slug: string;
  upvotes: number;
  featureRequests: number;
}) {
  const router = useRouter();
  const [upvoteStatus, setUpvoteStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [featureStatus, setFeatureStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [featureText, setFeatureText] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [honeypot, setHoneypot] = useState("");

  async function onUpvote() {
    setErrorMsg(null);
    setUpvoteStatus("submitting");

    try {
      const fingerprint = setFingerprintCookieIfMissing();
      const attribution = getAttributionSnapshot();
      const res = await fetch("/api/projects/upvote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, fingerprint, honeypot, ...attribution }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Upvote failed");
      }

      setUpvoteStatus("success");
      router.refresh();
    } catch (err) {
      setUpvoteStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Upvote failed");
    }
  }

  async function onRequestFeature(e: React.FormEvent) {
    e.preventDefault();
    const safe = featureText.trim();
    if (safe.length < 10) return;

    setErrorMsg(null);
    setFeatureStatus("submitting");

    try {
      const fingerprint = setFingerprintCookieIfMissing();
      const attribution = getAttributionSnapshot();
      const res = await fetch("/api/projects/request-feature", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, fingerprint, requestText: safe, honeypot, ...attribution }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Request failed");
      }

      setFeatureStatus("success");
      setFeatureText("");
      router.refresh();
    } catch (err) {
      setFeatureStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Request failed");
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={onUpvote}
          disabled={upvoteStatus === "submitting"}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-white/8 disabled:opacity-60"
        >
          {upvoteStatus === "submitting" ? "Upvoting..." : "Upvote this idea"}
          <span className="font-mono text-xs text-muted-foreground">+{upvotes}</span>
        </button>
        <input
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          className="hidden"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden
        />
        <div className="text-xs text-muted-foreground">
          Feature requests: <span className="font-semibold text-foreground">{featureRequests}</span>
        </div>
      </div>

      <form onSubmit={onRequestFeature} className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-5">
        <div className="text-sm font-semibold">Request this feature</div>
        <textarea
          value={featureText}
          onChange={(e) => setFeatureText(e.target.value)}
          rows={3}
          className="w-full rounded-xl border border-white/10 bg-background/30 px-4 py-3 text-sm outline-none focus:border-accent/40"
          placeholder="What’s the next thing that would make this useful? (Be specific.)"
        />
        <button
          type="submit"
          disabled={featureStatus === "submitting" || featureText.trim().length < 10}
          className="inline-flex w-full items-center justify-center rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-background shadow-[0_0_0_1px_rgba(36,246,255,0.35)] disabled:opacity-60"
        >
          {featureStatus === "submitting" ? "Submitting..." : "Send request"}
        </button>

        {upvoteStatus === "success" || featureStatus === "success" ? (
          <div className="rounded-xl border border-accent/25 bg-accent/10 p-3 text-sm text-foreground">
            Submitted. Your input becomes the next build iteration.
          </div>
        ) : null}

        {errorMsg ? (
          <div className="rounded-xl border border-red-400/25 bg-red-400/10 p-3 text-sm text-foreground">
            {errorMsg}
          </div>
        ) : null}
      </form>
    </div>
  );
}

