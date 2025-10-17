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
    
    if (error.status) {
      set.status = error.status
      return { error: error.message }
    }
    
    if (error.message?.includes('Invalid email or password') ||
        error.message?.includes('Account is inactive') ||
        error.message?.includes('User not found')) {
      set.status = 401
      return { error: error.message }
    }
    
    if (error.message?.includes('locked') || error.message?.includes('too many')) {
      set.status = 429
      return { error: error.message }
    }
    
    if (error.message?.includes('already exists')) {
      set.status = 409
      return { error: error.message }
    }
    
    console.error('Auth route error:', error)
    set.status = 500
    return { error: 'Internal server error' }
  })
  .post('/login', async ({ body, jwt, set, request }: any) => {
    const rateLimitCheck = await authRateLimit(request);
    if (!rateLimitCheck.allowed) {
      set.status = 429;
      return {
        error: rateLimitCheck.message || "Too many login attempts. Please try again in 15 minutes."
      };
    }
    
    const { email, password } = body as AuthModel.LoginBody
    console.log('Login request:', { email, passwordLength: password.length })
    const result = await Auth.login({ email, password }, { headers: request.headers, request })
    
    const { accessToken, refreshToken } = await TokenService.generateTokenPair(
      jwt,
      result.user.id,
      result.user.email,
      result.user.role
    )

    return {
      token: accessToken,
      refreshToken,
      user: result.user,
      sessionId: result.sessionId
    }
  }, {
    body: AuthModel.loginBody,
    response: {
      200: AuthModel.loginSuccess,
      401: AuthModel.errorResponse,
      429: AuthModel.errorResponse
    },
    detail: {
      tags: ['Auth'],
      summary: 'User Login',
      description: 'Authenticate user with email and password'
    }
  })
  .post('/register', async ({ body, jwt, request }: any) => {
    const { email, password, name, role } = body as AuthModel.RegisterBody
    
    const result = await Auth.register({ email, password, name, role }, { headers: request.headers, request })
    
    const { accessToken, refreshToken } = await TokenService.generateTokenPair(
      jwt,
      result.user.id,
      result.user.email,
      result.user.role
    )

    return {
      token: accessToken,
      refreshToken,
      user: result.user,
      sessionId: result.sessionId
    }
  }, {
    body: AuthModel.registerBody,
    response: {
      200: AuthModel.loginSuccess,
      409: AuthModel.errorResponse,
      400: AuthModel.errorResponse
    },
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
        error: 'No valid session found'
      }
    }
    
    const user = await Auth.getProfile(session.userId)
    return { 
      user: {
        ...user,
        role: user.role as AuthModel.UserRole
      }
    }
  }, {
    response: {
      200: AuthModel.userProfileSuccess,
      401: AuthModel.errorResponse
    },
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
        error: 'Refresh token is required'
      }
    }

    const newAccessToken = await TokenService.refreshAccessToken(jwt, refreshToken)
    
    if (!newAccessToken) {
      set.status = 401
      return {
        error: 'Invalid or expired refresh token'
      }
    }

    return {
      token: newAccessToken,
      message: 'Access token refreshed successfully'
    }
  }, {
    body: t.Object({
      refreshToken: t.String()
    }),
    response: {
      200: t.Object({
        token: t.String(),
        message: t.String()
      }),
      400: AuthModel.errorResponse,
      401: AuthModel.errorResponse
    },
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
        error: 'Request body is required'
      }
    }

    const { sessionId } = body as AuthModel.LogoutBody
    
    if (!sessionId || sessionId.trim() === '') {
      set.status = 400
      return {
        error: 'Session ID is required'
      }
    }

    const result = await Auth.logout({ sessionId }, { headers: request.headers, request })
    
    return result
  }, {
    body: AuthModel.logoutBody,
    response: {
      200: AuthModel.sessionResponseSuccess,
      400: AuthModel.errorResponse
    },
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
        error: 'No valid session found'
      }
    }

    return await Auth.logoutAllSessions(session.userId)
  }, {
    response: {
      200: AuthModel.sessionResponseSuccess,
      401: AuthModel.errorResponse
    },
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
        error: 'Request body is required'
      }
    }

    const { sessionId } = body as AuthModel.LogoutBody
    
    if (!sessionId || sessionId.trim() === '') {
      set.status = 400
      return {
        error: 'Session ID is required'
      }
    }

    return await Auth.refreshSession({ sessionId }, { headers: request.headers, request })
  }, {
    body: AuthModel.logoutBody,
    response: {
      200: AuthModel.sessionResponseSuccess,
      400: AuthModel.errorResponse
    },
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
        error: 'No valid session found'
      }
    }

    return await Auth.getActiveSessions(session.userId)
  }, {
    response: {
      200: AuthModel.sessionResponseSuccess,
      401: AuthModel.errorResponse
    },
    detail: {
      tags: ['Auth'],
      summary: 'Get Active Sessions',
      description: 'Get all active sessions for current user',
      security: [{ bearerAuth: [] }]
    }
  })
