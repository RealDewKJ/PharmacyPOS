<template>
  <!-- Add/Edit Product Modal -->
  <div v-if="isOpen" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" @click="handleClose">
    <Card class="w-full max-w-2xl" @click.stop>
      <CardHeader>
        <CardTitle>{{ isEditing ? t.products.editProduct : t.products.addNewProduct }}</CardTitle>
      </CardHeader>
      <CardContent>
        <form @submit.prevent="handleSave" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-sm font-medium">{{ t.products.name }}</label>
              <Input v-model="formData.name" required />
            </div>
            <div>
              <label class="text-sm font-medium">{{ t.products.sku }}</label>
              <Input v-model="formData.sku" required />
            </div>
          </div>
          
          <div>
            <label class="text-sm font-medium text-foreground">{{ t.products.description }}</label>
            <textarea v-model="formData.description" class="w-full p-2 border border-input rounded-md bg-background text-foreground" rows="3"></textarea>
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-sm font-medium text-foreground">{{ t.products.category }}</label>
              <select v-model="formData.categoryId" class="w-full p-2 border border-input rounded-md bg-background text-foreground" required>
                <option value="">{{ t.products.selectCategory }}</option>
                <option v-for="category in categories" :key="category.id" :value="category.id">
                  {{ category.name }}
                </option>
              </select>
            </div>
            <div>
              <label class="text-sm font-medium text-foreground">{{ t.products.supplier }}</label>
              <select v-model="formData.supplierId" class="w-full p-2 border border-input rounded-md bg-background text-foreground">
                <option value="">{{ t.products.selectSupplier }}</option>
                <option v-for="supplier in suppliers" :key="supplier.id" :value="supplier.id">
                  {{ supplier.name }}
                </option>
              </select>
            </div>
          </div>
          
          <div class="grid grid-cols-3 gap-4">
            <div>
              <label class="text-sm font-medium">{{ t.products.price }}</label>
              <Input 
                v-model="formData.price" 
                type="number" 
                step="0.01" 
                min="0"
                placeholder="0.00"
                required 
                :class="{ 'border-red-500': priceError }"
                @input="validatePrice"
                @keydown="preventNonNumeric"
                @paste="handlePaste"
              />
              <div v-if="priceError" class="text-red-500 text-xs mt-1">{{ priceError }}</div>
            </div>
            <div>
              <label class="text-sm font-medium">{{ t.products.costPrice }}</label>
              <Input 
                v-model="formData.costPrice" 
                type="number" 
                step="0.01" 
                min="0"
                placeholder="0.00"
                required 
                :class="{ 'border-red-500': costPriceError }"
                @input="validateCostPrice"
                @keydown="preventNonNumeric"
                @paste="handlePaste"
              />
              <div v-if="costPriceError" class="text-red-500 text-xs mt-1">{{ costPriceError }}</div>
            </div>
            <div>
              <label class="text-sm font-medium">{{ t.products.stockQuantity }}</label>
              <Input 
                v-model="formData.stockQuantity" 
                type="number" 
                min="0"
                step="1"
                placeholder="0"
                required 
                :class="{ 'border-red-500': stockQuantityError }"
                @input="validateStockQuantity"
                @keydown="preventNonNumericInteger"
                @paste="handlePasteInteger"
              />
              <div v-if="stockQuantityError" class="text-red-500 text-xs mt-1">{{ stockQuantityError }}</div>
            </div>
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-sm font-medium">{{ t.products.minStockLevel }}</label>
              <Input 
                v-model="formData.minStockLevel" 
                type="number" 
                min="0"
                step="1"
                placeholder="0"
                :class="{ 'border-red-500': minStockLevelError }"
                @input="validateMinStockLevel"
                @keydown="preventNonNumericInteger"
                @paste="handlePasteInteger"
              />
              <div v-if="minStockLevelError" class="text-red-500 text-xs mt-1">{{ minStockLevelError }}</div>
            </div>
            <div>
              <label class="text-sm font-medium">{{ t.products.barcode }}</label>
              <div class="flex gap-2">
                <Input 
                  v-model="formData.barcode" 
                  :placeholder="formData.barcode ? '' : t.products.barcodePlaceholder"
                  :class="{ 'border-red-500': barcodeError }"
                  :disabled="loadingBarcode"
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  @click="generateBarcode"
                  :disabled="loadingBarcode"
                  class="whitespace-nowrap"
                >
                  <ShuffleIcon v-if="!loadingBarcode" class="h-4 w-4 mr-1" />
                  <LoaderIcon v-else class="h-4 w-4 mr-1 animate-spin" />
                  {{ loadingBarcode ? t.products.generating : t.products.generate }}
                </Button>
              </div>
              <div v-if="barcodeError" class="text-red-500 text-xs mt-1">{{ barcodeError }}</div>
              <div v-if="formData.barcode" class="text-green-600 text-xs mt-1">
                <InfoIcon class="h-3 w-3 inline mr-1" />
                {{ t.products.barcode }}: {{ formData.barcode }}
              </div>
              <div v-if="!isEditing && !formData.barcode" class="text-blue-500 text-xs mt-1">
                <InfoIcon class="h-3 w-3 inline mr-1" />
                {{ t.products.autoGenerateNote }}
              </div>
            </div>
          </div>
          
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <label class="flex items-center">
                <input v-model="formData.requiresPrescription" type="checkbox" class="mr-2" />
                <span class="text-sm text-foreground">{{ t.products.requiresPrescription }}</span>
              </label>
            </div>
            
            <div class="flex items-center gap-2">
              <span class="text-sm text-foreground">{{ t.products.status }}</span>
              <Switch v-model="formData.isActive" />
              <span class="text-sm text-muted-foreground">
                {{ formData.isActive ? t.products.active : t.products.inactive }}
              </span>
            </div>
          </div>
          
          <div class="flex justify-end gap-2">
            <Button variant="outline" @click="handleClose">
              {{ t.customers.cancel }}
            </Button>
            <Button 
              type="submit" 
              :disabled="loading"
            >
              {{ loading ? t.products.saving : (isEditing ? t.products.update : t.products.create) }}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { ShuffleIcon, LoaderIcon, InfoIcon } from 'lucide-vue-next'
import Card from './ui/card.vue'
import CardHeader from './ui/card-header.vue'
import CardContent from './ui/card-content.vue'
import CardTitle from './ui/card-title.vue'
import Input from './ui/input.vue'
import Button from './ui/button.vue'
import Switch from './ui/switch.vue'
import { useLanguage } from '../composables/useLanguage'

const { t } = useLanguage()
const config = useRuntimeConfig()

interface Product {
  id: string
  name: string
  sku: string
  description: string
  price: number
  costPrice: number
  stockQuantity: number
  minStockLevel: number
  barcode: string | null
  requiresPrescription: boolean
  isActive: boolean
  category?: { name: string }
  categoryId: string
  supplierId: string
}

interface Category {
  id: string
  name: string
}

interface Supplier {
  id: string
  name: string
}

// Props
const props = defineProps<{
  isOpen: boolean
  product?: Product | null
  categories: Category[]
  suppliers: Supplier[]
}>()

// Emits
const emit = defineEmits<{
  close: []
  save: [productData: any]
}>()

// Reactive data
const isEditing = ref(false)
const loading = ref(false)
const loadingBarcode = ref(false)
const barcodeError = ref('')
const priceError = ref('')
const costPriceError = ref('')
const stockQuantityError = ref('')
const minStockLevelError = ref('')

const formData = ref({
  name: '',
  sku: '',
  description: '',
  price: 0,
  costPrice: 0,
  stockQuantity: 0,
  minStockLevel: 10,
  barcode: null as string | null,
  requiresPrescription: false,
  isActive: true,
  categoryId: '',
  supplierId: ''
})

// Utility function to reset form
const resetForm = () => {
  formData.value = {
    name: '',
    sku: '',
    description: '',
    price: 0,
    costPrice: 0,
    stockQuantity: 0,
    minStockLevel: 10,
    barcode: null,
    requiresPrescription: false,
    isActive: true,
    categoryId: '',
    supplierId: ''
  }
}

// Watch for product changes
watch(() => props.product, (newProduct) => {
  if (newProduct) {
    isEditing.value = true
    formData.value = { ...newProduct }
  } else {
    isEditing.value = false
    resetForm()
  }
}, { immediate: true })

// Watch for modal open/close
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    if (props.product) {
      isEditing.value = true
      formData.value = { ...props.product }
    } else {
      isEditing.value = false
      resetForm()
    }
    clearAllErrors()
  }
})

// Validation functions
const validatePrice = () => {
  const value = parseFloat(formData.value.price.toString())
  if (isNaN(value) || value < 0) {
    priceError.value = 'ราคาต้องเป็นตัวเลขที่มากกว่าหรือเท่ากับ 0'
  } else if (value > 999999.99) {
    priceError.value = 'ราคาต้องไม่เกิน 999,999.99'
  } else {
    priceError.value = ''
  }
}

const validateCostPrice = () => {
  const value = parseFloat(formData.value.costPrice.toString())
  if (isNaN(value) || value < 0) {
    costPriceError.value = 'ต้นทุนต้องเป็นตัวเลขที่มากกว่าหรือเท่ากับ 0'
  } else if (value > 999999.99) {
    costPriceError.value = 'ต้นทุนต้องไม่เกิน 999,999.99'
  } else {
    costPriceError.value = ''
  }
}

const validateStockQuantity = () => {
  const value = parseInt(formData.value.stockQuantity.toString())
  if (isNaN(value) || value < 0) {
    stockQuantityError.value = 'จำนวนสต๊อกต้องเป็นจำนวนเต็มที่มากกว่าหรือเท่ากับ 0'
  } else if (value > 999999) {
    stockQuantityError.value = 'จำนวนสต๊อกต้องไม่เกิน 999,999'
  } else {
    stockQuantityError.value = ''
  }
}

const validateMinStockLevel = () => {
  const value = parseInt(formData.value.minStockLevel.toString())
  if (isNaN(value) || value < 0) {
    minStockLevelError.value = 'ระดับสต๊อกขั้นต่ำต้องเป็นจำนวนเต็มที่มากกว่าหรือเท่ากับ 0'
  } else if (value > 999999) {
    minStockLevelError.value = 'ระดับสต๊อกขั้นต่ำต้องไม่เกิน 999,999'
  } else {
    minStockLevelError.value = ''
  }
}

const clearAllErrors = () => {
  priceError.value = ''
  costPriceError.value = ''
  stockQuantityError.value = ''
  minStockLevelError.value = ''
  barcodeError.value = ''
}

// Input validation functions
const preventNonNumeric = (event: KeyboardEvent) => {
  // Allow: backspace, delete, tab, escape, enter
  if ([8, 9, 27, 13, 46].indexOf(event.keyCode) !== -1 ||
      // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
      (event.keyCode === 65 && event.ctrlKey === true) ||
      (event.keyCode === 67 && event.ctrlKey === true) ||
      (event.keyCode === 86 && event.ctrlKey === true) ||
      (event.keyCode === 88 && event.ctrlKey === true) ||
      // Allow: home, end, left, right
      (event.keyCode >= 35 && event.keyCode <= 39)) {
    return
  }
  // Ensure that it is a number and stop the keypress
  if ((event.shiftKey || (event.keyCode < 48 || event.keyCode > 57)) && 
      (event.keyCode < 96 || event.keyCode > 105) && 
      event.keyCode !== 190 && event.keyCode !== 110) {
    event.preventDefault()
  }
}

const preventNonNumericInteger = (event: KeyboardEvent) => {
  // Allow: backspace, delete, tab, escape, enter
  if ([8, 9, 27, 13, 46].indexOf(event.keyCode) !== -1 ||
      // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
      (event.keyCode === 65 && event.ctrlKey === true) ||
      (event.keyCode === 67 && event.ctrlKey === true) ||
      (event.keyCode === 86 && event.ctrlKey === true) ||
      (event.keyCode === 88 && event.ctrlKey === true) ||
      // Allow: home, end, left, right
      (event.keyCode >= 35 && event.keyCode <= 39)) {
    return
  }
  // Ensure that it is a number and stop the keypress (no decimal point for integers)
  if ((event.shiftKey || (event.keyCode < 48 || event.keyCode > 57)) && 
      (event.keyCode < 96 || event.keyCode > 105)) {
    event.preventDefault()
  }
}

const handlePaste = (event: ClipboardEvent) => {
  const paste = event.clipboardData?.getData('text')
  if (paste && !/^\d*\.?\d*$/.test(paste)) {
    event.preventDefault()
  }
}

const handlePasteInteger = (event: ClipboardEvent) => {
  const paste = event.clipboardData?.getData('text')
  if (paste && !/^\d*$/.test(paste)) {
    event.preventDefault()
  }
}

// Barcode generation
const generateBarcode = async () => {
  loadingBarcode.value = true
  barcodeError.value = ''
  
  try {
    const token = localStorage.getItem('token')
    
    // Try to get barcode from API first
    const response = await $fetch(`${config.public.apiBase}/products/generate-barcode`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }) as any
    
    if (response && response.barcode) {
      formData.value.barcode = response.barcode
    } else {
      throw new Error('No barcode in API response')
    }
  } catch (error: any) {
    // Fallback: generate barcode locally
    const fallbackBarcode = generateFallbackBarcode()
    formData.value.barcode = fallbackBarcode
  } finally {
    loadingBarcode.value = false
  }
}

// Fallback barcode generator
const generateFallbackBarcode = (): string => {
  // Generate a 13-digit barcode starting with 8 (internal use)
  const prefix = '8'
  const randomDigits = Math.random().toString().slice(2, 13) // 11 digits
  const barcodeWithoutCheck = prefix + randomDigits
  
  // Simple check digit calculation
  let sum = 0
  for (let i = 0; i < barcodeWithoutCheck.length; i++) {
    const digit = parseInt(barcodeWithoutCheck[i])
    sum += i % 2 === 0 ? digit : digit * 3
  }
  const checkDigit = (10 - (sum % 10)) % 10
  
  return barcodeWithoutCheck + checkDigit
}

// Event handlers
const handleClose = () => {
  emit('close')
}

const handleSave = async () => {
  loading.value = true
  clearAllErrors()
  
  // Validate all numeric fields
  validatePrice()
  validateCostPrice()
  validateStockQuantity()
  validateMinStockLevel()
  
  // Check if there are any validation errors
  if (priceError.value || costPriceError.value || stockQuantityError.value || minStockLevelError.value) {
    loading.value = false
    return
  }
  
  try {
    // Prepare data - remove empty barcode for auto-generation and remove id
    const productData = { ...formData.value } as any
    
    // Remove fields that shouldn't be sent to API
    delete productData.id
    delete productData.category // Remove category object, keep only categoryId
    delete productData.supplier // Remove supplier object, keep only supplierId
    delete productData.createdAt
    delete productData.updatedAt
    
    if (!productData.barcode || productData.barcode.trim() === '') {
      productData.barcode = null // Let backend auto-generate
    }
    
    // Convert string values to numbers
    productData.price = parseFloat(productData.price.toString())
    productData.costPrice = parseFloat(productData.costPrice.toString())
    productData.stockQuantity = parseInt(productData.stockQuantity.toString())
    productData.minStockLevel = parseInt(productData.minStockLevel.toString())
    
    // Handle expiryDate - remove if null or undefined
    if (productData.expiryDate === null || productData.expiryDate === undefined) {
      delete productData.expiryDate
    }
    
    // Handle isActive - remove if undefined (let backend handle default)
    if (productData.isActive === undefined) {
      delete productData.isActive
    }
    
    console.log('Product data to save:', productData)
    emit('save', productData)
  } catch (error: any) {
    if (error.data?.error?.includes('barcode')) {
      barcodeError.value = error.data.error
    } else {
      console.error('Error preparing product data:', error)
    }
  } finally {
    loading.value = false
  }
}

// Handle ESC key to close modal
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
