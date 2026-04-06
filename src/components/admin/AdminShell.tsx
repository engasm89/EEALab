"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
        <div className="text-sm font-semibold">Admin Console</div>
        <div className="flex items-center gap-2">
          <Link className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs" href="/admin">
            Dashboard
          </Link>
          <Link className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs" href="/admin/projects">
            Projects
          </Link>
          <Link className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs" href="/admin/moderation">
            Moderation
          </Link>
          <Link className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs" href="/admin/analytics">
            Analytics
          </Link>
          <button onClick={logout} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs">
            Logout
          </button>
        </div>
      </div>
      {children}
    </div>
  );
}

