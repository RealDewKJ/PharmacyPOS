<template>
  <div class="min-h-screen bg-background">
    <div class="container mx-auto px-4 py-8">
      <div class="mb-8 flex justify-between items-center">
        <div>
          <h1 class="text-3xl font-bold text-foreground">{{ t.products.title }}</h1>
          <p class="text-muted-foreground">{{ t.products.subtitle }}</p>
        </div>
        <div class="flex gap-3">
          <Button variant="outline" @click="goToBarcodeScanner">
            <ScanIcon class="h-4 w-4 mr-2" />
            สแกนบาร์โค้ด
          </Button>
          <Button @click="openAddModal">
            <PlusIcon class="h-4 w-4 mr-2" />
            {{ t.products.addProduct }}
          </Button>
        </div>
      </div>

      <!-- Search and Filters -->
      <Card class="p-6 mb-6">
        <div class="flex gap-4">
          <Input
            v-model="searchQuery"
            :placeholder="t.products.searchPlaceholder"
            class="flex-1"
            @keyup.enter="fetchProducts"
          />
          <select v-model="selectedCategory" class="p-2 border border-input rounded-md bg-background text-foreground">
            <option value="">{{ t.products.allCategories }}</option>
            <option v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>
          <Button @click="fetchProducts">
            <SearchIcon class="h-4 w-4 mr-2" />
            {{ t.products.search }}
          </Button>
        </div>
      </Card>

      <!-- Products Table -->
      <Card class="p-6">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b border-border">
                <th class="text-left p-3 text-foreground">{{ t.products.name }}</th>
                <th class="text-left p-3 text-foreground">{{ t.products.sku }}</th>
                <th class="text-left p-3 text-foreground">{{ t.products.barcode }}</th>
                <th class="text-left p-3 text-foreground">{{ t.products.category }}</th>
                <th class="text-left p-3 text-foreground">{{ t.products.price }}</th>
                <th class="text-left p-3 text-foreground">{{ t.products.stock }}</th>
                <th class="text-left p-3 text-foreground">{{ t.products.status }}</th>
                <th class="text-left p-3 text-foreground">{{ t.products.actions }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="product in products" :key="product.id" class="border-b border-border hover:bg-accent">
                <td class="p-3">
                  <div>
                    <p class="font-medium text-foreground">{{ product.name }}</p>
                    <p class="text-sm text-muted-foreground">{{ product.description }}</p>
                  </div>
                </td>
                <td class="p-3 text-foreground">{{ product.sku }}</td>
                <td class="p-3">
                  <div v-if="product.barcode" class="flex items-center gap-2">
                    <span class="text-foreground font-mono text-sm">{{ product.barcode }}</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      @click="copyToClipboard(product.barcode)"
                      class="h-6 w-6 p-0"
                    >
                      <CopyIcon class="h-3 w-3" />
                    </Button>
                  </div>
                  <span v-else class="text-muted-foreground text-sm italic">{{ t.products.noBarcode }}</span>
                </td>
                <td class="p-3 text-foreground">{{ product.category?.name }}</td>
                <td class="p-3 font-bold text-foreground">฿{{ formatCurrency(product.price) }}</td>
                <td class="p-3">
                  <span :class="[
                    'px-2 py-1 rounded-full text-xs font-medium',
                    product.stockQuantity <= product.minStockLevel 
                      ? 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400' 
                      : 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400'
                  ]">
                    {{ product.stockQuantity }}
                  </span>
                </td>
                <td class="p-3">
                  <span :class="[
                    'px-2 py-1 rounded-full text-xs font-medium',
                    product.isActive ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400'
                  ]">
                    {{ product.isActive ? t.products.active : t.products.inactive }}
                  </span>
                </td>
                <td class="p-3">
                  <div class="flex gap-2">
                                         <Button variant="outline" size="sm" @click="editProduct(product)">
                       <PencilIcon class="h-4 w-4" />
                     </Button>
                    <Button variant="destructive" size="sm" @click="deleteProduct(product.id)">
                      <TrashIcon class="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div v-if="pagination.pages > 1" class="mt-6 flex justify-center">
          <div class="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              @click="changePage(pagination.page - 1)"
              :disabled="pagination.page <= 1"
            >
              {{ t.products.previous }}
            </Button>
            <span class="px-3 py-2 text-sm text-foreground">
              {{ t.products.page }} {{ pagination.page }} {{ t.products.of }} {{ pagination.pages }}
            </span>
            <Button
              variant="outline"
              size="sm"
              @click="changePage(pagination.page + 1)"
              :disabled="pagination.page >= pagination.pages"
            >
              {{ t.products.next }}
            </Button>
          </div>
        </div>
      </Card>
    </div>

    <!-- Product Modal Component -->
    <ProductModal
      :is-open="showAddModal"
      :product="editingProduct"
      :categories="categories"
      :suppliers="suppliers"
      @close="closeModal"
      @save="handleProductSave"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { PlusIcon, SearchIcon, PencilIcon, TrashIcon, CopyIcon, ScanIcon } from 'lucide-vue-next'
import Card from '../components/ui/card.vue'
import Input from '../components/ui/input.vue'
import Button from '../components/ui/button.vue'
import ProductModal from '../components/ProductModal.vue'
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

interface Pagination {
  page: number
  limit: number
  total: number
  pages: number
}

const products = ref<Product[]>([])
const categories = ref<Category[]>([])
const suppliers = ref<Supplier[]>([])
const searchQuery = ref('')
const selectedCategory = ref('')
const showAddModal = ref(false)
const editingProduct = ref<Product | null>(null)

const pagination = ref<Pagination>({
  page: 1,
  limit: 10,
  total: 0,
  pages: 0
})


const fetchProducts = async () => {
  try {
    const params = new URLSearchParams({
      page: pagination.value.page.toString(),
      limit: pagination.value.limit.toString()
    })
    
    if (searchQuery.value) params.append('search', searchQuery.value)
    if (selectedCategory.value) params.append('category', selectedCategory.value)
    
    const response = await $fetch(`${config.public.apiBase}/products?${params}`) as any
    products.value = response.products
    pagination.value = response.pagination
  } catch (error) {
    console.error('Error fetching products:', error)
  }
}

const fetchCategories = async () => {
  try {
    const response = await $fetch(`${config.public.apiBase}/categories`) as any
    categories.value = response.categories
  } catch (error) {
    console.error('Error fetching categories:', error)
  }
}

const fetchSuppliers = async () => {
  try {
    const response = await $fetch(`${config.public.apiBase}/suppliers`) as any
    suppliers.value = response.suppliers
  } catch (error) {
    console.error('Error fetching suppliers:', error)
  }
}

const openAddModal = () => {
  editingProduct.value = null
  showAddModal.value = true
}

const closeModal = () => {
  showAddModal.value = false
  editingProduct.value = null
}

const editProduct = (product: Product) => {
  editingProduct.value = product
  showAddModal.value = true
}

const handleProductSave = async (productData: any) => {
  try {
    if (editingProduct.value) {
      const response = await $fetch(`${config.public.apiBase}/products/${editingProduct.value.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: productData
      })
      console.log('Update response:', response)
    } else {
      const response = await $fetch(`${config.public.apiBase}/products`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: productData
      })
      console.log('Create response:', response)
    }
    
    closeModal()
    await fetchProducts()
  } catch (error: any) {
    console.error('Error saving product:', error)
    console.error('Error details:', error.data)
    alert(`Error: ${error.data?.error || error.message}`)
  }
}

// Utility functions
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('th-TH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value)
}

const deleteProduct = async (id: string) => {
  if (!confirm(t.value.products.deleteConfirm)) return
  
  try {
    await $fetch(`${config.public.apiBase}/products/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    await fetchProducts()
  } catch (error) {
    console.error('Error deleting product:', error)
  }
}

const changePage = (page: number) => {
  pagination.value.page = page
  fetchProducts()
}

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    // You could add a toast notification here
    console.log('Barcode copied to clipboard:', text)
  } catch (error) {
    console.error('Failed to copy to clipboard:', error)
  }
}

const goToBarcodeScanner = () => {
  navigateTo('/barcode-scanner')
}

onMounted(() => {
  fetchProducts()
  fetchCategories()
  fetchSuppliers()
})
</script>
