export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore()
  
  // Only check authentication if not already checking and not authenticated
  if (!authStore.isCheckingAuth && !authStore.isAuthenticated) {
    await authStore.checkAuth()
  }
  
  if (!authStore.isAuthenticated && to.path !== '/login') {
    return navigateTo('/login')
  }
  
  if (authStore.isAuthenticated && to.path === '/login') {
    return navigateTo('/')
  }
})
