import { Elysia } from 'elysia'
import { PrismaClient } from '@prisma/client'
import { swaggerConfig, corsConfig, jwtConfig, config } from './config'

import { 
  auth, 
  products, 
  categories,
  supplierRoutes,
  customers,
  saleRoutes,
  purchaseRoutes,
  prescriptionRoutes,
  userRoutes,
  dashboardRoutes,
  backupRoutes,
  securityRoutes,
  posSessionRoutes
} from './modules'

export const prisma = new PrismaClient()

console.log('🚀 Starting Pharmacy POS API...')

const app = new Elysia()
  .use(swaggerConfig)
  .use(corsConfig)
  .use(jwtConfig)
  .get('/status', ({ request }) => {
    const hostHeader = request.headers.get('host') || ''
    const [ip, port] = hostHeader.split(':')
  return {
    message: 'Pharmacy POS API',
    version: '1.0.0',
    status: 'OK',
    server_ip: ip || 'unknown',
    server_port: port || 'unknown',
  }  
  })
  .get('/health', () => ({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  }))
  .use(auth)
  .use(products)
  .use(categories)
  .use(supplierRoutes)
  .use(customers)
  .use(saleRoutes)
  .use(purchaseRoutes)
  .use(prescriptionRoutes)
  .use(userRoutes)
  .use(dashboardRoutes)
  .use(backupRoutes)
  .use(securityRoutes)
  .use(posSessionRoutes)
  .onError(({ code, error, set }: { code: string; error: any; set: any }) => {
    
    if (code === 'NOT_FOUND') {
      set.status = 404
      return { message: 'Resource not found' }
    }
    
    if (code === 'VALIDATION') {
      set.status = 400
      return { message: 'Validation error', details: error }
    }
    
    // Handle custom status codes from our services
    if (error.status) {
      set.status = error.status
      return { error: error.message }
    }
    
    // Handle specific error messages
    if (error.message?.includes('Authorization') || 
        error.message?.includes('JWT') || 
        error.message?.includes('token') ||
        error.message?.includes('User not found') ||
        error.message?.includes('inactive') ||
        error.message?.includes('Invalid email or password') ||
        error.message?.includes('Account is inactive')) {
      set.status = 401
      return { error: error.message || 'Authentication failed' }
    }
    
    if (error.message?.includes('locked') || error.message?.includes('too many')) {
      set.status = 429
      return { error: error.message || 'Too many attempts' }
    }
    
    if (error.message?.includes('already exists')) {
      set.status = 409
      return { error: error.message || 'Resource already exists' }
    }
    
    console.error('Unhandled error:', error)
    set.status = 500
    return { error: 'Internal server error' }
  })
  .listen(config.port)

console.log(
  `🦊 Pharmacy POS API is running at ${app.server?.hostname}:${app.server?.port}`
)
console.log(`📚 API Documentation: http://localhost:${app.server?.port}/swagger`)

export type App = typeof app