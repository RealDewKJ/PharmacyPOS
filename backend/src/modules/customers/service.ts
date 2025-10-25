// Service handle business logic, decoupled from Elysia controller
import { prisma } from '../../index'
import type { CustomerModel } from './model'
import { CustomerNotFoundError, UserAlreadyExistsError } from '../../types/errors'
import { CommonResponses } from '../../types/common-responses'

// If the class doesn't need to store a property,
// you may use `abstract class` to avoid class allocation
export abstract class Customer {
  private static formatCustomer(customer: any): CustomerModel.customer {
    return {
      ...customer,
      createdAt: customer.createdAt.toISOString(),
      updatedAt: customer.updatedAt.toISOString()
    }
  }

  static async getAllCustomers(): Promise<CustomerModel.customersListResponse> {
    try {
      const customers = await prisma.customer.findMany({
        where: { isActive: true },
        orderBy: { name: 'asc' }
      })
      
      return CommonResponses.createSuccessData({
        customers: customers.map(customer => this.formatCustomer(customer))
      }, 'Customers retrieved successfully')
    } catch (error) {
      return CommonResponses.createErrorData(
        'Failed to fetch customers',
        'CUSTOMERS_FETCH_ERROR',
        500
      )
    }
  }

  static async createCustomer(data: CustomerModel.createCustomerBody): Promise<CustomerModel.createCustomerResponse> {
    try {
      // Check if customer with same email already exists (if email provided)
      if (data.email) {
        const existingCustomer = await prisma.customer.findFirst({
          where: { 
            email: data.email,
            isActive: true 
          }
        })
        
        if (existingCustomer) {
          throw new UserAlreadyExistsError('Customer with this email already exists')
        }
      }

      const customer = await prisma.customer.create({ data })
      
      return CommonResponses.createSuccessData({
        customer: this.formatCustomer(customer)
      }, 'Customer created successfully')
    } catch (error) {
      if (error instanceof UserAlreadyExistsError) {
        throw error
      }
      return CommonResponses.createErrorData(
        'Failed to create customer',
        'CUSTOMER_CREATE_ERROR',
        500
      )
    }
  }

  static async getCustomerById(id: string): Promise<CustomerModel.getCustomerResponse> {
    try {
      const customer = await prisma.customer.findUnique({
        where: { id }
      })
      
      if (!customer || !customer.isActive) {
        throw new CustomerNotFoundError(
          'Customer not found'
        )
      }
      
      return CommonResponses.createSuccessData({
        customer: this.formatCustomer(customer)
      }, 'Customer retrieved successfully')
    } catch (error) {
      if (error instanceof CustomerNotFoundError) {
        throw error
      }
      return CommonResponses.createErrorData(
        'Failed to fetch customer',
        'CUSTOMER_FETCH_ERROR',
        500
      )
    }
  }

  static async updateCustomer(id: string, data: CustomerModel.updateCustomerBody): Promise<CustomerModel.updateCustomerResponse> {
    try {
      // Check if customer exists and is active
      const existingCustomer = await prisma.customer.findUnique({
        where: { id }
      })
      
      if (!existingCustomer || !existingCustomer.isActive) {
        throw new CustomerNotFoundError(
          'Customer not found'
        )
      }

      // Check if email is being updated and if it already exists
      if (data.email && data.email !== existingCustomer.email) {
        const emailExists = await prisma.customer.findFirst({
          where: { 
            email: data.email,
            isActive: true,
            id: { not: id }
          }
        })
        
        if (emailExists) {
          throw new UserAlreadyExistsError(
            'Customer with this email already exists'
          )
        }
      }

      const customer = await prisma.customer.update({
        where: { id },
        data
      })
      
      return CommonResponses.createSuccessData({
        customer: this.formatCustomer(customer)
      }, 'Customer updated successfully')
    } catch (error) {
      if (error instanceof CustomerNotFoundError || error instanceof UserAlreadyExistsError) {
        throw error
      }
      return CommonResponses.createErrorData(
        'Failed to update customer',
        'CUSTOMER_UPDATE_ERROR',
        500
      )
    }
  }

  static async deleteCustomer(id: string): Promise<CustomerModel.deleteCustomerResponse> {
    try {
      // Check if customer exists and is active
      const existingCustomer = await prisma.customer.findUnique({
        where: { id }
      })
      
      if (!existingCustomer || !existingCustomer.isActive) {
        throw new CustomerNotFoundError(
          'Customer not found'
        )
      }

      await prisma.customer.update({
        where: { id },
        data: { isActive: false }
      })
      
      return CommonResponses.createSuccessData({
        message: 'Customer deleted successfully'
      }, 'Customer deleted successfully')
    } catch (error) {
      if (error instanceof CustomerNotFoundError) {
        throw error
      }
      return CommonResponses.createErrorData(
        'Failed to delete customer',
        'CUSTOMER_DELETE_ERROR',
        500
      )
    }
  }
}
