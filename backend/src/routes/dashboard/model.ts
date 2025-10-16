import { t } from 'elysia'

// Request schemas
export const salesByPeriodQuerySchema = t.Object({
  period: t.Union([
    t.Literal('day'),
    t.Literal('week'),
    t.Literal('month'),
    t.Literal('year')
  ])
})

export const topProductsQuerySchema = t.Object({
  limit: t.Optional(t.String())
})

// Response schemas
export const statsSchema = t.Object({
  totalProducts: t.Number(),
  totalRevenue: t.Number(),
  totalSales: t.Number(),
  lowStockProducts: t.Number(),
  totalCustomers: t.Number(),
  totalSuppliers: t.Number()
})

export const statsResponseSchema = t.Union([
  t.Object({
    stats: statsSchema
  }),
  t.Object({
    error: t.String()
  })
])

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

export const recentSalesResponseSchema = t.Union([
  t.Object({
    recentSales: t.Array(saleSchema)
  }),
  t.Object({
    error: t.String()
  })
])

export const salesByPeriodResponseSchema = t.Union([
  t.Object({
    period: t.String(),
    totalRevenue: t.Number(),
    totalSales: t.Number(),
    sales: t.Array(saleSchema)
  }),
  t.Object({
    error: t.String()
  })
])

export const topProductSchema = t.Object({
  product: t.Union([
    t.Object({
      id: t.String(),
      name: t.String(),
      sku: t.String(),
      price: t.Number()
    }),
    t.Null()
  ]),
  totalQuantity: t.Number(),
  totalRevenue: t.Number()
})

export const topProductsResponseSchema = t.Union([
  t.Object({
    topProducts: t.Array(topProductSchema)
  }),
  t.Object({
    error: t.String()
  })
])
