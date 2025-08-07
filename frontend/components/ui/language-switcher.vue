<template>
  <div class="relative">
    <Button
      variant="outline"
      size="sm"
      @click="isOpen = !isOpen"
      class="flex items-center gap-2"
    >
      <GlobeIcon class="h-4 w-4" />
      <span class="hidden sm:inline">{{ getLanguageLabel() }}</span>
      <ChevronDownIcon class="h-4 w-4" />
    </Button>

    <!-- Dropdown Menu -->
    <div
      v-if="isOpen"
      class="absolute right-0 mt-2 w-48 bg-background border border-border rounded-md shadow-lg z-50"
    >
      <div class="py-1">
        <button
          v-for="option in languageOptions"
          :key="option.value"
          @click="selectLanguage(option.value as 'en' | 'th')"
          class="w-full text-left px-4 py-2 text-sm hover:bg-accent flex items-center gap-3 text-foreground"
          :class="{
            'bg-accent text-accent-foreground': currentLanguage === option.value
          }"
        >
          <span class="text-lg">{{ option.icon }}</span>
          {{ option.label }}
          <CheckIcon v-if="currentLanguage === option.value" class="h-4 w-4 ml-auto" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import {
  GlobeIcon,
  ChevronDownIcon,
  CheckIcon
} from 'lucide-vue-next'
import { useLanguage } from '../../composables/useLanguage'

const { t, currentLanguage, languageOptions, setLanguage } = useLanguage()

const isOpen = ref(false)

const getLanguageLabel = () => {
  const option = languageOptions.find((opt: any) => opt.value === currentLanguage.value)
  return option?.label || t.value.common.language
}

const selectLanguage = (newLanguage: 'en' | 'th') => {
  setLanguage(newLanguage)
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
