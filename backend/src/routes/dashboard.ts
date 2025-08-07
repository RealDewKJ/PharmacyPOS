import { Elysia } from 'elysia'
import { prisma } from '../index'
import { authMiddleware } from '../middleware/auth'

export const dashboardRoutes = new Elysia({ prefix: '/dashboard' })
  .use(authMiddleware)
  .get('/stats', async () => {
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
  })
  .get('/recent-sales', async () => {
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
  })
