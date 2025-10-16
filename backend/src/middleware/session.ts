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
        console.log('No valid authorization header found')
        return { session: null }
      }

      const token = authHeader.replace('Bearer ', '')
      if (!token) {
        console.log('No token found in authorization header')
        return { session: null }
      }
      
      // Verify JWT token
      const payload = await jwt.verify(token) as { sub: string; userId?: string; email: string; role: string; sessionId?: string; exp?: number }
      if (!payload) {
        console.log('JWT token verification failed')
        return { session: null }
      }

      // Check if token is expired
      if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
        console.log('JWT token has expired')
        return { session: null }
      }

      // Extract userId from sub field (JWT standard)
      const userId = payload.sub || payload.userId
      
      if (!userId) {
        console.log('JWT token missing userId/sub')
        return { session: null }
      }

      // Validate session in Redis if sessionId is provided
      if (payload.sessionId) {
        try {
          const redisSession = await AuthController.validateSession(payload.sessionId)
          if (!redisSession) {
            console.log('Redis session validation failed for sessionId:', payload.sessionId)
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
        } catch (error) {
          console.log('Error validating Redis session:', error)
          return { session: null }
        }
      }

      // For tokens without sessionId, create a basic session
      return {
        session: {
          userId: userId,
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
