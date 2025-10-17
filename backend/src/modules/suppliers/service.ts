import { prisma } from '../../index'

export class SupplierController {
  static async getAllSuppliers() {
    const suppliers = await prisma.supplier.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' }
    })
    return { suppliers }
  }

  static async getSupplierById(id: string) {
    const supplier = await prisma.supplier.findUnique({
      where: { id }
    })

    if (!supplier) {
      throw new Error('Supplier not found')
    }

    return { supplier }
  }

  static async createSupplier(data: {
    name: string;
    email?: string;
    phone?: string;
    address?: string;
  }) {
    const supplier = await prisma.supplier.create({
      data
    })

    return { supplier }
  }

  static async updateSupplier(id: string, data: {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
  }) {
    const supplier = await prisma.supplier.update({
      where: { id },
      data
    })

    return { supplier }
  }

  static async deleteSupplier(id: string) {
    await prisma.supplier.update({
      where: { id },
      data: { isActive: false }
    })

    return { message: 'Supplier deleted successfully' }
  }
}
