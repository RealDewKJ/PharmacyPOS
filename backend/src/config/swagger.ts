import { swagger } from '@elysiajs/swagger'

export const swaggerConfig = swagger({
  documentation: {
    info: {
      title: 'Pharmacy POS API',
      version: '1.0.0',
      description: 'A comprehensive REST API for managing a pharmacy point-of-sale system'
    },
    servers: [
      {
        url: 'http://localhost:3001',
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
    ]
  }
})
