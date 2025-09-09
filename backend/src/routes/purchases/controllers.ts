import { prisma } from '../../index'

export class PurchaseController {
  static async getAllPurchases() {
    const purchases = await prisma.purchase.findMany({
      include: {
        supplier: true,
        items: {
          include: {
            product: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    return { purchases }
  }

  static async createPurchase(data: {
    items: Array<{
      productId: string
      quantity: number
      costPrice: number
    }>
    supplierId: string
    notes?: string
  }, userId: string) {
    const { items, supplierId, notes = '' } = data

    // Calculate total
    const total = items.reduce((sum, item) => sum + (item.costPrice * item.quantity), 0)

    // Create purchase
    const purchase = await prisma.purchase.create({
      data: {
        supplierId,
        userId,
        total,
        notes,
        items: {
          create: items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            costPrice: item.costPrice,
            total: item.costPrice * item.quantity
          }))
        }
      },
      include: {
        supplier: true,
        items: {
          include: {
            product: true
          }
        }
      }
    })

    // Update product stock
    for (const item of items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stockQuantity: {
            increment: item.quantity
          }
        }
      })
    }

    return { purchase }
  }

  static async getPurchaseById(id: string) {
    const purchase = await prisma.purchase.findUnique({
      where: { id },
      include: {
        supplier: true,
        items: {
          include: {
            product: true
          }
        }
      }
    })
    if (!purchase) {
      throw new Error('Purchase not found')
    }
    return { purchase }
  }
}
