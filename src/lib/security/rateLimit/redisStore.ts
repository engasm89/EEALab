import type { RateLimitResult, RateLimitStore } from "@/lib/security/rateLimit/types";

function getRedisEnv() {
  return {
    url: process.env.REDIS_URL,
    token: process.env.REDIS_TOKEN,
  };
}

export class RedisRateLimitStore implements RateLimitStore {
  async take(key: string, windowMs: number, max: number): Promise<RateLimitResult> {
    const { url, token } = getRedisEnv();
    if (!url || !token) {
      throw new Error("Missing REDIS_URL or REDIS_TOKEN");
    }

    // Upstash REST pipeline:
    // 1) INCR key
    // 2) PTTL key
    // 3) EXPIRE key if newly created (count == 1)
    const pipelineRes = await fetch(`${url}/pipeline`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([
        ["INCR", key],
        ["PTTL", key],
      ]),
    });

    if (!pipelineRes.ok) {
      throw new Error(`Redis pipeline failed: ${pipelineRes.status}`);
    }

    const results = (await pipelineRes.json()) as Array<{ result?: number }>;
    const count = Number(results[0]?.result ?? 0);
    let pttl = Number(results[1]?.result ?? -1);

    if (count === 1 || pttl < 0) {
      await fetch(`${url}/EXPIRE/${encodeURIComponent(key)}/${Math.ceil(windowMs / 1000)}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      pttl = windowMs;
    }

    return {
      allowed: count <= max,
      remaining: Math.max(0, max - count),
      resetAt: Date.now() + Math.max(0, pttl),
    };
  }
}

