import { Elysia } from 'elysia'
import { PrismaClient } from '@prisma/client'
import { swaggerConfig, corsConfig, jwtConfig, config } from './config'

// Import routes - Clean Architecture
import { 
  authRoutes, 
  productRoutes, 
  categoryRoutes,
  supplierRoutes,
  customerRoutes,
  saleRoutes,
  purchaseRoutes,
  prescriptionRoutes,
  userRoutes,
  dashboardRoutes,
  backupRoutes
} from './routes'

// Initialize Prisma
export const prisma = new PrismaClient()

const app = new Elysia()
  .use(swaggerConfig)
  .use(corsConfig)
  .use(jwtConfig)
  .get('/', () => ({
    message: 'Pharmacy POS API',
    version: '1.0.0',
    status: 'running'
  }))
  .get('/health', () => ({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  }))
  .use(authRoutes)
  .use(productRoutes)
  .use(categoryRoutes)
  .use(supplierRoutes)
  .use(customerRoutes)
  .use(saleRoutes)
  .use(purchaseRoutes)
  .use(prescriptionRoutes)
  .use(userRoutes)
  .use(dashboardRoutes)
  .use(backupRoutes)
  .onError(({ code, error, set }) => {
    console.error(`Error ${code}:`, error)
    
    if (code === 'NOT_FOUND') {
      set.status = 404
      return { message: 'Resource not found' }
    }
    
    if (code === 'VALIDATION') {
      set.status = 400
      return { message: 'Validation error', details: error }
    }
    
    // Handle authentication errors
    if (error.message?.includes('Authorization') || 
        error.message?.includes('JWT') || 
        error.message?.includes('token') ||
        error.message?.includes('User not found') ||
        error.message?.includes('inactive')) {
      set.status = 401
      return { message: error.message || 'Authentication failed' }
    }
    
    set.status = 500
    return { message: 'Internal server error' }
  })
  .listen(config.port)

console.log(
  `🦊 Pharmacy POS API is running at ${app.server?.hostname}:${app.server?.port}`
)
console.log(`📚 API Documentation: http://localhost:${app.server?.port}/swagger`)

export type App = typeof app
