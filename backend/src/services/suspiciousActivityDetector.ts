import { redisService } from './redis';
import { SecurityLogger } from '../utils/securityLogger';

export interface SuspiciousActivityPattern {
  pattern: string;
  threshold: number;
  timeWindow: number; // in seconds
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export class SuspiciousActivityDetector {
  private static patterns: SuspiciousActivityPattern[] = [
    {
      pattern: 'multiple_failed_logins',
      threshold: 5,
      timeWindow: 300, // 5 minutes
      severity: 'medium'
    },
    {
      pattern: 'rapid_login_attempts',
      threshold: 10,
      timeWindow: 60, // 1 minute
      severity: 'high'
    },
    {
      pattern: 'unusual_ip_location',
      threshold: 1,
      timeWindow: 3600, // 1 hour
      severity: 'medium'
    },
    {
      pattern: 'privilege_escalation_attempts',
      threshold: 3,
      timeWindow: 1800, // 30 minutes
      severity: 'high'
    },
    {
      pattern: 'data_access_anomaly',
      threshold: 20,
      timeWindow: 300, // 5 minutes
      severity: 'medium'
    }
  ];

  static async checkSuspiciousActivity(
    userId: string,
    activity: string,
    ip: string,
    additionalData?: any
  ): Promise<boolean> {
    const timestamp = Date.now();
    const key = `suspicious:${userId}:${activity}:${ip}`;
    
    try {
      // Get current count
      const currentCount = await redisService.get(key);
      const count = currentCount ? parseInt(currentCount) : 0;
      
      // Increment count
      await redisService.set(key, (count + 1).toString(), 3600); // 1 hour TTL
      
      // Check against patterns
      for (const pattern of this.patterns) {
        if (this.matchesPattern(activity, pattern.pattern)) {
          if (count + 1 >= pattern.threshold) {
            await this.logSuspiciousActivity(
              userId,
              activity,
              pattern,
              ip,
              count + 1,
              additionalData
            );
            return true;
          }
        }
      }
      
      return false;
    } catch (error) {
      console.error('Error checking suspicious activity:', error);
      return false;
    }
  }

  private static matchesPattern(activity: string, pattern: string): boolean {
    const activityLower = activity.toLowerCase();
    
    switch (pattern) {
      case 'multiple_failed_logins':
        return activityLower.includes('failed_login') || activityLower.includes('invalid_credentials');
      case 'rapid_login_attempts':
        return activityLower.includes('login_attempt');
      case 'unusual_ip_location':
        return activityLower.includes('login_attempt') || activityLower.includes('session_created');
      case 'privilege_escalation_attempts':
        return activityLower.includes('role_change') || activityLower.includes('privilege');
      case 'data_access_anomaly':
        return activityLower.includes('data_access') || activityLower.includes('sensitive_data');
      default:
        return false;
    }
  }

  private static async logSuspiciousActivity(
    userId: string,
    activity: string,
    pattern: SuspiciousActivityPattern,
    ip: string,
    count: number,
    additionalData?: any
  ) {
    const details = {
      pattern: pattern.pattern,
      threshold: pattern.threshold,
      actualCount: count,
      severity: pattern.severity,
      timeWindow: pattern.timeWindow,
      additionalData
    };

    SecurityLogger.logSuspiciousActivity(userId, activity, details);
    
    // If critical severity, also log as security violation
    if (pattern.severity === 'critical') {
      SecurityLogger.logSecurityViolation(
        `Critical suspicious activity detected: ${pattern.pattern}`,
        userId,
        ip,
        details
      );
    }
  }

  static async checkBruteForcePattern(ip: string, email: string): Promise<boolean> {
    const key = `brute_force:${ip}:${email}`;
    const timestamp = Date.now();
    
    try {
      const attempts = await redisService.get(key);
      const attemptCount = attempts ? parseInt(attempts) : 0;
      
      // Increment attempt count
      await redisService.set(key, (attemptCount + 1).toString(), 900); // 15 minutes TTL
      
      // Check if this exceeds brute force threshold
      if (attemptCount + 1 >= 10) { // 10 attempts in 15 minutes
        SecurityLogger.logSecurityViolation(
          'Brute force attack detected',
          undefined,
          ip,
          { email, attemptCount: attemptCount + 1, timeWindow: '15 minutes' }
        );
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error checking brute force pattern:', error);
      return false;
    }
  }

  static async checkUnusualAccessPattern(userId: string, ip: string, resource: string): Promise<boolean> {
    const key = `access_pattern:${userId}:${ip}`;
    const timestamp = Date.now();
    
    try {
      // Get recent access pattern
      const patternData = await redisService.get(key);
      const pattern = patternData ? JSON.parse(patternData) : { resources: [], timestamps: [] };
      
      // Add current access
      pattern.resources.push(resource);
      pattern.timestamps.push(timestamp);
      
      // Keep only last 100 accesses
      if (pattern.resources.length > 100) {
        pattern.resources = pattern.resources.slice(-100);
        pattern.timestamps = pattern.timestamps.slice(-100);
      }
      
      // Save updated pattern
      await redisService.set(key, JSON.stringify(pattern), 3600); // 1 hour TTL
      
      // Check for unusual patterns (accessing many different resources quickly)
      const recentAccesses = pattern.timestamps.filter((ts: number) => timestamp - ts < 300000); // 5 minutes
      const uniqueResources = new Set(pattern.resources.slice(-recentAccesses.length));
      
      if (recentAccesses.length > 15 && uniqueResources.size > 10) {
        SecurityLogger.logSuspiciousActivity(
          userId,
          'unusual_access_pattern',
          {
            pattern: 'unusual_access_pattern',
            threshold: 15,
            actualCount: recentAccesses.length,
            uniqueResources: uniqueResources.size,
            severity: 'medium',
            timeWindow: 300
          }
        );
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error checking unusual access pattern:', error);
      return false;
    }
  }
}
