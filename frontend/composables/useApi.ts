export const useApi = () => {
  const authStore = useAuthStore()
  const config = useRuntimeConfig()

  // Log the apiBase value to check what it is
  console.log('API Base URL:', config.public.apiBase)

  const apiFetch = async <T>(endpoint: string, options: any = {}): Promise<T> => {
    const url = `${config.public.apiBase}${endpoint}`
    
    // Also log the full URL being constructed
    console.log('Full API URL:', url)
    
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    }

    // Add authorization header if token exists
    if (authStore.token) {
      headers.Authorization = `Bearer ${authStore.token}`
    }

    try {
      const response = await $fetch<T>(url, {
        ...options,
        headers
      })
      return response
    } catch (error: any) {
      // Handle 401 errors by logging out
      if (error.status === 401 || error.statusCode === 401) {
        await authStore.logout()
      }
      throw error
    }
  }

  return {
    get: <T>(endpoint: string, options = {}) => apiFetch<T>(endpoint, { ...options, method: 'GET' }),
    post: <T>(endpoint: string, data?: any, options = {}) => apiFetch<T>(endpoint, { ...options, method: 'POST', body: data }),
    put: <T>(endpoint: string, data?: any, options = {}) => apiFetch<T>(endpoint, { ...options, method: 'PUT', body: data }),
    delete: <T>(endpoint: string, options = {}) => apiFetch<T>(endpoint, { ...options, method: 'DELETE' }),
    patch: <T>(endpoint: string, data?: any, options = {}) => apiFetch<T>(endpoint, { ...options, method: 'PATCH', body: data })
  }
}
