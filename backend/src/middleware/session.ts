import { Elysia } from 'elysia'
import { jwt } from '@elysiajs/jwt'
import { AuthController } from '../routes/auth/controllers'

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

export const sessionMiddleware = new Elysia({ name: 'session' })
  .derive(async ({ headers, jwt }: any) => {
    try {
      const authHeader = headers.authorization
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return { session: null }
      }

      const token = authHeader.replace('Bearer ', '')
      
      // Verify JWT token
      const payload = await jwt.verify(token) as { userId: string; email: string; role: string; sessionId?: string }
      if (!payload) {
        return { session: null }
      }

      // Validate session in Redis if sessionId is provided
      if (payload.sessionId) {
        const redisSession = await AuthController.validateSession(payload.sessionId)
        if (!redisSession) {
          return { session: null } // Session invalid or expired
        }
        
        return {
          session: {
            userId: redisSession.userId,
            email: redisSession.email,
            role: redisSession.role,
            sessionId: redisSession.sessionId,
            createdAt: redisSession.createdAt,
            expiresAt: redisSession.expiresAt
          } as SessionData
        }
      }

      return {
        session: {
          userId: payload.userId,
          email: payload.email,
          role: payload.role,
          sessionId: '', 
          createdAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
        } as SessionData
      }
    } catch (error) {
      console.error('Session middleware error:', error)
      return { session: null }
    }
  })

export const requireAuth = new Elysia({ name: 'requireAuth' })
  .use(sessionMiddleware)
  .derive(({ session }: any) => {
    if (!session) {
      throw new Error('Authentication required')
    }
    return { session }
  })

export const requireRole = (roles: string[]) => new Elysia({ name: 'requireRole' })
  .use(requireAuth)
  .derive(({ session }: any) => {
    if (!roles.includes(session.role)) {
      throw new Error('Insufficient permissions')
    }
    return { session }
  })
