// API Response Types
export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}

// Product Types
export interface Product {
  id: string
  name: string
  sku: string
  description?: string
  barcode?: string
  price: number
  costPrice: number
  stockQuantity: number
  minStockLevel: number
  expiryDate?: string
  requiresPrescription: boolean
  isActive: boolean
  category?: Category
  supplier?: Supplier
  createdAt: string
  updatedAt: string
}

export interface Category {
  id: string
  name: string
  description?: string
  createdAt: string
  updatedAt: string
}

export interface Supplier {
  id: string
  name: string
  email?: string
  phone?: string
  address?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Customer {
  id: string
  name: string
  email?: string
  phone?: string
  address?: string
  city?: string
  postalCode?: string
  dateOfBirth?: string
  allergies?: string
  medicalConditions?: string
  notes?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  totalOrders?: number
  lastVisit?: string
}

// API Response Types
export interface ProductsResponse {
  products: Product[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export interface CategoriesResponse {
  categories: Category[]
}

export interface SuppliersResponse {
  suppliers: Supplier[]
}

export interface CustomersResponse {
  customers: Customer[]
}

export interface CustomerResponse {
  customer: Customer
}

export interface ProductResponse {
  product: Product
}

export interface CategoryResponse {
  category: Category
}

export interface SupplierResponse {
  supplier: Supplier
}

// Error Response
export interface ErrorResponse {
  error: string
  message?: string
}
