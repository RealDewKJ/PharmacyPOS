import { Elysia } from 'elysia'
import { prisma } from '../index'

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
        where: { id: payload.userId as string },
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

export const strictAuthMiddleware = new Elysia()
  .derive(async (context) => {
    try {
      const authHeader = context.headers.authorization
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new Error('Authorization header missing or invalid format')
      }

      const token = authHeader.substring(7)
      if (!token) {
        throw new Error('JWT token is missing')
      }

      const payload = await (context as any).jwt.verify(token)
      
      if (!payload) {
        throw new Error('Invalid or expired JWT token')
      }

      const user = await prisma.user.findUnique({
        where: { id: payload.userId as string },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          isActive: true
        }
      })

      if (!user) {
        throw new Error('User not found')
      }

      if (!user.isActive) {
        throw new Error('User account is inactive')
      }

      return { user }
    } catch (error: any) {
      context.set.status = 401
      throw new Error(error.message || 'Authentication failed')
    }
  })
