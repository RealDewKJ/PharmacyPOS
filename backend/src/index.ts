import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'
import { jwt } from '@elysiajs/jwt'
import { swagger } from '@elysiajs/swagger'
import { PrismaClient } from '@prisma/client'

// Import routes
import { authRoutes } from './routes/auth'
import { productRoutes } from './routes/products'
import { categoryRoutes } from './routes/categories'
import { supplierRoutes } from './routes/suppliers'
import { customerRoutes } from './routes/customers'
import { saleRoutes } from './routes/sales'
import { purchaseRoutes } from './routes/purchases'
import { prescriptionRoutes } from './routes/prescriptions'
import { userRoutes } from './routes/users'
import { dashboardRoutes } from './routes/dashboard'

// Initialize Prisma
export const prisma = new PrismaClient()

const app = new Elysia()
  .use(swagger({
    documentation: {
      info: {
        title: 'Pharmacy POS API',
        version: '1.0.0',
        description: `
# Pharmacy POS API Documentation

A comprehensive REST API for managing a pharmacy point-of-sale system. This API provides endpoints for:

- **Authentication & Authorization**: User login, registration, and JWT-based authentication
- **Product Management**: CRUD operations for pharmaceutical products with inventory tracking
- **Sales Management**: Point-of-sale transactions with payment processing
- **Inventory Management**: Stock tracking, low stock alerts, and expiry date monitoring
- **Customer Management**: Customer profiles and purchase history
- **Supplier Management**: Supplier information and purchase orders
- **Prescription Management**: Prescription tracking and validation
- **Reporting & Analytics**: Sales reports, inventory reports, and dashboard metrics

## Authentication

Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:

\`\`\`
Authorization: Bearer <your-jwt-token>
\`\`\`

## Base URL

\`\`\`
http://localhost:3001
\`\`\`

## Rate Limiting

API requests are limited to 100 requests per minute per IP address.

## Error Responses

The API uses standard HTTP status codes:

- \`200\` - Success
- \`201\` - Created
- \`400\` - Bad Request
- \`401\` - Unauthorized
- \`403\` - Forbidden
- \`404\` - Not Found
- \`500\` - Internal Server Error

Error responses include a message field with details about the error.
        `,
        contact: {
          name: 'Pharmacy POS Support',
          email: 'support@pharmacypos.com'
        },
        license: {
          name: 'MIT',
          url: 'https://opensource.org/licenses/MIT'
        }
      },
      servers: [
        {
          url: 'http://localhost:3001',
          description: 'Development server'
        }
      ],
      tags: [
        { 
          name: 'Auth', 
          description: 'Authentication and authorization endpoints for user management' 
        },
        { 
          name: 'Products', 
          description: 'Product management including inventory, pricing, and stock tracking' 
        },
        { 
          name: 'Categories', 
          description: 'Product category management for organizing inventory' 
        },
        { 
          name: 'Suppliers', 
          description: 'Supplier information and purchase order management' 
        },
        { 
          name: 'Customers', 
          description: 'Customer profile management and purchase history' 
        },
        { 
          name: 'Sales', 
          description: 'Point-of-sale transactions and sales management' 
        },
        { 
          name: 'Purchases', 
          description: 'Purchase orders and inventory replenishment' 
        },
        { 
          name: 'Prescriptions', 
          description: 'Prescription tracking and validation for controlled substances' 
        },
        { 
          name: 'Users', 
          description: 'User account management and role-based access control' 
        },
        { 
          name: 'Dashboard', 
          description: 'Analytics, reports, and dashboard metrics' 
        }
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            description: 'JWT token for authentication'
          }
        },
        schemas: {
          Error: {
            type: 'object',
            properties: {
              message: {
                type: 'string',
                description: 'Error message'
              },
              status: {
                type: 'number',
                description: 'HTTP status code'
              }
            }
          },
          Pagination: {
            type: 'object',
            properties: {
              page: {
                type: 'number',
                description: 'Current page number'
              },
              limit: {
                type: 'number',
                description: 'Number of items per page'
              },
              total: {
                type: 'number',
                description: 'Total number of items'
              },
              pages: {
                type: 'number',
                description: 'Total number of pages'
              }
            }
          }
        }
      },
      security: [
        {
          bearerAuth: []
        }
      ]
    }
  }))
  .use(cors({
    origin: true, // Allow all origins in development
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }))
  .use(
    jwt({
      name: 'jwt',
      secret: process.env.JWT_SECRET || 'fallback-secret'
    })
  )
  .get('/', () => ({
    message: 'Pharmacy POS API',
    version: '1.0.0',
    status: 'running'
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
  .listen(process.env.PORT || 3001)

console.log(
  `🦊 Pharmacy POS API is running at ${app.server?.hostname}:${app.server?.port}`
)
console.log(`📚 API Documentation: http://localhost:${app.server?.port}/docs`)

export type App = typeof app
