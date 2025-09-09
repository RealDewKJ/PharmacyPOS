<template>
  <div class="min-h-screen bg-background">
    <div class="container mx-auto px-4 py-8">
      <div class="mb-8 flex justify-between items-start">
        <div>
          <h1 class="text-3xl font-bold text-foreground">{{ t.pos.title }}</h1>
          <p class="text-muted-foreground">{{ t.pos.subtitle }}</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Product Search and Cart -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Product Search -->
          <Card class="p-6">
            <CardHeader>
              <CardTitle>{{ t.pos.addProducts }}</CardTitle>
            </CardHeader>
            <CardContent>
              <div class="flex gap-4">
                <input
                  v-model="searchQuery"
                  :placeholder="t.pos.searchPlaceholder"
                  class="flex-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  @keyup.enter="searchProducts"
                />
                <Button @click="searchProducts" :disabled="searchLoading">
                  <Loader2Icon v-if="searchLoading" class="h-4 w-4 mr-2 animate-spin" />
                  <SearchIcon v-else class="h-4 w-4 mr-2" />
                  {{ searchLoading ? t.pos.processing : t.pos.search }}
                </Button>
               
                <Button @click="() => console.log('Current searchQuery:', searchQuery)" variant="outline">
                  Show Value
                </Button>
              </div>
              
              <!-- Quick Search Suggestions -->
              <div v-if="searchQuery.length > 0 && searchResults.length === 0 && !searchLoading" class="mt-2">
                <p class="text-sm text-muted-foreground">Try searching for: "paracetamol", "ibuprofen", "vitamin c", "amoxicillin"</p>
              </div>

              <!-- Search Results -->
              <div v-if="searchResults.length > 0" class="mt-4">
                <h3 class="text-sm font-medium text-foreground mb-2">{{ t.pos.searchResults }}</h3>
                <div class="space-y-2">
                  <div
                    v-for="product in searchResults"
                    :key="product.id"
                    class="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-accent cursor-pointer transition-colors"
                    @click="addToCart(product)"
                  >
                    <div>
                      <p class="font-medium text-foreground">{{ product.name }}</p>
                      <p class="text-sm text-muted-foreground">{{ product.sku }} • {{ t.pos.stock }}: {{ product.stockQuantity }}</p>
                    </div>
                    <div class="text-right">
                      <p class="font-bold text-foreground">฿{{ product.price }}</p>
                      <p class="text-sm text-muted-foreground">{{ product.category?.name }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- No Results Message -->
              <div v-if="searchQuery && !searchLoading && searchResults.length === 0" class="mt-4 text-center py-4 text-muted-foreground">
                <p>No products found for "{{ searchQuery }}"</p>
              </div>
            </CardContent>
          </Card>

          <!-- Shopping Cart -->
          <Card class="p-6">
            <CardHeader>
              <CardTitle>{{ t.pos.shoppingCart }}</CardTitle>
            </CardHeader>
            <CardContent>
              <div v-if="cart.length === 0" class="text-center py-8 text-muted-foreground">
                <ShoppingCartIcon class="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <p>{{ t.pos.noItemsInCart }}</p>
              </div>
              <div v-else class="space-y-4">
                <div v-for="item in cart" :key="item.id" class="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div class="flex-1">
                    <p class="font-medium text-foreground">{{ item.name }}</p>
                    <p class="text-sm text-muted-foreground">{{ item.sku }}</p>
                  </div>
                  <div class="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      @click="updateQuantity(item.id, item.quantity - 1)"
                      :disabled="item.quantity <= 1"
                    >
                      -
                    </Button>
                    <span class="w-12 text-center">{{ item.quantity }}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      @click="updateQuantity(item.id, item.quantity + 1)"
                      :disabled="item.quantity >= item.stockQuantity"
                    >
                      +
                    </Button>
                    <p class="font-bold ml-4 text-foreground">฿{{ (item.price * item.quantity).toFixed(2) }}</p>
                    <Button
                      variant="destructive"
                      size="sm"
                      @click="removeFromCart(item.id)"
                    >
                      <TrashIcon class="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <!-- Payment Section -->
        <div class="space-y-6">
          <Card class="p-6">
            <CardHeader>
              <CardTitle>{{ t.pos.paymentMethod }}</CardTitle>
            </CardHeader>
            <CardContent class="space-y-4">
              <div class="space-y-2">
                <label class="text-sm font-medium text-foreground">{{ t.pos.customer }}</label>
                <select v-model="selectedCustomer" class="w-full p-2 border border-input rounded-md bg-background text-foreground">
                  <option value="">{{ t.pos.walkInCustomer }}</option>
                  <option v-for="customer in customers" :key="customer.id" :value="customer.id">
                    {{ customer.name }}
                  </option>
                </select>
              </div>

              <div class="space-y-2">
                <label class="text-sm font-medium text-foreground">{{ t.pos.paymentMethod }}</label>
                <select v-model="paymentMethod" class="w-full p-2 border border-input rounded-md bg-background text-foreground">
                  <option value="CASH">{{ t.pos.cash }}</option>
                  <option value="CARD">{{ t.pos.card }}</option>
                  <option value="BANK_TRANSFER">{{ t.pos.bankTransfer }}</option>
                  <option value="MOBILE_MONEY">{{ t.pos.mobileMoney }}</option>
                </select>
              </div>

              <div class="space-y-2">
                <label class="text-sm font-medium text-foreground">{{ t.pos.discount }}</label>
                <Input
                  v-model.number="discount"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                />
              </div>

              <div class="space-y-2">
                <label class="text-sm font-medium text-foreground">{{ t.pos.tax }}</label>
                <Input
                  v-model.number="tax"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                />
              </div>

              <div class="border-t border-border pt-4 space-y-2">
                <div class="flex justify-between">
                  <span class="text-foreground">{{ t.pos.subtotal }}:</span>
                  <span class="text-foreground">฿{{ subtotal.toFixed(2) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-foreground">{{ t.pos.discount }}:</span>
                  <span class="text-foreground">-฿{{ discount.toFixed(2) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-foreground">{{ t.pos.tax }}:</span>
                  <span class="text-foreground">฿{{ tax.toFixed(2) }}</span>
                </div>
                <div class="flex justify-between font-bold text-lg">
                  <span class="text-foreground">{{ t.pos.total }}:</span>
                  <span class="text-foreground">฿{{ grandTotal.toFixed(2) }}</span>
                </div>
              </div>

              <Button
                class="w-full"
                size="lg"
                @click="processSale"
                :disabled="cart.length === 0 || loading"
              >
                <Loader2Icon v-if="loading" class="h-4 w-4 mr-2 animate-spin" />
                {{ loading ? t.pos.processing : `${t.pos.completeSale} - ฿${grandTotal.toFixed(2)}` }}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { 
  SearchIcon, 
  ShoppingCartIcon, 
  TrashIcon, 
  Loader2Icon 
} from 'lucide-vue-next'

const { t } = useLanguage()
const { get } = useApi()

import Card from '../components/ui/card.vue'
import CardHeader from '../components/ui/card-header.vue'
import CardContent from '../components/ui/card-content.vue'
import CardTitle from '../components/ui/card-title.vue'
import Input from '../components/ui/input.vue'
import Button from '../components/ui/button.vue'
import { useLanguage } from '../composables/useLanguage'
import { useApi } from '../composables/useApi'

const router = useRouter()

interface Product {
  id: string
  name: string
  sku: string
  price: number
  stockQuantity: number
  category?: { name: string }
}

interface CartItem extends Product {
  quantity: number
}

interface Customer {
  id: string
  name: string
}

const searchQuery = ref('')
const searchResults = ref<Product[]>([])
const cart = ref<CartItem[]>([])
const customers = ref<Customer[]>([])
const selectedCustomer = ref('')
const paymentMethod = ref('CASH')
const discount = ref(0)
const tax = ref(0)
const loading = ref(false)
const searchLoading = ref(false)

// Watch for changes in searchQuery
watch(searchQuery, (newValue) => {
  console.log('searchQuery changed to:', newValue)
})


const subtotal = computed(() => {
  return cart.value.reduce((sum, item) => sum + (item.price * item.quantity), 0)
})

const grandTotal = computed(() => {
  return subtotal.value - discount.value + tax.value
})

const searchProducts = async () => {
  console.log('searchProducts function called!')
  console.log('searchQuery.value:', searchQuery.value)
  console.log('searchQuery.value type:', typeof searchQuery.value)
  console.log('searchQuery.value length:', searchQuery.value?.length)
  
  if (!searchQuery.value || !searchQuery.value.trim()) {
    console.log('Search query is empty, returning')
    return
  }

  console.log('Searching for:', searchQuery.value)
  searchLoading.value = true
  searchResults.value = []

  try {
    // Check if input looks like a barcode (numeric and 12-13 digits)
    const isBarcode = /^\d{12,13}$/.test(searchQuery.value.trim())
    
    if (isBarcode) {
      console.log('Searching by barcode:', searchQuery.value.trim())
      // Search by barcode
      const response = await get(`/products/barcode/${searchQuery.value.trim()}`) as any
      console.log('Barcode search response:', response)
      if (response.product) {
        searchResults.value = [response.product]
        // Auto-add to cart for barcode searches
        addToCart(response.product)
        return
      } else {
        searchResults.value = []
      }
    } else {
      console.log('Searching by text:', searchQuery.value)
      // Search by name, SKU, or description
      const response = await get(`/products?search=${encodeURIComponent(searchQuery.value)}&limit=10`) as any
      console.log('Text search response:', response)
      searchResults.value = response.products || []
    }
  } catch (error: any) {
    console.error('Error searching products:', error)
    // Show more detailed error message
    if (error.status === 401) {
      alert('Authentication error. Please log in again.')
    } else if (error.status === 404) {
      alert('API endpoint not found. Please check if the backend is running.')
    } else {
      alert(`Error searching products: ${error.message || 'Unknown error'}`)
    }
  } finally {
    searchLoading.value = false
  }
}

const addToCart = async (product: Product) => {
  const existingItem = cart.value.find(item => item.id === product.id)
  
  if (existingItem) {
    if (existingItem.quantity < product.stockQuantity) {
      existingItem.quantity++
    }
  } else {
    cart.value.push({
      ...product,
      quantity: 1
    })
  }
  
  searchResults.value = []
  searchQuery.value = ''
  
  // Focus back on search input for quick scanning
  await nextTick()
  const searchInputElement = document.querySelector('input[placeholder*="Search products"]') as HTMLInputElement
  if (searchInputElement) {
    searchInputElement.focus()
  }
}

const updateQuantity = (productId: string, newQuantity: number) => {
  const item = cart.value.find(item => item.id === productId)
  if (item && newQuantity > 0 && newQuantity <= item.stockQuantity) {
    item.quantity = newQuantity
  }
}

const removeFromCart = (productId: string) => {
  cart.value = cart.value.filter(item => item.id !== productId)
}

const fetchCustomers = async () => {
  try {
    console.log('Fetching customers...')
    const response = await get('/customers') as any
    console.log('Customers response:', response)
    customers.value = response.customers || []
  } catch (error: any) {
    console.error('Error fetching customers:', error)
    if (error.status === 401) {
      alert('Authentication error. Please log in again.')
    } else if (error.status === 404) {
      alert('API endpoint not found. Please check if the backend is running.')
    }
  }
}

const processSale = async () => {
  if (cart.value.length === 0) return

  loading.value = true

  try {
    // Calculate discount and tax as percentages
    const discountPercentage = subtotal.value > 0 ? (discount.value / subtotal.value) * 100 : 0
    const taxPercentage = (subtotal.value - discount.value) > 0 ? (tax.value / (subtotal.value - discount.value)) * 100 : 0

    const saleData = {
      customerId: selectedCustomer.value || null,
      paymentMethod: paymentMethod.value,
      discount: discountPercentage,
      tax: taxPercentage,
      items: cart.value.map(item => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.price
      }))
    }

    const { post } = useApi()
    await post('/sales', saleData)

    // Clear cart and reset form
    cart.value = []
    selectedCustomer.value = ''
    paymentMethod.value = 'CASH'
    discount.value = 0
    tax.value = 0

    // Show success message
    alert(t.value.pos.saleCompleted)
  } catch (error) {
    console.error('Error processing sale:', error)
    alert(t.value.pos.saleError)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  fetchCustomers()
  
  // Focus on search input when page loads
  await nextTick()
  const searchInputElement = document.querySelector('input[placeholder*="Search products"]') as HTMLInputElement
  if (searchInputElement) {
    searchInputElement.focus()
  }
})
</script>
