export default defineNuxtPlugin(() => {
  // Initialize theme on app startup
  const { isDark } = useTheme()
  
  // Apply theme immediately
  if (process.client) {
    if (isDark.value) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }
})
