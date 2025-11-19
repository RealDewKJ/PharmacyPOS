import { ref } from 'vue'
import { useApi } from './useApi'

export interface PosSession {
  id: string
  sessionDate: string
  openedAt: string
  closedAt: string | null
  openedBy: string
  closedBy: string | null
  openingCash: number
  closingCash: number | null
  expectedCash: number | null
  totalSales: number
  totalTransactions: number
  totalCashSales: number
  totalCardSales: number
  totalBankTransferSales: number
  totalDiscount: number
  totalTax: number
  status: 'OPEN' | 'CLOSED'
  notes: string | null
  createdAt: string
  updatedAt: string
  openedByUser?: {
    id: string
    name: string
    email: string
    role: string
  }
  closedByUser?: {
    id: string
    name: string
    email: string
    role: string
  } | null
}

export interface SessionSummary {
  totalSales: number
  totalTransactions: number
  totalCashSales: number
  totalCardSales: number
  totalBankTransferSales: number
  totalDiscount: number
  totalTax: number
  openingCash: number
  expectedCash: number
  difference: number
}

export const usePosSession = () => {
  const { get, post } = useApi()
  const currentSession = ref<PosSession | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const getCurrentSession = async () => {
    try {
      loading.value = true
      error.value = null
      const response = await get('/pos-sessions/current') as any
      if (response.session) {
        currentSession.value = response.session
      } else {
        currentSession.value = null
      }
      return response.session
    } catch (err: any) {
      error.value = err.message || 'Failed to get current session'
      currentSession.value = null
      return null
    } finally {
      loading.value = false
    }
  }

  const openSession = async (openingCash: number, notes?: string) => {
    try {
      loading.value = true
      error.value = null
      const response = await post('/pos-sessions/open', {
        openingCash,
        notes
      }) as any
      if (response.session) {
        currentSession.value = response.session
      }
      return response.session
    } catch (err: any) {
      error.value = err.message || 'Failed to open session'
      throw err
    } finally {
      loading.value = false
    }
  }

  const closeSession = async (closingCash: number, notes?: string) => {
    try {
      loading.value = true
      error.value = null
      const response = await post('/pos-sessions/close', {
        closingCash,
        notes
      }) as any
      if (response.session) {
        currentSession.value = response.session
      }
      return response.session
    } catch (err: any) {
      error.value = err.message || 'Failed to close session'
      throw err
    } finally {
      loading.value = false
    }
  }

  const getSessionSummary = async (sessionId?: string) => {
    try {
      loading.value = true
      error.value = null
      const endpoint = sessionId 
        ? `/pos-sessions/${sessionId}/summary`
        : '/pos-sessions/current/summary'
      const response = await get(endpoint) as any
      return response.summary as SessionSummary
    } catch (err: any) {
      error.value = err.message || 'Failed to get session summary'
      throw err
    } finally {
      loading.value = false
    }
  }

  const refreshSession = async () => {
    return await getCurrentSession()
  }

  return {
    currentSession,
    loading,
    error,
    getCurrentSession,
    openSession,
    closeSession,
    getSessionSummary,
    refreshSession
  }
}

