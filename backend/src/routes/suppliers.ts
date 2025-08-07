import { Elysia, t } from 'elysia'
import { prisma } from '../index'

export const supplierRoutes = new Elysia({ prefix: '/suppliers' })
  .get('/', async () => {
    const suppliers = await prisma.supplier.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' }
    })
    return { suppliers }
  })
  .post('/', async ({ body }) => {
    const supplier = await prisma.supplier.create({ data: body })
    return { supplier }
  }, {
    body: t.Object({
      name: t.String(),
      email: t.Optional(t.String()),
      phone: t.Optional(t.String()),
      address: t.Optional(t.String())
    })
  })
