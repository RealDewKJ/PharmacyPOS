<template>
  <div class="min-h-screen bg-background">
    <!-- Navigation -->
    <nav class="bg-card shadow-sm border-b border-border">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <div class="flex-shrink-0 flex items-center">
              <PillIcon class="h-8 w-8 text-primary" />
              <span class="ml-2 text-xl font-bold text-foreground">Pharmacy POS</span>
            </div>
          </div>
          
          <div class="flex items-center space-x-4">
            <LanguageSwitcher />
            <ThemeSwitcher />
            
            <!-- User Menu / Login Button -->
            <div class="relative">
              <!-- Show user menu when authenticated -->
              <div v-if="authStore.user" class="flex items-center space-x-2">
                <div class="h-8 w-8 bg-primary rounded-full flex items-center justify-center">
                  <span class="text-sm font-bold text-primary-foreground">
                    {{ authStore.user.name.charAt(0).toUpperCase() }}
                  </span>
                </div>
                <div class="hidden md:block">
                  <p class="text-sm font-medium text-foreground">{{ authStore.user.name }}</p>
                  <p class="text-xs text-muted-foreground">{{ authStore.user.role }}</p>
                </div>
                <Button variant="ghost" size="sm" @click="showUserMenu = !showUserMenu">
                  <ChevronDownIcon class="h-4 w-4" />
                </Button>
                
                <!-- Dropdown Menu -->
                <div v-if="showUserMenu" class="absolute right-0 mt-2 w-48 bg-card rounded-md shadow-lg border border-border z-50">
                  <div class="py-1">
                    <NuxtLink
                      to="/profile"
                      class="block px-4 py-2 text-sm text-foreground hover:bg-accent"
                      @click="showUserMenu = false"
                    >
                      <UserIcon class="h-4 w-4 mr-2 inline" />
                      Profile
                    </NuxtLink>
                    <button
                      @click="handleLogout"
                      class="block w-full text-left px-4 py-2 text-sm text-foreground hover:bg-accent"
                    >
                      <LogOutIcon class="h-4 w-4 mr-2 inline" />
                      Logout
                    </button>
                  </div>
                </div>
              </div>
              
              <!-- Show login button when not authenticated -->
              <div v-else>
                <NuxtLink to="/login">
                  <Button variant="outline" size="sm">
                    <UserIcon class="h-4 w-4 mr-2" />
                    Login
                  </Button>
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <div class="flex">
      <!-- Sidebar -->
      <div class="w-64 bg-card shadow-sm min-h-screen border-r border-border">
        <nav class="mt-5 px-2">
          <div class="space-y-1">
            <NuxtLink
              v-for="item in navigation"
              :key="item.name"
              :to="item.href"
              :class="[
                $route.path === item.href
                  ? 'bg-primary/10 border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                'group flex items-center px-3 py-2 text-sm font-medium border-l-4 transition-colors'
              ]"
            >
              <component :is="item.icon" class="mr-3 h-5 w-5" />
              {{ item.name }}
            </NuxtLink>
          </div>
        </nav>
      </div>

      <!-- Main content -->
      <div class="flex-1">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  PillIcon,
  HomeIcon,
  ShoppingCartIcon,
  PackageIcon,
  UsersIcon,
  BuildingIcon,
  FileTextIcon,
  BarChart3Icon,
  SettingsIcon,
  LogOutIcon,
  UserIcon,
  ChevronDownIcon
} from 'lucide-vue-next'
import ThemeSwitcher from '../components/ui/theme-switcher.vue'
import LanguageSwitcher from '../components/ui/language-switcher.vue'
import Button from '../components/ui/button.vue'

const authStore = useAuthStore()
const showUserMenu = ref(false)

const navigation = [
  { name: 'Point of Sale', href: '/pos', icon: ShoppingCartIcon },
  { name: 'Products', href: '/products', icon: PackageIcon },
  { name: 'Customers', href: '/customers', icon: UsersIcon },
  { name: 'Suppliers', href: '/suppliers', icon: BuildingIcon },
  { name: 'Sales', href: '/sales', icon: BarChart3Icon },
  { name: 'Prescriptions', href: '/prescriptions', icon: FileTextIcon },
  { name: 'Settings', href: '/settings', icon: SettingsIcon },
  { name: 'Dashboard', href: '/', icon: HomeIcon },
]

const handleLogout = async () => {
  showUserMenu.value = false
  await authStore.logout()
}

// Close user menu when clicking outside
onMounted(() => {
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement
    if (!target.closest('.relative')) {
      showUserMenu.value = false
    }
  })
})
</script>
