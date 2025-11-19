import { Elysia, t } from 'elysia'

import { PosSession } from './service'
import { PosSessionModel } from './model'
import { authMiddleware } from '../../middleware/auth'

export const posSessionRoutes = new Elysia({ prefix: '/pos-sessions' })
  .use(authMiddleware)
  .get(
    '/',
    async ({ query }) => {
      try {
        return await PosSession.getAllSessions(query)
      } catch (error) {
        return {
          error: error instanceof Error ? error.message : 'Failed to fetch POS sessions'
        }
      }
    },
    {
      query: PosSessionModel.querySchema,
      response: {
        200: PosSessionModel.posSessionsListResponse,
        400: PosSessionModel.validationError,
        500: t.Object({ error: t.String() })
      },
      detail: {
        tags: ['POS Sessions'],
        summary: 'Get All POS Sessions',
        description: 'Get paginated list of POS sessions with date and status filtering'
      }
    }
  )
  .get(
    '/current',
    async () => {
      try {
        return await PosSession.getCurrentSession()
      } catch (error) {
        return {
          error: error instanceof Error ? error.message : 'Failed to get current session'
        }
      }
    },
    {
      response: {
        200: PosSessionModel.currentSessionResponse,
        500: t.Object({ error: t.String() })
      },
      detail: {
        tags: ['POS Sessions'],
        summary: 'Get Current Session',
        description: 'Get the currently open POS session for today'
      }
    }
  )
  .get(
    '/current/summary',
    async () => {
      try {
        return await PosSession.getCurrentSessionSummary()
      } catch (error) {
        return {
          error: error instanceof Error ? error.message : 'Failed to get current session summary'
        }
      }
    },
    {
      response: {
        200: PosSessionModel.sessionSummaryResponse,
        404: PosSessionModel.noOpenSession,
        500: t.Object({ error: t.String() })
      },
      detail: {
        tags: ['POS Sessions'],
        summary: 'Get Current Session Summary',
        description: 'Get sales summary for the currently open POS session'
      }
    }
  )
  .get(
    '/:id',
    async ({ params }) => {
      try {
        return await PosSession.getSessionById(params.id)
      } catch (error) {
        return {
          error: error instanceof Error ? error.message : 'POS session not found'
        }
      }
    },
    {
      response: {
        200: PosSessionModel.singlePosSessionResponse,
        404: PosSessionModel.notFound,
        500: t.Object({ error: t.String() })
      },
      detail: {
        tags: ['POS Sessions'],
        summary: 'Get POS Session by ID',
        description: 'Get a specific POS session by its ID'
      }
    }
  )
  .get(
    '/:id/summary',
    async ({ params }) => {
      try {
        return await PosSession.getSessionSummary(params.id)
      } catch (error) {
        return {
          error: error instanceof Error ? error.message : 'Failed to get session summary'
        }
      }
    },
    {
      response: {
        200: PosSessionModel.sessionSummaryResponse,
        404: PosSessionModel.notFound,
        500: t.Object({ error: t.String() })
      },
      detail: {
        tags: ['POS Sessions'],
        summary: 'Get Session Summary',
        description: 'Get sales summary for a specific POS session'
      }
    }
  )
  .post(
    '/open',
    async ({ body, user }) => {
      try {
        if (!user) {
          return { error: 'Unauthorized access' }
        }
        return await PosSession.openSession(body, user.id)
      } catch (error: any) {
        if (error.status === 400) {
          return { error: error.message }
        }
        return {
          error: error instanceof Error ? error.message : 'Failed to open POS session'
        }
      }
    },
    {
      body: PosSessionModel.openSessionBody,
      response: {
        200: PosSessionModel.singlePosSessionResponse,
        400: t.Union([PosSessionModel.validationError, PosSessionModel.sessionAlreadyOpen]),
        401: PosSessionModel.unauthorized,
        500: t.Object({ error: t.String() })
      },
      detail: {
        tags: ['POS Sessions'],
        summary: 'Open POS Session',
        description: 'Open a new POS session for today. Only one session can be open at a time.',
        security: [{ bearerAuth: [] }]
      }
    }
  )
  .post(
    '/close',
    async ({ body, user }) => {
      try {
        if (!user) {
          return { error: 'Unauthorized access' }
        }
        return await PosSession.closeSession(body, user.id)
      } catch (error: any) {
        if (error.status === 404) {
          return { error: error.message }
        }
        return {
          error: error instanceof Error ? error.message : 'Failed to close POS session'
        }
      }
    },
    {
      body: PosSessionModel.closeSessionBody,
      response: {
        200: PosSessionModel.singlePosSessionResponse,
        400: PosSessionModel.validationError,
        401: PosSessionModel.unauthorized,
        404: PosSessionModel.noOpenSession,
        500: t.Object({ error: t.String() })
      },
      detail: {
        tags: ['POS Sessions'],
        summary: 'Close POS Session',
        description: 'Close the currently open POS session and calculate final totals',
        security: [{ bearerAuth: [] }]
      }
    }
  )

