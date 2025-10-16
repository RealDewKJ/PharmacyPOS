import { t } from 'elysia'

export namespace AuthModel {
	// User role enum
	export const userRole = t.Union([
		t.Literal('ADMIN'),
		t.Literal('PHARMACIST'),
		t.Literal('CASHIER')
	])
	export type UserRole = typeof userRole.static

	// User object schema
	export const user = t.Object({
		id: t.String(),
		email: t.String(),
		name: t.String(),
		role: userRole,
		isActive: t.Boolean(),
		createdAt: t.Date()
	})
	export type User = typeof user.static

	// Login request DTO
	export const loginBody = t.Object({
		email: t.String({ format: 'email' }),
		password: t.String({ minLength: 6 })
	})
	export type LoginBody = typeof loginBody.static

	// Register request DTO
	export const registerBody = t.Object({
		email: t.String({ format: 'email' }),
		password: t.String({ minLength: 6 }),
		name: t.String({ minLength: 2 }),
		role: t.Optional(userRole)
	})
	export type RegisterBody = typeof registerBody.static

	// Logout request DTO
	export const logoutBody = t.Object({
		sessionId: t.String()
	})
	export type LogoutBody = typeof logoutBody.static

	// Success response schemas
	export const loginSuccess = t.Object({
		token: t.String(),
		refreshToken: t.String(),
		user: user,
		sessionId: t.String()
	})
	export type LoginSuccess = typeof loginSuccess.static

	export const userProfileSuccess = t.Object({
		user: user
	})
	export type UserProfileSuccess = typeof userProfileSuccess.static

	export const sessionResponseSuccess = t.Object({
		success: t.Boolean(),
		message: t.String(),
		deletedSessions: t.Optional(t.Number()),
		activeSessions: t.Optional(t.Array(t.String())),
		count: t.Optional(t.Number())
	})
	export type SessionResponseSuccess = typeof sessionResponseSuccess.static

	// Error response schema
	export const errorResponse = t.Object({
		error: t.String()
	})
	export type ErrorResponse = typeof errorResponse.static

	// Union response schemas
	export const loginResponse = t.Union([loginSuccess, errorResponse])
	export type LoginResponse = typeof loginResponse.static

	export const userProfileResponse = t.Union([userProfileSuccess, errorResponse])
	export type UserProfileResponse = typeof userProfileResponse.static

	export const sessionResponse = t.Union([sessionResponseSuccess, errorResponse])
	export type SessionResponse = typeof sessionResponse.static

	// Common error messages
	export const invalidCredentials = t.Literal('Invalid email or password')
	export type InvalidCredentials = typeof invalidCredentials.static

	export const userNotFound = t.Literal('User not found')
	export type UserNotFound = typeof userNotFound.static

	export const sessionExpired = t.Literal('Session expired')
	export type SessionExpired = typeof sessionExpired.static

	export const unauthorized = t.Literal('Unauthorized access')
	export type Unauthorized = typeof unauthorized.static
}
