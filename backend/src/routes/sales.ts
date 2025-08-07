import { Elysia, t } from 'elysia'
import { prisma } from '../index'
import { authMiddleware } from '../middleware/auth'

export const saleRoutes = new Elysia({ prefix: '/sales' })
  .use(authMiddleware)
  .get('/', async ({ query }) => {
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
  }, {
    query: t.Object({
      page: t.Optional(t.String()),
      limit: t.Optional(t.String()),
      startDate: t.Optional(t.String()),
      endDate: t.Optional(t.String())
    })
  })
  .post('/', async ({ body, user }) => {
    const { items, customerId, paymentMethod, discount = 0, tax = 0 } = body

    // Calculate totals
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    const totalDiscount = (subtotal * discount) / 100
    const totalTax = ((subtotal - totalDiscount) * tax) / 100
    const total = subtotal - totalDiscount + totalTax

    // Create sale
    const sale = await prisma.sale.create({
      data: {
        customerId,
        userId: user.id,
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
  }, {
    body: t.Object({
      items: t.Array(t.Object({
        productId: t.String(),
        quantity: t.Number(),
        price: t.Number()
      })),
      customerId: t.Optional(t.String()),
      paymentMethod: t.Union([
        t.Literal('CASH'),
        t.Literal('CARD'),
        t.Literal('BANK_TRANSFER')
      ]),
      discount: t.Optional(t.Number()),
      tax: t.Optional(t.Number())
    })
  })
