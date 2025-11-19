import { t } from 'elysia'

export namespace PosSessionModel {
  const userEntity = t.Object({
    id: t.String(),
    name: t.String(),
    email: t.String(),
    role: t.String()
  })

  const basePosSessionEntity = t.Object({
    id: t.String(),
    sessionDate: t.Date(),
    openedAt: t.Date(),
    closedAt: t.Union([t.Date(), t.Null()]),
    openedBy: t.String(),
    closedBy: t.Union([t.String(), t.Null()]),
    openingCash: t.Number(),
    closingCash: t.Union([t.Number(), t.Null()]),
    expectedCash: t.Union([t.Number(), t.Null()]),
    totalSales: t.Number(),
    totalTransactions: t.Number(),
    totalCashSales: t.Number(),
    totalCardSales: t.Number(),
    totalBankTransferSales: t.Number(),
    totalDiscount: t.Number(),
    totalTax: t.Number(),
    status: t.String(),
    notes: t.Union([t.String(), t.Null()]),
    createdAt: t.Date(),
    updatedAt: t.Date()
  })

  export const querySchema = t.Object({
    page: t.Optional(t.String()),
    limit: t.Optional(t.String()),
    startDate: t.Optional(t.String()),
    endDate: t.Optional(t.String()),
    status: t.Optional(t.String())
  })
  export type QuerySchema = typeof querySchema.static

  export const openSessionBody = t.Object({
    openingCash: t.Number({ minimum: 0 }),
    notes: t.Optional(t.String())
  })
  export type OpenSessionBody = typeof openSessionBody.static

  export const closeSessionBody = t.Object({
    closingCash: t.Number({ minimum: 0 }),
    notes: t.Optional(t.String())
  })
  export type CloseSessionBody = typeof closeSessionBody.static

  export const posSessionWithRelations = t.Object({
    id: t.String(),
    sessionDate: t.Date(),
    openedAt: t.Date(),
    closedAt: t.Union([t.Date(), t.Null()]),
    openingCash: t.Number(),
    closingCash: t.Union([t.Number(), t.Null()]),
    expectedCash: t.Union([t.Number(), t.Null()]),
    totalSales: t.Number(),
    totalTransactions: t.Number(),
    totalCashSales: t.Number(),
    totalCardSales: t.Number(),
    totalBankTransferSales: t.Number(),
    totalDiscount: t.Number(),
    totalTax: t.Number(),
    status: t.String(),
    notes: t.Union([t.String(), t.Null()]),
    createdAt: t.Date(),
    updatedAt: t.Date(),
    openedByUser: userEntity,
    closedByUser: t.Union([userEntity, t.Null()])
  })

  export const singlePosSessionResponse = t.Union([
    t.Object({
      session: posSessionWithRelations
    }),
    t.Object({
      error: t.String()
    })
  ])
  export type SinglePosSessionResponse = typeof singlePosSessionResponse.static

  export const posSessionsListResponse = t.Union([
    t.Object({
      sessions: t.Array(posSessionWithRelations),
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
  export type PosSessionsListResponse = typeof posSessionsListResponse.static

  export const currentSessionResponse = t.Union([
    t.Object({
      session: posSessionWithRelations
    }),
    t.Object({
      session: t.Null()
    }),
    t.Object({
      error: t.String()
    })
  ])
  export type CurrentSessionResponse = typeof currentSessionResponse.static

  export const sessionSummaryResponse = t.Union([
    t.Object({
      summary: t.Object({
        totalSales: t.Number(),
        totalTransactions: t.Number(),
        totalCashSales: t.Number(),
        totalCardSales: t.Number(),
        totalBankTransferSales: t.Number(),
        totalDiscount: t.Number(),
        totalTax: t.Number(),
        openingCash: t.Number(),
        expectedCash: t.Number(),
        difference: t.Number()
      })
    }),
    t.Object({
      error: t.String()
    })
  ])
  export type SessionSummaryResponse = typeof sessionSummaryResponse.static

  export const notFound = t.Literal('POS session not found')
  export type NotFound = typeof notFound.static

  export const validationError = t.Literal('Validation error')
  export type ValidationError = typeof validationError.static

  export const unauthorized = t.Literal('Unauthorized access')
  export type Unauthorized = typeof unauthorized.static

  export const sessionAlreadyOpen = t.Literal('A POS session is already open for today')
  export type SessionAlreadyOpen = typeof sessionAlreadyOpen.static

  export const noOpenSession = t.Literal('No open POS session found')
  export type NoOpenSession = typeof noOpenSession.static
}

