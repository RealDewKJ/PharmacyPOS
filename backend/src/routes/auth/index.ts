import { Elysia } from 'elysia'
import { AuthController } from './controllers'
import { loginSchema, registerSchema, authResponseSchema, userProfileSchema } from './schemas'
import { jwt } from '@elysiajs/jwt'

export const authRoutes = new Elysia({ prefix: '/auth' })
  .use(jwt({
    name: 'jwt',
    secret: process.env.JWT_SECRET || 'fallback-secret'
  }))
  .post('/login', async ({ body, jwt }) => {
    try {
      const { email, password } = body as { email: string; password: string }
      
      const user = await AuthController.login(email, password)
      
      const token = await jwt.sign({
        userId: user.id,
        email: user.email,
        role: user.role
      })

      return {
        token,
        user
      }
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Login failed'
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
  .post('/register', async ({ body, jwt }) => {
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
        role: user.role
      })

      return {
        token,
        user
      }
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Registration failed'
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
  .get('/me', async ({ jwt, headers }) => {
    try {
      const token = headers.authorization?.replace('Bearer ', '')
      if (!token) {
        throw new Error('No token provided')
      }

      const payload = await jwt.verify(token) as { userId: string }
      if (!payload) {
        throw new Error('Invalid token')
      }

      const user = await AuthController.getProfile(payload.userId)
      return { user }
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Authentication failed'
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
