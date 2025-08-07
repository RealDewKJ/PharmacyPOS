import { Elysia, t } from 'elysia'
import { prisma } from '../index'

export const categoryRoutes = new Elysia({ prefix: '/categories' })
  .get('/', async () => {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' }
    })
    return { categories }
  })
  .get('/:id', async ({ params }) => {
    const category = await prisma.category.findUnique({
      where: { id: params.id },
      include: { products: true }
    })
    if (!category) throw new Error('Category not found')
    return { category }
  }, {
    params: t.Object({ id: t.String() })
  })
  .post('/', async ({ body }) => {
    const category = await prisma.category.create({ data: body })
    return { category }
  }, {
    body: t.Object({
      name: t.String(),
      description: t.Optional(t.String())
    })
  })
  .put('/:id', async ({ params, body }) => {
    const category = await prisma.category.update({
      where: { id: params.id },
      data: body
    })
    return { category }
  }, {
    params: t.Object({ id: t.String() }),
    body: t.Object({
      name: t.Optional(t.String()),
      description: t.Optional(t.String())
    })
  })
  .delete('/:id', async ({ params }) => {
    await prisma.category.delete({ where: { id: params.id } })
    return { message: 'Category deleted successfully' }
  }, {
    params: t.Object({ id: t.String() })
  })
