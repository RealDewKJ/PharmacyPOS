import { Elysia } from 'elysia'
import { jwt } from '@elysiajs/jwt'
import { Auth } from '../modules/auth/service'
import { SecurityLogger } from '../utils/securityLogger'

export interface SessionData {
  userId: string
  email: string
  role: string
  sessionId: string
  createdAt: string
  expiresAt: string
}

declare global {
  namespace Elysia {
    interface Context {
      session: SessionData | null
    }
  }
}

// Session service - ย้าย logic ไปเป็น service
export class SessionService {
  static async validateSession(sessionId: string): Promise<SessionData | null> {
    try {
      const redisSession = await Auth.validateSession(sessionId)
      if (!redisSession) {
        return null
      }
      
      return {
        userId: redisSession.userId,
        email: redisSession.email,
        role: redisSession.role,
        sessionId: redisSession.sessionId,
        createdAt: redisSession.createdAt,
        expiresAt: redisSession.expiresAt
      } as SessionData
    } catch (error) {
      console.error('Error validating Redis session:', error)
      return null
    }
  }

  static createBasicSession(payload: any): SessionData {
    return {
      userId: payload.sub || payload.userId,
      email: payload.email,
      role: payload.role,
      sessionId: payload.sessionId || '',
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
    }
  }
}

// Session middleware - ไม่บังคับ authentication
export const sessionMiddleware = new Elysia({ name: 'session' })
  .derive(async ({ headers, jwt, request }: any) => {
    try {
      const authHeader = headers.authorization
      const ip = request?.headers?.get('x-forwarded-for') || request?.headers?.get('x-real-ip') || 'unknown'
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        SecurityLogger.logAuthFailure('No valid authorization header', ip)
        return { session: null }
      }

      const token = authHeader.replace('Bearer ', '')
      if (!token) {
        SecurityLogger.logAuthFailure('No token found in authorization header', ip)
        return { session: null }
      }
      
      // Verify JWT token
      const payload = await jwt.verify(token) as { sub: string; userId?: string; email: string; role: string; sessionId?: string; exp?: number }
      if (!payload) {
        SecurityLogger.logAuthFailure('JWT token verification failed', ip)
        return { session: null }
      }

      // Check if token is expired
      if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
        SecurityLogger.logAuthFailure('JWT token has expired', ip)
        return { session: null }
      }

      // Extract userId from sub field (JWT standard)
      const userId = payload.sub || payload.userId
      
      if (!userId) {
        SecurityLogger.logAuthFailure('JWT token missing userId/sub', ip)
        return { session: null }
      }

      // Validate session in Redis if sessionId is provided
      if (payload.sessionId) {
        const session = await SessionService.validateSession(payload.sessionId)
        if (!session) {
          SecurityLogger.logAuthFailure(`Redis session validation failed for sessionId: ${payload.sessionId}`, ip)
          return { session: null }
        }
        return { session }
      }

      // For tokens without sessionId, create a basic session
      const session = SessionService.createBasicSession(payload)
      return { session }
    } catch (error) {
      const ip = request?.headers?.get('x-forwarded-for') || request?.headers?.get('x-real-ip') || 'unknown'
      SecurityLogger.logAuthFailure(`Session middleware error: ${error}`, ip)
      return { session: null }
    }
  })

// Legacy requireAuth - เก็บไว้เพื่อ backward compatibility
export const requireAuth = new Elysia({ name: 'requireAuth' })
  .use(sessionMiddleware)
  .derive(({ session }: any) => {
    if (!session) {
      throw new Error('Authentication required')
    }
    return { session }
  })

// Legacy requireRole - เก็บไว้เพื่อ backward compatibility
export const requireRole = (roles: string[]) => new Elysia({ name: 'requireRole' })
  .use(requireAuth)
  .derive(({ session }: any) => {
    if (!roles.includes(session.role)) {
      throw new Error('Insufficient permissions')
    }
    return { session }
  })
