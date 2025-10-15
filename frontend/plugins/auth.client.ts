export default defineNuxtPlugin(async () => {
  const authStore = useAuthStore()
  
  // Only check auth if not already checking and we have stored credentials
  if (!authStore.isCheckingAuth) {
    const token = localStorage.getItem('token')
    const userStr = localStorage.getItem('user')
    
    if (token && userStr) {
      await authStore.checkAuth()
    }
  }
})
