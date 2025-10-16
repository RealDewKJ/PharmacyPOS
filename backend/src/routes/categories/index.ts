import { Elysia, t } from 'elysia'
import { CategoryController } from './service'
import { 
  categorySchema, 
  categoryResponseSchema,
  categoryWithProductsResponseSchema,
  categoriesListResponseSchema
} from './model'
import { sessionMiddleware } from '../../middleware/session'

export const categoryRoutes = new Elysia({ prefix: '/categories' })
  .use(sessionMiddleware)
  .get('/', async () => {
    try {
      return await CategoryController.getAllCategories()
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Failed to fetch categories'
      }
    }
  }, {
    response: categoriesListResponseSchema,
    detail: {
      tags: ['Categories'],
      summary: 'Get All Categories',
      description: 'Get list of all product categories'
    }
  })
  .get('/:id', async ({ params }) => {
    try {
      return await CategoryController.getCategoryById(params.id)
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Category not found'
      }
    }
  }, {
    response: categoryWithProductsResponseSchema,
    detail: {
      tags: ['Categories'],
      summary: 'Get Category by ID',
      description: 'Get a specific category with its products'
    }
  })
  .post('/', async ({ body }) => {
    try {
      return await CategoryController.createCategory(body as any)
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Failed to create category'
      }
    }
  }, {
    body: categorySchema,
    response: t.Union([categoryResponseSchema, t.Object({ error: t.String() })]),
    detail: {
      tags: ['Categories'],
      summary: 'Create Category',
      description: 'Create a new product category',
      security: [{ bearerAuth: [] }]
    }
  })
  .put('/:id', async ({ params, body }) => {
    try {
      return await CategoryController.updateCategory(params.id, body as any)
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Failed to update category'
      }
    }
  }, {
    body: categorySchema,
    response: t.Union([categoryResponseSchema, t.Object({ error: t.String() })]),
    detail: {
      tags: ['Categories'],
      summary: 'Update Category',
      description: 'Update an existing category',
      security: [{ bearerAuth: [] }]
    }
  })
  .delete('/:id', async ({ params }) => {
    try {
      return await CategoryController.deleteCategory(params.id)
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Failed to delete category'
      }
    }
  }, {
    detail: {
      tags: ['Categories'],
      summary: 'Delete Category',
      description: 'Delete a category',
      security: [{ bearerAuth: [] }]
    }
  })
