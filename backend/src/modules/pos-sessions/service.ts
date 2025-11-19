import { prisma } from '../../index'
import type { PosSessionModel } from './model'

export abstract class PosSession {
  static async getAllSessions(query: PosSessionModel.QuerySchema) {
    const { 
      page = '1', 
      limit = '10', 
      startDate = '', 
      endDate = '', 
      status = '' 
    } = query
    const skip = (parseInt(page) - 1) * parseInt(limit)
    
    const where: any = {
      ...(status && { status }),
      ...(startDate && endDate && {
        sessionDate: {
          gte: new Date(startDate),
          lte: new Date(endDate)
        }
      })
    }

    const [sessions, total] = await Promise.all([
      prisma.posSession.findMany({
        where,
        skip,
        take: parseInt(limit),
        include: {
          openedByUser: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true
            }
          },
          closedByUser: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true
            }
          }
        },
        orderBy: { sessionDate: 'desc' }
      }),
      prisma.posSession.count({ where })
    ])

    return {
      sessions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    }
  }

  static async getSessionById(id: string) {
    const session = await prisma.posSession.findUnique({
      where: { id },
      include: {
        openedByUser: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        },
        closedByUser: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        }
      }
    })

    if (!session) {
      const error = new Error('POS session not found')
      ;(error as any).status = 404
      throw error
    }

    return { session }
  }

  static async getCurrentSession() {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const session = await prisma.posSession.findFirst({
      where: {
        sessionDate: {
          gte: today,
          lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
        },
        status: 'OPEN'
      },
      include: {
        openedByUser: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        },
        closedByUser: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        }
      },
      orderBy: { openedAt: 'desc' }
    })

    return { session }
  }

  static async openSession(data: PosSessionModel.OpenSessionBody, userId: string) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Check if there's already an open session for today
    const existingSession = await prisma.posSession.findFirst({
      where: {
        sessionDate: {
          gte: today,
          lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
        },
        status: 'OPEN'
      }
    })

    if (existingSession) {
      const error = new Error('A POS session is already open for today')
      ;(error as any).status = 400
      throw error
    }

    const session = await prisma.posSession.create({
      data: {
        sessionDate: today,
        openedBy: userId,
        openingCash: data.openingCash,
        notes: data.notes
      },
      include: {
        openedByUser: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        },
        closedByUser: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        }
      }
    })

    return { session }
  }

  static async closeSession(data: PosSessionModel.CloseSessionBody, userId: string) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Find the current open session
    const session = await prisma.posSession.findFirst({
      where: {
        sessionDate: {
          gte: today,
          lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
        },
        status: 'OPEN'
      },
      include: {
        sales: true
      }
    })

    if (!session) {
      const error = new Error('No open POS session found')
      ;(error as any).status = 404
      throw error
    }

    // Calculate totals from sales
    const sales = session.sales
    const totalSales = sales.reduce((sum, sale) => sum + sale.grandTotal, 0)
    const totalTransactions = sales.length
    const totalCashSales = sales
      .filter(sale => sale.paymentMethod === 'CASH')
      .reduce((sum, sale) => sum + sale.grandTotal, 0)
    const totalCardSales = sales
      .filter(sale => sale.paymentMethod === 'CARD')
      .reduce((sum, sale) => sum + sale.grandTotal, 0)
    const totalBankTransferSales = sales
      .filter(sale => sale.paymentMethod === 'BANK_TRANSFER')
      .reduce((sum, sale) => sum + sale.grandTotal, 0)
    const totalDiscount = sales.reduce((sum, sale) => sum + sale.discount, 0)
    const totalTax = sales.reduce((sum, sale) => sum + sale.tax, 0)

    // Calculate expected cash
    const expectedCash = session.openingCash + totalCashSales

    // Update session with closing information
    const updatedSession = await prisma.posSession.update({
      where: { id: session.id },
      data: {
        closedAt: new Date(),
        closedBy: userId,
        closingCash: data.closingCash,
        expectedCash,
        totalSales,
        totalTransactions,
        totalCashSales,
        totalCardSales,
        totalBankTransferSales,
        totalDiscount,
        totalTax,
        status: 'CLOSED',
        notes: data.notes || session.notes
      },
      include: {
        openedByUser: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        },
        closedByUser: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        }
      }
    })

    return { session: updatedSession }
  }

  static async getSessionSummary(id: string) {
    const session = await prisma.posSession.findUnique({
      where: { id },
      include: {
        sales: true
      }
    })

    if (!session) {
      const error = new Error('POS session not found')
      ;(error as any).status = 404
      throw error
    }

    const sales = session.sales
    const totalSales = sales.reduce((sum, sale) => sum + sale.grandTotal, 0)
    const totalTransactions = sales.length
    const totalCashSales = sales
      .filter(sale => sale.paymentMethod === 'CASH')
      .reduce((sum, sale) => sum + sale.grandTotal, 0)
    const totalCardSales = sales
      .filter(sale => sale.paymentMethod === 'CARD')
      .reduce((sum, sale) => sum + sale.grandTotal, 0)
    const totalBankTransferSales = sales
      .filter(sale => sale.paymentMethod === 'BANK_TRANSFER')
      .reduce((sum, sale) => sum + sale.grandTotal, 0)
    const totalDiscount = sales.reduce((sum, sale) => sum + sale.discount, 0)
    const totalTax = sales.reduce((sum, sale) => sum + sale.tax, 0)

    const expectedCash = session.openingCash + totalCashSales
    const difference = session.closingCash 
      ? session.closingCash - expectedCash 
      : 0

    return {
      summary: {
        totalSales,
        totalTransactions,
        totalCashSales,
        totalCardSales,
        totalBankTransferSales,
        totalDiscount,
        totalTax,
        openingCash: session.openingCash,
        expectedCash,
        difference
      }
    }
  }

  static async getCurrentSessionSummary() {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const session = await prisma.posSession.findFirst({
      where: {
        sessionDate: {
          gte: today,
          lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
        },
        status: 'OPEN'
      },
      include: {
        sales: true
      }
    })

    if (!session) {
      const error = new Error('No open POS session found')
      ;(error as any).status = 404
      throw error
    }

    const sales = session.sales
    const totalSales = sales.reduce((sum, sale) => sum + sale.grandTotal, 0)
    const totalTransactions = sales.length
    const totalCashSales = sales
      .filter(sale => sale.paymentMethod === 'CASH')
      .reduce((sum, sale) => sum + sale.grandTotal, 0)
    const totalCardSales = sales
      .filter(sale => sale.paymentMethod === 'CARD')
      .reduce((sum, sale) => sum + sale.grandTotal, 0)
    const totalBankTransferSales = sales
      .filter(sale => sale.paymentMethod === 'BANK_TRANSFER')
      .reduce((sum, sale) => sum + sale.grandTotal, 0)
    const totalDiscount = sales.reduce((sum, sale) => sum + sale.discount, 0)
    const totalTax = sales.reduce((sum, sale) => sum + sale.tax, 0)

    const expectedCash = session.openingCash + totalCashSales

    return {
      summary: {
        totalSales,
        totalTransactions,
        totalCashSales,
        totalCardSales,
        totalBankTransferSales,
        totalDiscount,
        totalTax,
        openingCash: session.openingCash,
        expectedCash,
        difference: 0 // No difference until closed
      }
    }
  }
}

