// Shared API types for type-safe communication
export interface ApiResponse<T = any> {
  success?: boolean
  message?: string
  data?: T
  error?: string
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Auth types
export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  name: string
  role?: string
}

export interface AuthResponse {
  token: string
  user: {
    id: string
    email: string
    name: string
    role: string
    isActive: boolean
    createdAt: string
  }
  sessionId: string
}

export interface UserProfile {
  id: string
  email: string
  name: string
  role: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

// Product types
export interface Product {
  id: string
  name: string
  description?: string
  sku: string
  barcode?: string
  price: number
  cost: number
  stock: number
  minStock: number
  categoryId: string
  supplierId: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  category?: {
    id: string
    name: string
  }
  supplier?: {
    id: string
    name: string
  }
}

export interface CreateProductRequest {
  name: string
  description?: string
  sku: string
  barcode?: string
  price: number
  cost: number
  stock: number
  minStock: number
  categoryId: string
  supplierId: string
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {
  id: string
}

// Category types
export interface Category {
  id: string
  name: string
  description?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateCategoryRequest {
  name: string
  description?: string
}

export interface UpdateCategoryRequest extends Partial<CreateCategoryRequest> {
  id: string
}

// Supplier types
export interface Supplier {
  id: string
  name: string
  contactPerson?: string
  email?: string
  phone?: string
  address?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateSupplierRequest {
  name: string
  contactPerson?: string
  email?: string
  phone?: string
  address?: string
}

export interface UpdateSupplierRequest extends Partial<CreateSupplierRequest> {
  id: string
}

// Customer types
export interface Customer {
  id: string
  name: string
  email?: string
  phone?: string
  address?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateCustomerRequest {
  name: string
  email?: string
  phone?: string
  address?: string
}

export interface UpdateCustomerRequest extends Partial<CreateCustomerRequest> {
  id: string
}

// Sale types
export interface Sale {
  id: string
  customerId?: string
  total: number
  discount: number
  tax: number
  finalTotal: number
  paymentMethod: string
  status: string
  createdAt: string
  updatedAt: string
  customer?: Customer
  items: SaleItem[]
}

export interface SaleItem {
  id: string
  saleId: string
  productId: string
  quantity: number
  price: number
  total: number
  product: Product
}

export interface CreateSaleRequest {
  customerId?: string
  items: {
    productId: string
    quantity: number
    price: number
  }[]
  discount: number
  paymentMethod: string
}

// Purchase types
export interface Purchase {
  id: string
  supplierId: string
  total: number
  status: string
  createdAt: string
  updatedAt: string
  supplier: Supplier
  items: PurchaseItem[]
}

export interface PurchaseItem {
  id: string
  purchaseId: string
  productId: string
  quantity: number
  cost: number
  total: number
  product: Product
}

export interface CreatePurchaseRequest {
  supplierId: string
  items: {
    productId: string
    quantity: number
    cost: number
  }[]
}

// Prescription types
export interface Prescription {
  id: string
  customerId: string
  doctorName: string
  doctorLicense?: string
  prescriptionDate: string
  notes?: string
  status: string
  createdAt: string
  updatedAt: string
  customer: Customer
  items: PrescriptionItem[]
}

export interface PrescriptionItem {
  id: string
  prescriptionId: string
  productId: string
  quantity: number
  dosage?: string
  instructions?: string
  product: Product
}

export interface CreatePrescriptionRequest {
  customerId: string
  doctorName: string
  doctorLicense?: string
  prescriptionDate: string
  notes?: string
  items: {
    productId: string
    quantity: number
    dosage?: string
    instructions?: string
  }[]
}

// Dashboard types
export interface DashboardStats {
  totalProducts: number
  totalSales: number
  totalRevenue: number
  totalCustomers: number
  lowStockProducts: number
  recentSales: Sale[]
  topProducts: Array<{
    product: Product
    quantitySold: number
    revenue: number
  }>
}

// User types
export interface User {
  id: string
  email: string
  name: string
  role: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateUserRequest {
  email: string
  password: string
  name: string
  role: string
}

export interface UpdateUserRequest extends Partial<CreateUserRequest> {
  id: string
}

// Session types
export interface Session {
  id: string
  userId: string
  deviceInfo?: string
  ipAddress?: string
  isActive: boolean
  createdAt: string
  lastAccessedAt: string
  expiresAt: string
}

export interface LogoutRequest {
  sessionId: string
}

export interface SessionResponse {
  success: boolean
  message: string
  deletedSessions?: number
  activeSessions?: Session[]
  count?: number
}
