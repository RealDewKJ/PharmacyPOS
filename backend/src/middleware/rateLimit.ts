import { redisService } from "../services/redis";

// Custom rate limiting middleware using Redis
export const authRateLimit = async (request: Request): Promise<{ allowed: boolean; message?: string }> => {
  const ip = request.headers.get("x-forwarded-for") || 
             request.headers.get("x-real-ip") || 
             "unknown";
  
  const key = `auth_rate_limit:${ip}`;
  const current = await redisService.get(key);
  const count = current ? parseInt(current) : 0;
  
  if (count >= 5) {
    return {
      allowed: false,
      message: "Too many login attempts. Please try again in 15 minutes."
    };
  }
  
  // Increment counter
  await redisService.set(key, (count + 1).toString(), 900); // 15 minutes
  
  return { allowed: true };
};

export class BruteForceProtection {
  static async recordFailedAttempt(
    identifier: string,
    type: "login" | "password"
  ): Promise<void> {
    const key = `failed_attempts:${type}:${identifier}`;
    const attempts = (await redisService.get(key)) || "0";
    const count = parseInt(attempts) + 1;

    await redisService.set(key, count.toString(), 900); // 15 minutes

    if (count >= 5) {
      await this.lockAccount(identifier, type);
    }
  }

  static async checkAccountLock(
    identifier: string,
    type: "login" | "password"
  ): Promise<boolean> {
    const lockKey = `account_locked:${type}:${identifier}`;
    const locked = await redisService.get(lockKey);
    return !!locked;
  }

  static async lockAccount(
    identifier: string,
    type: "login" | "password"
  ): Promise<void> {
    const lockKey = `account_locked:${type}:${identifier}`;
    await redisService.set(lockKey, "locked", 3600); // 1 hour

    // Log security event
    console.log(`SECURITY: Account locked for ${type} attempts: ${identifier}`);
  }
}
