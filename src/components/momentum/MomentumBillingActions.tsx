"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function MomentumBillingActions({ hasSubscription }: { hasSubscription: boolean }) {
  const [loading, setLoading] = useState<"checkout" | "portal" | null>(null);

  async function checkout() {
    setLoading("checkout");
    try {
      const res = await fetch("/api/momentum/billing/checkout", { method: "POST" });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else alert(data.error ?? "Checkout unavailable");
    } finally {
      setLoading(null);
    }
  }

  async function portal() {
    setLoading("portal");
    try {
      const res = await fetch("/api/momentum/billing/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else alert(data.error ?? "Portal unavailable");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button type="button" disabled={loading !== null} onClick={checkout}>
        {loading === "checkout" ? "Redirecting…" : "Start Pro trial ($39/mo)"}
      </Button>
      {hasSubscription && (
        <Button type="button" variant="secondary" disabled={loading !== null} onClick={portal}>
          {loading === "portal" ? "…" : "Manage billing"}
        </Button>
      )}
    </div>
  );
}
