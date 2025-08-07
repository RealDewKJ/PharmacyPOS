<template>
  <Button
    variant="outline"
    size="sm"
    @click="toggleTheme"
    class="flex items-center gap-2"
    :title="getThemeTitle()"
  >
    <SunIcon v-if="isDark" class="h-4 w-4" />
    <MoonIcon v-else class="h-4 w-4" />
    <span class="hidden sm:inline">{{ isDark ? 'Light' : 'Dark' }}</span>
  </Button>
</template>

<script setup lang="ts">
import { SunIcon, MoonIcon } from 'lucide-vue-next'

const { isDark, toggleTheme } = useTheme()

const getThemeTitle = () => {
  return isDark.value ? 'Switch to light mode' : 'Switch to dark mode'
}
</script>
