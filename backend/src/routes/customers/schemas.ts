import { t } from 'elysia'

// Request schemas
export const createCustomerSchema = t.Object({
  name: t.String(),
  email: t.Optional(t.String()),
  phone: t.Optional(t.String()),
  address: t.Optional(t.String())
})

export const updateCustomerSchema = t.Object({
  name: t.Optional(t.String()),
  email: t.Optional(t.String()),
  phone: t.Optional(t.String()),
  address: t.Optional(t.String())
})

export const customerParamsSchema = t.Object({
  id: t.String()
})

// Response schemas
export const customerSchema = t.Object({
  id: t.String(),
  name: t.String(),
  email: t.Union([t.String(), t.Null()]),
  phone: t.Union([t.String(), t.Null()]),
  address: t.Union([t.String(), t.Null()]),
  isActive: t.Boolean(),
  createdAt: t.String(),
  updatedAt: t.String()
})

export const customerResponseSchema = t.Union([
  t.Object({
    customer: customerSchema
  }),
  t.Object({
    error: t.String()
  })
])

export const customersListResponseSchema = t.Union([
  t.Object({
    customers: t.Array(customerSchema)
  }),
  t.Object({
    error: t.String()
  })
])

export const deleteCustomerResponseSchema = t.Union([
  t.Object({
    message: t.String()
  }),
  t.Object({
    error: t.String()
  })
])
