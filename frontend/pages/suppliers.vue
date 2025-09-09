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
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="border-b border-border">
                  <th class="text-left p-3 font-medium text-foreground">{{ t.suppliers.company }}</th>
                  <th class="text-left p-3 font-medium text-foreground">{{ t.suppliers.contact }}</th>
                  <th class="text-left p-3 font-medium text-foreground">{{ t.suppliers.phone }}</th>
                  <th class="text-left p-3 font-medium text-foreground">{{ t.suppliers.email }}</th>
                  <th class="text-left p-3 font-medium text-foreground">{{ t.suppliers.products }}</th>
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
                      {{ supplier.status === 'Active' ? t.suppliers.active : t.suppliers.inactive }}
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

      <!-- Add Supplier Modal -->
      <div v-if="showAddSupplier" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <Card class="w-full max-w-md mx-4">
          <CardHeader>
            <CardTitle>{{ t.suppliers.addNewSupplier }}</CardTitle>
            <CardDescription>{{ t.suppliers.addNewSupplierDescription }}</CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <div>
              <label class="text-sm font-medium text-foreground">{{ t.suppliers.companyName }}</label>
              <Input v-model="newSupplier.company" :placeholder="t.suppliers.companyNamePlaceholder" />
            </div>
            <div>
              <label class="text-sm font-medium text-foreground">{{ t.suppliers.contactPerson }}</label>
              <Input v-model="newSupplier.contact" :placeholder="t.suppliers.contactPersonPlaceholder" />
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
            <div>
              <label class="text-sm font-medium text-foreground">{{ t.suppliers.statusLabel }}</label>
              <select v-model="newSupplier.status" class="w-full p-2 border border-input rounded-md bg-background text-foreground">
                <option value="Active">{{ t.suppliers.active }}</option>
                <option value="Inactive">{{ t.suppliers.inactive }}</option>
              </select>
            </div>
            <div class="flex gap-2 justify-end">
              <Button variant="outline" @click="showAddSupplier = false">{{ t.suppliers.cancel }}</Button>
              <Button @click="addSupplier">{{ t.suppliers.addSupplierButton }}</Button>
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

// Language composable
const { t } = useLanguage()

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
