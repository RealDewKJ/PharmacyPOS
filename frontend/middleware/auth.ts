export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore()
  
  // Check authentication if not already checked
  if (!authStore.isAuthenticated && !authStore.user) {
    await authStore.checkAuth()
  }
  
  if (!authStore.isAuthenticated && to.path !== '/login') {
    return navigateTo('/login')
  }
  
  if (authStore.isAuthenticated && to.path === '/login') {
    return navigateTo('/')
  }
})
