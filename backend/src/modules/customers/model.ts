// Model define the data structure and validation for the request and response
import { t } from 'elysia'
import { CommonResponses } from '../../types/common-responses'

export namespace CustomerModel {
  // Base customer schema
  export const customer = t.Object({
    id: t.String(),
    name: t.String(),
    email: t.Union([t.String(), t.Null()]),
    phone: t.Union([t.String(), t.Null()]),
    address: t.Union([t.String(), t.Null()]),
    isActive: t.Boolean(),
    createdAt: t.String(),
    updatedAt: t.String()
  })

  // Define it as TypeScript type
  export type customer = typeof customer.static

  // Request schemas
  export const createCustomerBody = t.Object({
    name: t.String(),
    email: t.Optional(t.String()),
    phone: t.Optional(t.String()),
    address: t.Optional(t.String())
  })

  export type createCustomerBody = typeof createCustomerBody.static

  export const updateCustomerBody = t.Object({
    name: t.Optional(t.String()),
    email: t.Optional(t.String()),
    phone: t.Optional(t.String()),
    address: t.Optional(t.String())
  })

  export type updateCustomerBody = typeof updateCustomerBody.static

  export const customerParams = t.Object({
    id: t.String()
  })

  export type customerParams = typeof customerParams.static

  // Data schemas for success responses
  export const customerData = t.Object({
    customer: customer
  })
  export type CustomerData = typeof customerData.static

  export const customersListData = t.Object({
    customers: t.Array(customer)
  })
  export type CustomersListData = typeof customersListData.static

  export const deleteCustomerData = t.Object({
    message: t.String()
  })
  export type DeleteCustomerData = typeof deleteCustomerData.static

  // Response schemas using common response structure
  export const createCustomerResponse = t.Union([
    t.Object({
      success: t.Literal(true),
      data: customerData,
      message: t.Optional(t.String()),
      timestamp: t.String()
    }),
    CommonResponses.errorResponse
  ])
  export type createCustomerResponse = typeof createCustomerResponse.static

  export const getCustomerResponse = t.Union([
    t.Object({
      success: t.Literal(true),
      data: customerData,
      message: t.Optional(t.String()),
      timestamp: t.String()
    }),
    CommonResponses.errorResponse
  ])
  export type getCustomerResponse = typeof getCustomerResponse.static

  export const updateCustomerResponse = t.Union([
    t.Object({
      success: t.Literal(true),
      data: customerData,
      message: t.Optional(t.String()),
      timestamp: t.String()
    }),
    CommonResponses.errorResponse
  ])
  export type updateCustomerResponse = typeof updateCustomerResponse.static

  export const customersListResponse = t.Union([
    t.Object({
      success: t.Literal(true),
      data: customersListData,
      message: t.Optional(t.String()),
      timestamp: t.String()
    }),
    CommonResponses.errorResponse
  ])
  export type customersListResponse = typeof customersListResponse.static

  export const deleteCustomerResponse = t.Union([
    t.Object({
      success: t.Literal(true),
      data: deleteCustomerData,
      message: t.Optional(t.String()),
      timestamp: t.String()
    }),
    CommonResponses.errorResponse
  ])
  export type deleteCustomerResponse = typeof deleteCustomerResponse.static

  // Error literals (using common ones where possible)
  export const customerNotFound = t.Literal('Customer not found')
  export type customerNotFound = typeof customerNotFound.static

  export const customerAlreadyExists = t.Literal('Customer already exists')
  export type customerAlreadyExists = typeof customerAlreadyExists.static

  export const invalidCustomerData = t.Literal('Invalid customer data')
  export type invalidCustomerData = typeof invalidCustomerData.static
}
