import type { RateLimitResult, RateLimitStore } from "@/lib/security/rateLimit/types";

type Bucket = { count: number; resetAt: number };

const memory = new Map<string, Bucket>();

export class MemoryRateLimitStore implements RateLimitStore {
  async take(key: string, windowMs: number, max: number): Promise<RateLimitResult> {
    const now = Date.now();
    const current = memory.get(key);

    if (!current || now >= current.resetAt) {
      memory.set(key, { count: 1, resetAt: now + windowMs });
      return { allowed: true, remaining: max - 1, resetAt: now + windowMs };
    }

    current.count += 1;
    memory.set(key, current);
    return {
      allowed: current.count <= max,
      remaining: Math.max(0, max - current.count),
      resetAt: current.resetAt,
    };
  }
}

