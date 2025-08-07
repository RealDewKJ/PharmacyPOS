import { Elysia, t } from 'elysia'
import { prisma } from '../index'
import { authMiddleware } from '../middleware/auth'

export const prescriptionRoutes = new Elysia({ prefix: '/prescriptions' })
  .use(authMiddleware)
  .get('/', async () => {
    const prescriptions = await prisma.prescription.findMany({
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
    return { prescriptions }
  })
  .post('/', async ({ body }) => {
    const { customerId, items, notes = '', prescribedBy = '', expiryDate } = body

    // Create prescription
    const prescription = await prisma.prescription.create({
      data: {
        customerId,
        prescribedBy,
        notes,
        expiryDate: expiryDate ? new Date(expiryDate) : null,
        items: {
          create: items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            dosage: item.dosage,
            frequency: item.frequency,
            duration: item.duration
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

    return { prescription }
  }, {
    body: t.Object({
      customerId: t.String(),
      items: t.Array(t.Object({
        productId: t.String(),
        quantity: t.Number(),
        dosage: t.String(),
        frequency: t.String(),
        duration: t.String()
      })),
      notes: t.Optional(t.String()),
      prescribedBy: t.Optional(t.String()),
      expiryDate: t.Optional(t.String())
    })
  })
