import { Elysia, t } from 'elysia'
import { Auth } from './service'
import { AuthModel } from './model'
import { jwtConfig } from '../../config'
import { sessionMiddleware } from '../../middleware/session'
import { authRateLimit } from '../../middleware/rateLimit'
import { TokenService } from '../../services/tokenService'

export const auth = new Elysia({ prefix: '/auth' })
  .use(jwtConfig)
  .use(sessionMiddleware)
  .onError(({ error, code, set }: any) => {
    if (code === 'VALIDATION') {
      return
    }
    
    const timestamp = new Date().toISOString()
    
    if (error.status) {
      set.status = error.status
      return { 
        success: false as const,
        error: {
          message: error.message,
          code: error.errorCode || 'UNKNOWN_ERROR',
          statusCode: error.status,
          timestamp
        }
      }
    }
    
    if (error.message?.includes('Invalid email or password') ||
        error.message?.includes('Account is inactive') ||
        error.message?.includes('User not found')) {
      set.status = 401
      return { 
        success: false as const,
        error: {
          message: error.message,
          code: 'AUTH_ERROR',
          statusCode: 401,
          timestamp
        }
      }
    }
    
    if (error.message?.includes('locked') || error.message?.includes('too many')) {
      set.status = 429
      return { 
        success: false as const,
        error: {
          message: error.message,
          code: 'RATE_LIMIT_EXCEEDED',
          statusCode: 429,
          timestamp
        }
      }
    }
    
    if (error.message?.includes('already exists')) {
      set.status = 409
      return { 
        success: false as const,
        error: {
          message: error.message,
          code: 'RESOURCE_ALREADY_EXISTS',
          statusCode: 409,
          timestamp
        }
      }
    }
    
    console.error('Auth route error:', error)
    set.status = 500
    return { 
      success: false as const,
      error: {
        message: 'Internal server error',
        code: 'INTERNAL_SERVER_ERROR',
        statusCode: 500,
        timestamp
      }
    }
  })
  .post('/login', async ({ body, jwt, set, request }: any) => {
    const rateLimitCheck = await authRateLimit(request);
    if (!rateLimitCheck.allowed) {
      set.status = 429;
      return {
        success: false as const,
        error: {
          message: rateLimitCheck.message || "Too many login attempts. Please try again in 15 minutes.",
          code: 'RATE_LIMIT_EXCEEDED',
          statusCode: 429,
          timestamp: new Date().toISOString()
        }
      };
    }
    
    const { email, password } = body as AuthModel.LoginBody
    console.log('Login request:', { email, passwordLength: password.length })
    const result = await Auth.login({ email, password }, { headers: request.headers, request })
    
    // Check if result is an error response
    if (!result.success) {
      return result
    }
    
    const { accessToken, refreshToken } = await TokenService.generateTokenPair(
      jwt,
      result.data.user.id,
      result.data.user.email,
      result.data.user.role
    )

    return {
      success: true as const,
      data: {
        token: accessToken,
        refreshToken,
        user: result.data.user,
        sessionId: result.data.sessionId
      },
      message: 'Login successful',
      timestamp: new Date().toISOString()
    }
  }, {
    body: AuthModel.loginBody,
    response: AuthModel.loginResponse,
    detail: {
      tags: ['Auth'],
      summary: 'User Login',
      description: 'Authenticate user with email and password'
    }
  })
  .post('/register', async ({ body, jwt, request }: any) => {
    const { email, password, name, role } = body as AuthModel.RegisterBody
    
    const result = await Auth.register({ email, password, name, role }, { headers: request.headers, request })
    
    // Check if result is an error response
    if (!result.success) {
      return result
    }
    
    const { accessToken, refreshToken } = await TokenService.generateTokenPair(
      jwt,
      result.data.user.id,
      result.data.user.email,
      result.data.user.role
    )

    return {
      success: true as const,
      data: {
        token: accessToken,
        refreshToken,
        user: result.data.user,
        sessionId: result.data.sessionId
      },
      message: 'Registration successful',
      timestamp: new Date().toISOString()
    }
  }, {
    body: AuthModel.registerBody,
    response: AuthModel.loginResponse,
    detail: {
      tags: ['Auth'],
      summary: 'User Registration',
      description: 'Register a new user account'
    }
  })
  .get('/me', async ({ session, set }: any) => {
    if (!session || !session.userId) {
      set.status = 401
      return {
        success: false as const,
        error: {
          message: 'No valid session found',
          code: 'UNAUTHORIZED',
          statusCode: 401,
          timestamp: new Date().toISOString()
        }
      }
    }
    
    const result = await Auth.getProfile(session.userId)
    
    // Check if result is an error response
    if (!result.success) {
      return result
    }
    
    return {
      success: true as const,
      data: {
        user: {
          ...result.data.user,
          role: result.data.user.role as AuthModel.UserRole
        }
      },
      message: 'Profile retrieved successfully',
      timestamp: new Date().toISOString()
    }
  }, {
    response: AuthModel.userProfileResponse,
    detail: {
      tags: ['Auth'],
      summary: 'Get User Profile',
      description: 'Get current user profile information',
      security: [{ bearerAuth: [] }]
    }
  })
  .post('/refresh', async ({ body, jwt, set }: any) => {
    const { refreshToken } = body as { refreshToken: string }
    
    if (!refreshToken) {
      set.status = 400
      return {
        success: false as const,
        error: {
          message: 'Refresh token is required',
          code: 'REFRESH_TOKEN_REQUIRED',
          statusCode: 400,
          timestamp: new Date().toISOString()
        }
      }
    }

    const newAccessToken = await TokenService.refreshAccessToken(jwt, refreshToken)
    
    if (!newAccessToken) {
      set.status = 401
      return {
        success: false as const,
        error: {
          message: 'Invalid or expired refresh token',
          code: 'INVALID_REFRESH_TOKEN',
          statusCode: 401,
          timestamp: new Date().toISOString()
        }
      }
    }

    return {
      success: true as const,
      data: {
        token: newAccessToken
      },
      message: 'Access token refreshed successfully',
      timestamp: new Date().toISOString()
    }
  }, {
    body: t.Object({
      refreshToken: t.String()
    }),
    response: t.Union([
      t.Object({
        success: t.Literal(true),
        data: t.Object({
          token: t.String()
        }),
        message: t.String(),
        timestamp: t.String()
      }),
      t.Object({
        success: t.Literal(false),
        error: t.Object({
          message: t.String(),
          code: t.String(),
          statusCode: t.Number(),
          timestamp: t.String()
        })
      })
    ]),
    detail: {
      tags: ['Auth'],
      summary: 'Refresh Access Token',
      description: 'Refresh expired access token using refresh token'
    }
  })
  .post('/logout', async ({ body, set, request }: any) => {
    if (!body || typeof body !== 'object') {
      set.status = 400
      return {
        success: false as const,
        error: {
          message: 'Request body is required',
          code: 'REQUEST_BODY_REQUIRED',
          statusCode: 400,
          timestamp: new Date().toISOString()
        }
      }
    }

    const { sessionId } = body as AuthModel.LogoutBody
    
    if (!sessionId || sessionId.trim() === '') {
      set.status = 400
      return {
        success: false as const,
        error: {
          message: 'Session ID is required',
          code: 'SESSION_ID_REQUIRED',
          statusCode: 400,
          timestamp: new Date().toISOString()
        }
      }
    }

    const result = await Auth.logout({ sessionId }, { headers: request.headers, request })
    
    return result
  }, {
    body: AuthModel.logoutBody,
    response: AuthModel.sessionResponse,
    detail: {
      tags: ['Auth'],
      summary: 'User Logout',
      description: 'Logout user and invalidate session'
    }
  })
  .post('/logout-all', async ({ session, set }: any) => {
    if (!session) {
      set.status = 401
      return {
        success: false as const,
        error: {
          message: 'No valid session found',
          code: 'UNAUTHORIZED',
          statusCode: 401,
          timestamp: new Date().toISOString()
        }
      }
    }

    return await Auth.logoutAllSessions(session.userId)
  }, {
    response: AuthModel.sessionResponse,
    detail: {
      tags: ['Auth'],
      summary: 'Logout All Sessions',
      description: 'Logout user from all active sessions',
      security: [{ bearerAuth: [] }]
    }
  })
  .post('/refresh-session', async ({ body, set, request }: any) => {
    if (!body || typeof body !== 'object') {
      set.status = 400
      return {
        success: false as const,
        error: {
          message: 'Request body is required',
          code: 'REQUEST_BODY_REQUIRED',
          statusCode: 400,
          timestamp: new Date().toISOString()
        }
      }
    }

    const { sessionId } = body as AuthModel.LogoutBody
    
    if (!sessionId || sessionId.trim() === '') {
      set.status = 400
      return {
        success: false as const,
        error: {
          message: 'Session ID is required',
          code: 'SESSION_ID_REQUIRED',
          statusCode: 400,
          timestamp: new Date().toISOString()
        }
      }
    }

    return await Auth.refreshSession({ sessionId }, { headers: request.headers, request })
  }, {
    body: AuthModel.logoutBody,
    response: AuthModel.sessionResponse,
    detail: {
      tags: ['Auth'],
      summary: 'Refresh Session',
      description: 'Refresh session expiration time'
    }
  })
  .get('/sessions', async ({ session, set }: any) => {
    if (!session) {
      set.status = 401
      return {
        success: false as const,
        error: {
          message: 'No valid session found',
          code: 'UNAUTHORIZED',
          statusCode: 401,
          timestamp: new Date().toISOString()
        }
      }
    }

    return await Auth.getActiveSessions(session.userId)
  }, {
    response: AuthModel.sessionResponse,
    detail: {
      tags: ['Auth'],
      summary: 'Get Active Sessions',
      description: 'Get all active sessions for current user',
      security: [{ bearerAuth: [] }]
    }
  })
