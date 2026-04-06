"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export function AdminLoginClient({ nextPath }: { nextPath: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function loginWithPassword(e: React.FormEvent) {
    e.preventDefault();
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setStatus("error");
      setMessage("Supabase env is missing.");
      return;
    }

    setStatus("loading");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setStatus("error");
      setMessage(error.message);
      return;
    }
    router.push(nextPath);
    router.refresh();
  }

  async function loginWithMagicLink() {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setStatus("error");
      setMessage("Supabase env is missing.");
      return;
    }
    setStatus("loading");
    const redirectTo = `${window.location.origin}/admin`;
    const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: redirectTo } });
    if (error) {
      setStatus("error");
      setMessage(error.message);
      return;
    }
    setStatus("sent");
    setMessage("Magic link sent. Check your inbox.");
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <h1 className="text-2xl font-semibold">Admin Sign In</h1>
      <p className="mt-2 text-sm text-muted-foreground">Use your admin account to manage projects, moderation, and lifecycle.</p>

      <form onSubmit={loginWithPassword} className="mt-6 space-y-4">
        <input
          className="w-full rounded-xl border border-white/10 bg-background/40 px-3 py-2 text-sm"
          placeholder="admin@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          required
        />
        <input
          className="w-full rounded-xl border border-white/10 bg-background/40 px-3 py-2 text-sm"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          required
        />
        <button
          disabled={status === "loading"}
          type="submit"
          className="w-full rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-background disabled:opacity-60"
        >
          {status === "loading" ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <button
        onClick={loginWithMagicLink}
        disabled={status === "loading" || !email}
        className="mt-3 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold disabled:opacity-60"
      >
        Send magic link
      </button>

      {message ? <p className="mt-3 text-sm text-muted-foreground">{message}</p> : null}
    </div>
  );
}

