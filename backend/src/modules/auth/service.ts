import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { redisService } from '../../services/redis'
import { BruteForceProtection } from '../../middleware/rateLimit'
import { SecurityLogger } from '../../utils/securityLogger'
import { SuspiciousActivityDetector } from '../../services/suspiciousActivityDetector'
import { extractSecurityContext } from '../../middleware/securityContext'
import {
  AccountLockedError,
  AccountInactiveError,
  InvalidCredentialsError,
  UserAlreadyExistsError,
  UserNotFoundError
} from '../../types/errors'
import { CommonResponses } from '../../types/common-responses'
import type { AuthModel } from './model'

const prisma = new PrismaClient()

const SESSION_EXPIRE_SECONDS = 24 * 60 * 60
const SESSION_KEY_PREFIX = 'session:'
const USER_SESSIONS_KEY_PREFIX = 'user_sessions:'

export abstract class Auth {
  static async login({ email, password }: AuthModel.LoginBody, context?: any): Promise<AuthModel.LoginResponse> {
    const securityContext = context ? extractSecurityContext(context) : { ip: 'unknown', userAgent: undefined }
    const { ip, userAgent } = securityContext

    SecurityLogger.logLoginAttempt(email, ip, false, userAgent)

    const isAccountLocked = await BruteForceProtection.checkAccountLock(email, 'login')
    if (isAccountLocked) {
      SecurityLogger.logAccountLocked(email, ip, 'Account locked due to brute force attempts')
      throw new AccountLockedError()
    }

    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      await BruteForceProtection.recordFailedAttempt(email, 'login')
      SecurityLogger.logFailedLogin(email, ip, 'User not found', userAgent)
      await SuspiciousActivityDetector.checkBruteForcePattern(ip, email)
      
      throw new InvalidCredentialsError()
    }

    if (!user.isActive) {
      await BruteForceProtection.recordFailedAttempt(email, 'login')
      SecurityLogger.logFailedLogin(email, ip, 'Account inactive', userAgent)
      await SuspiciousActivityDetector.checkBruteForcePattern(ip, email)
      
      throw new AccountInactiveError()
    }

    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      await BruteForceProtection.recordFailedAttempt(email, 'login')
      SecurityLogger.logFailedLogin(email, ip, 'Invalid password', userAgent)
      await SuspiciousActivityDetector.checkBruteForcePattern(ip, email)
      
      throw new InvalidCredentialsError()
    }

    const sessionId = await this.createSession(user.id, user.email, user.role, ip)

    SecurityLogger.logLoginAttempt(email, ip, true, userAgent)
    SecurityLogger.logSessionCreated(user.id, sessionId, ip)
    
    await SuspiciousActivityDetector.checkSuspiciousActivity(
      user.id,
      'successful_login',
      ip,
      { email, sessionId }
    )

    return CommonResponses.createSuccessData({
      token: '', 
      refreshToken: '', 
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role as AuthModel.UserRole,
        isActive: user.isActive,
        createdAt: user.createdAt
      },
      sessionId
    }, 'Login successful')
  }

  static async register({ email, password, name, role = 'CASHIER' }: AuthModel.RegisterBody, context?: any): Promise<AuthModel.LoginResponse> {
    const securityContext = context ? extractSecurityContext(context) : { ip: 'unknown', userAgent: undefined }
    const { ip, userAgent } = securityContext

    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      SecurityLogger.logSecurityViolation('Registration attempt with existing email', undefined, ip, { email, name })
      throw new UserAlreadyExistsError()
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: role as AuthModel.UserRole
      }
    })

    const sessionId = await this.createSession(user.id, user.email, user.role, ip)

    SecurityLogger.logUserRegistration(email, ip, userAgent)
    SecurityLogger.logSessionCreated(user.id, sessionId, ip)

    return CommonResponses.createSuccessData({
      token: '', 
      refreshToken: '', 
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role as AuthModel.UserRole,
        isActive: user.isActive,
        createdAt: user.createdAt
      },
      sessionId
    }, 'Registration successful')
  }

  static async getProfile(userId: string): Promise<AuthModel.UserProfileResponse> {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      throw new UserNotFoundError()
    }

    return CommonResponses.createSuccessData({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role as AuthModel.UserRole,
        isActive: user.isActive,
        createdAt: user.createdAt
      }
    }, 'User profile retrieved successfully')
  }

  private static async createSession(userId: string, email: string, role: string, ip: string): Promise<string> {
    const sessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`

    const sessionData = {
      userId,
      email,
      role,
      sessionId,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + SESSION_EXPIRE_SECONDS * 1000).toISOString()
    }

    await redisService.set(
      `${SESSION_KEY_PREFIX}${sessionId}`,
      JSON.stringify(sessionData),
      SESSION_EXPIRE_SECONDS
    )

    const userSessionsKey = `${USER_SESSIONS_KEY_PREFIX}${userId}`
    const existingSessions = await redisService.get(userSessionsKey)
    const sessions = existingSessions ? JSON.parse(existingSessions) : []
    sessions.push(sessionId)
    
    await redisService.set(
      userSessionsKey,
      JSON.stringify(sessions),
      SESSION_EXPIRE_SECONDS
    )

    return sessionId
  }

  static async logout({ sessionId }: AuthModel.LogoutBody, context?: any): Promise<AuthModel.SessionResponse> {
    const securityContext = context ? extractSecurityContext(context) : { ip: 'unknown', userAgent: undefined }
    const { ip } = securityContext

    const sessionData = await redisService.get(`${SESSION_KEY_PREFIX}${sessionId}`)
    if (!sessionData) {
      throw new UserNotFoundError('Session not found')
    }

    const session = JSON.parse(sessionData)
    const userId = session.userId

    SecurityLogger.logSessionDestroyed(userId, sessionId, ip)

    await redisService.del(`${SESSION_KEY_PREFIX}${sessionId}`)

    const userSessionsKey = `${USER_SESSIONS_KEY_PREFIX}${userId}`
    const existingSessions = await redisService.get(userSessionsKey)
    if (existingSessions) {
      const sessions = JSON.parse(existingSessions)
      const updatedSessions = sessions.filter((id: string) => id !== sessionId)
      
      if (updatedSessions.length > 0) {
        await redisService.set(userSessionsKey, JSON.stringify(updatedSessions), SESSION_EXPIRE_SECONDS)
      } else {
        await redisService.del(userSessionsKey)
      }
    }

    return CommonResponses.createSuccessData({
      message: 'Logged out successfully'
    }, 'Logout successful')
  }

  static async logoutAllSessions(userId: string): Promise<AuthModel.SessionResponse> {
    const userSessionsKey = `${USER_SESSIONS_KEY_PREFIX}${userId}`
    const existingSessions = await redisService.get(userSessionsKey)
    
    if (!existingSessions) {
      return CommonResponses.createSuccessData({
        message: 'No active sessions found',
        deletedSessions: 0
      }, 'No active sessions to logout')
    }

    const sessions = JSON.parse(existingSessions)
    let deletedCount = 0

    for (const sessionId of sessions) {
      const deleted = await redisService.del(`${SESSION_KEY_PREFIX}${sessionId}`)
      if (deleted) {
        deletedCount++
      }
    }

    await redisService.del(userSessionsKey)

    return CommonResponses.createSuccessData({
      message: `Logged out from ${deletedCount} sessions`,
      deletedSessions: deletedCount
    }, 'All sessions logged out successfully')
  }

  static async refreshSession({ sessionId }: AuthModel.LogoutBody, context?: any): Promise<AuthModel.SessionResponse> {
    const securityContext = context ? extractSecurityContext(context) : { ip: 'unknown', userAgent: undefined }
    const { ip } = securityContext

    const sessionKey = `${SESSION_KEY_PREFIX}${sessionId}`
    const sessionData = await redisService.get(sessionKey)
    
    if (!sessionData) {
      throw new UserNotFoundError('Session not found or expired')
    }

    const session = JSON.parse(sessionData)
    
    const updatedSession = {
      ...session,
      expiresAt: new Date(Date.now() + SESSION_EXPIRE_SECONDS * 1000).toISOString()
    }

    await redisService.set(sessionKey, JSON.stringify(updatedSession), SESSION_EXPIRE_SECONDS)

    const userSessionsKey = `${USER_SESSIONS_KEY_PREFIX}${session.userId}`
    await redisService.set(userSessionsKey, await redisService.get(userSessionsKey) || '[]', SESSION_EXPIRE_SECONDS)

    SecurityLogger.logSessionRefresh(session.userId, sessionId, ip)

    return CommonResponses.createSuccessData({
      message: 'Session refreshed successfully'
    }, 'Session refresh successful')
  }

  static async getActiveSessions(userId: string): Promise<AuthModel.SessionResponse> {
    const userSessionsKey = `${USER_SESSIONS_KEY_PREFIX}${userId}`
    const existingSessions = await redisService.get(userSessionsKey)
    
    if (!existingSessions) {
      return CommonResponses.createSuccessData({
        message: 'No active sessions found',
        activeSessions: [],
        count: 0
      }, 'No active sessions found')
    }

    const sessionIds = JSON.parse(existingSessions)
    const activeSessions: string[] = []

    for (const sessionId of sessionIds) {
      const sessionData = await redisService.get(`${SESSION_KEY_PREFIX}${sessionId}`)
      if (sessionData) {
        const session = JSON.parse(sessionData)
        if (new Date(session.expiresAt) > new Date()) {
          activeSessions.push(sessionId)
        } else {
          await redisService.del(`${SESSION_KEY_PREFIX}${sessionId}`)
        }
      }
    }

    if (activeSessions.length !== sessionIds.length) {
      if (activeSessions.length > 0) {
        await redisService.set(userSessionsKey, JSON.stringify(activeSessions), SESSION_EXPIRE_SECONDS)
      } else {
        await redisService.del(userSessionsKey)
      }
    }

    return CommonResponses.createSuccessData({
      message: 'Active sessions retrieved successfully',
      activeSessions,
      count: activeSessions.length
    }, 'Active sessions retrieved successfully')
  }

  static async validateSession(sessionId: string): Promise<any | null> {
    if (!sessionId || sessionId.trim() === '') {
      return null
    }

    const sessionData = await redisService.get(`${SESSION_KEY_PREFIX}${sessionId}`)
    if (!sessionData) {
      return null 
    }

    const session = JSON.parse(sessionData)
    
    if (new Date(session.expiresAt) <= new Date()) {
      await redisService.del(`${SESSION_KEY_PREFIX}${sessionId}`)
      return null
    }

    return session
  }
}

