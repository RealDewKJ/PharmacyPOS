import { useLocalStorage, usePreferredDark } from '@vueuse/core'

export const useTheme = () => {
  const preferredDark = usePreferredDark()
  const theme = useLocalStorage('theme', 'system')

  const isDark = computed(() => {
    if (theme.value === 'system') {
      return preferredDark.value
    }
    return theme.value === 'dark'
  })

  const toggleTheme = () => {
    if (theme.value === 'light') {
      theme.value = 'dark'
    } else if (theme.value === 'dark') {
      theme.value = 'system'
    } else {
      theme.value = 'light'
    }
  }

  const setTheme = (newTheme: 'light' | 'dark' | 'system') => {
    theme.value = newTheme
  }

  // Watch for theme changes and apply to document
  watch(isDark, (dark) => {
    if (process.client) {
      if (dark) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }
  }, { immediate: true })

  return {
    theme: readonly(theme),
    isDark: readonly(isDark),
    toggleTheme,
    setTheme
  }
}
