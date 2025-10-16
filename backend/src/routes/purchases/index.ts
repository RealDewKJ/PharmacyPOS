import { Elysia, t } from 'elysia'
import { PurchaseController } from './service'
import {
  createPurchaseSchema,
  purchaseParamsSchema,
  purchaseResponseSchema,
  purchasesListResponseSchema
} from './model'
import { authMiddleware } from '../../middleware/auth'

export const purchaseRoutes = new Elysia({ prefix: '/purchases' })
  .use(authMiddleware)
  .get('/', async () => {
    try {
      return await PurchaseController.getAllPurchases()
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Failed to get purchases'
      }
    }
  }, {
    response: purchasesListResponseSchema,
    detail: {
      tags: ['Purchases'],
      summary: 'Get All Purchases',
      description: 'Retrieve all purchases with supplier and product details'
    }
  })
  .post('/', async ({ body, user }) => {
    try {
      return await PurchaseController.createPurchase(body, user.id)
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Failed to create purchase'
      }
    }
  }, {
    body: createPurchaseSchema,
    response: purchaseResponseSchema,
    detail: {
      tags: ['Purchases'],
      summary: 'Create Purchase',
      description: 'Create a new purchase order'
    }
  })
  .get('/:id', async ({ params }) => {
    try {
      return await PurchaseController.getPurchaseById(params.id)
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Failed to get purchase'
      }
    }
  }, {
    params: purchaseParamsSchema,
    response: purchaseResponseSchema,
    detail: {
      tags: ['Purchases'],
      summary: 'Get Purchase by ID',
      description: 'Retrieve a specific purchase by ID'
    }
  })
