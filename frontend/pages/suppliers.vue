<template>
  <div class="min-h-screen bg-background">
    <div class="container mx-auto px-4 py-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-foreground">Suppliers</h1>
        <p class="text-muted-foreground">Manage supplier information and inventory</p>
      </div>

      <!-- Search and Add Supplier -->
      <Card class="p-6 mb-8">
        <div class="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div class="flex-1 max-w-md">
            <Input 
              v-model="searchQuery" 
              placeholder="Search suppliers..." 
              class="w-full"
            />
          </div>
          <Button @click="showAddSupplier = true">
            <PlusIcon class="h-4 w-4 mr-2" />
            Add Supplier
          </Button>
        </div>
      </Card>

      <!-- Suppliers Table -->
      <Card class="p-6">
        <CardHeader>
          <CardTitle>Supplier List</CardTitle>
          <CardDescription>All registered suppliers in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="border-b border-border">
                  <th class="text-left p-3 font-medium text-foreground">Company</th>
                  <th class="text-left p-3 font-medium text-foreground">Contact</th>
                  <th class="text-left p-3 font-medium text-foreground">Phone</th>
                  <th class="text-left p-3 font-medium text-foreground">Email</th>
                  <th class="text-left p-3 font-medium text-foreground">Products</th>
                  <th class="text-left p-3 font-medium text-foreground">Status</th>
                  <th class="text-left p-3 font-medium text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="supplier in filteredSuppliers" :key="supplier.id" class="border-b border-border hover:bg-muted/50">
                  <td class="p-3">
                    <div class="flex items-center gap-3">
                      <div class="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <span class="text-sm font-medium text-primary">
                          {{ supplier.company.charAt(0).toUpperCase() }}
                        </span>
                      </div>
                      <div>
                        <div class="font-medium text-foreground">{{ supplier.company }}</div>
                        <div class="text-sm text-muted-foreground">ID: {{ supplier.id }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="p-3 text-foreground">{{ supplier.contact }}</td>
                  <td class="p-3 text-foreground">{{ supplier.phone }}</td>
                  <td class="p-3 text-foreground">{{ supplier.email }}</td>
                  <td class="p-3">
                    <span class="px-2 py-1 bg-primary/10 text-primary rounded-md text-sm">
                      {{ supplier.products }}
                    </span>
                  </td>
                  <td class="p-3">
                    <span :class="[
                      'px-2 py-1 rounded-md text-sm font-medium',
                      supplier.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                    ]">
                      {{ supplier.status }}
                    </span>
                  </td>
                  <td class="p-3">
                    <div class="flex items-center gap-2">
                      <Button size="sm" variant="outline" @click="viewSupplier(supplier)">
                        <EyeIcon class="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" @click="editSupplier(supplier)">
                        <EditIcon class="h-4 w-4" />
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

      <!-- Add Supplier Modal -->
      <div v-if="showAddSupplier" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <Card class="w-full max-w-md mx-4">
          <CardHeader>
            <CardTitle>Add New Supplier</CardTitle>
            <CardDescription>Enter supplier information</CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <div>
              <label class="text-sm font-medium text-foreground">Company Name</label>
              <Input v-model="newSupplier.company" placeholder="Enter company name" />
            </div>
            <div>
              <label class="text-sm font-medium text-foreground">Contact Person</label>
              <Input v-model="newSupplier.contact" placeholder="Enter contact person" />
            </div>
            <div>
              <label class="text-sm font-medium text-foreground">Phone</label>
              <Input v-model="newSupplier.phone" placeholder="Enter phone number" />
            </div>
            <div>
              <label class="text-sm font-medium text-foreground">Email</label>
              <Input v-model="newSupplier.email" type="email" placeholder="Enter email" />
            </div>
            <div>
              <label class="text-sm font-medium text-foreground">Address</label>
              <textarea 
                v-model="newSupplier.address" 
                class="w-full p-2 border border-input rounded-md bg-background text-foreground resize-none"
                rows="3"
                placeholder="Enter address"
              ></textarea>
            </div>
            <div>
              <label class="text-sm font-medium text-foreground">Status</label>
              <select v-model="newSupplier.status" class="w-full p-2 border border-input rounded-md bg-background text-foreground">
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <div class="flex gap-2 justify-end">
              <Button variant="outline" @click="showAddSupplier = false">Cancel</Button>
              <Button @click="addSupplier">Add Supplier</Button>
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
  EditIcon, 
  TrashIcon 
} from 'lucide-vue-next'

import Card from '../components/ui/card.vue'
import CardHeader from '../components/ui/card-header.vue'
import CardContent from '../components/ui/card-content.vue'
import CardTitle from '../components/ui/card-title.vue'
import CardDescription from '../components/ui/card-description.vue'
import Input from '../components/ui/input.vue'
import Button from '../components/ui/button.vue'

// Mock data - replace with actual API calls
const suppliers = ref([
  {
    id: 'S001',
    company: 'PharmaCorp Inc.',
    contact: 'John Smith',
    phone: '+1 (555) 123-4567',
    email: 'john.smith@pharmacorp.com',
    address: '123 Business Ave, City, State 12345',
    products: 45,
    status: 'Active'
  },
  {
    id: 'S002',
    company: 'MedSupply Co.',
    contact: 'Sarah Johnson',
    phone: '+1 (555) 987-6543',
    email: 'sarah.johnson@medsupply.com',
    address: '456 Industrial Blvd, City, State 12345',
    products: 32,
    status: 'Active'
  },
  {
    id: 'S003',
    company: 'HealthTech Solutions',
    contact: 'Mike Davis',
    phone: '+1 (555) 456-7890',
    email: 'mike.davis@healthtech.com',
    address: '789 Tech Park, City, State 12345',
    products: 28,
    status: 'Inactive'
  }
])

const searchQuery = ref('')
const showAddSupplier = ref(false)
const newSupplier = ref({
  company: '',
  contact: '',
  phone: '',
  email: '',
  address: '',
  status: 'Active'
})

const filteredSuppliers = computed(() => {
  if (!searchQuery.value) return suppliers.value
  return suppliers.value.filter(supplier =>
    supplier.company.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    supplier.contact.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    supplier.email.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const viewSupplier = (supplier: any) => {
  // Implement view supplier details
  console.log('View supplier:', supplier)
}

const editSupplier = (supplier: any) => {
  // Implement edit supplier
  console.log('Edit supplier:', supplier)
}

const deleteSupplier = (supplierId: string) => {
  // Implement delete supplier
  console.log('Delete supplier:', supplierId)
  suppliers.value = suppliers.value.filter(s => s.id !== supplierId)
}

const addSupplier = () => {
  if (newSupplier.value.company && newSupplier.value.contact) {
    const supplier = {
      id: `S${String(suppliers.value.length + 1).padStart(3, '0')}`,
      ...newSupplier.value,
      products: 0
    }
    suppliers.value.push(supplier)
    newSupplier.value = { company: '', contact: '', phone: '', email: '', address: '', status: 'Active' }
    showAddSupplier.value = false
  }
}
</script>
