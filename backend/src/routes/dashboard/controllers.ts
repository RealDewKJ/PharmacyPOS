import { prisma } from '../../index'

export class DashboardController {
  static async getStats() {
    const [
      totalProducts,
      totalRevenue,
      totalSales,
      lowStockProducts,
      totalCustomers,
      totalSuppliers
    ] = await Promise.all([
      prisma.product.count({ where: { isActive: true } }),
      prisma.sale.aggregate({
        _sum: { total: true }
      }),
      prisma.sale.count(),
      prisma.product.count({
        where: {
          isActive: true,
          stockQuantity: {
            lte: prisma.product.fields.minStockLevel
          }
        }
      }),
      prisma.customer.count({ where: { isActive: true } }),
      prisma.supplier.count({ where: { isActive: true } })
    ])

    return {
      stats: {
        totalProducts,
        totalRevenue: totalRevenue._sum.total || 0,
        totalSales,
        lowStockProducts,
        totalCustomers,
        totalSuppliers
      }
    }
  }

  static async getRecentSales() {
    const recentSales = await prisma.sale.findMany({
      take: 10,
      include: {
        customer: true,
        items: {
          include: {
            product: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return { recentSales }
  }

  static async getSalesByPeriod(period: 'day' | 'week' | 'month' | 'year') {
    const now = new Date()
    let startDate: Date

    switch (period) {
      case 'day':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        break
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1)
        break
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1)
        break
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    }

    const sales = await prisma.sale.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: now
        }
      },
      include: {
        customer: true,
        items: {
          include: {
            product: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0)
    const totalSales = sales.length

    return {
      period,
      totalRevenue,
      totalSales,
      sales
    }
  }

  static async getTopProducts(limit: number = 10) {
    const topProducts = await prisma.saleItem.groupBy({
      by: ['productId'],
      _sum: {
        quantity: true,
        total: true
      },
      orderBy: {
        _sum: {
          quantity: 'desc'
        }
      },
      take: limit
    })

    const productsWithDetails = await Promise.all(
      topProducts.map(async (item) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
          select: {
            id: true,
            name: true,
            sku: true,
            price: true
          }
        })
        return {
          product,
          totalQuantity: item._sum.quantity || 0,
          totalRevenue: item._sum.total || 0
        }
      })
    )

    return { topProducts: productsWithDetails }
  }
}
