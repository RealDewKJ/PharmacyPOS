// Controller handle HTTP related eg. routing, request validation
import { Elysia, t } from 'elysia'

import { Product } from './service'
import { ProductModel } from './model'
import { sessionMiddleware } from '../../middleware/session'

export const productRoutes = new Elysia({ prefix: '/products' })
  .use(sessionMiddleware)
  .get(
    '/',
    async ({ query }) => {
      return await Product.getAllProducts(query)
    },
    {
      query: ProductModel.querySchema,
      response: {
        200: ProductModel.productsListResponse,
        400: ProductModel.validationError,
        500: t.Object({ error: t.String() })
      },
      detail: {
        tags: ['Products'],
        summary: 'Get All Products',
        description: 'Get paginated list of products with search and filter options'
      }
    }
  )
  .get(
    '/:id',
    async ({ params }) => {
      return await Product.getProductById(params.id)
    },
    {
      response: {
        200: ProductModel.singleProductResponse,
        404: ProductModel.notFound,
        500: t.Object({ error: t.String() })
      },
      detail: {
        tags: ['Products'],
        summary: 'Get Product by ID',
        description: 'Get a specific product by its ID'
      }
    }
  )
  .get(
    '/barcode/:barcode',
    async ({ params }) => {
      return await Product.getProductByBarcode(params.barcode)
    },
    {
      response: {
        200: ProductModel.singleProductResponse,
        404: ProductModel.notFound,
        500: t.Object({ error: t.String() })
      },
      detail: {
        tags: ['Products'],
        summary: 'Get Product by Barcode',
        description: 'Get product information by barcode (useful for POS scanning)'
      }
    }
  )
  .get(
    '/low-stock',
    async () => {
      return await Product.getLowStockProducts()
    },
    {
      response: {
        200: ProductModel.lowStockResponse,
        500: t.Object({ error: t.String() })
      },
      detail: {
        tags: ['Products'],
        summary: 'Get Low Stock Products',
        description: 'Get products with stock quantity at or below minimum stock level'
      }
    }
  )
  .get(
    '/expiring',
    async ({ query }) => {
      const days = query.days ? parseInt(query.days.toString()) : 30
      return await Product.getExpiringProducts(days)
    },
    {
      query: ProductModel.expiringProductsQuery,
      response: {
        200: ProductModel.expiringProductsResponse,
        500: t.Object({ error: t.String() })
      },
      detail: {
        tags: ['Products'],
        summary: 'Get Expiring Products',
        description: 'Get products expiring within specified days'
      }
    }
  )
  .post(
    '/generate-barcode',
    async () => {
      return await Product.generateUniqueBarcode()
    },
    {
      response: {
        200: t.Object({ barcode: t.String() }),
        500: t.Object({ error: t.String() })
      },
      detail: {
        tags: ['Products'],
        summary: 'Generate Unique Barcode',
        description: 'Generate a unique barcode for new products',
        security: [{ bearerAuth: [] }]
      }
    }
  )
  .put(
    '/:id/barcode',
    async ({ params, body }) => {
      return await Product.updateProductBarcode(params.id, body.barcode)
    },
    {
      body: t.Object({
        barcode: t.String()
      }),
      response: {
        200: t.Object({ product: t.Object({ id: t.String(), name: t.String(), barcode: t.Union([t.String(), t.Null()]) }) }),
        400: ProductModel.validationError,
        500: t.Object({ error: t.String() })
      },
      detail: {
        tags: ['Products'],
        summary: 'Update Product Barcode',
        description: 'Update barcode for existing product',
        security: [{ bearerAuth: [] }]
      }
    }
  )
  .get(
    '/without-barcode',
    async () => {
      return await Product.getProductsWithoutBarcode()
    },
    {
      response: {
        200: t.Object({ products: t.Array(t.Object({ id: t.String(), name: t.String(), sku: t.String(), price: t.Number() })) }),
        500: t.Object({ error: t.String() })
      },
      detail: {
        tags: ['Products'],
        summary: 'Get Products Without Barcode',
        description: 'Get list of products that do not have barcode assigned',
        security: [{ bearerAuth: [] }]
      }
    }
  )
  .post(
    '/',
    async ({ body }) => {
      return await Product.createProduct(body)
    },
    {
      body: ProductModel.createBody,
      response: {
        200: ProductModel.singleProductResponse,
        400: ProductModel.validationError,
        500: t.Object({ error: t.String() })
      },
      detail: {
        tags: ['Products'],
        summary: 'Create Product',
        description: 'Create a new product',
        security: [{ bearerAuth: [] }]
      }
    }
  )
  .put(
    '/:id',
    async ({ params, body }) => {
      return await Product.updateProduct(params.id, body)
    },
    {
      body: ProductModel.updateBody,
      response: {
        200: ProductModel.singleProductResponse,
        400: ProductModel.validationError,
        404: ProductModel.notFound,
        500: t.Object({ error: t.String() })
      },
      detail: {
        tags: ['Products'],
        summary: 'Update Product',
        description: 'Update an existing product',
        security: [{ bearerAuth: [] }]
      }
    }
  )
  .delete(
    '/:id',
    async ({ params }) => {
      return await Product.deleteProduct(params.id)
    },
    {
      response: {
        200: t.Object({ message: t.String() }),
        404: ProductModel.notFound,
        500: t.Object({ error: t.String() })
      },
      detail: {
        tags: ['Products'],
        summary: 'Delete Product',
        description: 'Soft delete a product',
        security: [{ bearerAuth: [] }]
      }
    }
  )
