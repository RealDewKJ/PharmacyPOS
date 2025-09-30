import { Elysia } from 'elysia'
import { AuthController } from './controllers'
import { loginSchema, registerSchema, authResponseSchema, userProfileSchema, logoutSchema, sessionResponseSchema } from './schemas'
import { jwt } from '@elysiajs/jwt'
import { sessionMiddleware, requireAuth } from '../../middleware/session'

export const authRoutes = new Elysia({ prefix: '/auth' })
  .use(jwt({
    name: 'jwt',
    secret: process.env.JWT_SECRET || 'fallback-secret'
  }))
  .use(sessionMiddleware)
  .onError(({ error, code, set }) => {
    if (code === 'VALIDATION') {
     return
    }
    return {
      error: 'Internal server error',
      message: 'Something went wrong'
    }
  })
  .post('/login', async ({ body, jwt, set }: any) => {
    try {
    
      const { email, password } = body as { email: string; password: string }
      
      const user = await AuthController.login(email, password)
      
      const token = await jwt.sign({
        userId: user.id,
        email: user.email,
        role: user.role,
        sessionId: user.sessionId
      })

      return {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          isActive: user.isActive,
          createdAt: user.createdAt
        },
        sessionId: user.sessionId
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed'
      
      if (errorMessage === 'Invalid credentials' || errorMessage === 'Account is inactive') {
        set.status = 401
        return {
          error: errorMessage
        }
      }
      
      return {
        error: errorMessage
      }
    }
  }, {
    body: loginSchema,
    response: authResponseSchema,
    detail: {
      tags: ['Auth'],
      summary: 'User Login',
      description: 'Authenticate user with email and password'
    }
  })
  .post('/register', async ({ body, jwt, set }: any) => {
    try {
     
      const { email, password, name, role } = body as { 
        email: string; 
        password: string; 
        name: string; 
        role?: string 
      }
      
      const user = await AuthController.register(email, password, name, role)
      
      const token = await jwt.sign({
        userId: user.id,
        email: user.email,
        role: user.role,
        sessionId: user.sessionId
      })

      return {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          isActive: user.isActive,
          createdAt: user.createdAt
        },
        sessionId: user.sessionId
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed'
      
      if (errorMessage === 'User already exists') {
        set.status = 409
        return {
          error: errorMessage
        }
      }
      
      return {
        error: errorMessage
      }
    }
  }, {
    body: registerSchema,
    response: authResponseSchema,
    detail: {
      tags: ['Auth'],
      summary: 'User Registration',
      description: 'Register a new user account'
    }
  })
  .get('/me', async ({ session, set }: any) => {
    try {
      if (!session) {
        set.status = 401
        return {
          error: 'No valid session found'
        }
      }

      const user = await AuthController.getProfile(session.userId)
      return { user }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Authentication failed'
      
      if (errorMessage === 'User not found') {
        set.status = 401
        return {
          error: errorMessage
        }
      }
      
      return {
        error: errorMessage
      }
    }
  }, {
    response: userProfileSchema,
    detail: {
      tags: ['Auth'],
      summary: 'Get User Profile',
      description: 'Get current user profile information',
      security: [{ bearerAuth: [] }]
    }
  })
  .post('/logout', async ({ body, set }: any) => {
    try {
      // Check if body exists and has required fields
      if (!body || typeof body !== 'object') {
        set.status = 400
        return {
          error: 'Request body is required'
        }
      }

      const { sessionId } = body as { sessionId: string }
      
      if (!sessionId || sessionId.trim() === '') {
        set.status = 400
        return {
          error: 'Session ID is required'
        }
      }

      const success = await AuthController.logout(sessionId)
      
      return {
        success,
        message: success ? 'Logged out successfully' : 'Session not found'
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Logout failed'
      
      // Set 400 status for client errors
      if (errorMessage.includes('required')) {
        set.status = 400
      }
      
      return {
        error: errorMessage
      }
    }
  }, {
    body: logoutSchema,
    response: sessionResponseSchema,
    detail: {
      tags: ['Auth'],
      summary: 'User Logout',
      description: 'Logout user and invalidate session'
    }
  })
  .post('/logout-all', async ({ session, set }: any) => {
    try {
      if (!session) {
        set.status = 401
        return {
          error: 'No valid session found'
        }
      }

      const deletedCount = await AuthController.logoutAllSessions(session.userId)
      
      return {
        success: true,
        message: `Logged out from ${deletedCount} sessions`,
        deletedSessions: deletedCount
      }
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Logout failed'
      }
    }
  }, {
    response: sessionResponseSchema,
    detail: {
      tags: ['Auth'],
      summary: 'Logout All Sessions',
      description: 'Logout user from all active sessions',
      security: [{ bearerAuth: [] }]
    }
  })
  .post('/refresh-session', async ({ body, set }: any) => {
    try {
      // Check if body exists and has required fields
      if (!body || typeof body !== 'object') {
        set.status = 400
        return {
          error: 'Request body is required'
        }
      }

      const { sessionId } = body as { sessionId: string }
      
      if (!sessionId || sessionId.trim() === '') {
        set.status = 400
        return {
          error: 'Session ID is required'
        }
      }

      const success = await AuthController.refreshSession(sessionId)
      
      return {
        success,
        message: success ? 'Session refreshed successfully' : 'Session not found or expired'
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Session refresh failed'
      
      // Set 400 status for client errors
      if (errorMessage.includes('required')) {
        set.status = 400
      }
      
      return {
        error: errorMessage
      }
    }
  }, {
    body: logoutSchema,
    response: sessionResponseSchema,
    detail: {
      tags: ['Auth'],
      summary: 'Refresh Session',
      description: 'Refresh session expiration time'
    }
  })
  .get('/sessions', async ({ session, set }: any) => {
    try {
      if (!session) {
        set.status = 401
        return {
          error: 'No valid session found'
        }
      }

      const activeSessions = await AuthController.getActiveSessions(session.userId)
      
      return {
        success: true,
        message: 'Active sessions retrieved successfully',
        activeSessions,
        count: activeSessions.length
      }
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Failed to get sessions'
      }
    }
  }, {
    response: sessionResponseSchema,
    detail: {
      tags: ['Auth'],
      summary: 'Get Active Sessions',
      description: 'Get all active sessions for current user',
      security: [{ bearerAuth: [] }]
    }
  })
