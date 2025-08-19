import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// In-memory fallback (per process)
const memoryBuckets = new Map<string, number[]>();

function memoryLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const bucket = memoryBuckets.get(key) || [];
  const filtered = bucket.filter((t) => now - t < windowMs);
  if (filtered.length >= limit) {
    memoryBuckets.set(key, filtered);
    return true; // limited
  }
  filtered.push(now);
  memoryBuckets.set(key, filtered);
  return false;
}

let redis: Redis | null = null;
let rlApi: Ratelimit | null = null;
let rlAdmin: Ratelimit | null = null;

function ensureUpstash() {
  if (redis || (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN)) {
    if (!redis) {
      redis = new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL!,
        token: process.env.UPSTASH_REDIS_REST_TOKEN!,
      });
    }
    if (!rlApi) {
      const apiLimit = Number(process.env.RATE_LIMIT_API_PER_MIN || 100);
      rlApi = new Ratelimit({ redis: redis!, limiter: Ratelimit.slidingWindow(apiLimit, '60 s') });
    }
    if (!rlAdmin) {
      const adminLimit = Number(process.env.RATE_LIMIT_ADMIN_PER_MIN || 30);
      rlAdmin = new Ratelimit({ redis: redis!, limiter: Ratelimit.slidingWindow(adminLimit, '60 s') });
    }
  }
}

export async function isRateLimitedUpstash(key: string, isAdminBucket: boolean): Promise<boolean> {
  ensureUpstash();
  const windowMs = 60_000;

  // Upstash path
  if (rlApi && rlAdmin) {
    const rl = isAdminBucket ? rlAdmin! : rlApi!;
    const { success } = await rl.limit(key);
    return !success;
  }

  // Fallback memory
  const limit = isAdminBucket ? Number(process.env.RATE_LIMIT_ADMIN_PER_MIN || 30) : Number(process.env.RATE_LIMIT_API_PER_MIN || 100);
  return memoryLimit(key, limit, windowMs);
}

