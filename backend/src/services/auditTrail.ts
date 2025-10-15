import { SecurityLogger } from '../utils/securityLogger';
import { redisService } from './redis';

export interface AuditEvent {
  id: string;
  userId: string;
  action: string;
  resource: string;
  resourceId?: string;
  details: any;
  ip: string;
  userAgent?: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export class AuditTrailService {
  private static readonly AUDIT_KEY_PREFIX = 'audit:';
  private static readonly AUDIT_RETENTION_DAYS = 90; // Keep audit logs for 90 days

  static async logEvent(
    userId: string,
    action: string,
    resource: string,
    details: any,
    ip: string,
    userAgent?: string,
    resourceId?: string,
    severity: 'low' | 'medium' | 'high' | 'critical' = 'low'
  ): Promise<void> {
    const eventId = `audit_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    
    const auditEvent: AuditEvent = {
      id: eventId,
      userId,
      action,
      resource,
      resourceId,
      details,
      ip,
      userAgent,
      timestamp: new Date().toISOString(),
      severity
    };

    try {
      // Store in Redis with TTL
      const key = `${this.AUDIT_KEY_PREFIX}${eventId}`;
      await redisService.set(
        key,
        JSON.stringify(auditEvent),
        this.AUDIT_RETENTION_DAYS * 24 * 60 * 60 // Convert days to seconds
      );

      // Also log to security logger for immediate monitoring
      SecurityLogger.logDataAccess(userId, resource, action, ip);

      // For critical events, also log as security violation
      if (severity === 'critical') {
        SecurityLogger.logSecurityViolation(
          `Critical audit event: ${action} on ${resource}`,
          userId,
          ip,
          details
        );
      }
    } catch (error) {
      console.error('Failed to log audit event:', error);
      // Fallback to security logger only
      SecurityLogger.logSystemError('Audit logging failed', { eventId, error: error.message }, ip);
    }
  }

  static async getAuditEvents(
    userId?: string,
    resource?: string,
    action?: string,
    startDate?: Date,
    endDate?: Date,
    limit: number = 100
  ): Promise<AuditEvent[]> {
    try {
      // In a production system, you'd want to use a proper database for audit queries
      // For now, we'll return a subset from Redis (this is not efficient for large datasets)
      const pattern = `${this.AUDIT_KEY_PREFIX}*`;
      const keys = await redisService.keys(pattern);
      
      const events: AuditEvent[] = [];
      
      for (const key of keys.slice(0, limit)) {
        const eventData = await redisService.get(key);
        if (eventData) {
          const event = JSON.parse(eventData) as AuditEvent;
          
          // Apply filters
          if (userId && event.userId !== userId) continue;
          if (resource && event.resource !== resource) continue;
          if (action && event.action !== action) continue;
          if (startDate && new Date(event.timestamp) < startDate) continue;
          if (endDate && new Date(event.timestamp) > endDate) continue;
          
          events.push(event);
        }
      }
      
      // Sort by timestamp (newest first)
      return events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    } catch (error) {
      console.error('Failed to retrieve audit events:', error);
      return [];
    }
  }

  static async getAuditEventsByUser(userId: string, limit: number = 50): Promise<AuditEvent[]> {
    return this.getAuditEvents(userId, undefined, undefined, undefined, undefined, limit);
  }

  static async getAuditEventsByResource(resource: string, limit: number = 50): Promise<AuditEvent[]> {
    return this.getAuditEvents(undefined, resource, undefined, undefined, undefined, limit);
  }

  static async getCriticalEvents(limit: number = 20): Promise<AuditEvent[]> {
    try {
      const pattern = `${this.AUDIT_KEY_PREFIX}*`;
      const keys = await redisService.keys(pattern);
      
      const events: AuditEvent[] = [];
      
      for (const key of keys.slice(0, limit * 2)) { // Get more to filter
        const eventData = await redisService.get(key);
        if (eventData) {
          const event = JSON.parse(eventData) as AuditEvent;
          if (event.severity === 'critical' || event.severity === 'high') {
            events.push(event);
          }
        }
      }
      
      // Sort by timestamp (newest first) and limit
      return events
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, limit);
    } catch (error) {
      console.error('Failed to retrieve critical audit events:', error);
      return [];
    }
  }

  // Specific audit methods for common operations
  static async logUserAction(
    userId: string,
    action: string,
    details: any,
    ip: string,
    userAgent?: string,
    severity: 'low' | 'medium' | 'high' | 'critical' = 'low'
  ): Promise<void> {
    await this.logEvent(userId, action, 'user', details, ip, userAgent, userId, severity);
  }

  static async logDataAccess(
    userId: string,
    resource: string,
    action: string,
    resourceId: string,
    details: any,
    ip: string,
    userAgent?: string,
    severity: 'low' | 'medium' | 'high' | 'critical' = 'low'
  ): Promise<void> {
    await this.logEvent(userId, action, resource, details, ip, userAgent, resourceId, severity);
  }

  static async logSystemAction(
    action: string,
    resource: string,
    details: any,
    ip: string,
    severity: 'low' | 'medium' | 'high' | 'critical' = 'medium'
  ): Promise<void> {
    await this.logEvent('system', action, resource, details, ip, undefined, undefined, severity);
  }

  static async logSecurityEvent(
    userId: string,
    action: string,
    details: any,
    ip: string,
    userAgent?: string,
    severity: 'low' | 'medium' | 'high' | 'critical' = 'high'
  ): Promise<void> {
    await this.logEvent(userId, action, 'security', details, ip, userAgent, undefined, severity);
  }
}
