// Common Response Schemas for consistent API responses across the application
import { t } from 'elysia'

export namespace CommonResponses {
  // Base error response schema
  export const errorResponse = t.Object({
    success: t.Literal(false),
    error: t.Object({
      message: t.String(),
      code: t.String(),
      statusCode: t.Number(),
      timestamp: t.String(),
      path: t.Optional(t.String())
    })
  })

  export type ErrorResponse = typeof errorResponse.static

  // Base success response schema
  export const successResponse = t.Object({
    success: t.Literal(true),
    data: t.Any(),
    message: t.Optional(t.String()),
    timestamp: t.String()
  })

  export type SuccessResponse<T = any> = {
    success: true
    data: T
    message?: string
    timestamp: string
  }

  // Generic API response union
  export const apiResponse = t.Union([successResponse, errorResponse])
  export type ApiResponse<T = any> = SuccessResponse<T> | ErrorResponse

  // Common error literals
  export const notFound = t.Literal('Resource not found')
  export type NotFound = typeof notFound.static

  export const alreadyExists = t.Literal('Resource already exists')
  export type AlreadyExists = typeof alreadyExists.static

  export const invalidData = t.Literal('Invalid data provided')
  export type InvalidData = typeof invalidData.static

  export const unauthorized = t.Literal('Unauthorized access')
  export type Unauthorized = typeof unauthorized.static

  export const forbidden = t.Literal('Access forbidden')
  export type Forbidden = typeof forbidden.static

  export const internalError = t.Literal('Internal server error')
  export type InternalError = typeof internalError.static

  // Helper function to create error response data
  export function createErrorData(
    message: string,
    code: string,
    statusCode: number,
    path?: string
  ) {
    return {
      success: false as const,
      error: {
        message,
        code,
        statusCode,
        timestamp: new Date().toISOString(),
        path
      }
    }
  }

  // Helper function to create success response data
  export function createSuccessData<T>(data: T, message?: string) {
    return {
      success: true as const,
      data,
      message,
      timestamp: new Date().toISOString()
    }
  }
}
