import { MemoryRateLimitStore } from "@/lib/security/rateLimit/memoryStore";
import { RedisRateLimitStore } from "@/lib/security/rateLimit/redisStore";
import type { RateLimitStore } from "@/lib/security/rateLimit/types";

function max() {
  return Number(process.env.RATE_LIMIT_MAX ?? "20");
}

function windowMs() {
  return Number(process.env.RATE_LIMIT_WINDOW_MS ?? "60000");
}

let store: RateLimitStore | null = null;

function getStore() {
  if (store) return store;
  const backend = (process.env.RATE_LIMIT_STORE ?? "memory").toLowerCase();
  if (backend === "redis") {
    store = new RedisRateLimitStore();
    return store;
  }
  store = new MemoryRateLimitStore();
  return store;
}

export async function takeRateLimit(key: string) {
  const s = getStore();
  try {
    return await s.take(key, windowMs(), max());
  } catch {
    // Fail open with memory store fallback if redis is unavailable.
    const fallback = new MemoryRateLimitStore();
    return fallback.take(key, windowMs(), max());
  }
}

