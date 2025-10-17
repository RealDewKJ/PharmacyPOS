import { t } from 'elysia'

// Request schemas
export const createSaleSchema = t.Object({
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

export const salesQuerySchema = t.Object({
  page: t.Optional(t.String()),
  limit: t.Optional(t.String()),
  startDate: t.Optional(t.String()),
  endDate: t.Optional(t.String())
})

export const saleParamsSchema = t.Object({
  id: t.String()
})

// Response schemas
export const saleItemSchema = t.Object({
  id: t.String(),
  productId: t.String(),
  quantity: t.Number(),
  price: t.Number(),
  total: t.Number(),
  product: t.Object({
    id: t.String(),
    name: t.String(),
    sku: t.String(),
    barcode: t.Union([t.String(), t.Null()])
  })
})

export const saleSchema = t.Object({
  id: t.String(),
  customerId: t.Union([t.String(), t.Null()]),
  userId: t.String(),
  paymentMethod: t.String(),
  discount: t.Number(),
  tax: t.Number(),
  subtotal: t.Number(),
  total: t.Number(),
  createdAt: t.String(),
  updatedAt: t.String(),
  customer: t.Union([
    t.Object({
      id: t.String(),
      name: t.String(),
      email: t.Union([t.String(), t.Null()]),
      phone: t.Union([t.String(), t.Null()])
    }),
    t.Null()
  ]),
  items: t.Array(saleItemSchema)
})

export const saleResponseSchema = t.Union([
  t.Object({
    sale: saleSchema
  }),
  t.Object({
    error: t.String()
  })
])

export const salesListResponseSchema = t.Union([
  t.Object({
    sales: t.Array(saleSchema),
    pagination: t.Object({
      page: t.Number(),
      limit: t.Number(),
      total: t.Number(),
      pages: t.Number()
    })
  }),
  t.Object({
    error: t.String()
  })
])
