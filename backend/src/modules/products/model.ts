import { t } from 'elysia'

export namespace ProductModel {
  const baseProductEntity = t.Object({
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
    createdAt: t.Date(),
    updatedAt: t.Date()
  })

  const categoryEntity = t.Object({
    id: t.String(),
    name: t.String(),
    description: t.Union([t.String(), t.Null()]),
    createdAt: t.Date(),
    updatedAt: t.Date()
  })

  const supplierEntity = t.Object({
    id: t.String(),
    name: t.String(),
    email: t.Union([t.String(), t.Null()]),
    phone: t.Union([t.String(), t.Null()]),
    address: t.Union([t.String(), t.Null()]),
    isActive: t.Boolean(),
    createdAt: t.Date(),
    updatedAt: t.Date()
  })

  export const querySchema = t.Object({
    page: t.Optional(t.String()),
    limit: t.Optional(t.String()),
    search: t.Optional(t.String()),
    category: t.Optional(t.String()),
    sort: t.Optional(t.String()),
    includeInactive: t.Optional(t.String())
  })
  export type QuerySchema = typeof querySchema.static

  export const createBody = t.Object({
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
  export type CreateBody = typeof createBody.static

  export const updateBody = t.Object({
    name: t.Optional(t.String({ minLength: 1 })),
    description: t.Optional(t.String()),
    barcode: t.Optional(t.String()),
    sku: t.Optional(t.String({ minLength: 1 })),
    price: t.Optional(t.Number({ minimum: 0 })),
    costPrice: t.Optional(t.Number({ minimum: 0 })),
    stockQuantity: t.Optional(t.Number({ minimum: 0 })),
    minStockLevel: t.Optional(t.Number({ minimum: 0 })),
    expiryDate: t.Optional(t.Date()),
    requiresPrescription: t.Optional(t.Boolean()),
    isActive: t.Optional(t.Boolean()),
    categoryId: t.Optional(t.String()),
    supplierId: t.Optional(t.String())
  })
  export type UpdateBody = typeof updateBody.static

  export const expiringProductsQuery = t.Object({
    days: t.Optional(t.Number({ minimum: 1, maximum: 365 }))
  })
  export type ExpiringProductsQuery = typeof expiringProductsQuery.static

  export const productWithRelations = t.Object({
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
    createdAt: t.Date(),
    updatedAt: t.Date(),
    category: categoryEntity,
    supplier: t.Union([supplierEntity, t.Null()])
  })

  export const singleProductResponse = t.Union([
    t.Object({
      product: productWithRelations
    }),
    t.Object({
      error: t.String()
    })
  ])
  export type SingleProductResponse = typeof singleProductResponse.static

  export const productsListResponse = t.Union([
    t.Object({
      products: t.Array(productWithRelations),
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
  export type ProductsListResponse = typeof productsListResponse.static

  export const lowStockResponse = t.Union([
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
  export type LowStockResponse = typeof lowStockResponse.static

  export const expiringProductsResponse = t.Union([
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
  export type ExpiringProductsResponse = typeof expiringProductsResponse.static

  export const notFound = t.Literal('Product not found')
  export type NotFound = typeof notFound.static

  export const validationError = t.Literal('Validation error')
  export type ValidationError = typeof validationError.static

  export const unauthorized = t.Literal('Unauthorized access')
  export type Unauthorized = typeof unauthorized.static
}
