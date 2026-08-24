import type { Request, Response, NextFunction } from 'express';

interface RateLimitRecord {
  timestamps: number[];
}

const clientRequestStore = new Map<string, RateLimitRecord>();

// Cleanup stale records periodically (every 5 minutes)
setInterval(() => {
  const now = Date.now();
  const windowMs = 60 * 1000;
  for (const [key, record] of clientRequestStore.entries()) {
    record.timestamps = record.timestamps.filter(ts => now - ts < windowMs);
    if (record.timestamps.length === 0) {
      clientRequestStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

export function getRateLimitConfig() {
  const limit = parseInt(process.env.RATE_LIMIT_PER_MINUTE || '30', 10);
  return {
    limit: isNaN(limit) || limit <= 0 ? 30 : limit,
    windowMs: 60 * 1000
  };
}

export function rateLimiterMiddleware(req: Request, res: Response, next: NextFunction) {
  // Extract identifier (User ID header or IP)
  const userId = req.headers['x-user-id'] as string || req.body?.userId || req.ip || req.socket.remoteAddress || 'anonymous_user';
  const key = `ratelimit_${userId}`;
  
  const { limit, windowMs } = getRateLimitConfig();
  const now = Date.now();

  let record = clientRequestStore.get(key);
  if (!record) {
    record = { timestamps: [] };
    clientRequestStore.set(key, record);
  }

  // Filter timestamps within the rolling window
  record.timestamps = record.timestamps.filter(ts => now - ts < windowMs);

  const currentCount = record.timestamps.length;
  const remaining = Math.max(0, limit - currentCount - 1);
  const oldestTimestamp = record.timestamps[0] || now;
  const resetInSeconds = Math.ceil((oldestTimestamp + windowMs - now) / 1000);

  // Set standard rate limit headers
  res.setHeader('X-RateLimit-Limit', limit.toString());
  res.setHeader('X-RateLimit-Remaining', remaining.toString());
  res.setHeader('X-RateLimit-Reset', resetInSeconds.toString());

  if (currentCount >= limit) {
    res.status(429).json({
      error: 'Rate limit exceeded',
      message: `You have made too many requests. Nyay Sarthi allows up to ${limit} queries per minute. Please wait ${resetInSeconds} seconds before sending another message.`,
      retryAfter: resetInSeconds
    });
    return;
  }

  record.timestamps.push(now);
  next();
}
