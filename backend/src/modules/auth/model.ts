import { t } from 'elysia'
import { CommonResponses } from '../../types/common-responses'

export namespace AuthModel {
	export const userRole = t.Union([
		t.Literal('ADMIN'),
		t.Literal('PHARMACIST'),
		t.Literal('CASHIER')
	])
	export type UserRole = typeof userRole.static

	export const user = t.Object({
		id: t.String(),
		email: t.String(),
		name: t.String(),
		role: userRole,
		isActive: t.Boolean(),
		createdAt: t.Date()
	})
	export type User = typeof user.static

	export const loginBody = t.Object({
		email: t.String({ format: 'email' }),
		password: t.String({ minLength: 6 })
	})
	export type LoginBody = typeof loginBody.static

	export const registerBody = t.Object({
		email: t.String({ format: 'email' }),
		password: t.String({ minLength: 6 }),
		name: t.String({ minLength: 2 }),
		role: t.Optional(userRole)
	})
	export type RegisterBody = typeof registerBody.static

	export const logoutBody = t.Object({
		sessionId: t.String()
	})
	export type LogoutBody = typeof logoutBody.static

	// Data schemas for success responses
	export const loginData = t.Object({
		token: t.String(),
		refreshToken: t.String(),
		user: user,
		sessionId: t.String()
	})
	export type LoginData = typeof loginData.static

	export const userProfileData = t.Object({
		user: user
	})
	export type UserProfileData = typeof userProfileData.static

	export const sessionData = t.Object({
		message: t.String(),
		deletedSessions: t.Optional(t.Number()),
		activeSessions: t.Optional(t.Array(t.String())),
		count: t.Optional(t.Number())
	})
	export type SessionData = typeof sessionData.static

	// Response schemas using common response structure
	export const loginResponse = t.Union([
		t.Object({
			success: t.Literal(true),
			data: loginData,
			message: t.Optional(t.String()),
			timestamp: t.String()
		}),
		CommonResponses.errorResponse
	])
	export type LoginResponse = typeof loginResponse.static

	export const userProfileResponse = t.Union([
		t.Object({
			success: t.Literal(true),
			data: userProfileData,
			message: t.Optional(t.String()),
			timestamp: t.String()
		}),
		CommonResponses.errorResponse
	])
	export type UserProfileResponse = typeof userProfileResponse.static

	export const sessionResponse = t.Union([
		t.Object({
			success: t.Literal(true),
			data: sessionData,
			message: t.Optional(t.String()),
			timestamp: t.String()
		}),
		CommonResponses.errorResponse
	])
	export type SessionResponse = typeof sessionResponse.static

	// Error literals (using common ones where possible)
	export const invalidCredentials = t.Literal('Invalid email or password')
	export type InvalidCredentials = typeof invalidCredentials.static

	export const userNotFound = t.Literal('User not found')
	export type UserNotFound = typeof userNotFound.static

	export const sessionExpired = t.Literal('Session expired')
	export type SessionExpired = typeof sessionExpired.static

	export const accountLocked = t.Literal('Account is temporarily locked')
	export type AccountLocked = typeof accountLocked.static

	export const accountInactive = t.Literal('Account is inactive')
	export type AccountInactive = typeof accountInactive.static

	export const userAlreadyExists = t.Literal('User already exists')
	export type UserAlreadyExists = typeof userAlreadyExists.static
}
