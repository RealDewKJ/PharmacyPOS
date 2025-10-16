<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" @click="handleClose">
    <div v-if="supplier" class="w-full max-w-2xl bg-background rounded-2xl shadow-2xl overflow-hidden" @click.stop>
      <!-- Header with Gradient Background -->
      <div class="relative h-20 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500">
        <div class="absolute inset-0 bg-black/20"></div>
        <button 
          @click="handleClose"
          class="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors backdrop-blur-sm"
        >
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Profile Section -->
      <div class="relative px-6 pb-6">
        <!-- Avatar -->
        <!-- <div class="flex justify-center -mt-16 mb-4">
          <div class="w-32 h-32 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg ring-4 ring-background">
            {{ supplier.name.charAt(0).toUpperCase() }}
          </div>
        </div> -->

        <!-- Supplier Info -->
        <div class="text-center mb-6 mt-2">
          <h2 class="text-2xl font-bold text-foreground mb-1">{{ supplier.name }}</h2>
          <p class="text-muted-foreground mb-2">Supplier ID: {{ supplier.id }}</p>
          
          <!-- Status Badge -->
          <div class="inline-flex items-center gap-2">
            <div :class="[
              'w-2 h-2 rounded-full',
              supplier.isActive ? 'bg-green-500' : 'bg-red-500'
            ]"></div>
            <span :class="[
              'px-3 py-1 rounded-full text-sm font-medium',
              supplier.isActive 
                ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400' 
                : 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400'
            ]">
              {{ supplier.isActive ? t.suppliers.active : t.suppliers.inactive }}
            </span>
          </div>
        </div>

        <!-- Stats Cards -->
        <div class="grid grid-cols-3 gap-4 mb-6">
          <div class="bg-muted/50 rounded-xl p-4 text-center">
            <div class="text-2xl font-bold text-foreground">{{ getRandomProducts() }}</div>
            <div class="text-sm text-muted-foreground">{{ t.suppliers.products }}</div>
          </div>
          <div class="bg-muted/50 rounded-xl p-4 text-center">
            <div class="text-2xl font-bold text-foreground">{{ getDaysSinceCreated() }}</div>
            <div class="text-sm text-muted-foreground">{{ t.suppliers.daysSinceCreated }}</div>
          </div>
          <div class="bg-muted/50 rounded-xl p-4 text-center">
            <div class="text-2xl font-bold text-foreground">{{ getLastUpdateDays() }}</div>
            <div class="text-sm text-muted-foreground">{{ t.suppliers.daysSinceLastUpdate }}</div>
          </div>
        </div>

        <!-- Contact Information -->
        <div class="space-y-4">
          <h3 class="text-lg font-semibold text-foreground flex items-center gap-2">
            <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            {{ t.suppliers.contactInformation }}
          </h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div v-if="supplier.email" class="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
              <svg class="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
              </svg>
              <div>
                <div class="text-sm text-muted-foreground">{{ t.suppliers.email }}</div>
                <div class="text-foreground">{{ supplier.email }}</div>
              </div>
            </div>
            
            <div v-if="supplier.phone" class="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
              <svg class="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <div>
                <div class="text-sm text-muted-foreground">{{ t.suppliers.phone }}</div>
                <div class="text-foreground">{{ supplier.phone }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Address Information -->
        <div v-if="supplier.address" class="space-y-4 mt-6">
          <h3 class="text-lg font-semibold text-foreground flex items-center gap-2">
            <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {{ t.suppliers.addressInformation }}
          </h3>
          
          <div class="p-4 bg-muted/30 rounded-lg">
            <div class="text-foreground whitespace-pre-wrap">{{ supplier.address }}</div>
          </div>
        </div>

        <!-- Business Information -->
        <div class="space-y-4 mt-6">
          <h3 class="text-lg font-semibold text-foreground flex items-center gap-2">
            <svg class="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            {{ t.suppliers.businessInformation }}
          </h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div class="text-sm font-medium text-blue-800 dark:text-blue-400 mb-1">{{ t.suppliers.supplierType }}</div>
              <div class="text-blue-700 dark:text-blue-300">{{ getSupplierType() }}</div>
            </div>
            
            <div class="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
              <div class="text-sm font-medium text-orange-800 dark:text-orange-400 mb-1">{{ t.suppliers.reliability }}</div>
              <div class="text-orange-700 dark:text-orange-300">{{ getReliability() }}</div>
            </div>
          </div>
        </div>

        <!-- System Information -->
        <div class="space-y-4 mt-6 pt-6 border-t border-border">
          <h3 class="text-lg font-semibold text-foreground flex items-center gap-2">
            <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {{ t.suppliers.systemInformation }}
          </h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <div class="text-muted-foreground">{{ t.suppliers.createdAt }}</div>
              <div class="text-foreground">{{ formatDateTime(supplier.createdAt) }}</div>
            </div>
            <div>
              <div class="text-muted-foreground">{{ t.suppliers.updatedAt }}</div>
              <div class="text-foreground">{{ formatDateTime(supplier.updatedAt) }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useLanguage } from '../composables/useLanguage'

interface Supplier {
  id: string
  name: string
  email?: string
  phone?: string
  address?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface Props {
  isOpen: boolean
  supplier: Supplier | null
}

interface Emits {
  (e: 'close'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const { t } = useLanguage()

const handleClose = () => {
  emit('close')
}

const formatDateTime = (dateString: string): string => {
  try {
    return new Date(dateString).toLocaleString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return '-'
  }
}

const getRandomProducts = (): number => {
  return Math.floor(Math.random() * 100) + 10
}

const getDaysSinceCreated = (): number => {
  try {
    const created = new Date(props.supplier?.createdAt || '')
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - created.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  } catch {
    return 0
  }
}

const getLastUpdateDays = (): number => {
  try {
    const updated = new Date(props.supplier?.updatedAt || '')
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - updated.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  } catch {
    return 0
  }
}

const getSupplierType = (): string => {
  const types = ['Pharmaceutical', 'Medical Equipment', 'General Supplies', 'Specialty Products']
  return types[Math.floor(Math.random() * types.length)]
}

const getReliability = (): string => {
  const levels = ['Excellent', 'Good', 'Average', 'Fair']
  return levels[Math.floor(Math.random() * levels.length)]
}

// Handle ESC key
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && props.isOpen) {
    handleClose()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>
