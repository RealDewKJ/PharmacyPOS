import { t } from 'elysia'

// Request schemas
export const createPurchaseSchema = t.Object({
  items: t.Array(t.Object({
    productId: t.String(),
    quantity: t.Number(),
    costPrice: t.Number()
  })),
  supplierId: t.String(),
  notes: t.Optional(t.String())
})

export const purchaseParamsSchema = t.Object({
  id: t.String()
})

// Response schemas
export const purchaseItemSchema = t.Object({
  id: t.String(),
  productId: t.String(),
  quantity: t.Number(),
  costPrice: t.Number(),
  total: t.Number(),
  product: t.Object({
    id: t.String(),
    name: t.String(),
    sku: t.String(),
    barcode: t.Union([t.String(), t.Null()])
  })
})

export const purchaseSchema = t.Object({
  id: t.String(),
  supplierId: t.String(),
  userId: t.String(),
  total: t.Number(),
  notes: t.Union([t.String(), t.Null()]),
  createdAt: t.String(),
  updatedAt: t.String(),
  supplier: t.Object({
    id: t.String(),
    name: t.String(),
    email: t.Union([t.String(), t.Null()]),
    phone: t.Union([t.String(), t.Null()])
  }),
  items: t.Array(purchaseItemSchema)
})

export const purchaseResponseSchema = t.Union([
  t.Object({
    purchase: purchaseSchema
  }),
  t.Object({
    error: t.String()
  })
])

export const purchasesListResponseSchema = t.Union([
  t.Object({
    purchases: t.Array(purchaseSchema)
  }),
  t.Object({
    error: t.String()
  })
])
