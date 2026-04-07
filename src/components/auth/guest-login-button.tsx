"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function GuestLoginButton({ redirectTo }: { redirectTo: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function proceed() {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/guest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ redirectTo }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) return;
      router.push(data.redirectTo || redirectTo);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button type="button" variant="outline" className="w-full" onClick={proceed} disabled={loading}>
      {loading ? "Preparing guest session..." : "Continue as Guest (read-only)"}
    </Button>
  );
}
