import { Elysia, t } from 'elysia'
import { prisma } from '../index'
import { authMiddleware } from '../middleware/auth'

export const productRoutes = new Elysia({ prefix: '/products' })
  // Public routes (no authentication required)
  .get('/', async ({ query }) => {
    const { page = '1', limit = '10', search = '', category = '' } = query
    const skip = (parseInt(page) - 1) * parseInt(limit)
    
    const where = {
      isActive: true,
      ...(search && {
        OR: [
          { name: { contains: search } },
          { sku: { contains: search } },
          { barcode: { contains: search } }
        ]
      }),
      ...(category && { categoryId: category })
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: true,
          supplier: true
        },
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.product.count({ where })
    ])

    return {
      products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    }
  }, {
    query: t.Object({
      page: t.Optional(t.String()),
      limit: t.Optional(t.String()),
      search: t.Optional(t.String()),
      category: t.Optional(t.String())
    }),
    detail: {
      tags: ['Products'],
      summary: 'Get All Products',
      description: 'Retrieve a paginated list of all active products. Supports search by name, SKU, or barcode, and filtering by category.',
      responses: {
        200: {
          description: 'Products retrieved successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  products: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        id: { type: 'string' },
                        name: { type: 'string' },
                        description: { type: 'string' },
                        barcode: { type: 'string' },
                        sku: { type: 'string' },
                        price: { type: 'number' },
                        costPrice: { type: 'number' },
                        stockQuantity: { type: 'number' },
                        minStockLevel: { type: 'number' },
                        expiryDate: { type: 'string', format: 'date' },
                        requiresPrescription: { type: 'boolean' },
                        category: {
                          type: 'object',
                          properties: {
                            id: { type: 'string' },
                            name: { type: 'string' }
                          }
                        },
                        supplier: {
                          type: 'object',
                          properties: {
                            id: { type: 'string' },
                            name: { type: 'string' }
                          }
                        }
                      }
                    }
                  },
                  pagination: {
                    $ref: '#/components/schemas/Pagination'
                  }
                }
              }
            }
          }
        }
      }
    }
  })
  .get('/barcode/:barcode', async ({ params }) => {
    const product = await prisma.product.findFirst({
      where: {
        barcode: params.barcode,
        isActive: true
      },
      include: {
        category: true,
        supplier: true
      }
    })

    if (!product) {
      throw new Error('Product not found')
    }

    return { product }
  }, {
    params: t.Object({
      barcode: t.String()
    }),
    detail: {
      tags: ['Products'],
      summary: 'Get Product by Barcode',
      description: 'Retrieve a product by its barcode. Useful for POS scanning operations.',
      responses: {
        200: {
          description: 'Product found',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  product: {
                    type: 'object',
                    properties: {
                      id: { type: 'string' },
                      name: { type: 'string' },
                      description: { type: 'string' },
                      barcode: { type: 'string' },
                      sku: { type: 'string' },
                      price: { type: 'number' },
                      costPrice: { type: 'number' },
                      stockQuantity: { type: 'number' },
                      minStockLevel: { type: 'number' },
                      expiryDate: { type: 'string', format: 'date' },
                      requiresPrescription: { type: 'boolean' },
                      category: {
                        type: 'object',
                        properties: {
                          id: { type: 'string' },
                          name: { type: 'string' }
                        }
                      },
                      supplier: {
                        type: 'object',
                        properties: {
                          id: { type: 'string' },
                          name: { type: 'string' }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        404: {
          description: 'Product not found',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: { type: 'string', example: 'Product not found' }
                }
              }
            }
          }
        }
      }
    }
  })
  .get('/:id', async ({ params }) => {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: {
        category: true,
        supplier: true
      }
    })

    if (!product) {
      throw new Error('Product not found')
    }

    return { product }
  }, {
    params: t.Object({
      id: t.String()
    })
  })
  .get('/low-stock', async () => {
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        stockQuantity: {
          lte: prisma.product.fields.minStockLevel
        }
      },
      include: {
        category: true,
        supplier: true
      },
      orderBy: { stockQuantity: 'asc' }
    })

    return { products }
  }, {
    detail: {
      tags: ['Products'],
      summary: 'Get Low Stock Products',
      description: 'Retrieve all products that are running low on stock (stock quantity <= minimum stock level).',
      responses: {
        200: {
          description: 'Low stock products retrieved successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  products: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        id: { type: 'string' },
                        name: { type: 'string' },
                        stockQuantity: { type: 'number' },
                        minStockLevel: { type: 'number' },
                        category: {
                          type: 'object',
                          properties: {
                            id: { type: 'string' },
                            name: { type: 'string' }
                          }
                        },
                        supplier: {
                          type: 'object',
                          properties: {
                            id: { type: 'string' },
                            name: { type: 'string' }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  })
  .get('/expiring', async ({ query }) => {
    const { days = '30' } = query
    const expiryDate = new Date()
    expiryDate.setDate(expiryDate.getDate() + parseInt(days))

    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        expiryDate: {
          lte: expiryDate,
          gte: new Date()
        }
      },
      include: {
        category: true,
        supplier: true
      },
      orderBy: { expiryDate: 'asc' }
    })

    return { products }
  }, {
    query: t.Object({
      days: t.Optional(t.String())
    }),
    detail: {
      tags: ['Products'],
      summary: 'Get Expiring Products',
      description: 'Retrieve products that are expiring within the specified number of days (default: 30 days).',
      responses: {
        200: {
          description: 'Expiring products retrieved successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  products: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        id: { type: 'string' },
                        name: { type: 'string' },
                        expiryDate: { type: 'string', format: 'date' },
                        stockQuantity: { type: 'number' },
                        category: {
                          type: 'object',
                          properties: {
                            id: { type: 'string' },
                            name: { type: 'string' }
                          }
                        },
                        supplier: {
                          type: 'object',
                          properties: {
                            id: { type: 'string' },
                            name: { type: 'string' }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  })
  // Protected routes (authentication required)
  .use(authMiddleware)
  .post('/', async ({ body, user }) => {
    const product = await prisma.product.create({
      data: {
        ...body,
        sku: body.sku || `SKU-${Date.now()}`
      },
      include: {
        category: true,
        supplier: true
      }
    })

    return { product }
  }, {
    body: t.Object({
      name: t.String(),
      description: t.Optional(t.String()),
      barcode: t.Optional(t.String()),
      sku: t.Optional(t.String()),
      price: t.Number(),
      costPrice: t.Number(),
      stockQuantity: t.Number(),
      minStockLevel: t.Optional(t.Number()),
      expiryDate: t.Optional(t.String()),
      requiresPrescription: t.Optional(t.Boolean()),
      categoryId: t.String(),
      supplierId: t.Optional(t.String())
    }),
    detail: {
      tags: ['Products'],
      summary: 'Create New Product',
      description: 'Create a new product in the inventory. Requires authentication.',
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'Product created successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  product: {
                    type: 'object',
                    properties: {
                      id: { type: 'string' },
                      name: { type: 'string' },
                      description: { type: 'string' },
                      barcode: { type: 'string' },
                      sku: { type: 'string' },
                      price: { type: 'number' },
                      costPrice: { type: 'number' },
                      stockQuantity: { type: 'number' },
                      minStockLevel: { type: 'number' },
                      expiryDate: { type: 'string', format: 'date' },
                      requiresPrescription: { type: 'boolean' },
                      category: {
                        type: 'object',
                        properties: {
                          id: { type: 'string' },
                          name: { type: 'string' }
                        }
                      },
                      supplier: {
                        type: 'object',
                        properties: {
                          id: { type: 'string' },
                          name: { type: 'string' }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        401: {
          description: 'Unauthorized',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        }
      }
    }
  })
  .put('/:id', async ({ params, body }) => {
    const product = await prisma.product.update({
      where: { id: params.id },
      data: body,
      include: {
        category: true,
        supplier: true
      }
    })

    return { product }
  }, {
    params: t.Object({
      id: t.String()
    }),
    body: t.Object({
      name: t.Optional(t.String()),
      description: t.Optional(t.String()),
      barcode: t.Optional(t.String()),
      price: t.Optional(t.Number()),
      costPrice: t.Optional(t.Number()),
      stockQuantity: t.Optional(t.Number()),
      minStockLevel: t.Optional(t.Number()),
      expiryDate: t.Optional(t.String()),
      requiresPrescription: t.Optional(t.Boolean()),
      categoryId: t.Optional(t.String()),
      supplierId: t.Optional(t.String())
    })
  })
  .delete('/:id', async ({ params }) => {
    await prisma.product.update({
      where: { id: params.id },
      data: { isActive: false }
    })

    return { message: 'Product deleted successfully' }
  }, {
    params: t.Object({
      id: t.String()
    })
  })
