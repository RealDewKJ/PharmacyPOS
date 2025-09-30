import { defineStore } from 'pinia'
import { useEdenApi } from '../composables/useEdenApi'

interface User {
  id: string
  email: string
  name: string
  role: 'ADMIN' | 'PHARMACIST' | 'CASHIER'
  isActive: boolean
  createdAt: string
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
        const edenApi = useEdenApi()
        console.log('Attempting login with Eden API')
        console.log('Login credentials:', { email, password: '***' })
        
        const response = await edenApi.auth.login(email, password)

        if (response.error) {
          throw new Error(response.error)
        }

        if (response.token && response.user) {
          this.token = response.token
          this.user = response.user
          this.isAuthenticated = true

          // Store in localStorage
          if (process.client) {
            localStorage.setItem('token', response.token)
            localStorage.setItem('user', JSON.stringify(response.user))
            if (response.sessionId) {
              localStorage.setItem('sessionId', response.sessionId)
            }
          }

          return response
        } else {
          throw new Error('Invalid response from server')
        }
      } catch (error: any) {
        console.error('Login error:', error)
        console.error('Error details:', {
          message: error.message,
          response: error.response,
          status: error.status
        })
        
        let errorMessage = 'Login failed'
        
        // Handle HTTP status codes
        if (error.status === 401) {
          errorMessage = error.message || 'Invalid credentials'
        } else if (error.status === 400) {
          errorMessage = 'Invalid input data. Please check your email and password format.'
        } else if (error.status === 500) {
          errorMessage = 'Internal server error. Please try again later.'
        } else if (error.message?.includes('server')) {
          errorMessage = 'Internal server error. Please check if the backend server is running.'
        } else if (error.message?.includes('credentials') || error.message?.includes('Invalid')) {
          errorMessage = 'Invalid credentials'
        } else if (error.message?.includes('connect')) {
          errorMessage = 'Cannot connect to server. Please check if the backend is running.'
        } else {
          errorMessage = error.message || 'Login failed'
        }
        
        throw new Error(errorMessage)
      } finally {
        this.loading = false
      }
    },

    async logout() {
      try {
        // Try to logout from server if we have a session
        if (process.client) {
          const sessionId = localStorage.getItem('sessionId')
          if (sessionId) {
            const edenApi = useEdenApi(this.token || undefined)
            await edenApi.auth.logout(sessionId)
          }
        }
      } catch (error) {
        console.warn('Logout from server failed:', error)
      }

      this.user = null
      this.token = null
      this.isAuthenticated = false

      if (process.client) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        localStorage.removeItem('sessionId')
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

            // Verify token with backend using Eden API
            const edenApi = useEdenApi(this.token || undefined)
            console.log('Checking auth with Eden API')
            
            const response = await edenApi.auth.getProfile()
            
            if (response.error) {
              throw new Error(response.error)
            }

            // Update user data if needed
            if (response.user) {
              this.user = response.user
              localStorage.setItem('user', JSON.stringify(response.user))
            }
          } catch (error: any) {
            // Token is invalid, clear everything
            console.warn('Token validation failed:', error)
            console.warn('Error details:', {
              message: error.message,
              response: error.response,
              status: error.status
            })
            
            // If it's a 401, the token is definitely invalid
            if (error.status === 401) {
              console.warn('Received 401 - token is invalid, logging out')
            }
            
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
        const edenApi = useEdenApi(this.token || undefined)
        const response = await edenApi.auth.getProfile()

        if (response.error) {
          throw new Error(response.error)
        }

        if (response.user) {
          this.user = response.user
          if (process.client) {
            localStorage.setItem('user', JSON.stringify(response.user))
          }
        }
      } catch (error: any) {
        console.warn('Refresh user failed:', error)
        console.warn('Error details:', {
          message: error.message,
          response: error.response,
          status: error.status
        })
        
        // If it's a 401, the token is invalid
        if (error.status === 401) {
          console.warn('Received 401 during user refresh - token is invalid')
        }
        
        this.logout()
      }
    }
  }
})
