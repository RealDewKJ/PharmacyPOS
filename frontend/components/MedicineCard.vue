<template>
  <div 
    :class="[
      'bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:shadow-3xl',
      size === 'small' ? 'max-w-xs' : 'max-w-md'
    ]"
  >
    <!-- Header with gradient -->
    <div class="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white relative">
      <div class="absolute top-2 right-2 opacity-20">
        <PillIcon class="h-8 w-8" />
      </div>
      <div class="relative z-10">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-medium opacity-90">{{ product.category?.name || 'Medicine' }}</span>
          <span 
            :class="[
              'px-2 py-1 rounded-full text-xs font-bold',
              product.isActive 
                ? 'bg-green-500 text-white' 
                : 'bg-red-500 text-white'
            ]"
          >
            {{ product.isActive ? 'พร้อมขาย' : 'ไม่พร้อมขาย' }}
          </span>
        </div>
        <h3 class="text-lg font-bold leading-tight">{{ product.name }}</h3>
      </div>
    </div>

    <!-- Content -->
    <div class="p-6">
      <!-- Description -->
      <div v-if="product.description" class="mb-4">
        <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
          {{ product.description }}
        </p>
      </div>

      <!-- Barcode Section -->
      <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">บาร์โค้ด</p>
            <p class="font-mono text-sm font-bold text-gray-800 dark:text-gray-200">
              {{ product.barcode }}
            </p>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            @click="copyBarcode"
            class="h-8 w-8 p-0"
          >
            <CopyIcon class="h-4 w-4" />
          </Button>
        </div>
      </div>

      <!-- Details Grid -->
      <div class="grid grid-cols-2 gap-4 mb-4">
        <div class="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p class="text-xs text-blue-600 dark:text-blue-400 mb-1">SKU</p>
          <p class="font-semibold text-blue-800 dark:text-blue-200">{{ product.sku }}</p>
        </div>
        <div class="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <p class="text-xs text-green-600 dark:text-green-400 mb-1">สต็อก</p>
          <p 
            :class="[
              'font-semibold',
              product.stockQuantity <= product.minStockLevel 
                ? 'text-red-600 dark:text-red-400' 
                : 'text-green-800 dark:text-green-200'
            ]"
          >
            {{ product.stockQuantity }}
          </p>
        </div>
      </div>

      <!-- Price Section -->
      <div class="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-4 mb-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">ราคาขาย</p>
            <p class="text-2xl font-bold text-green-600 dark:text-green-400">
              ฿{{ formatCurrency(product.price) }}
            </p>
          </div>
          <div class="text-right">
            <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">ต้นทุน</p>
            <p class="text-sm font-semibold text-gray-600 dark:text-gray-300">
              ฿{{ formatCurrency(product.costPrice) }}
            </p>
          </div>
        </div>
      </div>

      <!-- Prescription Warning -->
      <div v-if="product.requiresPrescription" class="mb-4">
        <div class="flex items-center p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg">
          <AlertTriangleIcon class="h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-2 flex-shrink-0" />
          <p class="text-sm text-yellow-800 dark:text-yellow-200 font-medium">
            ต้องใช้ใบสั่งยา
          </p>
        </div>
      </div>

      <!-- Supplier Info -->
      <div v-if="product.supplier" class="mb-4">
        <div class="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <BuildingIcon class="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2 flex-shrink-0" />
          <div class="min-w-0 flex-1">
            <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">ผู้จัดจำหน่าย</p>
            <p class="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
              {{ product.supplier.name }}
            </p>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="border-t border-gray-200 dark:border-gray-600 pt-4">
        <div class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <div class="flex items-center">
            <CalendarIcon class="h-3 w-3 mr-1" />
            <span>{{ formatDate(product.createdAt) }}</span>
          </div>
          <div class="flex items-center">
            <HashIcon class="h-3 w-3 mr-1" />
            <span>{{ product.id.slice(-8) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Decorative corner -->
    <div class="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-white/10 to-transparent rounded-bl-2xl"></div>
  </div>
</template>

<script setup lang="ts">
import { 
  PillIcon, 
  CopyIcon, 
  AlertTriangleIcon, 
  BuildingIcon, 
  CalendarIcon, 
  HashIcon 
} from 'lucide-vue-next'
import Button from './ui/button.vue'

interface Product {
  id: string
  name: string
  description: string
  barcode: string
  sku: string
  price: number
  costPrice: number
  stockQuantity: number
  minStockLevel: number
  requiresPrescription: boolean
  isActive: boolean
  category?: {
    id: string
    name: string
  }
  supplier?: {
    id: string
    name: string
  }
  createdAt: string
  updatedAt: string
}

const props = defineProps<{
  product: Product
  size?: 'normal' | 'small'
}>()

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('th-TH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value)
}

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const copyBarcode = async () => {
  try {
    await navigator.clipboard.writeText(props.product.barcode)
    // You could add a toast notification here
    console.log('Barcode copied to clipboard:', props.product.barcode)
  } catch (error) {
    console.error('Failed to copy barcode:', error)
  }
}
</script>

<style scoped>
.shadow-3xl {
  box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
}

/* Add subtle animation */
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
}

.hover\:float:hover {
  animation: float 2s ease-in-out infinite;
}
</style>
