import { t } from 'elysia'

export const supplierSchema = t.Object({
  name: t.String({ minLength: 1 }),
  email: t.Optional(t.String({ format: 'email' })),
  phone: t.Optional(t.String()),
  address: t.Optional(t.String())
})

export const supplierResponseSchema = t.Union([
  t.Object({
    supplier: t.Object({
      id: t.String(),
      name: t.String(),
      email: t.Union([t.String(), t.Null()]),
      phone: t.Union([t.String(), t.Null()]),
      address: t.Union([t.String(), t.Null()]),
      isActive: t.Boolean(),
      createdAt: t.Date(),
      updatedAt: t.Date()
    })
  }),
  t.Object({
    error: t.String()
  })
])

export const suppliersListResponseSchema = t.Union([
  t.Object({
    suppliers: t.Array(t.Object({
      id: t.String(),
      name: t.String(),
      email: t.Union([t.String(), t.Null()]),
      phone: t.Union([t.String(), t.Null()]),
      address: t.Union([t.String(), t.Null()]),
      isActive: t.Boolean(),
      createdAt: t.Date(),
      updatedAt: t.Date()
    }))
  }),
  t.Object({
    error: t.String()
  })
])
