<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" @click="handleClose">
    <div v-if="customer" class="w-full max-w-2xl bg-background rounded-2xl shadow-2xl overflow-hidden" @click.stop>
      <!-- Header with Gradient Background -->
      <div class="relative h-32 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
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
        <div class="flex justify-center -mt-16 mb-4">
          <div class="w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg ring-4 ring-background">
            {{ customer.name.charAt(0).toUpperCase() }}
          </div>
        </div>

        <!-- Customer Info -->
        <div class="text-center mb-6">
          <h2 class="text-2xl font-bold text-foreground mb-1">{{ customer.name }}</h2>
          <p class="text-muted-foreground mb-2">Customer ID: {{ customer.id }}</p>
          
          <!-- Status Badge -->
          <div class="inline-flex items-center gap-2">
            <div :class="[
              'w-2 h-2 rounded-full',
              customer.isActive ? 'bg-green-500' : 'bg-red-500'
            ]"></div>
            <span :class="[
              'px-3 py-1 rounded-full text-sm font-medium',
              customer.isActive 
                ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400' 
                : 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400'
            ]">
              {{ customer.isActive ? t.customers.active : t.customers.inactive }}
            </span>
          </div>
        </div>

        <!-- Stats Cards -->
        <div class="grid grid-cols-3 gap-4 mb-6">
          <div class="bg-muted/50 rounded-xl p-4 text-center">
            <div class="text-2xl font-bold text-foreground">{{ customer.totalOrders }}</div>
            <div class="text-sm text-muted-foreground">{{ t.customers.totalOrders }}</div>
          </div>
          <div class="bg-muted/50 rounded-xl p-4 text-center">
            <div class="text-2xl font-bold text-foreground">{{ getAge(customer.dateOfBirth) }}</div>
            <div class="text-sm text-muted-foreground">{{ t.customers.age }}</div>
          </div>
          <div class="bg-muted/50 rounded-xl p-4 text-center">
            <div class="text-2xl font-bold text-foreground">{{ getDaysSinceLastVisit(customer.lastVisit) }}</div>
            <div class="text-sm text-muted-foreground">{{ t.customers.daysSinceLastVisit }}</div>
          </div>
        </div>

        <!-- Contact Information -->
        <div class="space-y-4">
          <h3 class="text-lg font-semibold text-foreground flex items-center gap-2">
            <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            {{ t.customers.contactInformation }}
          </h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div v-if="customer.email" class="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
              <svg class="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
              </svg>
              <div>
                <div class="text-sm text-muted-foreground">{{ t.customers.email }}</div>
                <div class="text-foreground">{{ customer.email }}</div>
              </div>
            </div>
            
            <div v-if="customer.phone" class="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
              <svg class="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <div>
                <div class="text-sm text-muted-foreground">{{ t.customers.phone }}</div>
                <div class="text-foreground">{{ customer.phone }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Address Information -->
        <div v-if="customer.address" class="space-y-4 mt-6">
          <h3 class="text-lg font-semibold text-foreground flex items-center gap-2">
            <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {{ t.customers.addressInformation }}
          </h3>
          
          <div class="p-4 bg-muted/30 rounded-lg">
            <div class="text-foreground">{{ customer.address }}</div>
            <div v-if="customer.city || customer.postalCode" class="text-sm text-muted-foreground mt-1">
              {{ customer.city }}{{ customer.city && customer.postalCode ? ', ' : '' }}{{ customer.postalCode }}
            </div>
          </div>
        </div>

        <!-- Medical Information -->
        <div v-if="customer.allergies || customer.medicalConditions || customer.notes" class="space-y-4 mt-6">
          <h3 class="text-lg font-semibold text-foreground flex items-center gap-2">
            <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {{ t.customers.medicalInformation }}
          </h3>
          
          <div class="space-y-3">
            <div v-if="customer.allergies" class="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
              <div class="text-sm font-medium text-red-800 dark:text-red-400 mb-1">{{ t.customers.allergies }}</div>
              <div class="text-red-700 dark:text-red-300">{{ customer.allergies }}</div>
            </div>
            
            <div v-if="customer.medicalConditions" class="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
              <div class="text-sm font-medium text-orange-800 dark:text-orange-400 mb-1">{{ t.customers.medicalConditions }}</div>
              <div class="text-orange-700 dark:text-orange-300">{{ customer.medicalConditions }}</div>
            </div>
            
            <div v-if="customer.notes" class="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div class="text-sm font-medium text-blue-800 dark:text-blue-400 mb-1">{{ t.customers.notes }}</div>
              <div class="text-blue-700 dark:text-blue-300 whitespace-pre-wrap">{{ customer.notes }}</div>
            </div>
          </div>
        </div>

        <!-- System Information -->
        <div class="space-y-4 mt-6 pt-6 border-t border-border">
          <h3 class="text-lg font-semibold text-foreground flex items-center gap-2">
            <svg class="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {{ t.customers.systemInformation }}
          </h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <div class="text-muted-foreground">{{ t.customers.createdAt }}</div>
              <div class="text-foreground">{{ formatDateTime(customer.createdAt) }}</div>
            </div>
            <div v-if="customer.updatedAt">
              <div class="text-muted-foreground">{{ t.customers.updatedAt }}</div>
              <div class="text-foreground">{{ formatDateTime(customer.updatedAt) }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useLanguage } from '../composables/useLanguage'

interface Customer {
  id: string
  name: string
  email?: string
  phone?: string
  dateOfBirth?: string
  address?: string
  city?: string
  postalCode?: string
  allergies?: string
  medicalConditions?: string
  notes?: string
  isActive: boolean
  createdAt: string
  updatedAt?: string
  totalOrders: number
  lastVisit: string
}

interface Props {
  isOpen: boolean
  customer: Customer | null
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

const formatDate = (dateString?: string): string => {
  if (!dateString) return '-'
  try {
    return new Date(dateString).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  } catch {
    return '-'
  }
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

const getAge = (dateOfBirth?: string): string => {
  if (!dateOfBirth) return '-'
  try {
    const today = new Date()
    const birthDate = new Date(dateOfBirth)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    
    return age.toString()
  } catch {
    return '-'
  }
}

const getDaysSinceLastVisit = (lastVisit: string): string => {
  try {
    const today = new Date()
    const visitDate = new Date(lastVisit)
    const diffTime = Math.abs(today.getTime() - visitDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return '0'
    if (diffDays === 1) return '1'
    return diffDays.toString()
  } catch {
    return '-'
  }
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
