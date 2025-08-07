import { defineStore } from 'pinia'

interface User {
  id: string
  email: string
  name: string
  role: 'ADMIN' | 'PHARMACIST' | 'CASHIER'
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  loading: boolean
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false
  }),

  getters: {
    isAdmin: (state) => state.user?.role === 'ADMIN',
    isPharmacist: (state) => state.user?.role === 'PHARMACIST',
    isCashier: (state) => state.user?.role === 'CASHIER',
    hasRole: (state) => (role: string) => state.user?.role === role,
    canAccess: (state) => (requiredRoles: string[]) => {
      if (!state.user) return false
      return requiredRoles.includes(state.user.role)
    }
  },

  actions: {
    async login(email: string, password: string) {
      this.loading = true
      try {
        const config = useRuntimeConfig()
        console.log('Attempting login with API base:', config.public.apiBase)
        
        const response = await $fetch<{ token: string; user: User }>(`${config.public.apiBase}/auth/login`, {
          method: 'POST',
          body: { email, password }
        })

        this.token = response.token
        this.user = response.user
        this.isAuthenticated = true

        // Store in localStorage
        if (process.client) {
          localStorage.setItem('token', response.token)
          localStorage.setItem('user', JSON.stringify(response.user))
        }

        return response
      } catch (error: any) {
        console.error('Login error:', error)
        console.error('Error details:', {
          status: error.status,
          statusCode: error.statusCode,
          data: error.data,
          message: error.message
        })
        
        let errorMessage = 'Login failed'
        if (error.status === 500 || error.statusCode === 500) {
          errorMessage = 'Internal server error. Please check if the backend server is running.'
        } else if (error.status === 401 || error.statusCode === 401) {
          errorMessage = error.data?.message || 'Invalid credentials'
        } else if (error.status === 0 || error.statusCode === 0) {
          errorMessage = 'Cannot connect to server. Please check if the backend is running.'
        } else {
          errorMessage = error.data?.message || error.message || 'Login failed'
        }
        
        throw new Error(errorMessage)
      } finally {
        this.loading = false
      }
    },

    async logout() {
      this.user = null
      this.token = null
      this.isAuthenticated = false

      if (process.client) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }

      await navigateTo('/login')
    },

    async checkAuth() {
      if (process.client) {
        const token = localStorage.getItem('token')
        const userStr = localStorage.getItem('user')

        if (token && userStr) {
          try {
            this.token = token
            this.user = JSON.parse(userStr)
            this.isAuthenticated = true

            // Verify token with backend
            const config = useRuntimeConfig()
            console.log('Checking auth with API base:', config.public.apiBase)
            
            await $fetch(`${config.public.apiBase}/auth/me`, {
              headers: {
                Authorization: `Bearer ${token}`
              }
            })
          } catch (error: any) {
            // Token is invalid, clear everything
            console.warn('Token validation failed:', error)
            console.warn('Error details:', {
              status: error.status,
              statusCode: error.statusCode,
              data: error.data,
              message: error.message
            })
            this.logout()
          }
        } else {
          // No token or user data, ensure we're logged out
          this.user = null
          this.token = null
          this.isAuthenticated = false
        }
      }
    },

    async refreshUser() {
      if (!this.token) return

      try {
        const config = useRuntimeConfig()
        const response = await $fetch<{ user: User }>(`${config.public.apiBase}/auth/me`, {
          headers: {
            Authorization: `Bearer ${this.token}`
          }
        })

        this.user = response.user
        if (process.client) {
          localStorage.setItem('user', JSON.stringify(response.user))
        }
      } catch (error) {
        this.logout()
      }
    }
  }
})
