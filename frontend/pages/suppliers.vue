<template>
  <div class="min-h-screen bg-background">
    <div class="container mx-auto px-4 py-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-foreground">{{ t.suppliers.title }}</h1>
        <p class="text-muted-foreground">{{ t.suppliers.subtitle }}</p>
      </div>

      <!-- Search and Add Supplier -->
      <Card class="p-6 mb-8">
        <div class="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div class="flex-1 max-w-md">
            <Input 
              v-model="searchQuery" 
              :placeholder="t.suppliers.searchPlaceholder" 
              class="w-full"
            />
          </div>
          <Button @click="showAddSupplier = true">
            <PlusIcon class="h-4 w-4 mr-2" />
            {{ t.suppliers.addSupplier }}
          </Button>
        </div>
      </Card>

      <!-- Suppliers Table -->
      <Card class="p-6">
        <CardHeader>
          <CardTitle>{{ t.suppliers.supplierList }}</CardTitle>
          <CardDescription>{{ t.suppliers.supplierListDescription }}</CardDescription>
        </CardHeader>
        <CardContent>
          <div v-if="loading" class="flex justify-center items-center py-8">
            <div class="text-muted-foreground">Loading suppliers...</div>
          </div>
          <div v-else class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="border-b border-border">
                  <th class="text-left p-3 font-medium text-foreground">{{ t.suppliers.company }}</th>
                  <th class="text-left p-3 font-medium text-foreground">{{ t.suppliers.phone }}</th>
                  <th class="text-left p-3 font-medium text-foreground">{{ t.suppliers.email }}</th>
                  <th class="text-left p-3 font-medium text-foreground">{{ t.suppliers.status }}</th>
                  <th class="text-left p-3 font-medium text-foreground">{{ t.suppliers.actions }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="supplier in filteredSuppliers" :key="supplier.id" class="border-b border-border hover:bg-muted/50">
                  <td class="p-3">
                    <div class="flex items-center gap-3">
                      <div class="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <span class="text-sm font-medium text-primary">
                          {{ supplier.name.charAt(0).toUpperCase() }}
                        </span>
                      </div>
                      <div>
                        <div class="font-medium text-foreground">{{ supplier.name }}</div>
                        <div class="text-sm text-muted-foreground">ID: {{ supplier.id }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="p-3 text-foreground">{{ supplier.phone || '-' }}</td>
                  <td class="p-3 text-foreground">{{ supplier.email || '-' }}</td>
                  <td class="p-3">
                    <span :class="[
                      'px-2 py-1 rounded-md text-sm font-medium',
                      supplier.isActive ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                    ]">
                      {{ supplier.isActive ? t.suppliers.active : t.suppliers.inactive }}
                    </span>
                  </td>
                  <td class="p-3">
                    <div class="flex items-center gap-2">
                      <Button size="sm" variant="outline" @click="viewSupplier(supplier)">
                        <EyeIcon class="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" @click="editSupplier(supplier)">
                        <PencilIcon class="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="destructive" @click="deleteSupplier(supplier.id)">
                        <TrashIcon class="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <!-- Add/Edit Supplier Modal -->
      <div v-if="showAddSupplier || showEditSupplier" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <Card class="w-full max-w-md mx-4">
          <CardHeader>
            <CardTitle>{{ showEditSupplier ? t.suppliers.editSupplier : t.suppliers.addNewSupplier }}</CardTitle>
            <CardDescription>{{ showEditSupplier ? t.suppliers.editSupplierDescription : t.suppliers.addNewSupplierDescription }}</CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <div>
              <label class="text-sm font-medium text-foreground">{{ t.suppliers.companyName }}</label>
              <Input v-model="newSupplier.name" :placeholder="t.suppliers.companyNamePlaceholder" />
            </div>
            <div>
              <label class="text-sm font-medium text-foreground">{{ t.suppliers.phone }}</label>
              <Input v-model="newSupplier.phone" :placeholder="t.suppliers.phonePlaceholder" />
            </div>
            <div>
              <label class="text-sm font-medium text-foreground">{{ t.suppliers.email }}</label>
              <Input v-model="newSupplier.email" type="email" :placeholder="t.suppliers.emailPlaceholder" />
            </div>
            <div>
              <label class="text-sm font-medium text-foreground">{{ t.suppliers.address }}</label>
              <textarea 
                v-model="newSupplier.address" 
                class="w-full p-2 border border-input rounded-md bg-background text-foreground resize-none"
                rows="3"
                :placeholder="t.suppliers.addressPlaceholder"
              ></textarea>
            </div>
            <div class="flex gap-2 justify-end">
              <Button variant="outline" @click="closeModal">{{ t.suppliers.cancel }}</Button>
              <Button @click="showEditSupplier ? updateSupplier() : addSupplier()">
                {{ showEditSupplier ? t.suppliers.updateSupplierButton : t.suppliers.addSupplierButton }}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Supplier Detail Dialog -->
      <SupplierDetailDialog
        :is-open="showSupplierDetail"
        :supplier="selectedSupplier"
        @close="showSupplierDetail = false"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { 
  PlusIcon, 
  EyeIcon, 
  PencilIcon, 
  TrashIcon 
} from 'lucide-vue-next'

import Card from '../components/ui/card.vue'
import CardHeader from '../components/ui/card-header.vue'
import CardContent from '../components/ui/card-content.vue'
import CardTitle from '../components/ui/card-title.vue'
import CardDescription from '../components/ui/card-description.vue'
import Input from '../components/ui/input.vue'
import Button from '../components/ui/button.vue'
import { useLanguage } from '../composables/useLanguage'
import { useApi } from '../composables/useApi'
import SupplierDetailDialog from '../components/SupplierDetailDialog.vue'
import type { Supplier, SuppliersResponse } from '../types/api'

// Language composable
const { t } = useLanguage()
const { get, post, put, delete: del } = useApi()

// Supplier data
const suppliers = ref<Supplier[]>([])
const loading = ref(false)

const searchQuery = ref('')
const showAddSupplier = ref(false)
const showEditSupplier = ref(false)
const showSupplierDetail = ref(false)
const selectedSupplier = ref<Supplier | null>(null)
const editingSupplier = ref<Supplier | null>(null)
const newSupplier = ref({
  name: '',
  email: '',
  phone: '',
  address: ''
})

// API Functions
const fetchSuppliers = async () => {
  try {
    loading.value = true
    const response = await get<SuppliersResponse>('/suppliers')
    suppliers.value = response.suppliers
  } catch (error) {
    console.error('Error fetching suppliers:', error)
  } finally {
    loading.value = false
  }
}

const filteredSuppliers = computed(() => {
  if (!searchQuery.value) return suppliers.value
  return suppliers.value.filter(supplier =>
    supplier.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    (supplier.email && supplier.email.toLowerCase().includes(searchQuery.value.toLowerCase())) ||
    (supplier.phone && supplier.phone.includes(searchQuery.value))
  )
})

const viewSupplier = (supplier: Supplier) => {
  selectedSupplier.value = supplier
  showSupplierDetail.value = true
}

const editSupplier = (supplier: Supplier) => {
  editingSupplier.value = supplier
  newSupplier.value = {
    name: supplier.name,
    email: supplier.email || '',
    phone: supplier.phone || '',
    address: supplier.address || ''
  }
  showEditSupplier.value = true
}

const deleteSupplier = async (supplierId: string) => {
  if (!confirm(t.value.suppliers.deleteConfirm)) return
  
  try {
    await del(`/suppliers/${supplierId}`)
    await fetchSuppliers()
  } catch (error) {
    console.error('Error deleting supplier:', error)
  }
}

const addSupplier = async () => {
  try {
    const supplierData = {
      name: newSupplier.value.name,
      email: newSupplier.value.email || undefined,
      phone: newSupplier.value.phone || undefined,
      address: newSupplier.value.address || undefined
    }
    
    await post('/suppliers', supplierData)
    showAddSupplier.value = false
    resetForm()
    await fetchSuppliers()
  } catch (error) {
    console.error('Error adding supplier:', error)
  }
}

const updateSupplier = async () => {
  if (!editingSupplier.value) return
  
  try {
    const supplierData = {
      name: newSupplier.value.name,
      email: newSupplier.value.email || undefined,
      phone: newSupplier.value.phone || undefined,
      address: newSupplier.value.address || undefined
    }
    
    await put(`/suppliers/${editingSupplier.value.id}`, supplierData)
    showEditSupplier.value = false
    editingSupplier.value = null
    resetForm()
    await fetchSuppliers()
  } catch (error) {
    console.error('Error updating supplier:', error)
  }
}

const resetForm = () => {
  newSupplier.value = {
    name: '',
    email: '',
    phone: '',
    address: ''
  }
}

const closeModal = () => {
  showAddSupplier.value = false
  showEditSupplier.value = false
  editingSupplier.value = null
  resetForm()
}

// Load suppliers on mount
onMounted(() => {
  fetchSuppliers()
})
</script>
