// Controller handle HTTP related eg. routing, request validation
import { Elysia } from 'elysia'
import { Customer } from './service'
import { CustomerModel } from './model'
import { strictAuthMiddleware } from '../../middleware/auth'

export const customers = new Elysia({ prefix: '/customers' })
  .use(strictAuthMiddleware)
  .get(
    '/',
    async () => {
      return await Customer.getAllCustomers()
    },
    {
      response: CustomerModel.customersListResponse,
      detail: {
        tags: ['Customers'],
        summary: 'Get All Customers',
        description: 'Retrieve all active customers'
      }
    }
  )
  .post(
    '/',
    async ({ body }) => {
      return await Customer.createCustomer(body)
    },
    {
      body: CustomerModel.createCustomerBody,
      response: CustomerModel.createCustomerResponse,
      detail: {
        tags: ['Customers'],
        summary: 'Create Customer',
        description: 'Create a new customer'
      }
    }
  )
  .get(
    '/:id',
    async ({ params }) => {
      return await Customer.getCustomerById(params.id)
    },
    {
      params: CustomerModel.customerParams,
      response: CustomerModel.getCustomerResponse,
      detail: {
        tags: ['Customers'],
        summary: 'Get Customer by ID',
        description: 'Retrieve a specific customer by ID'
      }
    }
  )
  .put(
    '/:id',
    async ({ params, body }) => {
      return await Customer.updateCustomer(params.id, body)
    },
    {
      params: CustomerModel.customerParams,
      body: CustomerModel.updateCustomerBody,
      response: CustomerModel.updateCustomerResponse,
      detail: {
        tags: ['Customers'],
        summary: 'Update Customer',
        description: 'Update a customer by ID'
      }
    }
  )
  .delete(
    '/:id',
    async ({ params }) => {
      return await Customer.deleteCustomer(params.id)
    },
    {
      params: CustomerModel.customerParams,
      response: CustomerModel.deleteCustomerResponse,
      detail: {
        tags: ['Customers'],
        summary: 'Delete Customer',
        description: 'Soft delete a customer by ID'
      }
    }
  )
