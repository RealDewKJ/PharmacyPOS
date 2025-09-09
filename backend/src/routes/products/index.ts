import { Elysia } from 'elysia'
import { ProductController } from './controllers'
import { 
  productQuerySchema, 
  productSchema, 
  productsListResponseSchema,
  lowStockResponseSchema,
  expiringProductsQuerySchema,
  expiringProductsResponseSchema
} from './schemas'
import { authMiddleware } from '../../middleware/auth'

export const productRoutes = new Elysia({ prefix: '/products' })
  .use(authMiddleware)
  // Public routes (no authentication required)
  .get('/', async ({ query }) => {
    try {
      return await ProductController.getAllProducts(query)
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Failed to fetch products'
      }
    }
  }, {
    query: productQuerySchema,
    response: productsListResponseSchema,
    detail: {
      tags: ['Products'],
      summary: 'Get All Products',
      description: 'Get paginated list of products with search and filter options'
    }
  })
  .get('/:id', async ({ params }) => {
    try {
      return await ProductController.getProductById(params.id)
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Product not found'
      }
    }
  }, {
    detail: {
      tags: ['Products'],
      summary: 'Get Product by ID',
      description: 'Get a specific product by its ID'
    }
  })
  .get('/barcode/:barcode', async ({ params }) => {
    try {
      return await ProductController.getProductByBarcode(params.barcode)
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Product not found'
      }
    }
  }, {
    detail: {
      tags: ['Products'],
      summary: 'Get Product by Barcode',
      description: 'Get product information by barcode (useful for POS scanning)'
    }
  })
  .get('/low-stock', async () => {
    try {
      return await ProductController.getLowStockProducts()
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Failed to fetch low stock products'
      }
    }
  }, {
    response: lowStockResponseSchema,
    detail: {
      tags: ['Products'],
      summary: 'Get Low Stock Products',
      description: 'Get products with stock quantity at or below minimum stock level'
    }
  })
  .get('/expiring', async ({ query }) => {
    try {
      const days = query.days ? parseInt(query.days.toString()) : 30
      return await ProductController.getExpiringProducts(days)
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Failed to fetch expiring products'
      }
    }
  }, {
    query: expiringProductsQuerySchema,
    response: expiringProductsResponseSchema,
    detail: {
      tags: ['Products'],
      summary: 'Get Expiring Products',
      description: 'Get products expiring within specified days'
    }
  })
  // Protected routes (authentication required)
  .post('/', async ({ body }) => {
    try {
      return await ProductController.createProduct(body as any)
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Failed to create product'
      }
    }
  }, {
    body: productSchema,
    detail: {
      tags: ['Products'],
      summary: 'Create Product',
      description: 'Create a new product',
      security: [{ bearerAuth: [] }]
    }
  })
  .put('/:id', async ({ params, body }) => {
    try {
      return await ProductController.updateProduct(params.id, body as any)
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Failed to update product'
      }
    }
  }, {
    body: productSchema,
    detail: {
      tags: ['Products'],
      summary: 'Update Product',
      description: 'Update an existing product',
      security: [{ bearerAuth: [] }]
    }
  })
  .delete('/:id', async ({ params }) => {
    try {
      return await ProductController.deleteProduct(params.id)
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Failed to delete product'
      }
    }
  }, {
    detail: {
      tags: ['Products'],
      summary: 'Delete Product',
      description: 'Soft delete a product',
      security: [{ bearerAuth: [] }]
    }
  })
