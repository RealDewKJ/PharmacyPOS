import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { redisService } from '../../services/redis'
import { BruteForceProtection } from '../../middleware/rateLimit'
import { SecurityLogger } from '../../utils/securityLogger'
import { SuspiciousActivityDetector } from '../../services/suspiciousActivityDetector'
import { extractSecurityContext } from '../../middleware/securityContext'

import type { AuthModel } from './model'

const prisma = new PrismaClient()

const SESSION_EXPIRE_SECONDS = 24 * 60 * 60
const SESSION_KEY_PREFIX = 'session:'
const USER_SESSIONS_KEY_PREFIX = 'user_sessions:'

export abstract class Auth {
  static async login({ email, password }: AuthModel.LoginBody, context?: any): Promise<AuthModel.LoginSuccess> {
    const securityContext = context ? extractSecurityContext(context) : { ip: 'unknown', userAgent: undefined }
    const { ip, userAgent } = securityContext

    SecurityLogger.logLoginAttempt(email, ip, false, userAgent)

    const isAccountLocked = await BruteForceProtection.checkAccountLock(email, 'login')
    if (isAccountLocked) {
      SecurityLogger.logAccountLocked(email, ip, 'Account locked due to brute force attempts')
      const error = new Error('Account is temporarily locked due to multiple failed login attempts. Please try again later.')
      ;(error as any).status = 429
      throw error
    }

    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      await BruteForceProtection.recordFailedAttempt(email, 'login')
      SecurityLogger.logFailedLogin(email, ip, 'User not found', userAgent)
      await SuspiciousActivityDetector.checkBruteForcePattern(ip, email)
      
      const error = new Error('Invalid email or password' satisfies AuthModel.InvalidCredentials)
      ;(error as any).status = 401
      throw error
    }

    if (!user.isActive) {
      await BruteForceProtection.recordFailedAttempt(email, 'login')
      SecurityLogger.logFailedLogin(email, ip, 'Account inactive', userAgent)
      await SuspiciousActivityDetector.checkBruteForcePattern(ip, email)
      
      const error = new Error('Account is inactive')
      ;(error as any).status = 401
      throw error
    }

    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      await BruteForceProtection.recordFailedAttempt(email, 'login')
      SecurityLogger.logFailedLogin(email, ip, 'Invalid password', userAgent)
      await SuspiciousActivityDetector.checkBruteForcePattern(ip, email)
      
      const error = new Error('Invalid email or password' satisfies AuthModel.InvalidCredentials)
      ;(error as any).status = 401
      throw error
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

    return {
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
    }
  }

  static async register({ email, password, name, role = 'CASHIER' }: AuthModel.RegisterBody, context?: any): Promise<AuthModel.LoginSuccess> {
    const securityContext = context ? extractSecurityContext(context) : { ip: 'unknown', userAgent: undefined }
    const { ip, userAgent } = securityContext

    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      SecurityLogger.logSecurityViolation('Registration attempt with existing email', undefined, ip, { email, name })
      const error = new Error('User already exists')
      ;(error as any).status = 409
      throw error
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

    return {
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
    }
  }

  static async getProfile(userId: string): Promise<AuthModel.User> {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      const error = new Error('User not found' satisfies AuthModel.UserNotFound)
      ;(error as any).status = 401
      throw error
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role as AuthModel.UserRole,
      isActive: user.isActive,
      createdAt: user.createdAt
    }
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

  static async logout({ sessionId }: AuthModel.LogoutBody, context?: any): Promise<AuthModel.SessionResponseSuccess> {
    const securityContext = context ? extractSecurityContext(context) : { ip: 'unknown', userAgent: undefined }
    const { ip } = securityContext

    const sessionData = await redisService.get(`${SESSION_KEY_PREFIX}${sessionId}`)
    if (!sessionData) {
      return {
        success: false,
        message: 'Session not found'
      }
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

    return {
      success: true,
      message: 'Logged out successfully'
    }
  }

  static async logoutAllSessions(userId: string): Promise<AuthModel.SessionResponseSuccess> {
    const userSessionsKey = `${USER_SESSIONS_KEY_PREFIX}${userId}`
    const existingSessions = await redisService.get(userSessionsKey)
    
    if (!existingSessions) {
      return {
        success: true,
        message: 'No active sessions found',
        deletedSessions: 0
      }
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

    return {
      success: true,
      message: `Logged out from ${deletedCount} sessions`,
      deletedSessions: deletedCount
    }
  }

  static async refreshSession({ sessionId }: AuthModel.LogoutBody, context?: any): Promise<AuthModel.SessionResponseSuccess> {
    const securityContext = context ? extractSecurityContext(context) : { ip: 'unknown', userAgent: undefined }
    const { ip } = securityContext

    const sessionKey = `${SESSION_KEY_PREFIX}${sessionId}`
    const sessionData = await redisService.get(sessionKey)
    
    if (!sessionData) {
      return {
        success: false,
        message: 'Session not found or expired'
      }
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

    return {
      success: true,
      message: 'Session refreshed successfully'
    }
  }

  static async getActiveSessions(userId: string): Promise<AuthModel.SessionResponseSuccess> {
    const userSessionsKey = `${USER_SESSIONS_KEY_PREFIX}${userId}`
    const existingSessions = await redisService.get(userSessionsKey)
    
    if (!existingSessions) {
      return {
        success: true,
        message: 'No active sessions found',
        activeSessions: [],
        count: 0
      }
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

    return {
      success: true,
      message: 'Active sessions retrieved successfully',
      activeSessions,
      count: activeSessions.length
    }
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

