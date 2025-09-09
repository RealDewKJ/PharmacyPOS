import { prisma } from '../../index'

export class SaleController {
  static async getAllSales(query: {
    page?: string
    limit?: string
    startDate?: string
    endDate?: string
  }) {
    const { page = '1', limit = '10', startDate = '', endDate = '' } = query
    const skip = (parseInt(page) - 1) * parseInt(limit)
    
    const where = {
      ...(startDate && endDate && {
        createdAt: {
          gte: new Date(startDate),
          lte: new Date(endDate)
        }
      })
    }

    const [sales, total] = await Promise.all([
      prisma.sale.findMany({
        where,
        include: {
          customer: true,
          items: {
            include: {
              product: true
            }
          }
        },
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.sale.count({ where })
    ])

    return {
      sales,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    }
  }

  static async createSale(data: {
    items: Array<{
      productId: string
      quantity: number
      price: number
    }>
    customerId?: string
    paymentMethod: 'CASH' | 'CARD' | 'BANK_TRANSFER'
    discount?: number
    tax?: number
  }, userId: string) {
    const { items, customerId, paymentMethod, discount = 0, tax = 0 } = data

    // Calculate totals
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    const totalDiscount = (subtotal * discount) / 100
    const totalTax = ((subtotal - totalDiscount) * tax) / 100
    const total = subtotal - totalDiscount + totalTax

    // Create sale
    const sale = await prisma.sale.create({
      data: {
        customerId,
        userId,
        paymentMethod,
        discount,
        tax,
        subtotal,
        total,
        items: {
          create: items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            total: item.price * item.quantity
          }))
        }
      },
      include: {
        customer: true,
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
            decrement: item.quantity
          }
        }
      })
    }

    return { sale }
  }

  static async getSaleById(id: string) {
    const sale = await prisma.sale.findUnique({
      where: { id },
      include: {
        customer: true,
        items: {
          include: {
            product: true
          }
        }
      }
    })
    if (!sale) {
      throw new Error('Sale not found')
    }
    return { sale }
  }
}
