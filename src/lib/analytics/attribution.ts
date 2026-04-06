"use client";

export type AttributionData = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  referrer?: string;
  landing_path?: string;
  session_id?: string;
};

const KEY = "ashraflab_attribution_v1";

function getSessionId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function captureFirstTouchAttribution() {
  if (typeof window === "undefined") return;
  const existing = window.localStorage.getItem(KEY);
  if (existing) return;

  const params = new URLSearchParams(window.location.search);
  const payload: AttributionData = {
    utm_source: params.get("utm_source") ?? undefined,
    utm_medium: params.get("utm_medium") ?? undefined,
    utm_campaign: params.get("utm_campaign") ?? undefined,
    utm_content: params.get("utm_content") ?? undefined,
    referrer: document.referrer || undefined,
    landing_path: window.location.pathname,
    session_id: getSessionId(),
  };
  window.localStorage.setItem(KEY, JSON.stringify(payload));
}

export function getAttributionSnapshot(): AttributionData {
  if (typeof window === "undefined") return {};
  const raw = window.localStorage.getItem(KEY);
  if (!raw) return {};
  try {
    return JSON.parse(raw) as AttributionData;
  } catch {
    return {};
  }
}

