import { Elysia, t } from 'elysia'
import { prisma } from '../index'
import { authMiddleware } from '../middleware/auth'

export const purchaseRoutes = new Elysia({ prefix: '/purchases' })
  .use(authMiddleware)
  .get('/', async () => {
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
  })
  .post('/', async ({ body, user }) => {
    const { items, supplierId, notes = '' } = body

    // Calculate total
    const total = items.reduce((sum, item) => sum + (item.costPrice * item.quantity), 0)

    // Create purchase
    const purchase = await prisma.purchase.create({
      data: {
        supplierId,
        userId: user.id,
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
  }, {
    body: t.Object({
      items: t.Array(t.Object({
        productId: t.String(),
        quantity: t.Number(),
        costPrice: t.Number()
      })),
      supplierId: t.String(),
      notes: t.Optional(t.String())
    })
  })
