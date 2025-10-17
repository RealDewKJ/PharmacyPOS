import { t } from 'elysia'

export const categorySchema = t.Object({
  name: t.String({ minLength: 1 }),
  description: t.Optional(t.String())
})

export const categoryResponseSchema = t.Union([
  t.Object({
    category: t.Object({
      id: t.String(),
      name: t.String(),
      description: t.Union([t.String(), t.Null()]),
      createdAt: t.Date(),
      updatedAt: t.Date()
    })
  }),
  t.Object({
    error: t.String()
  })
])

export const categoryWithProductsResponseSchema = t.Union([
  t.Object({
    category: t.Object({
      id: t.String(),
      name: t.String(),
      description: t.Union([t.String(), t.Null()]),
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
        categoryId: t.String(),
        supplierId: t.Union([t.String(), t.Null()]),
        createdAt: t.Date(),
        updatedAt: t.Date()
      })),
      createdAt: t.Date(),
      updatedAt: t.Date()
    })
  }),
  t.Object({
    error: t.String()
  })
])

export const categoriesListResponseSchema = t.Union([
  t.Object({
    categories: t.Array(t.Object({
      id: t.String(),
      name: t.String(),
      description: t.Union([t.String(), t.Null()]),
      createdAt: t.Date(),
      updatedAt: t.Date()
    }))
  }),
  t.Object({
    error: t.String()
  })
])
