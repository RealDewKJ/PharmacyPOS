import { Elysia, t } from 'elysia'
import { DashboardController } from './controllers'
import {
  salesByPeriodQuerySchema,
  topProductsQuerySchema,
  statsResponseSchema,
  recentSalesResponseSchema,
  salesByPeriodResponseSchema,
  topProductsResponseSchema
} from './schemas'
import { authMiddleware } from '../../middleware/auth'

export const dashboardRoutes = new Elysia({ prefix: '/dashboard' })
  .use(authMiddleware)
  .get('/stats', async () => {
    try {
      return await DashboardController.getStats()
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Failed to get stats'
      }
    }
  }, {
    response: statsResponseSchema,
    detail: {
      tags: ['Dashboard'],
      summary: 'Get Dashboard Stats',
      description: 'Retrieve key statistics for the dashboard'
    }
  })
  .get('/recent-sales', async () => {
    try {
      return await DashboardController.getRecentSales()
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Failed to get recent sales'
      }
    }
  }, {
    response: recentSalesResponseSchema,
    detail: {
      tags: ['Dashboard'],
      summary: 'Get Recent Sales',
      description: 'Retrieve the 10 most recent sales'
    }
  })
  .get('/sales-by-period', async ({ query }) => {
    try {
      return await DashboardController.getSalesByPeriod(query.period)
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Failed to get sales by period'
      }
    }
  }, {
    query: salesByPeriodQuerySchema,
    response: salesByPeriodResponseSchema,
    detail: {
      tags: ['Dashboard'],
      summary: 'Get Sales by Period',
      description: 'Retrieve sales data for a specific time period'
    }
  })
  .get('/top-products', async ({ query }) => {
    try {
      const limit = query.limit ? parseInt(query.limit) : 10
      return await DashboardController.getTopProducts(limit)
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Failed to get top products'
      }
    }
  }, {
    query: topProductsQuerySchema,
    response: topProductsResponseSchema,
    detail: {
      tags: ['Dashboard'],
      summary: 'Get Top Products',
      description: 'Retrieve the top selling products'
    }
  })
