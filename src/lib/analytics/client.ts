"use client";

import { getAttributionSnapshot } from "@/lib/analytics/attribution";

export async function trackClientEvent(payload: {
  eventName: string;
  projectSlug?: string;
  category?: string;
  fingerprint?: string;
  source?: string;
  metadata?: Record<string, unknown>;
}) {
  try {
    const attribution = getAttributionSnapshot();
    await fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, ...attribution }),
    });
  } catch {
    // analytics should not break UX
  }
}

