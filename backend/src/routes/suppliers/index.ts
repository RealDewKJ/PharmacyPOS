import { Elysia, t } from 'elysia'
import { SupplierController } from './controllers'
import { 
  supplierSchema, 
  supplierResponseSchema,
  suppliersListResponseSchema
} from './schemas'
import { sessionMiddleware } from '../../middleware/session'

export const supplierRoutes = new Elysia({ prefix: '/suppliers' })
  .use(sessionMiddleware)
  .get('/', async () => {
    try {
      return await SupplierController.getAllSuppliers()
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Failed to fetch suppliers'
      }
    }
  }, {
    response: suppliersListResponseSchema,
    detail: {
      tags: ['Suppliers'],
      summary: 'Get All Suppliers',
      description: 'Get list of all active suppliers'
    }
  })
  .get('/:id', async ({ params }) => {
    try {
      return await SupplierController.getSupplierById(params.id)
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Supplier not found'
      }
    }
  }, {
    response: supplierResponseSchema,
    detail: {
      tags: ['Suppliers'],
      summary: 'Get Supplier by ID',
      description: 'Get a specific supplier by ID'
    }
  })
  .post('/', async ({ body }) => {
    try {
      return await SupplierController.createSupplier(body as any)
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Failed to create supplier'
      }
    }
  }, {
    body: supplierSchema,
    response: t.Union([supplierResponseSchema, t.Object({ error: t.String() })]),
    detail: {
      tags: ['Suppliers'],
      summary: 'Create Supplier',
      description: 'Create a new supplier',
      security: [{ bearerAuth: [] }]
    }
  })
  .put('/:id', async ({ params, body }) => {
    try {
      return await SupplierController.updateSupplier(params.id, body as any)
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Failed to update supplier'
      }
    }
  }, {
    body: supplierSchema,
    response: t.Union([supplierResponseSchema, t.Object({ error: t.String() })]),
    detail: {
      tags: ['Suppliers'],
      summary: 'Update Supplier',
      description: 'Update an existing supplier',
      security: [{ bearerAuth: [] }]
    }
  })
  .delete('/:id', async ({ params }) => {
    try {
      return await SupplierController.deleteSupplier(params.id)
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Failed to delete supplier'
      }
    }
  }, {
    detail: {
      tags: ['Suppliers'],
      summary: 'Delete Supplier',
      description: 'Soft delete a supplier',
      security: [{ bearerAuth: [] }]
    }
  })
