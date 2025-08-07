<template>
  <div class="min-h-screen bg-background">
    <div class="container mx-auto px-4 py-8">
      <div class="mb-8 flex justify-between items-center">
        <div>
          <h1 class="text-3xl font-bold text-foreground">{{ t.products.title }}</h1>
          <p class="text-muted-foreground">{{ t.products.subtitle }}</p>
        </div>
        <Button @click="showAddModal = true">
          <PlusIcon class="h-4 w-4 mr-2" />
          {{ t.products.addProduct }}
        </Button>
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
                <td class="p-3 text-foreground">{{ product.category?.name }}</td>
                <td class="p-3 font-bold text-foreground">${{ product.price }}</td>
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

    <!-- Add/Edit Product Modal -->
    <div v-if="showAddModal" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card class="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>{{ editingProduct ? t.products.editProduct : t.products.addNewProduct }}</CardTitle>
        </CardHeader>
        <CardContent>
          <form @submit.prevent="saveProduct" class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="text-sm font-medium">{{ t.products.name }}</label>
                <Input v-model="productForm.name" required />
              </div>
              <div>
                <label class="text-sm font-medium">{{ t.products.sku }}</label>
                <Input v-model="productForm.sku" required />
              </div>
            </div>
            
            <div>
              <label class="text-sm font-medium text-foreground">{{ t.products.description }}</label>
              <textarea v-model="productForm.description" class="w-full p-2 border border-input rounded-md bg-background text-foreground" rows="3"></textarea>
            </div>
            
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="text-sm font-medium text-foreground">{{ t.products.category }}</label>
                <select v-model="productForm.categoryId" class="w-full p-2 border border-input rounded-md bg-background text-foreground" required>
                  <option value="">{{ t.products.selectCategory }}</option>
                  <option v-for="category in categories" :key="category.id" :value="category.id">
                    {{ category.name }}
                  </option>
                </select>
              </div>
              <div>
                <label class="text-sm font-medium text-foreground">{{ t.products.supplier }}</label>
                <select v-model="productForm.supplierId" class="w-full p-2 border border-input rounded-md bg-background text-foreground">
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
                <Input v-model.number="productForm.price" type="number" step="0.01" required />
              </div>
              <div>
                <label class="text-sm font-medium">{{ t.products.costPrice }}</label>
                <Input v-model.number="productForm.costPrice" type="number" step="0.01" required />
              </div>
              <div>
                <label class="text-sm font-medium">{{ t.products.stockQuantity }}</label>
                <Input v-model.number="productForm.stockQuantity" type="number" required />
              </div>
            </div>
            
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="text-sm font-medium">{{ t.products.minStockLevel }}</label>
                <Input v-model.number="productForm.minStockLevel" type="number" />
              </div>
              <div>
                <label class="text-sm font-medium">{{ t.products.barcode }}</label>
                <Input v-model="productForm.barcode" />
              </div>
            </div>
            
            <div class="flex items-center gap-4">
              <label class="flex items-center">
                <input v-model="productForm.requiresPrescription" type="checkbox" class="mr-2" />
                <span class="text-sm text-foreground">{{ t.products.requiresPrescription }}</span>
              </label>
            </div>
            
            <div class="flex justify-end gap-2">
              <Button variant="outline" @click="showAddModal = false">
                {{ t.customers.cancel }}
              </Button>
              <Button type="submit" :disabled="loading">
                {{ loading ? t.products.saving : (editingProduct ? t.products.update : t.products.create) }}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { PlusIcon, SearchIcon, PencilIcon, TrashIcon } from 'lucide-vue-next'
import Card from '../components/ui/card.vue'
import CardHeader from '../components/ui/card-header.vue'
import CardContent from '../components/ui/card-content.vue'
import CardTitle from '../components/ui/card-title.vue'
import Input from '../components/ui/input.vue'
import Button from '../components/ui/button.vue'
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
  barcode: string
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
const loading = ref(false)

const pagination = ref<Pagination>({
  page: 1,
  limit: 10,
  total: 0,
  pages: 0
})

const productForm = ref({
  name: '',
  sku: '',
  description: '',
  price: 0,
  costPrice: 0,
  stockQuantity: 0,
  minStockLevel: 10,
  barcode: '',
  requiresPrescription: false,
  categoryId: '',
  supplierId: ''
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

const editProduct = (product: Product) => {
  editingProduct.value = product
  productForm.value = { ...product }
  showAddModal.value = true
}

const saveProduct = async () => {
  loading.value = true
  
  try {
    if (editingProduct.value) {
      await $fetch(`${config.public.apiBase}/products/${editingProduct.value.id}`, {
        method: 'PUT',
        body: productForm.value
      })
    } else {
      await $fetch(`${config.public.apiBase}/products`, {
        method: 'POST',
        body: productForm.value
      })
    }
    
    showAddModal.value = false
    editingProduct.value = null
    productForm.value = {
      name: '',
      sku: '',
      description: '',
      price: 0,
      costPrice: 0,
      stockQuantity: 0,
      minStockLevel: 10,
      barcode: '',
      requiresPrescription: false,
      categoryId: '',
      supplierId: ''
    }
    
    await fetchProducts()
  } catch (error) {
    console.error('Error saving product:', error)
  } finally {
    loading.value = false
  }
}

const deleteProduct = async (id: string) => {
  if (!confirm(t.value.products.deleteConfirm)) return
  
  try {
    await $fetch(`${config.public.apiBase}/products/${id}`, {
      method: 'DELETE'
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

onMounted(() => {
  fetchProducts()
  fetchCategories()
  fetchSuppliers()
})
</script>
