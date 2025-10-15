// Routes exports - Clean Architecture
export { authRoutes } from './auth'
export { productRoutes } from './products'
export { categoryRoutes } from './categories'
export { supplierRoutes } from './suppliers'
export { customerRoutes } from './customers'
export { saleRoutes } from './sales'
export { purchaseRoutes } from './purchases'
export { prescriptionRoutes } from './prescriptions'
export { userRoutes } from './users'
export { dashboardRoutes } from './dashboard'
export { backupRoutes } from './backup'
export { securityRoutes } from './security'

// Route groups for better organization
export const publicRoutes = [
  'auth',
  'products',
  'categories',
  'suppliers',
  'customers'
] as const

export const protectedRoutes = [
  'sales',
  'purchases',
  'prescriptions',
  'users',
  'dashboard',
  'backup',
  'security'
] as const

export type PublicRoute = typeof publicRoutes[number]
export type ProtectedRoute = typeof protectedRoutes[number]
