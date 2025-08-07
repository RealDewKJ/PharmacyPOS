<template>
  <div class="min-h-screen bg-background">
    <div class="container mx-auto px-4 py-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-foreground">Sales</h1>
        <p class="text-muted-foreground">View and manage sales transactions</p>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-muted-foreground">Total Sales</p>
              <p class="text-2xl font-bold text-foreground">$12,345.67</p>
            </div>
            <div class="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
              <DollarSignIcon class="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </Card>
        <Card class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-muted-foreground">Today's Sales</p>
              <p class="text-2xl font-bold text-foreground">$1,234.56</p>
            </div>
            <div class="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
              <TrendingUpIcon class="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </Card>
        <Card class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-muted-foreground">Total Orders</p>
              <p class="text-2xl font-bold text-foreground">156</p>
            </div>
            <div class="w-8 h-8 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
              <ShoppingCartIcon class="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </Card>
        <Card class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-muted-foreground">Today's Orders</p>
              <p class="text-2xl font-bold text-foreground">23</p>
            </div>
            <div class="w-8 h-8 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center">
              <CalendarIcon class="h-4 w-4 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </Card>
      </div>

      <!-- Filters -->
      <Card class="p-6 mb-8">
        <div class="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div class="flex flex-col md:flex-row gap-4 flex-1">
            <Input 
              v-model="searchQuery" 
              placeholder="Search sales..." 
              class="max-w-md"
            />
            <select v-model="statusFilter" class="p-2 border border-input rounded-md bg-background text-foreground">
              <option value="">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <Input 
              type="date" 
              v-model="dateFilter" 
              class="max-w-md"
            />
          </div>
          <Button @click="exportSales">
            <DownloadIcon class="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </Card>

      <!-- Sales Table -->
      <Card class="p-6">
        <CardHeader>
          <CardTitle>Sales History</CardTitle>
          <CardDescription>Recent sales transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="border-b border-border">
                  <th class="text-left p-3 font-medium text-foreground">Order ID</th>
                  <th class="text-left p-3 font-medium text-foreground">Customer</th>
                  <th class="text-left p-3 font-medium text-foreground">Items</th>
                  <th class="text-left p-3 font-medium text-foreground">Total</th>
                  <th class="text-left p-3 font-medium text-foreground">Payment</th>
                  <th class="text-left p-3 font-medium text-foreground">Status</th>
                  <th class="text-left p-3 font-medium text-foreground">Date</th>
                  <th class="text-left p-3 font-medium text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="sale in filteredSales" :key="sale.id" class="border-b border-border hover:bg-muted/50">
                  <td class="p-3">
                    <span class="font-medium text-foreground">#{{ sale.id }}</span>
                  </td>
                  <td class="p-3">
                    <div>
                      <div class="font-medium text-foreground">{{ sale.customer }}</div>
                      <div class="text-sm text-muted-foreground">{{ sale.customerEmail }}</div>
                    </div>
                  </td>
                  <td class="p-3">
                    <span class="text-sm text-muted-foreground">{{ sale.items }} items</span>
                  </td>
                  <td class="p-3">
                    <span class="font-medium text-foreground">${{ sale.total.toFixed(2) }}</span>
                  </td>
                  <td class="p-3">
                    <span :class="[
                      'px-2 py-1 rounded-md text-sm font-medium',
                      sale.paymentMethod === 'Cash' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' : 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                    ]">
                      {{ sale.paymentMethod }}
                    </span>
                  </td>
                  <td class="p-3">
                    <span :class="[
                      'px-2 py-1 rounded-md text-sm font-medium',
                      sale.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' : 
                      sale.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' : 
                      'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                    ]">
                      {{ sale.status }}
                    </span>
                  </td>
                  <td class="p-3 text-muted-foreground">{{ sale.date }}</td>
                  <td class="p-3">
                    <div class="flex items-center gap-2">
                      <Button size="sm" variant="outline" @click="viewSale(sale)">
                        <EyeIcon class="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" @click="printReceipt(sale)">
                        <PrinterIcon class="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" @click="refundSale(sale.id)">
                        <RotateCcwIcon class="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <!-- Sale Details Modal -->
      <div v-if="selectedSale" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <Card class="w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
          <CardHeader>
            <CardTitle>Sale Details - #{{ selectedSale.id }}</CardTitle>
            <CardDescription>Complete transaction information</CardDescription>
          </CardHeader>
          <CardContent class="space-y-6">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="text-sm font-medium text-muted-foreground">Customer</label>
                <p class="text-foreground">{{ selectedSale.customer }}</p>
              </div>
              <div>
                <label class="text-sm font-medium text-muted-foreground">Date</label>
                <p class="text-foreground">{{ selectedSale.date }}</p>
              </div>
              <div>
                <label class="text-sm font-medium text-muted-foreground">Payment Method</label>
                <p class="text-foreground">{{ selectedSale.paymentMethod }}</p>
              </div>
              <div>
                <label class="text-sm font-medium text-muted-foreground">Status</label>
                <p class="text-foreground">{{ selectedSale.status }}</p>
              </div>
            </div>
            
            <div>
              <label class="text-sm font-medium text-muted-foreground">Items</label>
              <div class="mt-2 space-y-2">
                <div v-for="item in selectedSale.itemDetails" :key="item.id" class="flex justify-between items-center p-2 bg-muted rounded-md">
                  <div>
                    <p class="font-medium text-foreground">{{ item.name }}</p>
                    <p class="text-sm text-muted-foreground">Qty: {{ item.quantity }}</p>
                  </div>
                  <p class="font-medium text-foreground">${{ item.price.toFixed(2) }}</p>
                </div>
              </div>
            </div>
            
            <div class="border-t pt-4">
              <div class="flex justify-between items-center text-lg font-bold">
                <span>Total</span>
                <span>${{ selectedSale.total.toFixed(2) }}</span>
              </div>
            </div>
            
            <div class="flex gap-2 justify-end">
              <Button variant="outline" @click="selectedSale = null">Close</Button>
              <Button @click="printReceipt(selectedSale)">
                <PrinterIcon class="h-4 w-4 mr-2" />
                Print Receipt
              </Button>
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
  DollarSignIcon,
  TrendingUpIcon,
  ShoppingCartIcon,
  CalendarIcon,
  DownloadIcon,
  EyeIcon,
  PrinterIcon,
  RotateCcwIcon
} from 'lucide-vue-next'

import Card from '../components/ui/card.vue'
import CardHeader from '../components/ui/card-header.vue'
import CardContent from '../components/ui/card-content.vue'
import CardTitle from '../components/ui/card-title.vue'
import CardDescription from '../components/ui/card-description.vue'
import Input from '../components/ui/input.vue'
import Button from '../components/ui/button.vue'

// Mock data - replace with actual API calls
const sales = ref([
  {
    id: 'S001',
    customer: 'John Doe',
    customerEmail: 'john.doe@email.com',
    items: 3,
    total: 45.67,
    paymentMethod: 'Cash',
    status: 'completed',
    date: '2024-01-15 14:30',
    itemDetails: [
      { id: 1, name: 'Aspirin 500mg', quantity: 2, price: 12.99 },
      { id: 2, name: 'Vitamin C 1000mg', quantity: 1, price: 19.69 }
    ]
  },
  {
    id: 'S002',
    customer: 'Jane Smith',
    customerEmail: 'jane.smith@email.com',
    items: 2,
    total: 32.50,
    paymentMethod: 'Card',
    status: 'completed',
    date: '2024-01-15 13:15',
    itemDetails: [
      { id: 3, name: 'Ibuprofen 400mg', quantity: 1, price: 15.99 },
      { id: 4, name: 'Bandages', quantity: 1, price: 16.51 }
    ]
  },
  {
    id: 'S003',
    customer: 'Mike Johnson',
    customerEmail: 'mike.johnson@email.com',
    items: 1,
    total: 28.99,
    paymentMethod: 'Cash',
    status: 'pending',
    date: '2024-01-15 12:45',
    itemDetails: [
      { id: 5, name: 'Prescription Medicine', quantity: 1, price: 28.99 }
    ]
  }
])

const searchQuery = ref('')
const statusFilter = ref('')
const dateFilter = ref('')
const selectedSale = ref(null)

const filteredSales = computed(() => {
  let filtered = sales.value
  
  if (searchQuery.value) {
    filtered = filtered.filter(sale =>
      sale.id.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      sale.customer.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }
  
  if (statusFilter.value) {
    filtered = filtered.filter(sale => sale.status === statusFilter.value)
  }
  
  if (dateFilter.value) {
    filtered = filtered.filter(sale => sale.date.startsWith(dateFilter.value))
  }
  
  return filtered
})

const viewSale = (sale: any) => {
  selectedSale.value = sale
}

const printReceipt = (sale: any) => {
  // Implement print receipt functionality
  console.log('Print receipt for sale:', sale.id)
}

const refundSale = (saleId: string) => {
  // Implement refund functionality
  console.log('Refund sale:', saleId)
}

const exportSales = () => {
  // Implement export functionality
  console.log('Export sales data')
}
</script>
