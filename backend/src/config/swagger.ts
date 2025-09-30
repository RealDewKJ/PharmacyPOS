import { swagger } from '@elysiajs/swagger'

// Load environment variables
import { config as dotenvConfig } from 'dotenv'
dotenvConfig({ path: './env.development' })

const port = parseInt(process.env.PORT || '3001')

export const swaggerConfig = swagger({
  documentation: {
    info: {
      title: 'Pharmacy POS API',
      version: '1.0.0',
      description: 'A comprehensive REST API for managing a pharmacy point-of-sale system'
    },
    servers: [
      {
        url: `http://localhost:${port}`,
        description: 'Development server'
      }
    ],
    tags: [
      { name: 'Auth', description: 'Authentication endpoints' },
      { name: 'Products', description: 'Product management' },
      { name: 'Categories', description: 'Category management' },
      { name: 'Suppliers', description: 'Supplier management' },
      { name: 'Customers', description: 'Customer management' },
      { name: 'Sales', description: 'Sales management' },
      { name: 'Purchases', description: 'Purchase management' },
      { name: 'Prescriptions', description: 'Prescription management' },
      { name: 'Users', description: 'User management' },
      { name: 'Dashboard', description: 'Dashboard and analytics' }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter JWT token obtained from login endpoint'
        }
      }
    }
  }
})
