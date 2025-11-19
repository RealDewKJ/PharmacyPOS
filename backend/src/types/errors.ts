// Custom Error Classes for better error handling across the application

export class AppError extends Error {
  public readonly statusCode: number
  public readonly isOperational: boolean
  public readonly errorCode: string

  constructor(
    message: string,
    statusCode: number = 500,
    errorCode: string = 'INTERNAL_ERROR',
    isOperational: boolean = true
  ) {
    super(message)
    this.statusCode = statusCode
    this.errorCode = errorCode
    this.isOperational = isOperational

    // Maintains proper stack trace for where our error was thrown
    Error.captureStackTrace(this, this.constructor)
  }
}

// Authentication Errors
export class AuthError extends AppError {
  constructor(message: string, statusCode: number = 401, errorCode: string = 'AUTH_ERROR') {
    super(message, statusCode, errorCode)
  }
}

export class UserNotFoundError extends AuthError {
  constructor(message: string = 'User not found') {
    super(message, 404, 'USER_NOT_FOUND')
  }
}

export class InvalidCredentialsError extends AuthError {
  constructor(message: string = 'Invalid email or password') {
    super(message, 401, 'INVALID_CREDENTIALS')
  }
}

export class AccountLockedError extends AuthError {
  constructor(message: string = 'Account is temporarily locked due to multiple failed login attempts. Please try again later.') {
    super(message, 429, 'ACCOUNT_LOCKED')
  }
}

export class AccountInactiveError extends AuthError {
  constructor(message: string = 'Account is inactive') {
    super(message, 401, 'ACCOUNT_INACTIVE')
  }
}

export class UserAlreadyExistsError extends AuthError {
  constructor(message: string = 'User already exists') {
    super(message, 409, 'USER_ALREADY_EXISTS')
  }
}

export class SessionExpiredError extends AuthError {
  constructor(message: string = 'Session expired') {
    super(message, 401, 'SESSION_EXPIRED')
  }
}

export class UnauthorizedError extends AuthError {
  constructor(message: string = 'Unauthorized access') {
    super(message, 403, 'UNAUTHORIZED')
  }
}

// Validation Errors
export class ValidationError extends AppError {
  constructor(message: string, field?: string) {
    super(message, 400, 'VALIDATION_ERROR')
    this.name = 'ValidationError'
    if (field) {
      this.message = `${field}: ${message}`
    }
  }
}

// Business Logic Errors
export class BusinessLogicError extends AppError {
  constructor(message: string, statusCode: number = 400, errorCode: string = 'BUSINESS_LOGIC_ERROR') {
    super(message, statusCode, errorCode)
  }
}

export class InsufficientStockError extends BusinessLogicError {
  constructor(productName: string, available: number, requested: number) {
    super(
      `Insufficient stock for ${productName}. Available: ${available}, Requested: ${requested}`,
      400,
      'INSUFFICIENT_STOCK'
    )
  }
}

export class ProductNotFoundError extends BusinessLogicError {
  constructor(message: string = 'Product not found') {
    super(message, 404, 'PRODUCT_NOT_FOUND')
  }
}

export class CategoryNotFoundError extends BusinessLogicError {
  constructor(message: string = 'Category not found') {
    super(message, 404, 'CATEGORY_NOT_FOUND')
  }
}

export class SupplierNotFoundError extends BusinessLogicError {
  constructor(message: string = 'Supplier not found') {
    super(message, 404, 'SUPPLIER_NOT_FOUND')
  }
}

export class CustomerNotFoundError extends BusinessLogicError {
  constructor(message: string = 'Customer not found') {
    super(message, 404, 'CUSTOMER_NOT_FOUND')
  }
}

export class PrescriptionNotFoundError extends BusinessLogicError {
  constructor(message: string = 'Prescription not found') {
    super(message, 404, 'PRESCRIPTION_NOT_FOUND')
  }
}

export class SaleNotFoundError extends BusinessLogicError {
  constructor(message: string = 'Sale not found') {
    super(message, 404, 'SALE_NOT_FOUND')
  }
}

export class PurchaseNotFoundError extends BusinessLogicError {
  constructor(message: string = 'Purchase not found') {
    super(message, 404, 'PURCHASE_NOT_FOUND')
  }
}

// Database Errors
export class DatabaseError extends AppError {
  constructor(message: string, originalError?: Error) {
    super(message, 500, 'DATABASE_ERROR')
    this.name = 'DatabaseError'
    if (originalError) {
      this.message = `${message}: ${originalError.message}`
    }
  }
}

// External Service Errors
export class ExternalServiceError extends AppError {
  constructor(serviceName: string, message: string, statusCode: number = 502) {
    super(`${serviceName} error: ${message}`, statusCode, 'EXTERNAL_SERVICE_ERROR')
  }
}

// Rate Limiting Errors
export class RateLimitError extends AppError {
  constructor(message: string = 'Too many requests, please try again later') {
    super(message, 429, 'RATE_LIMIT_EXCEEDED')
  }
}

// Security Errors
export class SecurityError extends AppError {
  constructor(message: string, statusCode: number = 403, errorCode: string = 'SECURITY_ERROR') {
    super(message, statusCode, errorCode)
  }
}

export class SuspiciousActivityError extends SecurityError {
  constructor(message: string = 'Suspicious activity detected') {
    super(message, 403, 'SUSPICIOUS_ACTIVITY')
  }
}

// File/Upload Errors
export class FileError extends AppError {
  constructor(message: string, statusCode: number = 400, errorCode: string = 'FILE_ERROR') {
    super(message, statusCode, errorCode)
  }
}

export class FileTooLargeError extends FileError {
  constructor(maxSize: string) {
    super(`File too large. Maximum size allowed: ${maxSize}`, 413, 'FILE_TOO_LARGE')
  }
}

export class UnsupportedFileTypeError extends FileError {
  constructor(allowedTypes: string[]) {
    super(`Unsupported file type. Allowed types: ${allowedTypes.join(', ')}`, 400, 'UNSUPPORTED_FILE_TYPE')
  }
}

// Error Type Guards
export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError
}

export function isAuthError(error: unknown): error is AuthError {
  return error instanceof AuthError
}

export function isValidationError(error: unknown): error is ValidationError {
  return error instanceof ValidationError
}

export function isBusinessLogicError(error: unknown): error is BusinessLogicError {
  return error instanceof BusinessLogicError
}

export function isDatabaseError(error: unknown): error is DatabaseError {
  return error instanceof DatabaseError
}

// Error Response Interface
export interface ErrorResponse {
  success: false
  error: {
    message: string
    code: string
    statusCode: number
    timestamp: string
    path?: string
  }
}

// Success Response Interface
export interface SuccessResponse<T = any> {
  success: true
  data: T
  message?: string
  timestamp: string
}

// Generic API Response
export type ApiResponse<T = any> = SuccessResponse<T> | ErrorResponse

// Helper function to create error response
export function createErrorResponse(error: AppError, path?: string): ErrorResponse {
  return {
    success: false,
    error: {
      message: error.message,
      code: error.errorCode,
      statusCode: error.statusCode,
      timestamp: new Date().toISOString(),
      path
    }
  }
}

// Helper function to create success response
export function createSuccessResponse<T>(data: T, message?: string): SuccessResponse<T> {
  return {
    success: true,
    data,
    message,
    timestamp: new Date().toISOString()
  }
}
