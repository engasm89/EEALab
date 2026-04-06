export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  resetAt: number;
};

export interface RateLimitStore {
  take(key: string, windowMs: number, max: number): Promise<RateLimitResult>;
}

