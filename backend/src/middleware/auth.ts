import { Elysia } from 'elysia'
import { prisma } from '../index'
import { CommonResponses } from '../types/common-responses'

// Basic auth middleware - ไม่บังคับ authentication
export const authMiddleware = new Elysia()
  .derive(async (context) => {
    try {
      const authHeader = context.headers.authorization
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.log('Auth middleware: No valid authorization header')
        return { user: null }
      }

      const token = authHeader.substring(7)
      if (!token) {
        console.log('Auth middleware: No token found')
        return { user: null }
      }

      const payload = await (context as any).jwt.verify(token)
      
      if (!payload) {
        console.log('Auth middleware: JWT verification failed')
        return { user: null }
      }

      // Check if token is expired
      if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
        console.log('Auth middleware: Token has expired')
        return { user: null }
      }

      const user = await prisma.user.findUnique({
        where: { id: payload.sub as string },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          isActive: true
        }
      })

      if (!user || !user.isActive) {
        console.log('Auth middleware: User not found or inactive')
        return { user: null }
      }

      console.log('Auth middleware: User authenticated successfully:', user.email)
      return { user }
    } catch (error: any) {
      console.warn('Auth middleware error:', error.message)
      return { user: null }
    }
  })

// Strict auth middleware - บังคับ authentication
export const requireAuth = new Elysia()
  .use(authMiddleware)
  .derive(({ user }) => {
    if (!user) {
      throw new Error('Authentication required')
    }
    return { user }
  })

// Role-based auth middleware - บังคับ authentication + role check
export const requireRole = (roles: string[]) => new Elysia()
  .use(requireAuth)
  .derive(({ user }) => {
    if (!roles.includes(user.role)) {
      throw new Error('Insufficient permissions')
    }
    return { user }
  })

// Legacy strictAuthMiddleware - เก็บไว้เพื่อ backward compatibility
export const strictAuthMiddleware = new Elysia()
  .onBeforeHandle(async (context) => {
    try {
      const authHeader = context.headers.authorization
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        context.set.status = 401
        return CommonResponses.createErrorData(
          'Authorization header missing or invalid format',
          'UNAUTHORIZED',
          401,
          context.path
        )
      }

      const token = authHeader.substring(7)
      if (!token) {
        context.set.status = 401
        return CommonResponses.createErrorData(
          'JWT token is missing',
          'UNAUTHORIZED',
          401,
          context.path
        )
      }

      const payload = await (context as any).jwt.verify(token)
      
      console.log('JWT Payload:', payload)
      
      if (!payload) {
        context.set.status = 401
        return CommonResponses.createErrorData(
          'Invalid or expired JWT token',
          'UNAUTHORIZED',
          401,
          context.path
        )
      }

      // Check if payload has required fields
      if (!payload.sub) {
        context.set.status = 401
        return CommonResponses.createErrorData(
          'Invalid JWT token: missing user ID',
          'UNAUTHORIZED',
          401,
          context.path
        )
      }

      const user = await prisma.user.findUnique({
        where: { id: payload.sub as string },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          isActive: true
        }
      })

      if (!user) {
        context.set.status = 401
        return CommonResponses.createErrorData(
          'User not found',
          'USER_NOT_FOUND',
          401,
          context.path
        )
      }

      if (!user.isActive) {
        context.set.status = 401
        return CommonResponses.createErrorData(
          'User account is inactive',
          'ACCOUNT_INACTIVE',
          401,
          context.path
        )
      }

      // Store user in context for use in route handlers
      ;(context as any).user = user
      return
    } catch (error: any) {
      console.warn('Auth middleware error:', error.message)
      context.set.status = 401
      return CommonResponses.createErrorData(
        'Authentication failed',
        'AUTH_ERROR',
        401,
        context.path
      )
    }
  })
