import winston from "winston";

export const securityLogger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: "logs/security.log" }),
    new winston.transports.Console(),
  ],
});

export class SecurityLogger {
  static logLoginAttempt(
    email: string,
    ip: string,
    success: boolean,
    userAgent?: string
  ) {
    securityLogger.info("Login attempt", {
      event: "LOGIN_ATTEMPT",
      email,
      ip,
      success,
      userAgent,
      timestamp: new Date().toISOString(),
    });
  }

  static logFailedLogin(
    email: string,
    ip: string,
    reason: string,
    userAgent?: string
  ) {
    securityLogger.warn("Failed login", {
      event: "FAILED_LOGIN",
      email,
      ip,
      reason,
      userAgent,
      timestamp: new Date().toISOString(),
    });
  }

  static logAccountLocked(email: string, ip: string, reason: string) {
    securityLogger.error("Account locked", {
      event: "ACCOUNT_LOCKED",
      email,
      ip,
      reason,
      timestamp: new Date().toISOString(),
    });
  }

  static logSuspiciousActivity(userId: string, activity: string, details: any) {
    securityLogger.warn("Suspicious activity", {
      event: "SUSPICIOUS_ACTIVITY",
      userId,
      activity,
      details,
      timestamp: new Date().toISOString(),
    });
  }

  static logPasswordChange(userId: string, ip: string) {
    securityLogger.info("Password changed", {
      event: "PASSWORD_CHANGED",
      userId,
      ip,
      timestamp: new Date().toISOString(),
    });
  }

  static logUserRegistration(email: string, ip: string, userAgent?: string) {
    securityLogger.info("User registration", {
      event: "USER_REGISTRATION",
      email,
      ip,
      userAgent,
      timestamp: new Date().toISOString(),
    });
  }

  static logSessionCreated(userId: string, sessionId: string, ip: string) {
    securityLogger.info("Session created", {
      event: "SESSION_CREATED",
      userId,
      sessionId,
      ip,
      timestamp: new Date().toISOString(),
    });
  }

  static logSessionDestroyed(userId: string, sessionId: string, ip: string) {
    securityLogger.info("Session destroyed", {
      event: "SESSION_DESTROYED",
      userId,
      sessionId,
      ip,
      timestamp: new Date().toISOString(),
    });
  }

  static logSessionRefresh(userId: string, sessionId: string, ip: string) {
    securityLogger.info("Session refreshed", {
      event: "SESSION_REFRESHED",
      userId,
      sessionId,
      ip,
      timestamp: new Date().toISOString(),
    });
  }

  static logDataAccess(userId: string, resource: string, action: string, ip: string) {
    securityLogger.info("Data access", {
      event: "DATA_ACCESS",
      userId,
      resource,
      action,
      ip,
      timestamp: new Date().toISOString(),
    });
  }

  static logPrivilegeEscalation(userId: string, oldRole: string, newRole: string, ip: string) {
    securityLogger.warn("Privilege escalation", {
      event: "PRIVILEGE_ESCALATION",
      userId,
      oldRole,
      newRole,
      ip,
      timestamp: new Date().toISOString(),
    });
  }

  static logSystemError(error: string, context: any, ip?: string) {
    securityLogger.error("System error", {
      event: "SYSTEM_ERROR",
      error,
      context,
      ip,
      timestamp: new Date().toISOString(),
    });
  }

  static logSecurityViolation(violation: string, userId?: string, ip?: string, details?: any) {
    securityLogger.error("Security violation", {
      event: "SECURITY_VIOLATION",
      violation,
      userId,
      ip,
      details,
      timestamp: new Date().toISOString(),
    });
  }

  static logAuthFailure(reason: string, ip: string, userId?: string) {
    securityLogger.warn("Authentication failure", {
      event: "AUTH_FAILURE",
      reason,
      ip,
      userId,
      timestamp: new Date().toISOString(),
    });
  }
}
