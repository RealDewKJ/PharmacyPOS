<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
    <div class="container mx-auto px-4 py-8">
      <!-- Header -->
      <div class="mb-8 text-center">
        <h1 class="text-4xl font-bold text-foreground mb-2">
          <ScanIcon class="h-10 w-10 inline mr-3 text-blue-600" />
         {{ t.barcodeScanner.title}}
        </h1>
        <p class="text-muted-foreground text-lg">{{ t.barcodeScanner.subtitle }}</p>
      </div>

      <!-- Scanner Section -->
      <div class="max-w-4xl mx-auto">
        <!-- Manual Input -->
        <Card class="p-6 mb-6">
          <div class="flex gap-4">
            <Input
              v-model="barcodeInput"
              placeholder="ป้อนบาร์โค้ด..."
              class="flex-1 text-lg"
              @keyup.enter="searchProduct"
              ref="barcodeInputRef"
            />
            <Button @click="searchProduct" size="lg" class="px-8">
              <SearchIcon class="h-5 w-5 mr-2" />
              ค้นหา
            </Button>
            <Button 
              @click="isScanning ? stopScanning() : startScanning()" 
              :variant="isScanning ? 'destructive' : 'default'"
              size="lg" 
              class="px-8"
            >
              <CameraIcon v-if="!isScanning" class="h-5 w-5 mr-2" />
              <XIcon v-else class="h-5 w-5 mr-2" />
              {{ isScanning ? 'หยุดสแกน' : 'เปิดกล้อง' }}
            </Button>
          </div>
        </Card>

        <!-- Camera Scanner -->
        <div v-if="isScanning" class="mb-6">
          <Card class="p-6">
            <div class="text-center mb-4">
              <h3 class="text-lg font-semibold text-foreground mb-2">สแกนบาร์โค้ดด้วยกล้อง</h3>
              <p class="text-muted-foreground">ชี้กล้องไปที่บาร์โค้ดเพื่อสแกน</p>
            </div>
            <div 
              ref="scannerContainer" 
              class="w-full h-96 bg-gray-100 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center"
            >
              <div v-if="!isScanning" class="text-center text-gray-500 dark:text-gray-400">
                <CameraIcon class="h-16 w-16 mx-auto mb-2 opacity-50" />
                <p>กำลังเริ่มกล้อง...</p>
              </div>
            </div>
          </Card>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center items-center py-12">
          <div class="text-center">
            <LoaderIcon class="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
            <p class="text-muted-foreground">กำลังค้นหา...</p>
          </div>
        </div>

        <!-- Error State -->
        <div v-if="error" class="text-center py-12">
          <AlertCircleIcon class="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h3 class="text-xl font-semibold text-foreground mb-2">ไม่พบยา</h3>
          <p class="text-muted-foreground">{{ error }}</p>
          <Button @click="clearError" variant="outline" class="mt-4">
            ลองอีกครั้ง
          </Button>
        </div>

        <!-- Product Card -->
        <div v-if="product && !loading" class="flex justify-center">
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:shadow-3xl max-w-md">
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
                      ฿{{ product.price.toFixed(2) }}
                    </p>
                  </div>
                  <div class="text-right">
                    <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">ต้นทุน</p>
                    <p class="text-sm font-semibold text-gray-600 dark:text-gray-300">
                      ฿{{ product.costPrice.toFixed(2) }}
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
                    <span>{{ new Date(product.createdAt).toLocaleDateString('th-TH') }}</span>
                  </div>
                  <div class="flex items-center">
                    <HashIcon class="h-3 w-3 mr-1" />
                    <span>{{ product.id.slice(-8) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div v-if="product && !loading" class="mt-8 flex justify-center gap-4">
          <Button @click="addToCart" variant="default" size="lg">
            <ShoppingCartIcon class="h-5 w-5 mr-2" />
            เพิ่มในตะกร้า
          </Button>
          <Button @click="viewDetails" variant="outline" size="lg">
            <EyeIcon class="h-5 w-5 mr-2" />
            ดูรายละเอียด
          </Button>
          <Button @click="scanAnother" variant="ghost" size="lg">
            <ScanIcon class="h-5 w-5 mr-2" />
            สแกนอีก
          </Button>
        </div>

        <!-- Recent Scans -->
        <div v-if="recentScans.length > 0" class="mt-12">
          <h3 class="text-xl font-semibold text-foreground mb-4">การสแกนล่าสุด</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              v-for="recent in recentScans"
              :key="recent.id"
              class="cursor-pointer hover:scale-105 transition-transform"
              @click="selectRecent(recent)"
            >
              <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:shadow-xl max-w-xs">
                <!-- Header with gradient -->
                <div class="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white relative">
                  <div class="absolute top-1 right-1 opacity-20">
                    <PillIcon class="h-6 w-6" />
                  </div>
                  <div class="relative z-10">
                    <div class="flex items-center justify-between mb-1">
                      <span class="text-xs font-medium opacity-90">{{ recent.category?.name || 'Medicine' }}</span>
                      <span 
                        :class="[
                          'px-1 py-0.5 rounded-full text-xs font-bold',
                          recent.isActive 
                            ? 'bg-green-500 text-white' 
                            : 'bg-red-500 text-white'
                        ]"
                      >
                        {{ recent.isActive ? 'พร้อม' : 'ไม่พร้อม' }}
                      </span>
                    </div>
                    <h4 class="text-sm font-bold leading-tight">{{ recent.name }}</h4>
                  </div>
                </div>

                <!-- Content -->
                <div class="p-4">
                  <!-- Barcode -->
                  <div class="bg-gray-50 dark:bg-gray-700 rounded p-2 mb-3">
                    <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">บาร์โค้ด</p>
                    <p class="font-mono text-xs font-bold text-gray-800 dark:text-gray-200">
                      {{ recent.barcode }}
                    </p>
                  </div>

                  <!-- Price -->
                  <div class="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded p-3 mb-3">
                    <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">ราคา</p>
                    <p class="text-lg font-bold text-green-600 dark:text-green-400">
                      ฿{{ recent.price.toFixed(2) }}
                    </p>
                  </div>

                  <!-- Stock -->
                  <div class="text-center">
                    <p 
                      :class="[
                        'text-sm font-semibold',
                        recent.stockQuantity <= recent.minStockLevel 
                          ? 'text-red-600 dark:text-red-400' 
                          : 'text-green-600 dark:text-green-400'
                      ]"
                    >
                      สต็อก: {{ recent.stockQuantity }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, onUnmounted } from 'vue'
import { ScanIcon, SearchIcon, LoaderIcon, AlertCircleIcon, ShoppingCartIcon, EyeIcon, CameraIcon, XIcon, PillIcon, CopyIcon, AlertTriangleIcon, BuildingIcon, CalendarIcon, HashIcon } from 'lucide-vue-next'
import Card from '../components/ui/card.vue'
import Input from '../components/ui/input.vue'
import Button from '../components/ui/button.vue'
import MedicineCard from '../components/MedicineCard.vue'
import { useLanguage } from '../composables/useLanguage'
import Quagga from 'quagga'

const { t } = useLanguage()
const config = useRuntimeConfig()

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

const barcodeInput = ref('')
const barcodeInputRef = ref()
const loading = ref(false)
const error = ref('')
const product = ref<Product | null>(null)
const recentScans = ref<Product[]>([])
const isScanning = ref(false)
const scannerContainer = ref<HTMLDivElement>()

const searchProduct = async () => {
  if (!barcodeInput.value.trim()) return
  
  loading.value = true
  error.value = ''
  product.value = null
  
  try {
    const response = await $fetch(`${config.public.apiBase}/products/barcode/${barcodeInput.value.trim()}`) as any
    
    if (response.product) {
      product.value = response.product
      addToRecentScans(response.product)
    } else {
      error.value = 'ไม่พบยาที่มีบาร์โค้ดนี้'
    }
  } catch (err: any) {
    console.error('Error searching product:', err)
    error.value = err.data?.error || 'เกิดข้อผิดพลาดในการค้นหา'
  } finally {
    loading.value = false
  }
}

const addToRecentScans = (product: Product) => {
  // Remove if already exists
  recentScans.value = recentScans.value.filter(p => p.id !== product.id)
  // Add to beginning
  recentScans.value.unshift(product)
  // Keep only last 6 items
  recentScans.value = recentScans.value.slice(0, 6)
  
  // Save to localStorage
  localStorage.setItem('recentScans', JSON.stringify(recentScans.value))
}

const loadRecentScans = () => {
  try {
    const saved = localStorage.getItem('recentScans')
    if (saved) {
      recentScans.value = JSON.parse(saved)
    }
  } catch (error) {
    console.error('Error loading recent scans:', error)
  }
}

const clearError = () => {
  error.value = ''
  barcodeInput.value = ''
  product.value = null
}

const scanAnother = () => {
  clearError()
  nextTick(() => {
    barcodeInputRef.value?.focus()
  })
}

const selectRecent = (selectedProduct: Product) => {
  product.value = selectedProduct
  barcodeInput.value = selectedProduct.barcode
}

const addToCart = () => {
  // TODO: Implement add to cart functionality
  console.log('Add to cart:', product.value)
}

const viewDetails = () => {
  // TODO: Navigate to product details page
  console.log('View details:', product.value)
}

const copyBarcode = async () => {
  if (!product.value) return
  try {
    await navigator.clipboard.writeText(product.value.barcode)
    console.log('Barcode copied to clipboard:', product.value.barcode)
  } catch (error) {
    console.error('Failed to copy barcode:', error)
  }
}

const startScanning = async () => {
  if (!scannerContainer.value) return
  
  isScanning.value = true
  error.value = ''
  product.value = null
  
  try {
    await Quagga.init({
      inputStream: {
        name: "Live",
        type: "LiveStream",
        target: scannerContainer.value,
        constraints: {
          width: 640,
          height: 480,
          facingMode: "environment" // ใช้กล้องหลัง
        }
      },
      locator: {
        patchSize: "medium",
        halfSample: true
      },
      numOfWorkers: 2,
      decoder: {
        readers: [
          "code_128_reader",
          "ean_reader",
          "ean_8_reader",
          "code_39_reader",
          "code_39_vin_reader",
          "codabar_reader",
          "upc_reader",
          "upc_e_reader",
          "i2of5_reader"
        ]
      },
      locate: true
    }, (err: any) => {
      if (err) {
        console.error('Quagga initialization error:', err)
        error.value = 'ไม่สามารถเริ่มกล้องได้ กรุณาตรวจสอบสิทธิ์การเข้าถึงกล้อง'
        isScanning.value = false
        return
      }
      Quagga.start()
    })

    Quagga.onDetected((result: any) => {
      const code = result.codeResult.code
      console.log('Barcode detected:', code)
      barcodeInput.value = code
      stopScanning()
      searchProduct()
    })

  } catch (err: any) {
    console.error('Error starting scanner:', err)
    error.value = 'เกิดข้อผิดพลาดในการเริ่มกล้อง'
    isScanning.value = false
  }
}

const stopScanning = () => {
  if (Quagga) {
    Quagga.stop()
  }
  isScanning.value = false
}


onMounted(() => {
  loadRecentScans()
  nextTick(() => {
    barcodeInputRef.value?.focus()
  })
})

onUnmounted(() => {
  if (isScanning.value) {
    stopScanning()
  }
})
</script>
