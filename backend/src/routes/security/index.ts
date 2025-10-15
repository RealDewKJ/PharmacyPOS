import { Elysia, t } from 'elysia';
import { SecurityLogger } from '../../utils/securityLogger';
import { AuditTrailService } from '../../services/auditTrail';
import { SuspiciousActivityDetector } from '../../services/suspiciousActivityDetector';
import { sessionMiddleware } from '../../middleware/session';

export const securityRoutes = new Elysia({ prefix: '/security' })
  .use(sessionMiddleware)
  .onError(({ error, code, set }: any) => {
    if (code === 'VALIDATION') {
      return;
    }
    return {
      error: 'Internal server error',
      message: 'Something went wrong'
    };
  })
  .get('/audit-events', async ({ session, query, set }: any) => {
    try {
      if (!session) {
        set.status = 401;
        return {
          error: 'Authentication required'
        };
      }

      // Only allow ADMIN users to view audit events
      if (session.role !== 'ADMIN') {
        set.status = 403;
        return {
          error: 'Insufficient permissions'
        };
      }

      const {
        userId,
        resource,
        action,
        startDate,
        endDate,
        limit = 100
      } = query;

      const start = startDate ? new Date(startDate) : undefined;
      const end = endDate ? new Date(endDate) : undefined;

      const events = await AuditTrailService.getAuditEvents(
        userId,
        resource,
        action,
        start,
        end,
        parseInt(limit)
      );

      return {
        success: true,
        events,
        count: events.length
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Failed to retrieve audit events'
      };
    }
  }, {
    query: t.Object({
      userId: t.Optional(t.String()),
      resource: t.Optional(t.String()),
      action: t.Optional(t.String()),
      startDate: t.Optional(t.String()),
      endDate: t.Optional(t.String()),
      limit: t.Optional(t.String())
    }),
    detail: {
      tags: ['Security'],
      summary: 'Get Audit Events',
      description: 'Retrieve audit trail events (Admin only)',
      security: [{ bearerAuth: [] }]
    }
  })
  .get('/critical-events', async ({ session, query, set }: any) => {
    try {
      if (!session) {
        set.status = 401;
        return {
          error: 'Authentication required'
        };
      }

      // Only allow ADMIN users to view critical events
      if (session.role !== 'ADMIN') {
        set.status = 403;
        return {
          error: 'Insufficient permissions'
        };
      }

      const { limit = 20 } = query;
      const events = await AuditTrailService.getCriticalEvents(parseInt(limit));

      return {
        success: true,
        events,
        count: events.length
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Failed to retrieve critical events'
      };
    }
  }, {
    query: t.Object({
      limit: t.Optional(t.String())
    }),
    detail: {
      tags: ['Security'],
      summary: 'Get Critical Events',
      description: 'Retrieve critical security events (Admin only)',
      security: [{ bearerAuth: [] }]
    }
  })
  .get('/user-audit/:userId', async ({ session, params, query, set }: any) => {
    try {
      if (!session) {
        set.status = 401;
        return {
          error: 'Authentication required'
        };
      }

      // Users can only view their own audit events, or ADMIN can view any
      if (session.userId !== params.userId && session.role !== 'ADMIN') {
        set.status = 403;
        return {
          error: 'Insufficient permissions'
        };
      }

      const { limit = 50 } = query;
      const events = await AuditTrailService.getAuditEventsByUser(
        params.userId,
        parseInt(limit)
      );

      return {
        success: true,
        events,
        count: events.length
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Failed to retrieve user audit events'
      };
    }
  }, {
    params: t.Object({
      userId: t.String()
    }),
    query: t.Object({
      limit: t.Optional(t.String())
    }),
    detail: {
      tags: ['Security'],
      summary: 'Get User Audit Events',
      description: 'Retrieve audit events for a specific user',
      security: [{ bearerAuth: [] }]
    }
  })
  .get('/security-dashboard', async ({ session, set }: any) => {
    try {
      if (!session) {
        set.status = 401;
        return {
          error: 'Authentication required'
        };
      }

      // Only allow ADMIN users to view security dashboard
      if (session.role !== 'ADMIN') {
        set.status = 403;
        return {
          error: 'Insufficient permissions'
        };
      }

      // Get recent critical events
      const criticalEvents = await AuditTrailService.getCriticalEvents(10);
      
      // Get recent audit events
      const recentEvents = await AuditTrailService.getAuditEvents(
        undefined,
        undefined,
        undefined,
        new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
        undefined,
        50
      );

      // Count events by severity
      const severityCounts = {
        low: 0,
        medium: 0,
        high: 0,
        critical: 0
      };

      recentEvents.forEach(event => {
        severityCounts[event.severity]++;
      });

      // Count events by action type
      const actionCounts: { [key: string]: number } = {};
      recentEvents.forEach(event => {
        actionCounts[event.action] = (actionCounts[event.action] || 0) + 1;
      });

      return {
        success: true,
        dashboard: {
          criticalEvents,
          recentEvents: recentEvents.slice(0, 20), // Show only first 20
          severityCounts,
          actionCounts,
          totalEvents: recentEvents.length,
          timeRange: '24 hours'
        }
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Failed to retrieve security dashboard'
      };
    }
  }, {
    detail: {
      tags: ['Security'],
      summary: 'Get Security Dashboard',
      description: 'Get security monitoring dashboard data (Admin only)',
      security: [{ bearerAuth: [] }]
    }
  })
  .post('/log-audit-event', async ({ session, body, set, request }: any) => {
    try {
      if (!session) {
        set.status = 401;
        return {
          error: 'Authentication required'
        };
      }

      const {
        action,
        resource,
        resourceId,
        details,
        severity = 'low'
      } = body;

      // Extract IP from request
      const ip = request?.ip || 'unknown';
      const userAgent = request?.headers?.['user-agent'];

      await AuditTrailService.logDataAccess(
        session.userId,
        resource,
        action,
        resourceId,
        details,
        ip,
        userAgent,
        severity
      );

      return {
        success: true,
        message: 'Audit event logged successfully'
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Failed to log audit event'
      };
    }
  }, {
    body: t.Object({
      action: t.String(),
      resource: t.String(),
      resourceId: t.String(),
      details: t.Any(),
      severity: t.Optional(t.String({ enum: ['low', 'medium', 'high', 'critical'] }))
    }),
    detail: {
      tags: ['Security'],
      summary: 'Log Audit Event',
      description: 'Log a custom audit event',
      security: [{ bearerAuth: [] }]
    }
  });
