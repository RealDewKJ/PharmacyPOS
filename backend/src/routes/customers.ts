import { Elysia, t } from 'elysia'
import { prisma } from '../index'
import { authMiddleware } from '../middleware/auth'

export const customerRoutes = new Elysia({ prefix: '/customers' })
  .use(authMiddleware)
  .get('/', async () => {
    const customers = await prisma.customer.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' }
    })
    return { customers }
  })
  .post('/', async ({ body }) => {
    const customer = await prisma.customer.create({ data: body })
    return { customer }
  }, {
    body: t.Object({
      name: t.String(),
      email: t.Optional(t.String()),
      phone: t.Optional(t.String()),
      address: t.Optional(t.String())
    })
  })
