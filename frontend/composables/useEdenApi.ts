// Type-safe API client interface
export interface ApiClient {
  auth: {
    login: (email: string, password: string) => Promise<{ token?: string; user?: any; sessionId?: string; error?: string }>
    register: (email: string, password: string, name: string, role?: string) => Promise<{ token?: string; user?: any; sessionId?: string; error?: string }>
    logout: (sessionId: string) => Promise<{ success?: boolean; message?: string; error?: string }>
    logoutAll: () => Promise<{ success?: boolean; message?: string; deletedSessions?: number; error?: string }>
    refreshSession: (sessionId: string) => Promise<{ success?: boolean; message?: string; error?: string }>
    getProfile: () => Promise<{ user?: any; error?: string }>
    getSessions: () => Promise<{ success?: boolean; message?: string; activeSessions?: any[]; count?: number; error?: string }>
  }
  products: {
    getAll: () => Promise<{ products?: any[]; error?: string }>
    getById: (id: string) => Promise<{ product?: any; error?: string }>
    create: (data: any) => Promise<{ product?: any; error?: string }>
    update: (id: string, data: any) => Promise<{ product?: any; error?: string }>
    delete: (id: string) => Promise<{ success?: boolean; message?: string; error?: string }>
  }
  categories: {
    getAll: () => Promise<{ categories?: any[]; error?: string }>
    getById: (id: string) => Promise<{ category?: any; error?: string }>
    create: (data: any) => Promise<{ category?: any; error?: string }>
    update: (id: string, data: any) => Promise<{ category?: any; error?: string }>
    delete: (id: string) => Promise<{ success?: boolean; message?: string; error?: string }>
  }
  suppliers: {
    getAll: () => Promise<{ suppliers?: any[]; error?: string }>
    getById: (id: string) => Promise<{ supplier?: any; error?: string }>
    create: (data: any) => Promise<{ supplier?: any; error?: string }>
    update: (id: string, data: any) => Promise<{ supplier?: any; error?: string }>
    delete: (id: string) => Promise<{ success?: boolean; message?: string; error?: string }>
  }
  customers: {
    getAll: () => Promise<{ customers?: any[]; error?: string }>
    getById: (id: string) => Promise<{ customer?: any; error?: string }>
    create: (data: any) => Promise<{ customer?: any; error?: string }>
    update: (id: string, data: any) => Promise<{ customer?: any; error?: string }>
    delete: (id: string) => Promise<{ success?: boolean; message?: string; error?: string }>
  }
  sales: {
    getAll: () => Promise<{ sales?: any[]; error?: string }>
    getById: (id: string) => Promise<{ sale?: any; error?: string }>
    create: (data: any) => Promise<{ sale?: any; error?: string }>
    update: (id: string, data: any) => Promise<{ sale?: any; error?: string }>
    delete: (id: string) => Promise<{ success?: boolean; message?: string; error?: string }>
  }
  purchases: {
    getAll: () => Promise<{ purchases?: any[]; error?: string }>
    getById: (id: string) => Promise<{ purchase?: any; error?: string }>
    create: (data: any) => Promise<{ purchase?: any; error?: string }>
    update: (id: string, data: any) => Promise<{ purchase?: any; error?: string }>
    delete: (id: string) => Promise<{ success?: boolean; message?: string; error?: string }>
  }
  prescriptions: {
    getAll: () => Promise<{ prescriptions?: any[]; error?: string }>
    getById: (id: string) => Promise<{ prescription?: any; error?: string }>
    create: (data: any) => Promise<{ prescription?: any; error?: string }>
    update: (id: string, data: any) => Promise<{ prescription?: any; error?: string }>
    delete: (id: string) => Promise<{ success?: boolean; message?: string; error?: string }>
  }
  users: {
    getAll: () => Promise<{ users?: any[]; error?: string }>
    getById: (id: string) => Promise<{ user?: any; error?: string }>
    create: (data: any) => Promise<{ user?: any; error?: string }>
    update: (id: string, data: any) => Promise<{ user?: any; error?: string }>
    delete: (id: string) => Promise<{ success?: boolean; message?: string; error?: string }>
  }
  dashboard: {
    getStats: () => Promise<{ stats?: any; error?: string }>
  }
  health: {
    check: () => Promise<{ status?: string; timestamp?: string; uptime?: number; error?: string }>
  }
}

// Create a type-safe API client using $fetch
const createApiClient = (baseUrl: string, token?: string): ApiClient => {
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  }

  const makeRequest = async <T = any>(endpoint: string, options: any = {}): Promise<T> => {
    const fullUrl = `${baseUrl}${endpoint}`
    console.log('Making request to:', fullUrl)
    console.log('Request options:', options)
    console.log('Request headers:', { ...headers, ...options.headers })
    
    try {
      const response = await $fetch<T>(fullUrl, {
        ...options,
        headers: { ...headers, ...options.headers }
      })
      console.log('Response received:', response)
      return response
    } catch (error: any) {
      console.error('Request failed:', error)
      console.error('Error details:', {
        status: error.status,
        statusCode: error.statusCode,
        message: error.message,
        data: error.data
      })
      
      if (error.status === 401 || error.statusCode === 401) {
        if (process.client) {
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          localStorage.removeItem('sessionId')
        }
      }
      throw error
    }
  }

  return {
    auth: {
      login: (email: string, password: string) => 
        makeRequest<{ token?: string; user?: any; sessionId?: string; error?: string }>('/auth/login', { method: 'POST', body: { email, password } }),
      register: (email: string, password: string, name: string, role?: string) => 
        makeRequest<{ token?: string; user?: any; sessionId?: string; error?: string }>('/auth/register', { method: 'POST', body: { email, password, name, role } }),
      logout: (sessionId: string) => 
        makeRequest<{ success?: boolean; message?: string; error?: string }>('/auth/logout', { method: 'POST', body: { sessionId } }),
      logoutAll: () => 
        makeRequest<{ success?: boolean; message?: string; deletedSessions?: number; error?: string }>('/auth/logout-all', { method: 'POST' }),
      refreshSession: (sessionId: string) => 
        makeRequest<{ success?: boolean; message?: string; error?: string }>('/auth/refresh-session', { method: 'POST', body: { sessionId } }),
      getProfile: () => 
        makeRequest<{ user?: any; error?: string }>('/auth/me'),
      getSessions: () => 
        makeRequest<{ success?: boolean; message?: string; activeSessions?: any[]; count?: number; error?: string }>('/auth/sessions')
    },
    products: {
      getAll: () => makeRequest<{ products?: any[]; error?: string }>('/products'),
      getById: (id: string) => makeRequest<{ product?: any; error?: string }>(`/products/${id}`),
      create: (data: any) => makeRequest<{ product?: any; error?: string }>('/products', { method: 'POST', body: data }),
      update: (id: string, data: any) => makeRequest<{ product?: any; error?: string }>(`/products/${id}`, { method: 'PUT', body: data }),
      delete: (id: string) => makeRequest<{ success?: boolean; message?: string; error?: string }>(`/products/${id}`, { method: 'DELETE' })
    },
    categories: {
      getAll: () => makeRequest<{ categories?: any[]; error?: string }>('/categories'),
      getById: (id: string) => makeRequest<{ category?: any; error?: string }>(`/categories/${id}`),
      create: (data: any) => makeRequest<{ category?: any; error?: string }>('/categories', { method: 'POST', body: data }),
      update: (id: string, data: any) => makeRequest<{ category?: any; error?: string }>(`/categories/${id}`, { method: 'PUT', body: data }),
      delete: (id: string) => makeRequest<{ success?: boolean; message?: string; error?: string }>(`/categories/${id}`, { method: 'DELETE' })
    },
    suppliers: {
      getAll: () => makeRequest<{ suppliers?: any[]; error?: string }>('/suppliers'),
      getById: (id: string) => makeRequest<{ supplier?: any; error?: string }>(`/suppliers/${id}`),
      create: (data: any) => makeRequest<{ supplier?: any; error?: string }>('/suppliers', { method: 'POST', body: data }),
      update: (id: string, data: any) => makeRequest<{ supplier?: any; error?: string }>(`/suppliers/${id}`, { method: 'PUT', body: data }),
      delete: (id: string) => makeRequest<{ success?: boolean; message?: string; error?: string }>(`/suppliers/${id}`, { method: 'DELETE' })
    },
    customers: {
      getAll: () => makeRequest<{ customers?: any[]; error?: string }>('/customers'),
      getById: (id: string) => makeRequest<{ customer?: any; error?: string }>(`/customers/${id}`),
      create: (data: any) => makeRequest<{ customer?: any; error?: string }>('/customers', { method: 'POST', body: data }),
      update: (id: string, data: any) => makeRequest<{ customer?: any; error?: string }>(`/customers/${id}`, { method: 'PUT', body: data }),
      delete: (id: string) => makeRequest<{ success?: boolean; message?: string; error?: string }>(`/customers/${id}`, { method: 'DELETE' })
    },
    sales: {
      getAll: () => makeRequest<{ sales?: any[]; error?: string }>('/sales'),
      getById: (id: string) => makeRequest<{ sale?: any; error?: string }>(`/sales/${id}`),
      create: (data: any) => makeRequest<{ sale?: any; error?: string }>('/sales', { method: 'POST', body: data }),
      update: (id: string, data: any) => makeRequest<{ sale?: any; error?: string }>(`/sales/${id}`, { method: 'PUT', body: data }),
      delete: (id: string) => makeRequest<{ success?: boolean; message?: string; error?: string }>(`/sales/${id}`, { method: 'DELETE' })
    },
    purchases: {
      getAll: () => makeRequest<{ purchases?: any[]; error?: string }>('/purchases'),
      getById: (id: string) => makeRequest<{ purchase?: any; error?: string }>(`/purchases/${id}`),
      create: (data: any) => makeRequest<{ purchase?: any; error?: string }>('/purchases', { method: 'POST', body: data }),
      update: (id: string, data: any) => makeRequest<{ purchase?: any; error?: string }>(`/purchases/${id}`, { method: 'PUT', body: data }),
      delete: (id: string) => makeRequest<{ success?: boolean; message?: string; error?: string }>(`/purchases/${id}`, { method: 'DELETE' })
    },
    prescriptions: {
      getAll: () => makeRequest<{ prescriptions?: any[]; error?: string }>('/prescriptions'),
      getById: (id: string) => makeRequest<{ prescription?: any; error?: string }>(`/prescriptions/${id}`),
      create: (data: any) => makeRequest<{ prescription?: any; error?: string }>('/prescriptions', { method: 'POST', body: data }),
      update: (id: string, data: any) => makeRequest<{ prescription?: any; error?: string }>(`/prescriptions/${id}`, { method: 'PUT', body: data }),
      delete: (id: string) => makeRequest<{ success?: boolean; message?: string; error?: string }>(`/prescriptions/${id}`, { method: 'DELETE' })
    },
    users: {
      getAll: () => makeRequest<{ users?: any[]; error?: string }>('/users'),
      getById: (id: string) => makeRequest<{ user?: any; error?: string }>(`/users/${id}`),
      create: (data: any) => makeRequest<{ user?: any; error?: string }>('/users', { method: 'POST', body: data }),
      update: (id: string, data: any) => makeRequest<{ user?: any; error?: string }>(`/users/${id}`, { method: 'PUT', body: data }),
      delete: (id: string) => makeRequest<{ success?: boolean; message?: string; error?: string }>(`/users/${id}`, { method: 'DELETE' })
    },
    dashboard: {
      getStats: () => makeRequest<{ stats?: any; error?: string }>('/dashboard')
    },
    health: {
      check: () => makeRequest<{ status?: string; timestamp?: string; uptime?: number; error?: string }>('/health')
    }
  }
}

export const useEdenApi = (token?: string) => {
  const config = useRuntimeConfig()
  
  console.log('Runtime config:', config)
  console.log('API Base URL from config:', config.public.apiBase)

  // Create a configured API client with authentication
  const api = createApiClient(config.public.apiBase, token)

  // Auth endpoints
  const auth = {
    login: async (email: string, password: string) => {
      const response = await api.auth.login(email, password)
      return response
    },
    
    register: async (email: string, password: string, name: string, role?: string) => {
      const response = await api.auth.register(email, password, name, role)
      return response
    },
    
    logout: async (sessionId: string) => {
      const response = await api.auth.logout(sessionId)
      return response
    },
    
    logoutAll: async () => {
      const response = await api.auth.logoutAll()
      return response
    },
    
    refreshSession: async (sessionId: string) => {
      const response = await api.auth.refreshSession(sessionId)
      return response
    },
    
    getProfile: async () => {
      const response = await api.auth.getProfile()
      return response
    },
    
    getSessions: async () => {
      const response = await api.auth.getSessions()
      return response
    }
  }

  // Products endpoints
  const products = {
    getAll: async () => {
      const response = await api.products.getAll()
      return response
    },
    
    getById: async (id: string) => {
      const response = await api.products.getById(id)
      return response
    },
    
    create: async (data: any) => {
      const response = await api.products.create(data)
      return response
    },
    
    update: async (id: string, data: any) => {
      const response = await api.products.update(id, data)
      return response
    },
    
    delete: async (id: string) => {
      const response = await api.products.delete(id)
      return response
    }
  }

  // Categories endpoints
  const categories = {
    getAll: async () => {
      const response = await api.categories.getAll()
      return response
    },
    
    getById: async (id: string) => {
      const response = await api.categories.getById(id)
      return response
    },
    
    create: async (data: any) => {
      const response = await api.categories.create(data)
      return response
    },
    
    update: async (id: string, data: any) => {
      const response = await api.categories.update(id, data)
      return response
    },
    
    delete: async (id: string) => {
      const response = await api.categories.delete(id)
      return response
    }
  }

  // Suppliers endpoints
  const suppliers = {
    getAll: async () => {
      const response = await api.suppliers.getAll()
      return response
    },
    
    getById: async (id: string) => {
      const response = await api.suppliers.getById(id)
      return response
    },
    
    create: async (data: any) => {
      const response = await api.suppliers.create(data)
      return response
    },
    
    update: async (id: string, data: any) => {
      const response = await api.suppliers.update(id, data)
      return response
    },
    
    delete: async (id: string) => {
      const response = await api.suppliers.delete(id)
      return response
    }
  }

  // Customers endpoints
  const customers = {
    getAll: async () => {
      const response = await api.customers.getAll()
      return response
    },
    
    getById: async (id: string) => {
      const response = await api.customers.getById(id)
      return response
    },
    
    create: async (data: any) => {
      const response = await api.customers.create(data)
      return response
    },
    
    update: async (id: string, data: any) => {
      const response = await api.customers.update(id, data)
      return response
    },
    
    delete: async (id: string) => {
      const response = await api.customers.delete(id)
      return response
    }
  }

  // Sales endpoints
  const sales = {
    getAll: async () => {
      const response = await api.sales.getAll()
      return response
    },
    
    getById: async (id: string) => {
      const response = await api.sales.getById(id)
      return response
    },
    
    create: async (data: any) => {
      const response = await api.sales.create(data)
      return response
    },
    
    update: async (id: string, data: any) => {
      const response = await api.sales.update(id, data)
      return response
    },
    
    delete: async (id: string) => {
      const response = await api.sales.delete(id)
      return response
    }
  }

  // Purchases endpoints
  const purchases = {
    getAll: async () => {
      const response = await api.purchases.getAll()
      return response
    },
    
    getById: async (id: string) => {
      const response = await api.purchases.getById(id)
      return response
    },
    
    create: async (data: any) => {
      const response = await api.purchases.create(data)
      return response
    },
    
    update: async (id: string, data: any) => {
      const response = await api.purchases.update(id, data)
      return response
    },
    
    delete: async (id: string) => {
      const response = await api.purchases.delete(id)
      return response
    }
  }

  // Prescriptions endpoints
  const prescriptions = {
    getAll: async () => {
      const response = await api.prescriptions.getAll()
      return response
    },
    
    getById: async (id: string) => {
      const response = await api.prescriptions.getById(id)
      return response
    },
    
    create: async (data: any) => {
      const response = await api.prescriptions.create(data)
      return response
    },
    
    update: async (id: string, data: any) => {
      const response = await api.prescriptions.update(id, data)
      return response
    },
    
    delete: async (id: string) => {
      const response = await api.prescriptions.delete(id)
      return response
    }
  }

  // Users endpoints
  const users = {
    getAll: async () => {
      const response = await api.users.getAll()
      return response
    },
    
    getById: async (id: string) => {
      const response = await api.users.getById(id)
      return response
    },
    
    create: async (data: any) => {
      const response = await api.users.create(data)
      return response
    },
    
    update: async (id: string, data: any) => {
      const response = await api.users.update(id, data)
      return response
    },
    
    delete: async (id: string) => {
      const response = await api.users.delete(id)
      return response
    }
  }

  // Dashboard endpoints
  const dashboard = {
    getStats: async () => {
      const response = await api.dashboard.getStats()
      return response
    }
  }

  // Health check
  const health = {
    check: async () => {
      const response = await api.health.check()
      return response
    }
  }

  return {
    auth,
    products,
    categories,
    suppliers,
    customers,
    sales,
    purchases,
    prescriptions,
    users,
    dashboard,
    health,
    // Raw API client for advanced usage
    api: api
  }
}