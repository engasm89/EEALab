"use client";

import { useMemo, useState } from "react";
import { getFingerprintFromCookies } from "@/components/FingerprintCookie";
import { getAttributionSnapshot } from "@/lib/analytics/attribution";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function EmailCaptureSection() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [honeypot, setHoneypot] = useState("");

  const canSubmit = useMemo(() => {
    return name.trim().length >= 2 && isValidEmail(email);
  }, [name, email]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setStatus("submitting");
    setErrorMsg(null);

    try {
      const fingerprint = getFingerprintFromCookies() ?? undefined;
      const attribution = getAttributionSnapshot();
      const res = await fetch("/api/email/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, fingerprint, honeypot, ...attribution }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Request failed with ${res.status}`);
      }

      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  return (
    <section id="follow" className="mx-auto w-full max-w-6xl px-4 pb-16">
      <div className="eea-gridlines rounded-[2rem] border border-white/10 bg-white/5 p-6 md:p-10">
        <div className="grid gap-8 md:grid-cols-2 md:items-center">
          <div>
            <div className="text-xs font-semibold tracking-wide text-accent">FOLLOW WHAT I AM BUILDING</div>
            <h2 className="mt-3 text-2xl font-semibold">Early access to tools. Free build resources.</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Get behind-the-scenes updates, execution lessons, and practical templates you can reuse.
              No spam. Just shipping.
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-white/10 bg-background/30 p-5">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground" htmlFor="eea-name">
                Name
              </label>
              <input
                id="eea-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-accent/40"
                placeholder="Ashraf"
                autoComplete="name"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground" htmlFor="eea-email">
                Email
              </label>
              <input
                id="eea-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-accent/40"
                placeholder="you@domain.com"
                autoComplete="email"
              />
            </div>

            <button
              type="submit"
              disabled={!canSubmit || status === "submitting"}
              className="w-full rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-background shadow-[0_0_0_1px_rgba(36,246,255,0.35)] disabled:opacity-60"
            >
              {status === "submitting" ? "Joining..." : "Get early access"}
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
              <div className="rounded-xl border border-accent/25 bg-accent/10 p-4 text-sm text-foreground">
                You are in. Watch your inbox for the next lab update.
              </div>
            ) : null}

            {status === "error" ? (
              <div className="rounded-xl border border-red-400/25 bg-red-400/10 p-4 text-sm text-foreground">
                {errorMsg ?? "Signup failed. Try again."}
              </div>
            ) : null}
          </form>
        </div>
      </div>
    </section>
  );
}

