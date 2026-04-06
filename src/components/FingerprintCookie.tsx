"use client";

import { useEffect } from "react";

const COOKIE_NAME = "eea_fingerprint";

function getCookie(name: string) {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return decodeURIComponent(parts.pop()!.split(";").shift() ?? "");
  return null;
}

function setCookie(name: string, value: string) {
  // Basic fingerprint persistence. Not cryptographically secure; used only for uniqueness control.
  document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; path=/; max-age=31536000; samesite=lax`;
}

export function FingerprintCookie() {
  useEffect(() => {
    const existing = getCookie(COOKIE_NAME);
    if (existing) return;
    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    setCookie(COOKIE_NAME, id);
  }, []);

  return null;
}

export function getFingerprintFromCookies() {
  return getCookie(COOKIE_NAME);
}

