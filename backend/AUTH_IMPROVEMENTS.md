# 🔐 Authentication Security Improvements

## Overview

This document outlines the necessary improvements to make the Pharmacy POS authentication system compliant with international security standards (OWASP, NIST, ISO 27001).

## 🚨 Critical Security Issues to Fix

### 1. Password Security Enhancements

#### Current Issues:

- Password validation is too basic (only 6 characters minimum)
- No password strength checking
- No breach detection
- Using bcryptjs instead of more secure Argon2

#### Required Changes:

**File: `src/validators/passwordValidator.ts` (NEW)**

```typescript
export class PasswordValidator {
  static validate(password: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // NIST Guidelines
    if (password.length < 8) {
      errors.push("Password must be at least 8 characters");
    }

    if (password.length > 128) {
      errors.push("Password must not exceed 128 characters");
    }

    // Check against common passwords
    const commonPasswords = ["password", "123456", "admin", "pharmacy123"];
    if (commonPasswords.includes(password.toLowerCase())) {
      errors.push("Password is too common");
    }

    // Check for repeated characters
    if (/(.)\1{3,}/.test(password)) {
      errors.push("Password cannot have more than 3 repeated characters");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  static async checkBreach(password: string): Promise<boolean> {
    // Implement HaveIBeenPwned API check
    const hash = crypto
      .createHash("sha1")
      .update(password)
      .digest("hex")
      .toUpperCase();
    const prefix = hash.substring(0, 5);
    const suffix = hash.substring(5);

    try {
      const response = await fetch(
        `https://api.pwnedpasswords.com/range/${prefix}`
      );
      const data = await response.text();
      return data.includes(suffix);
    } catch {
      return false; // Fail open for availability
    }
  }
}
```

**File: `src/utils/passwordUtils.ts` (NEW)**

```typescript
import bcrypt from "bcryptjs";
import argon2 from "argon2";

export class PasswordUtils {
  // Use Argon2 for new passwords (more secure than bcrypt)
  static async hashPassword(password: string): Promise<string> {
    return await argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 2 ** 16, // 64 MB
      timeCost: 3,
      parallelism: 1,
    });
  }

  static async verifyPassword(
    password: string,
    hash: string
  ): Promise<boolean> {
    try {
      return await argon2.verify(hash, password);
    } catch {
      // Fallback to bcrypt for legacy passwords
      return bcrypt.compare(password, hash);
    }
  }

  static async upgradePasswordHash(
    password: string,
    currentHash: string
  ): Promise<string> {
    const isValid = await bcrypt.compare(password, currentHash);
    if (isValid) {
      return await this.hashPassword(password);
    }
    throw new Error("Invalid password");
  }
}
```

### 2. Rate Limiting & Brute Force Protection

#### Current Issues:

- No rate limiting on authentication endpoints
- No brute force protection
- No account lockout mechanism

#### Required Changes:

**File: `src/middleware/rateLimit.ts` (NEW)**

```typescript
import { rateLimit } from "@elysiajs/rate-limit";
import { redisService } from "../services/redis";

export const authRateLimit = rateLimit({
  max: 5, // 5 attempts
  duration: 15 * 60 * 1000, // 15 minutes
  keyGenerator: ({ request }) => {
    const ip =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";
    return `auth:${ip}`;
  },
  error: "Too many login attempts. Please try again in 15 minutes.",
});

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
```

### 3. Enhanced JWT Security

#### Current Issues:

- JWT tokens don't have proper expiration
- No token rotation mechanism
- No token blacklisting
- Missing JWT ID for tracking

#### Required Changes:

**File: `src/services/tokenService.ts` (NEW)**

```typescript
import jwt from "jsonwebtoken";
import { redisService } from "./redis";

export class TokenService {
  static async generateTokenPair(userId: string, email: string, role: string) {
    const accessToken = jwt.sign(
      {
        sub: userId,
        email,
        role,
        type: "access",
        jti: crypto.randomUUID(), // JWT ID for tracking
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: "15m",
        issuer: "pharmacy-pos-api",
        audience: "pharmacy-pos-client",
      }
    );

    const refreshToken = jwt.sign(
      {
        sub: userId,
        type: "refresh",
        jti: crypto.randomUUID(),
      },
      process.env.JWT_REFRESH_SECRET!,
      {
        expiresIn: "7d",
        issuer: "pharmacy-pos-api",
        audience: "pharmacy-pos-client",
      }
    );

    // Store refresh token in Redis
    await redisService.set(
      `refresh_token:${refreshToken}`,
      JSON.stringify({ userId, createdAt: new Date() }),
      7 * 24 * 60 * 60 // 7 days
    );

    return { accessToken, refreshToken };
  }

  static async revokeToken(tokenId: string): Promise<void> {
    await redisService.set(
      `revoked_token:${tokenId}`,
      "true",
      7 * 24 * 60 * 60
    );
  }

  static async isTokenRevoked(tokenId: string): Promise<boolean> {
    return !!(await redisService.get(`revoked_token:${tokenId}`));
  }

  static async refreshAccessToken(
    refreshToken: string
  ): Promise<string | null> {
    try {
      const decoded = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET!
      ) as any;
      const stored = await redisService.get(`refresh_token:${refreshToken}`);

      if (!stored) {
        return null; // Refresh token not found or expired
      }

      // Generate new access token
      return jwt.sign(
        {
          sub: decoded.sub,
          email: decoded.email,
          role: decoded.role,
          type: "access",
          jti: crypto.randomUUID(),
        },
        process.env.JWT_SECRET!,
        {
          expiresIn: "15m",
          issuer: "pharmacy-pos-api",
          audience: "pharmacy-pos-client",
        }
      );
    } catch {
      return null;
    }
  }
}
```

### 4. Security Logging & Monitoring

#### Current Issues:

- No security event logging
- No monitoring for suspicious activities
- No audit trail

#### Required Changes:

**File: `src/utils/securityLogger.ts` (NEW)**

```typescript
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
}
```

### 5. Multi-Factor Authentication (MFA)

#### Required Changes:

**File: `src/services/mfaService.ts` (NEW)**

```typescript
import speakeasy from "speakeasy";
import QRCode from "qrcode";

export class MFAService {
  static generateSecret(userId: string, email: string) {
    const secret = speakeasy.generateSecret({
      name: `Pharmacy POS (${email})`,
      issuer: "Pharmacy POS System",
      length: 32,
    });

    return {
      secret: secret.base32,
      qrCodeUrl: secret.otpauth_url,
    };
  }

  static verifyToken(token: string, secret: string): boolean {
    return speakeasy.totp.verify({
      secret,
      encoding: "base32",
      token,
      window: 2, // Allow 2 time steps tolerance
    });
  }

  static generateQRCode(otpauthUrl: string): Promise<string> {
    return QRCode.toDataURL(otpauthUrl);
  }

  static async enableMFA(
    userId: string,
    secret: string,
    token: string
  ): Promise<boolean> {
    if (!this.verifyToken(token, secret)) {
      return false;
    }

    // Store MFA secret in database
    await prisma.user.update({
      where: { id: userId },
      data: { mfaSecret: secret, mfaEnabled: true },
    });

    return true;
  }
}
```

### 6. Enhanced Input Validation

#### Required Changes:

**File: `src/validators/authValidators.ts` (NEW)**

```typescript
import { t } from "elysia";
import validator from "validator";

export const enhancedLoginSchema = t.Object({
  email: t.String({
    format: "email",
    minLength: 5,
    maxLength: 254,
    pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
  }),
  password: t.String({
    minLength: 8,
    maxLength: 128,
  }),
  rememberMe: t.Optional(t.Boolean()),
  mfaToken: t.Optional(t.String()),
});

export const enhancedRegisterSchema = t.Object({
  email: t.String({
    format: "email",
    minLength: 5,
    maxLength: 254,
  }),
  password: t.String({
    minLength: 8,
    maxLength: 128,
  }),
  name: t.String({
    minLength: 2,
    maxLength: 100,
    pattern: "^[a-zA-Z\\s]+$",
  }),
  role: t.Optional(
    t.String({
      enum: ["ADMIN", "PHARMACIST", "CASHIER"],
    })
  ),
});

export class InputSanitizer {
  static sanitizeEmail(email: string): string {
    return (
      validator.normalizeEmail(email, {
        gmail_remove_dots: false,
        gmail_remove_subaddress: false,
        outlookdotcom_remove_subaddress: false,
        yahoo_remove_subaddress: false,
        icloud_remove_subaddress: false,
      }) || email
    );
  }

  static sanitizeName(name: string): string {
    return validator.escape(name.trim());
  }

  static validatePasswordStrength(password: string): boolean {
    // Check for common patterns
    const commonPatterns = [
      /(.)\1{3,}/, // Repeated characters
      /123456|password|admin|qwerty/i, // Common passwords
      /^[a-z]+$/i, // Only letters
      /^\d+$/, // Only numbers
    ];

    return !commonPatterns.some((pattern) => pattern.test(password));
  }
}
```

### 7. Security Headers

#### Required Changes:

**File: `src/middleware/securityHeaders.ts` (NEW)**

```typescript
export const securityHeaders = new Elysia({
  name: "security-headers",
}).onRequest(({ set }) => {
  set.headers = {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-XSS-Protection": "1; mode=block",
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
    "Content-Security-Policy": "default-src 'self'",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "geolocation=(), microphone=(), camera=()",
  };
});
```

### 8. Enhanced Session Management

#### Required Changes:

**File: `src/middleware/enhancedSession.ts` (NEW)**

```typescript
export class EnhancedSessionMiddleware {
  static async validateSession(
    sessionId: string,
    userAgent: string,
    ip: string
  ) {
    const session = await AuthController.validateSession(sessionId);
    if (!session) return null;

    // Check for session hijacking indicators
    if (session.userAgent !== userAgent || session.ip !== ip) {
      await AuthController.logout(sessionId);
      SecurityLogger.logSuspiciousActivity(
        session.userId,
        "SESSION_HIJACKING_ATTEMPT",
        {
          sessionId,
          originalUserAgent: session.userAgent,
          currentUserAgent: userAgent,
          originalIP: session.ip,
          currentIP: ip,
        }
      );
      return null;
    }

    // Refresh session if needed
    const now = new Date();
    const lastActivity = new Date(session.lastActivity);
    const inactivityThreshold = 30 * 60 * 1000; // 30 minutes

    if (now.getTime() - lastActivity.getTime() > inactivityThreshold) {
      await AuthController.refreshSession(sessionId);
    }

    return session;
  }

  static async createSecureSession(
    userId: string,
    userAgent: string,
    ip: string
  ) {
    const sessionId = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    const sessionData = {
      userId,
      sessionId,
      userAgent,
      ip,
      createdAt: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      expiresAt: expiresAt.toISOString(),
    };

    await redisService.set(
      `session:${sessionId}`,
      JSON.stringify(sessionData),
      24 * 60 * 60 // 24 hours
    );

    return sessionData;
  }
}
```

## 📦 Required Dependencies

Add these to your `package.json`:

```json
{
  "dependencies": {
    "argon2": "^0.31.2",
    "speakeasy": "^2.0.0",
    "qrcode": "^1.5.3",
    "winston": "^3.11.0",
    "validator": "^13.11.0",
    "crypto": "^1.0.1"
  },
  "devDependencies": {
    "@types/speakeasy": "^2.0.10",
    "@types/qrcode": "^1.5.5",
    "@types/validator": "^13.11.7"
  }
}
```

## 🔧 Environment Variables

Add these to your `.env` files:

```bash
# JWT Configuration
JWT_SECRET="256-bit-random-secret-key"
JWT_REFRESH_SECRET="different-256-bit-secret"
JWT_ACCESS_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"

# Security
BCRYPT_ROUNDS=12
ARGON2_MEMORY_COST=65536
ARGON2_TIME_COST=3
ARGON2_PARALLELISM=1

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_ATTEMPTS=5
BRUTE_FORCE_LOCKOUT_DURATION=3600

# Session Security
SESSION_SECRET="session-secret-key"
SESSION_MAX_AGE=86400000
SESSION_SECURE=true
SESSION_HTTP_ONLY=true
SESSION_SAME_SITE=strict

# Logging
LOG_LEVEL=info
SECURITY_LOG_LEVEL=warn
```

## 🧪 Security Testing

**File: `tests/security/auth.test.ts` (NEW)**

```typescript
import request from "supertest";
import { app } from "../../src/index";

describe("Authentication Security", () => {
  test("should prevent SQL injection in login", async () => {
    const maliciousInput = "admin'; DROP TABLE users; --";
    const response = await request(app)
      .post("/auth/login")
      .send({ email: maliciousInput, password: "password" });

    expect(response.status).toBe(400);
  });

  test("should rate limit login attempts", async () => {
    for (let i = 0; i < 6; i++) {
      await request(app)
        .post("/auth/login")
        .send({ email: "test@test.com", password: "wrong" });
    }

    const response = await request(app)
      .post("/auth/login")
      .send({ email: "test@test.com", password: "wrong" });

    expect(response.status).toBe(429);
  });

  test("should validate JWT token expiration", async () => {
    const expiredToken = jwt.sign({ userId: "123" }, process.env.JWT_SECRET!, {
      expiresIn: "-1h",
    });

    const response = await request(app)
      .get("/auth/me")
      .set("Authorization", `Bearer ${expiredToken}`);

    expect(response.status).toBe(401);
  });
});
```

## 📋 Implementation Priority

### Phase 1 (Critical - Implement First):

1. ✅ Password security enhancements
2. ✅ Rate limiting and brute force protection
3. ✅ Enhanced JWT security
4. ✅ Security logging

### Phase 2 (Important - Implement Second):

1. ✅ Input validation improvements
2. ✅ Security headers
3. ✅ Enhanced session management

### Phase 3 (Advanced - Implement Third):

1. ✅ Multi-factor authentication
2. ✅ Advanced monitoring
3. ✅ Security testing

## 🚀 Quick Start Implementation

1. **Install new dependencies:**

   ```bash
   npm install argon2 speakeasy qrcode winston validator
   npm install -D @types/speakeasy @types/qrcode @types/validator
   ```

2. **Create the new files** as outlined above

3. **Update existing auth routes** to use the new security features

4. **Update environment variables** with the new security settings

5. **Run security tests** to ensure everything works correctly

## 📚 References

- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [NIST Digital Identity Guidelines](https://pages.nist.gov/800-63-3/)
- [ISO/IEC 27001:2013](https://www.iso.org/standard/54534.html)

---

**Note:** This document should be treated as confidential and only shared with authorized development team members.

สรุป
🔒 Security Issues ที่ต้องแก้ไข:
Password Security - เพิ่มความแข็งแกร่งของรหัสผ่าน
Rate Limiting - ป้องกัน brute force attacks
JWT Security - ปรับปรุงการจัดการ token
Security Logging - บันทึกเหตุการณ์ความปลอดภัย
MFA Support - Multi-Factor Authentication
Input Validation - ตรวจสอบข้อมูลนำเข้า
Security Headers - เพิ่ม HTTP security headers
Session Management - จัดการ session อย่างปลอดภัย
📁 ไฟล์ที่ต้องสร้างใหม่:
src/validators/passwordValidator.ts
src/utils/passwordUtils.ts
src/middleware/rateLimit.ts
src/services/tokenService.ts
src/utils/securityLogger.ts
src/services/mfaService.ts
src/validators/authValidators.ts
src/middleware/securityHeaders.ts
src/middleware/enhancedSession.ts
tests/security/auth.test.ts
📦 Dependencies ที่ต้องติดตั้ง:
argon2, speakeasy, qrcode, winston, validator
🔧 Environment Variables ที่ต้องเพิ่ม:
JWT secrets, rate limiting, security settings
🧪 Security Tests:
SQL injection protection
Rate limiting tests
JWT validation tests
🚀 วิธีใช้งาน:
อ่านไฟล์ AUTH_IMPROVEMENTS.md
ติดตั้ง dependencies ตามที่ระบุ
สร้างไฟล์ใหม่ ตามโค้ดตัวอย่าง
อัปเดต environment variables
ทดสอบระบบ ด้วย security tests
