export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore()
  
  // Check if route requires specific roles
  const requiredRoles = to.meta.roles as string[]
  
  if (requiredRoles && requiredRoles.length > 0) {
    if (!authStore.isAuthenticated) {
      return navigateTo('/login')
    }
    
    if (!authStore.canAccess(requiredRoles)) {
      // Redirect to dashboard or show access denied
      return navigateTo('/')
    }
  }
})
