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
              <CardTitle class="flex items-center gap-2">
                <SearchIcon class="h-5 w-5" />
                {{ t.pos.addProducts }}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <!-- Search Input with Auto-focus -->
              <div class="relative">
                <input
                  ref="searchInput"
                  v-model="searchQuery"
                  :placeholder="`${t.pos.searchPlaceholder} (⌘K)`"
                  class="w-full h-12 rounded-lg border border-input bg-background px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pr-12"
                  @input="onSearchInput"
                  @keyup.enter="searchProducts"
                  @keydown.escape="clearSearch"
                  @keydown.down="navigateResults(1)"
                  @keydown.up="navigateResults(-1)"
                />
                <div class="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  <Loader2Icon v-if="searchLoading" class="h-4 w-4 animate-spin text-muted-foreground" />
                  <SearchIcon v-else class="h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              <!-- Search Suggestions & Recent Searches -->
              <div v-if="showSuggestions" class="mt-3 space-y-2">
                <!-- Recent Searches -->
                <div v-if="recentSearches.length > 0" class="space-y-1">
                  <p class="text-xs font-medium text-muted-foreground uppercase tracking-wide">{{ t.pos.recentSearches }}</p>
                  <div class="flex flex-wrap gap-1">
                    <button
                      v-for="term in recentSearches.slice(0, 5)"
                      :key="term"
                      @click="selectSuggestion(term)"
                      class="px-2 py-1 text-xs bg-muted text-muted-foreground rounded-md hover:bg-muted/80 transition-colors"
                    >
                      {{ term }}
                    </button>
                  </div>
                </div>

                <!-- Popular Products -->
                <div v-if="popularProducts.length > 0" class="space-y-1">
                  <p class="text-xs font-medium text-muted-foreground uppercase tracking-wide">{{ t.pos.popularProducts }}</p>
                  <div class="space-y-1">
                    <button
                      v-for="product in popularProducts.slice(0, 3)"
                      :key="product.id"
                      @click="addToCart(product)"
                      class="w-full text-left p-2 rounded-md hover:bg-accent transition-colors"
                    >
                      <div class="flex justify-between items-center">
                        <div>
                          <p class="text-sm font-medium">{{ product.name }}</p>
                          <p class="text-xs text-muted-foreground">{{ product.sku }}</p>
                        </div>
                        <p class="text-sm font-bold">฿{{ product.price }}</p>
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Search Results -->
              <div v-if="searchResults.length > 0" class="mt-4">
                <div class="flex justify-between items-center mb-3">
                  <h3 class="text-sm font-medium text-foreground">{{ t.pos.searchResults }} ({{ searchResults.length }})</h3>
                  <button
                    @click="clearSearch"
                    class="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Clear
                  </button>
                </div>
                <div class="space-y-2 max-h-80 overflow-y-auto">
                  <div
                    v-for="(product, index) in searchResults"
                    :key="product.id"
                    :class="[
                      'flex items-center justify-between p-3 border border-border rounded-lg hover:bg-accent cursor-pointer transition-colors',
                      selectedResultIndex === index ? 'bg-accent border-ring' : ''
                    ]"
                    @click="addToCart(product)"
                  >
                    <div class="flex-1">
                      <p class="font-medium text-foreground">{{ product.name }}</p>
                      <p class="text-sm text-muted-foreground">{{ product.sku }} • {{ t.pos.stock }}: {{ product.stockQuantity }}</p>
                      <p v-if="product.category" class="text-xs text-muted-foreground">{{ product.category.name }}</p>
                    </div>
                    <div class="text-right">
                      <p class="font-bold text-foreground">฿{{ product.price }}</p>
                      <p v-if="product.stockQuantity <= 5" class="text-xs text-destructive">Low Stock</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- No Results Message -->
              <div v-if="searchQuery && !searchLoading && searchResults.length === 0 && !showSuggestions" class="mt-4 text-center py-6 text-muted-foreground">
                <SearchIcon class="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p class="text-sm">No products found for "{{ searchQuery }}"</p>
                <p class="text-xs mt-1">Try different keywords or check spelling</p>
              </div>

              <!-- Quick Actions -->
              <div v-if="!searchQuery && !searchResults.length" class="mt-4 space-y-2">
                <p class="text-xs font-medium text-muted-foreground uppercase tracking-wide">{{ t.pos.quickActions }}</p>
                <div class="grid grid-cols-2 gap-2">
                  <button
                    @click="loadPopularProducts"
                    class="p-2 text-left border border-border rounded-lg hover:bg-accent transition-colors"
                  >
                    <p class="text-sm font-medium">{{ t.pos.popularProducts }}</p>
                    <p class="text-xs text-muted-foreground">Most sold items</p>
                  </button>
                  <button
                    @click="loadLowStockProducts"
                    class="p-2 text-left border border-border rounded-lg hover:bg-accent transition-colors"
                  >
                    <p class="text-sm font-medium">{{ t.pos.lowStock }}</p>
                    <p class="text-xs text-muted-foreground">Need restocking</p>
                  </button>
                </div>
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
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
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

// New search-related state
const searchInput = ref<HTMLInputElement>()
const showSuggestions = ref(false)
const recentSearches = ref<string[]>([])
const popularProducts = ref<Product[]>([])
const selectedResultIndex = ref(-1)
const searchTimeout = ref<NodeJS.Timeout>()

// Watch for changes in searchQuery
watch(searchQuery, (newValue) => {
  console.log('searchQuery changed to:', newValue)
  if (newValue.length === 0) {
    showSuggestions.value = false
    searchResults.value = []
    selectedResultIndex.value = -1
  }
})


const subtotal = computed(() => {
  return cart.value.reduce((sum, item) => sum + (item.price * item.quantity), 0)
})

const grandTotal = computed(() => {
  return subtotal.value - discount.value + tax.value
})

// New search functions
const onSearchInput = () => {
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }
  
  if (searchQuery.value.length > 0) {
    showSuggestions.value = true
    searchTimeout.value = setTimeout(() => {
      searchProducts()
    }, 300) // Debounce search by 300ms
  } else {
    showSuggestions.value = false
    searchResults.value = []
  }
}

const selectSuggestion = (term: string) => {
  searchQuery.value = term
  showSuggestions.value = false
  searchProducts()
}

const clearSearch = () => {
  searchQuery.value = ''
  searchResults.value = []
  showSuggestions.value = false
  selectedResultIndex.value = -1
  searchInput.value?.focus()
}

const navigateResults = (direction: number) => {
  if (searchResults.value.length === 0) return
  
  selectedResultIndex.value += direction
  
  if (selectedResultIndex.value < 0) {
    selectedResultIndex.value = searchResults.value.length - 1
  } else if (selectedResultIndex.value >= searchResults.value.length) {
    selectedResultIndex.value = 0
  }
}

const loadPopularProducts = async () => {
  try {
    searchLoading.value = true
    const response = await get('/products?limit=5&sort=popular') as any
    popularProducts.value = response.products || []
    showSuggestions.value = true
  } catch (error) {
    console.error('Error loading popular products:', error)
  } finally {
    searchLoading.value = false
  }
}

const loadLowStockProducts = async () => {
  try {
    searchLoading.value = true
    const response = await get('/products/low-stock') as any
    searchResults.value = response.products || []
    showSuggestions.value = false
  } catch (error) {
    console.error('Error loading low stock products:', error)
  } finally {
    searchLoading.value = false
  }
}

const addToRecentSearches = (term: string) => {
  if (!term.trim()) return
  
  const trimmedTerm = term.trim()
  recentSearches.value = recentSearches.value.filter(t => t !== trimmedTerm)
  recentSearches.value.unshift(trimmedTerm)
  recentSearches.value = recentSearches.value.slice(0, 10) // Keep only last 10 searches
  
  // Save to localStorage
  localStorage.setItem('recentSearches', JSON.stringify(recentSearches.value))
}

const loadRecentSearches = () => {
  try {
    const saved = localStorage.getItem('recentSearches')
    if (saved) {
      recentSearches.value = JSON.parse(saved)
    }
  } catch (error) {
    console.error('Error loading recent searches:', error)
  }
}

const searchProducts = async () => {
  console.log('searchProducts function called!')
  console.log('searchQuery.value:', searchQuery.value)
  
  if (!searchQuery.value || !searchQuery.value.trim()) {
    console.log('Search query is empty, returning')
    return
  }

  const query = searchQuery.value.trim()
  console.log('Searching for:', query)
  searchLoading.value = true
  searchResults.value = []
  showSuggestions.value = false
  selectedResultIndex.value = -1

  try {
    // Check if input looks like a barcode (numeric and 12-13 digits)
    const isBarcode = /^\d{12,13}$/.test(query)
    
    if (isBarcode) {
      console.log('Searching by barcode:', query)
      // Search by barcode
      const response = await get(`/products/barcode/${query}`) as any
      console.log('Barcode search response:', response)
      if (response.product) {
        searchResults.value = [response.product]
        // Auto-add to cart for barcode searches
        addToCart(response.product)
        addToRecentSearches(query)
        return
      } else {
        searchResults.value = []
      }
    } else {
      console.log('Searching by text:', query)
      // Search by name, SKU, or description with better parameters
      const response = await get(`/products?search=${encodeURIComponent(query)}&limit=20&page=1`) as any
      console.log('Text search response:', response)
      searchResults.value = response.products || []
      addToRecentSearches(query)
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
  
  // Clear search and focus back on input
  clearSearch()
  
  // Focus back on search input for quick scanning
  await nextTick()
  searchInput.value?.focus()
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

// Keyboard shortcuts
const handleKeydown = (event: KeyboardEvent) => {
  // Ctrl/Cmd + K to focus search
  if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
    event.preventDefault()
    searchInput.value?.focus()
  }
  
  // Escape to clear search
  if (event.key === 'Escape') {
    clearSearch()
  }
  
  // Enter to select highlighted result
  if (event.key === 'Enter' && selectedResultIndex.value >= 0 && searchResults.value.length > 0) {
    event.preventDefault()
    addToCart(searchResults.value[selectedResultIndex.value])
  }
}

onMounted(async () => {
  fetchCustomers()
  loadRecentSearches()
  loadPopularProducts()
  
  // Add keyboard event listeners
  document.addEventListener('keydown', handleKeydown)
  
  // Focus on search input when page loads
  await nextTick()
  searchInput.value?.focus()
})

onUnmounted(() => {
  // Clean up event listeners
  document.removeEventListener('keydown', handleKeydown)
})
</script>
