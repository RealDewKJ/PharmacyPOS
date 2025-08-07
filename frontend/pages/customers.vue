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
          <div class="overflow-x-auto">
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

      <!-- Add Customer Modal -->
      <div v-if="showAddCustomer" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <Card class="w-full max-w-md mx-4">
          <CardHeader>
            <CardTitle>{{ t.customers.addNewCustomer }}</CardTitle>
            <CardDescription>{{ t.customers.addNewCustomerDescription }}</CardDescription>
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
              <Button variant="outline" @click="showAddCustomer = false">{{ t.customers.cancel }}</Button>
              <Button @click="addCustomer">{{ t.customers.addCustomerButton }}</Button>
            </div>
          </CardContent>
        </Card>
      </div>
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
import { useLanguage } from '../composables/useLanguage'

const { t } = useLanguage()

// Mock data - replace with actual API calls
const customers = ref([
  {
    id: 'C001',
    name: 'John Doe',
    email: 'john.doe@email.com',
    phone: '+1 (555) 123-4567',
    address: '123 Main St, City, State 12345',
    totalOrders: 15,
    lastVisit: '2024-01-15'
  },
  {
    id: 'C002',
    name: 'Jane Smith',
    email: 'jane.smith@email.com',
    phone: '+1 (555) 987-6543',
    address: '456 Oak Ave, City, State 12345',
    totalOrders: 8,
    lastVisit: '2024-01-10'
  },
  {
    id: 'C003',
    name: 'Mike Johnson',
    email: 'mike.johnson@email.com',
    phone: '+1 (555) 456-7890',
    address: '789 Pine Rd, City, State 12345',
    totalOrders: 23,
    lastVisit: '2024-01-12'
  }
])

const searchQuery = ref('')
const showAddCustomer = ref(false)
const newCustomer = ref({
  name: '',
  email: '',
  phone: '',
  address: ''
})

const filteredCustomers = computed(() => {
  if (!searchQuery.value) return customers.value
  return customers.value.filter(customer =>
    customer.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    customer.phone.includes(searchQuery.value)
  )
})

const viewCustomer = (customer: any) => {
  // Implement view customer details
  console.log('View customer:', customer)
}

const editCustomer = (customer: any) => {
  // Implement edit customer
  console.log('Edit customer:', customer)
}

const deleteCustomer = (customerId: string) => {
  // Implement delete customer
  console.log('Delete customer:', customerId)
  customers.value = customers.value.filter(c => c.id !== customerId)
}

const addCustomer = () => {
  if (newCustomer.value.name && newCustomer.value.email) {
    const customer = {
      id: `C${String(customers.value.length + 1).padStart(3, '0')}`,
      ...newCustomer.value,
      totalOrders: 0,
      lastVisit: new Date().toISOString().split('T')[0]
    }
    customers.value.push(customer)
    newCustomer.value = { name: '', email: '', phone: '', address: '' }
    showAddCustomer.value = false
  }
}
</script>
