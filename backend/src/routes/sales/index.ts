import { Elysia, t } from 'elysia'
import { SaleController } from './controllers'
import {
  createSaleSchema,
  salesQuerySchema,
  saleParamsSchema,
  saleResponseSchema,
  salesListResponseSchema
} from './schemas'
import { authMiddleware } from '../../middleware/auth'

export const saleRoutes = new Elysia({ prefix: '/sales' })
  .use(authMiddleware)
  .get('/', async ({ query }) => {
    try {
      return await SaleController.getAllSales(query)
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Failed to get sales'
      }
    }
  }, {
    query: salesQuerySchema,
    response: salesListResponseSchema,
    detail: {
      tags: ['Sales'],
      summary: 'Get All Sales',
      description: 'Retrieve all sales with pagination and date filtering'
    }
  })
  .post('/', async ({ body, user }) => {
    try {
      return await SaleController.createSale(body, user.id)
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Failed to create sale'
      }
    }
  }, {
    body: createSaleSchema,
    response: saleResponseSchema,
    detail: {
      tags: ['Sales'],
      summary: 'Create Sale',
      description: 'Create a new sale transaction'
    }
  })
  .get('/:id', async ({ params }) => {
    try {
      return await SaleController.getSaleById(params.id)
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Failed to get sale'
      }
    }
  }, {
    params: saleParamsSchema,
    response: saleResponseSchema,
    detail: {
      tags: ['Sales'],
      summary: 'Get Sale by ID',
      description: 'Retrieve a specific sale by ID'
    }
  })
