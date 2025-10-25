// Export all types for easy importing across the application

// Error types
export * from './errors'

// API types
export * from './api'

// Re-export commonly used types for convenience
export type {
  AppError,
  AuthError,
  UserNotFoundError,
  InvalidCredentialsError,
  AccountLockedError,
  AccountInactiveError,
  UserAlreadyExistsError,
  SessionExpiredError,
  UnauthorizedError,
  ValidationError,
  BusinessLogicError,
  InsufficientStockError,
  ProductNotFoundError,
  CategoryNotFoundError,
  SupplierNotFoundError,
  CustomerNotFoundError,
  PrescriptionNotFoundError,
  SaleNotFoundError,
  PurchaseNotFoundError,
  DatabaseError,
  ExternalServiceError,
  RateLimitError,
  SecurityError,
  SuspiciousActivityError,
  FileError,
  FileTooLargeError,
  UnsupportedFileTypeError,
  ErrorResponse,
  SuccessResponse,
  ApiResponse
} from './errors'

// Re-export API types
export type {
  ApiResponse as ApiResponseType,
  PaginatedResponse,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  UserProfile,
  Product,
  CreateProductRequest,
  UpdateProductRequest,
  Category,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  Supplier,
  CreateSupplierRequest,
  UpdateSupplierRequest,
  Customer,
  CreateCustomerRequest,
  UpdateCustomerRequest,
  Sale,
  SaleItem,
  CreateSaleRequest,
  Purchase,
  PurchaseItem,
  CreatePurchaseRequest,
  Prescription,
  PrescriptionItem,
  CreatePrescriptionRequest,
  DashboardStats,
  User,
  CreateUserRequest,
  UpdateUserRequest,
  Session,
  LogoutRequest,
  SessionResponse
} from './api'
