<template>
  <div class="min-h-screen bg-background">
    <div class="container mx-auto px-4 py-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-foreground">{{ t.dashboard.title }}</h1>
        <p class="text-muted-foreground">{{ t.dashboard.subtitle }}</p>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card class="p-6">
          <div class="flex items-center">
            <div class="p-2 bg-primary/10 rounded-lg">
              <PillIcon class="h-6 w-6 text-primary" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-muted-foreground">{{ t.dashboard.totalProducts }}</p>
              <p class="text-2xl font-bold text-foreground">{{ stats.totalProducts || 0 }}</p>
            </div>
          </div>
        </Card>

        <Card class="p-6">
          <div class="flex items-center">
            <div class="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <DollarSignIcon class="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-muted-foreground">{{ t.dashboard.totalRevenue }}</p>
              <p class="text-2xl font-bold text-foreground">฿{{ formatCurrency(stats.totalRevenue || 0) }}</p>
            </div>
          </div>
        </Card>

        <Card class="p-6">
          <div class="flex items-center">
            <div class="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <ShoppingCartIcon class="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-muted-foreground">{{ t.dashboard.totalSales }}</p>
              <p class="text-2xl font-bold text-foreground">{{ stats.totalSales || 0 }}</p>
            </div>
          </div>
        </Card>

        <Card class="p-6">
          <div class="flex items-center">
            <div class="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
              <AlertTriangleIcon class="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-muted-foreground">{{ t.dashboard.lowStockItems }}</p>
              <p class="text-2xl font-bold text-foreground">{{ stats.lowStockProducts || 0 }}</p>
            </div>
          </div>
        </Card>
      </div>

      <!-- Quick Actions -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card class="p-6">
          <CardHeader>
            <CardTitle>{{ t.dashboard.quickActions }}</CardTitle>
          </CardHeader>
          <CardContent class="space-y-3">
            <Button class="w-full" @click="navigateTo('/pos')">
              <PlusIcon class="h-4 w-4 mr-2" />
              {{ t.dashboard.newSale }}
            </Button>
            <Button variant="outline" class="w-full" @click="navigateTo('/products')">
              <PackageIcon class="h-4 w-4 mr-2" />
              {{ t.dashboard.manageProducts }}
            </Button>
            <Button variant="outline" class="w-full" @click="navigateTo('/customers')">
              <UsersIcon class="h-4 w-4 mr-2" />
              {{ t.dashboard.manageCustomers }}
            </Button>
          </CardContent>
        </Card>

        <Card class="p-6">
          <CardHeader>
            <CardTitle>{{ t.dashboard.recentSales }}</CardTitle>
          </CardHeader>
          <CardContent>
            <div v-if="recentSales.length === 0" class="text-center py-4 text-muted-foreground">
              {{ t.dashboard.noRecentSales }}
            </div>
            <div v-else class="space-y-3">
              <div v-for="sale in recentSales.slice(0, 5)" :key="sale.id" class="flex justify-between items-center">
                <div>
                  <p class="font-medium text-foreground">{{ sale.customer?.name || t.dashboard.walkInCustomer }}</p>
                  <p class="text-sm text-muted-foreground">{{ formatDate(sale.createdAt) }}</p>
                </div>
                <p class="font-bold text-foreground">฿{{ formatCurrency(sale.grandTotal) }}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card class="p-6">
          <CardHeader>
            <CardTitle>{{ t.dashboard.systemStatus }}</CardTitle>
          </CardHeader>
          <CardContent class="space-y-3">
            <div class="flex justify-between items-center">
              <span class="text-sm text-muted-foreground">{{ t.dashboard.database }}</span>
              <span class="text-green-600 dark:text-green-400 text-sm font-medium">{{ t.dashboard.online }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-muted-foreground">{{ t.dashboard.apiServer }}</span>
              <span class="text-green-600 dark:text-green-400 text-sm font-medium">{{ t.dashboard.running }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-muted-foreground">{{ t.dashboard.lastBackup }}</span>
              <span class="text-sm text-muted-foreground">{{ formatDate(new Date()) }}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { 
  PillIcon, 
  DollarSignIcon, 
  ShoppingCartIcon, 
  AlertTriangleIcon,
  PlusIcon,
  PackageIcon,
  UsersIcon
} from 'lucide-vue-next'

// Components
import Card from '../components/ui/card.vue'
import CardHeader from '../components/ui/card-header.vue'
import CardContent from '../components/ui/card-content.vue'
import CardTitle from '../components/ui/card-title.vue'
import Button from '../components/ui/button.vue'
import { useLanguage } from '../composables/useLanguage'

const { t } = useLanguage()
const config = useRuntimeConfig()
interface DashboardStats {
  totalProducts: number
  totalRevenue: number
  totalSales: number
  lowStockProducts: number
}

interface Sale {
  id: string
  customer?: { name: string }
  createdAt: string
  grandTotal: number
}

const stats = ref<DashboardStats>({
  totalProducts: 0,
  totalRevenue: 0,
  totalSales: 0,
  lowStockProducts: 0
})
const recentSales = ref<Sale[]>([])

const formatCurrency = (amount: number) => {
  return amount.toFixed(2)
}

const formatDate = (date: string | Date) => {
  return new Date(date).toLocaleDateString()
}

const fetchDashboardData = async () => {
  try {
    const statsResponse = await $fetch(`${config.public.apiBase}/dashboard/stats`) as any
    const salesResponse = await $fetch(`${config.public.apiBase}/dashboard/recent-sales`) as any
    
    stats.value = statsResponse.stats
    recentSales.value = salesResponse.recentSales
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
  }
}

onMounted(() => {
  fetchDashboardData()
})
</script>
