import { t } from 'elysia'

export const productQuerySchema = t.Object({
  page: t.Optional(t.String()),
  limit: t.Optional(t.String()),
  search: t.Optional(t.String()),
  category: t.Optional(t.String())
})

export const productSchema = t.Object({
  name: t.String({ minLength: 1 }),
  description: t.Optional(t.String()),
  barcode: t.Optional(t.String()),
  sku: t.String({ minLength: 1 }),
  price: t.Number({ minimum: 0 }),
  costPrice: t.Number({ minimum: 0 }),
  stockQuantity: t.Number({ minimum: 0 }),
  minStockLevel: t.Number({ minimum: 0 }),
  expiryDate: t.Optional(t.Date()),
  requiresPrescription: t.Boolean(),
  categoryId: t.String(),
  supplierId: t.Optional(t.String())
})

export const productResponseSchema = t.Union([
  t.Object({
    product: t.Object({
      id: t.String(),
      name: t.String(),
      description: t.Union([t.String(), t.Null()]),
      barcode: t.Union([t.String(), t.Null()]),
      sku: t.String(),
      price: t.Number(),
      costPrice: t.Number(),
      stockQuantity: t.Number(),
      minStockLevel: t.Number(),
      expiryDate: t.Union([t.Date(), t.Null()]),
      requiresPrescription: t.Boolean(),
      isActive: t.Boolean(),
      category: t.Object({
        id: t.String(),
        name: t.String(),
        description: t.Union([t.String(), t.Null()]),
        createdAt: t.Date(),
        updatedAt: t.Date()
      }),
      supplier: t.Union([t.Object({
        id: t.String(),
        name: t.String(),
        email: t.Union([t.String(), t.Null()]),
        phone: t.Union([t.String(), t.Null()]),
        address: t.Union([t.String(), t.Null()]),
        isActive: t.Boolean(),
        createdAt: t.Date(),
        updatedAt: t.Date()
      }), t.Null()]),
      createdAt: t.Date(),
      updatedAt: t.Date()
    })
  }),
  t.Object({
    error: t.String()
  })
])

export const productsListResponseSchema = t.Union([
  t.Object({
    products: t.Array(t.Object({
      id: t.String(),
      name: t.String(),
      description: t.Union([t.String(), t.Null()]),
      barcode: t.Union([t.String(), t.Null()]),
      sku: t.String(),
      price: t.Number(),
      costPrice: t.Number(),
      stockQuantity: t.Number(),
      minStockLevel: t.Number(),
      expiryDate: t.Union([t.Date(), t.Null()]),
      requiresPrescription: t.Boolean(),
      isActive: t.Boolean(),
      category: t.Object({
        id: t.String(),
        name: t.String(),
        description: t.Union([t.String(), t.Null()]),
        createdAt: t.Date(),
        updatedAt: t.Date()
      }),
      supplier: t.Union([t.Object({
        id: t.String(),
        name: t.String(),
        email: t.Union([t.String(), t.Null()]),
        phone: t.Union([t.String(), t.Null()]),
        address: t.Union([t.String(), t.Null()]),
        isActive: t.Boolean(),
        createdAt: t.Date(),
        updatedAt: t.Date()
      }), t.Null()]),
      createdAt: t.Date(),
      updatedAt: t.Date()
    })),
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

export const lowStockResponseSchema = t.Union([
  t.Object({
    products: t.Array(t.Object({
      id: t.String(),
      name: t.String(),
      stockQuantity: t.Number(),
      minStockLevel: t.Number()
    }))
  }),
  t.Object({
    error: t.String()
  })
])

export const expiringProductsQuerySchema = t.Object({
  days: t.Optional(t.Number({ minimum: 1, maximum: 365 }))
})

export const expiringProductsResponseSchema = t.Union([
  t.Object({
    products: t.Array(t.Object({
      id: t.String(),
      name: t.String(),
      expiryDate: t.Union([t.Date(), t.Null()]),
      stockQuantity: t.Number()
    }))
  }),
  t.Object({
    error: t.String()
  })
])
