import { prisma } from '../../index'

export class CustomerController {
  static async getAllCustomers() {
    const customers = await prisma.customer.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' }
    })
    return { 
      customers: customers.map(customer => ({
        ...customer,
        createdAt: customer.createdAt.toISOString(),
        updatedAt: customer.updatedAt.toISOString()
      }))
    }
  }

  static async createCustomer(data: {
    name: string
    email?: string
    phone?: string
    address?: string
  }) {
    const customer = await prisma.customer.create({ data })
    return { 
      customer: {
        ...customer,
        createdAt: customer.createdAt.toISOString(),
        updatedAt: customer.updatedAt.toISOString()
      }
    }
  }

  static async getCustomerById(id: string) {
    const customer = await prisma.customer.findUnique({
      where: { id }
    })
    if (!customer) {
      throw new Error('Customer not found')
    }
    return { 
      customer: {
        ...customer,
        createdAt: customer.createdAt.toISOString(),
        updatedAt: customer.updatedAt.toISOString()
      }
    }
  }

  static async updateCustomer(id: string, data: {
    name?: string
    email?: string
    phone?: string
    address?: string
  }) {
    const customer = await prisma.customer.update({
      where: { id },
      data
    })
    return { 
      customer: {
        ...customer,
        createdAt: customer.createdAt.toISOString(),
        updatedAt: customer.updatedAt.toISOString()
      }
    }
  }

  static async deleteCustomer(id: string) {
    await prisma.customer.update({
      where: { id },
      data: { isActive: false }
    })
    return { message: 'Customer deleted successfully' }
  }
}
