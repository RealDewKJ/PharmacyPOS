<template>
  <div class="min-h-screen bg-background">
    <div class="container mx-auto px-4 py-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-foreground">{{ t.customers.title }}</h1>
        <p class="text-muted-foreground">{{ t.customers.subtitle }}</p>
      </div>

      <!-- Search and Add Customer -->
      <Card class="p-6 mb-8">
        <div class="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div class="flex-1 max-w-md">
            <Input 
              v-model="searchQuery" 
              :placeholder="t.customers.searchPlaceholder" 
              class="w-full"
            />
          </div>
          <Button @click="showAddCustomer = true">
            <PlusIcon class="h-4 w-4 mr-2" />
            {{ t.customers.addCustomer }}
          </Button>
        </div>
      </Card>

      <!-- Customers Table -->
      <Card class="p-6">
        <CardHeader>
          <CardTitle>{{ t.customers.customerList }}</CardTitle>
          <CardDescription>{{ t.customers.customerListDescription }}</CardDescription>
        </CardHeader>
        <CardContent>
          <div v-if="loading" class="flex justify-center items-center py-8">
            <div class="text-muted-foreground">Loading customers...</div>
          </div>
          <div v-else class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="border-b border-border">
                  <th class="text-left p-3 font-medium text-foreground">{{ t.customers.name }}</th>
                  <th class="text-left p-3 font-medium text-foreground">{{ t.customers.email }}</th>
                  <th class="text-left p-3 font-medium text-foreground">{{ t.customers.phone }}</th>
                  <th class="text-left p-3 font-medium text-foreground">{{ t.customers.totalOrders }}</th>
                  <th class="text-left p-3 font-medium text-foreground">{{ t.customers.lastVisit }}</th>
                  <th class="text-left p-3 font-medium text-foreground">{{ t.customers.actions }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="customer in filteredCustomers" :key="customer.id" class="border-b border-border hover:bg-muted/50">
                  <td class="p-3">
                    <div class="flex items-center gap-3">
                      <div class="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <span class="text-sm font-medium text-primary">
                          {{ customer.name.charAt(0).toUpperCase() }}
                        </span>
                      </div>
                      <div>
                        <div class="font-medium text-foreground">{{ customer.name }}</div>
                        <div class="text-sm text-muted-foreground">ID: {{ customer.id }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="p-3 text-foreground">{{ customer.email }}</td>
                  <td class="p-3 text-foreground">{{ customer.phone }}</td>
                  <td class="p-3">
                    <span class="px-2 py-1 bg-primary/10 text-primary rounded-md text-sm">
                      {{ customer.totalOrders }}
                    </span>
                  </td>
                  <td class="p-3 text-muted-foreground">{{ customer.lastVisit }}</td>
                  <td class="p-3">
                    <div class="flex items-center gap-2">
                      <Button size="sm" variant="outline" @click="viewCustomer(customer)">
                        <EyeIcon class="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" @click="editCustomer(customer)">
                        <PencilIcon class="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="destructive" @click="deleteCustomer(customer.id)">
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

      <!-- Add/Edit Customer Modal -->
      <div v-if="showAddCustomer || showEditCustomer" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <Card class="w-full max-w-md mx-4">
          <CardHeader>
            <CardTitle>{{ showEditCustomer ? t.customers.editCustomer : t.customers.addNewCustomer }}</CardTitle>
            <CardDescription>{{ showEditCustomer ? t.customers.editCustomerDescription : t.customers.addNewCustomerDescription }}</CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <div>
              <label class="text-sm font-medium text-foreground">{{ t.customers.fullName }}</label>
              <Input v-model="newCustomer.name" :placeholder="t.customers.fullNamePlaceholder" />
            </div>
            <div>
              <label class="text-sm font-medium text-foreground">{{ t.customers.email }}</label>
              <Input v-model="newCustomer.email" type="email" :placeholder="t.customers.emailPlaceholder" />
            </div>
            <div>
              <label class="text-sm font-medium text-foreground">{{ t.customers.phone }}</label>
              <Input v-model="newCustomer.phone" :placeholder="t.customers.phonePlaceholder" />
            </div>
            <div>
              <label class="text-sm font-medium text-foreground">{{ t.customers.address }}</label>
              <textarea 
                v-model="newCustomer.address" 
                class="w-full p-2 border border-input rounded-md bg-background text-foreground resize-none"
                rows="3"
                :placeholder="t.customers.addressPlaceholder"
              ></textarea>
            </div>
            <div class="flex gap-2 justify-end">
              <Button variant="outline" @click="closeModal">{{ t.customers.cancel }}</Button>
              <Button @click="showEditCustomer ? updateCustomer() : addCustomer()">
                {{ showEditCustomer ? t.customers.updateCustomerButton : t.customers.addCustomerButton }}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Customer Detail Dialog -->
      <CustomerDetailDialog
        :is-open="showCustomerDetail"
        :customer="selectedCustomer"
        @close="showCustomerDetail = false"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
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
import CustomerDetailDialog from '../components/CustomerDetailDialog.vue'
import { useLanguage } from '../composables/useLanguage'
import { useApi } from '../composables/useApi'
import type { Customer, CustomersResponse } from '../types/api'

const { t } = useLanguage()
const { get, post, put, delete: del } = useApi()

// Customer data
const customers = ref<Customer[]>([])
const loading = ref(false)

const searchQuery = ref('')
const showAddCustomer = ref(false)
const showCustomerDetail = ref(false)
const showEditCustomer = ref(false)
const selectedCustomer = ref<Customer | null>(null)
const editingCustomer = ref<Customer | null>(null)
const newCustomer = ref({
  name: '',
  email: '',
  phone: '',
  address: ''
})

// API Functions
const fetchCustomers = async () => {
  try {
    loading.value = true
    const response = await get<CustomersResponse>('/customers')
    customers.value = response.customers.map(customer => ({
      ...customer,
      totalOrders: Math.floor(Math.random() * 50) + 1, // Mock data for now
      lastVisit: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    }))
  } catch (error) {
    console.error('Error fetching customers:', error)
  } finally {
    loading.value = false
  }
}

const filteredCustomers = computed(() => {
  if (!searchQuery.value) return customers.value
  return customers.value.filter(customer =>
    customer.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    (customer.email && customer.email.toLowerCase().includes(searchQuery.value.toLowerCase())) ||
    (customer.phone && customer.phone.includes(searchQuery.value))
  )
})

const viewCustomer = (customer: Customer) => {
  selectedCustomer.value = customer
  showCustomerDetail.value = true
}

const editCustomer = (customer: Customer) => {
  editingCustomer.value = customer
  newCustomer.value = {
    name: customer.name,
    email: customer.email || '',
    phone: customer.phone || '',
    address: customer.address || ''
  }
  showEditCustomer.value = true
}

const deleteCustomer = async (customerId: string) => {
  if (!confirm(t.value.customers.deleteConfirm)) return
  
  try {
    await del(`/customers/${customerId}`)
    await fetchCustomers()
  } catch (error) {
    console.error('Error deleting customer:', error)
  }
}

const addCustomer = async () => {
  try {
    const customerData = {
      name: newCustomer.value.name,
      email: newCustomer.value.email || undefined,
      phone: newCustomer.value.phone || undefined,
      address: newCustomer.value.address || undefined
    }
    
    await post('/customers', customerData)
    showAddCustomer.value = false
    resetForm()
    await fetchCustomers()
  } catch (error) {
    console.error('Error adding customer:', error)
  }
}

const updateCustomer = async () => {
  if (!editingCustomer.value) return
  
  try {
    const customerData = {
      name: newCustomer.value.name,
      email: newCustomer.value.email || undefined,
      phone: newCustomer.value.phone || undefined,
      address: newCustomer.value.address || undefined
    }
    
    await put(`/customers/${editingCustomer.value.id}`, customerData)
    showEditCustomer.value = false
    editingCustomer.value = null
    resetForm()
    await fetchCustomers()
  } catch (error) {
    console.error('Error updating customer:', error)
  }
}

const resetForm = () => {
  newCustomer.value = {
    name: '',
    email: '',
    phone: '',
    address: ''
  }
}

const closeModal = () => {
  showAddCustomer.value = false
  showEditCustomer.value = false
  editingCustomer.value = null
  resetForm()
}

// Load customers on mount
onMounted(() => {
  fetchCustomers()
})
</script>
