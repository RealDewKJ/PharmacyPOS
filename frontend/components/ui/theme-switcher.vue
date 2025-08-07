<template>
  <div class="relative">
    <Button
      variant="outline"
      size="sm"
      @click="isOpen = !isOpen"
      class="flex items-center gap-2"
    >
      <SunIcon v-if="isDark" class="h-4 w-4" />
      <MoonIcon v-else class="h-4 w-4" />
      <span class="hidden sm:inline">{{ getThemeLabel() }}</span>
      <ChevronDownIcon class="h-4 w-4" />
    </Button>

    <!-- Dropdown Menu -->
    <div
      v-if="isOpen"
      class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-50"
    >
      <div class="py-1">
        <button
          v-for="option in themeOptions"
          :key="option.value"
          @click="selectTheme(option.value as 'light' | 'dark' | 'system')"
          class="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3"
          :class="{
            'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300': theme === option.value
          }"
        >
          <component :is="option.icon" class="h-4 w-4" />
          {{ option.label }}
          <CheckIcon v-if="theme === option.value" class="h-4 w-4 ml-auto" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import {
  SunIcon,
  MoonIcon,
  MonitorIcon,
  ChevronDownIcon,
  CheckIcon
} from 'lucide-vue-next'

const { theme, isDark, setTheme } = useTheme()

const isOpen = ref(false)

const themeOptions = [
  {
    value: 'light',
    label: 'Light',
    icon: SunIcon
  },
  {
    value: 'dark',
    label: 'Dark',
    icon: MoonIcon
  },
  {
    value: 'system',
    label: 'System',
    icon: MonitorIcon
  }
]

const getThemeLabel = () => {
  const option = themeOptions.find(opt => opt.value === theme.value)
  return option?.label || 'Theme'
}

const selectTheme = (newTheme: 'light' | 'dark' | 'system') => {
  setTheme(newTheme)
  isOpen.value = false
}

// Close dropdown when clicking outside
onMounted(() => {
  const handleClickOutside = (event: Event) => {
    const target = event.target as Element
    if (!target.closest('.relative')) {
      isOpen.value = false
    }
  }

  document.addEventListener('click', handleClickOutside)
  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
  })
})
</script>
