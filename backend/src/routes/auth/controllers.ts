import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { redisService } from '../../services/redis'

const prisma = new PrismaClient()

// Session configuration
const SESSION_EXPIRE_SECONDS = 24 * 60 * 60 // 24 hours
const SESSION_KEY_PREFIX = 'session:'
const USER_SESSIONS_KEY_PREFIX = 'user_sessions:'

export class AuthController {
  static async login(email: string, password: string) {
    if (!email || email.trim() === '') {
      throw new Error('Email is required')
    }
    if (!password || password.trim() === '') {
      throw new Error('Password is required')
    }
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters')
    }

    console.log('Login attempt for email:', email)

    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      throw new Error('Invalid credentials')
    }

    if (!user.isActive) {
      throw new Error('Account is inactive')
    }

    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      throw new Error('Invalid credentials')
    }

    // Generate a unique session ID
    const sessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`

    // Store session in Redis
    const sessionData = {
      userId: user.id,
      email: user.email,
      role: user.role,
      sessionId,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + SESSION_EXPIRE_SECONDS * 1000).toISOString()
    }

    // Store session data
    await redisService.set(
      `${SESSION_KEY_PREFIX}${sessionId}`,
      JSON.stringify(sessionData),
      SESSION_EXPIRE_SECONDS
    )

    // Add session to user's active sessions
    const userSessionsKey = `${USER_SESSIONS_KEY_PREFIX}${user.id}`
    const existingSessions = await redisService.get(userSessionsKey)
    const sessions = existingSessions ? JSON.parse(existingSessions) : []
    sessions.push(sessionId)
    
    await redisService.set(
      userSessionsKey,
      JSON.stringify(sessions),
      SESSION_EXPIRE_SECONDS
    )

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
      sessionId
    }
  }

  static async register(email: string, password: string, name: string, role: string = 'CASHIER') {
    if (!email || email.trim() === '') {
      throw new Error('Email is required')
    }
    if (!password || password.trim() === '') {
      throw new Error('Password is required')
    }
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters')
    }
    if (!name || name.trim() === '') {
      throw new Error('Name is required')
    }
    if (name.trim().length < 2) {
      throw new Error('Name must be at least 2 characters')
    }

    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      throw new Error('User already exists')
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role
      }
    })

    // Generate a unique session ID
    const sessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`

    // Store session in Redis
    const sessionData = {
      userId: user.id,
      email: user.email,
      role: user.role,
      sessionId,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + SESSION_EXPIRE_SECONDS * 1000).toISOString()
    }

    // Store session data
    await redisService.set(
      `${SESSION_KEY_PREFIX}${sessionId}`,
      JSON.stringify(sessionData),
      SESSION_EXPIRE_SECONDS
    )

    // Add session to user's active sessions
    const userSessionsKey = `${USER_SESSIONS_KEY_PREFIX}${user.id}`
    const existingSessions = await redisService.get(userSessionsKey)
    const sessions = existingSessions ? JSON.parse(existingSessions) : []
    sessions.push(sessionId)
    
    await redisService.set(
      userSessionsKey,
      JSON.stringify(sessions),
      SESSION_EXPIRE_SECONDS
    )

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
      sessionId
    }
  }

  static async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      throw new Error('User not found')
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt
    }
  }

  static async logout(sessionId: string): Promise<boolean> {
    if (!sessionId || sessionId.trim() === '') {
      throw new Error('Session ID is required')
    }

    try {
      // Get session data to find user ID
      const sessionData = await redisService.get(`${SESSION_KEY_PREFIX}${sessionId}`)
      if (!sessionData) {
        return false // Session not found
      }

      const session = JSON.parse(sessionData)
      const userId = session.userId

      // Remove session from Redis
      await redisService.del(`${SESSION_KEY_PREFIX}${sessionId}`)

      // Remove session from user's active sessions list
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

      console.log('Logout successful for session:', sessionId)
      return true
    } catch (error) {
      console.error('Logout error:', error)
      return false
    }
  }

  static async logoutAllSessions(userId: string): Promise<number> {
    if (!userId || userId.trim() === '') {
      throw new Error('User ID is required')
    }

    try {
      const userSessionsKey = `${USER_SESSIONS_KEY_PREFIX}${userId}`
      const existingSessions = await redisService.get(userSessionsKey)
      
      if (!existingSessions) {
        return 0 // No sessions to clear
      }

      const sessions = JSON.parse(existingSessions)
      let deletedCount = 0

      // Delete each session
      for (const sessionId of sessions) {
        const deleted = await redisService.del(`${SESSION_KEY_PREFIX}${sessionId}`)
        if (deleted) {
          deletedCount++
        }
      }

      // Clear user's sessions list
      await redisService.del(userSessionsKey)

      console.log(`Logout all sessions completed for user ${userId}: ${deletedCount} sessions deleted`)
      return deletedCount
    } catch (error) {
      console.error('Logout all sessions error:', error)
      return 0
    }
  }

  static async refreshSession(sessionId: string): Promise<boolean> {
    if (!sessionId || sessionId.trim() === '') {
      throw new Error('Session ID is required')
    }

    try {
      const sessionKey = `${SESSION_KEY_PREFIX}${sessionId}`
      const sessionData = await redisService.get(sessionKey)
      
      if (!sessionData) {
        return false // Session not found
      }

      const session = JSON.parse(sessionData)
      
      // Update session with new expiration time
      const updatedSession = {
        ...session,
        expiresAt: new Date(Date.now() + SESSION_EXPIRE_SECONDS * 1000).toISOString()
      }

      // Refresh session in Redis
      await redisService.set(sessionKey, JSON.stringify(updatedSession), SESSION_EXPIRE_SECONDS)

      // Also refresh user sessions list
      const userSessionsKey = `${USER_SESSIONS_KEY_PREFIX}${session.userId}`
      await redisService.set(userSessionsKey, await redisService.get(userSessionsKey) || '[]', SESSION_EXPIRE_SECONDS)

      console.log('Session refreshed successfully for session:', sessionId)
      return true
    } catch (error) {
      console.error('Session refresh error:', error)
      return false
    }
  }

  static async getActiveSessions(userId: string): Promise<string[]> {
    if (!userId || userId.trim() === '') {
      throw new Error('User ID is required')
    }

    try {
      const userSessionsKey = `${USER_SESSIONS_KEY_PREFIX}${userId}`
      const existingSessions = await redisService.get(userSessionsKey)
      
      if (!existingSessions) {
        return [] // No active sessions
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

      // Update user sessions list if some sessions were removed
      if (activeSessions.length !== sessionIds.length) {
        if (activeSessions.length > 0) {
          await redisService.set(userSessionsKey, JSON.stringify(activeSessions), SESSION_EXPIRE_SECONDS)
        } else {
          await redisService.del(userSessionsKey)
        }
      }

      console.log(`Active sessions for user ${userId}: ${activeSessions.length} sessions`)
      return activeSessions
    } catch (error) {
      console.error('Get active sessions error:', error)
      return []
    }
  }

  static async validateSession(sessionId: string): Promise<any | null> {
    if (!sessionId || sessionId.trim() === '') {
      return null
    }

    try {
      const sessionData = await redisService.get(`${SESSION_KEY_PREFIX}${sessionId}`)
      if (!sessionData) {
        return null // Session not found
      }

      const session = JSON.parse(sessionData)
      
      // Check if session is expired
      if (new Date(session.expiresAt) <= new Date()) {
        // Remove expired session
        await redisService.del(`${SESSION_KEY_PREFIX}${sessionId}`)
        return null
      }

      return session
    } catch (error) {
      console.error('Session validation error:', error)
      return null
    }
  }
}
