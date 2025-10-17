import { Elysia, t } from 'elysia'
import { CustomerController } from './service'
import {
  createCustomerSchema,
  updateCustomerSchema,
  customerParamsSchema,
  customerResponseSchema,
  customersListResponseSchema,
  deleteCustomerResponseSchema
} from './model'
import { authMiddleware } from '../../middleware/auth'

export const customerRoutes = new Elysia({ prefix: '/customers' })
  .use(authMiddleware)
  .get('/', async () => {
    try {
      return await CustomerController.getAllCustomers()
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Failed to get customers'
      }
    }
  }, {
    response: customersListResponseSchema,
    detail: {
      tags: ['Customers'],
      summary: 'Get All Customers',
      description: 'Retrieve all active customers'
    }
  })
  .post('/', async ({ body }) => {
    try {
      return await CustomerController.createCustomer(body)
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Failed to create customer'
      }
    }
  }, {
    body: createCustomerSchema,
    response: customerResponseSchema,
    detail: {
      tags: ['Customers'],
      summary: 'Create Customer',
      description: 'Create a new customer'
    }
  })
  .get('/:id', async ({ params }) => {
    try {
      return await CustomerController.getCustomerById(params.id)
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Failed to get customer'
      }
    }
  }, {
    params: customerParamsSchema,
    response: customerResponseSchema,
    detail: {
      tags: ['Customers'],
      summary: 'Get Customer by ID',
      description: 'Retrieve a specific customer by ID'
    }
  })
  .put('/:id', async ({ params, body }) => {
    try {
      return await CustomerController.updateCustomer(params.id, body)
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Failed to update customer'
      }
    }
  }, {
    params: customerParamsSchema,
    body: updateCustomerSchema,
    response: customerResponseSchema,
    detail: {
      tags: ['Customers'],
      summary: 'Update Customer',
      description: 'Update a customer by ID'
    }
  })
  .delete('/:id', async ({ params }) => {
    try {
      return await CustomerController.deleteCustomer(params.id)
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Failed to delete customer'
      }
    }
  }, {
    params: customerParamsSchema,
    response: deleteCustomerResponseSchema,
    detail: {
      tags: ['Customers'],
      summary: 'Delete Customer',
      description: 'Soft delete a customer by ID'
    }
  })
