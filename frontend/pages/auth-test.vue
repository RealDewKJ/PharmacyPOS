<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-2xl mx-auto">
      <h1 class="text-3xl font-bold text-foreground mb-8">Authentication Test</h1>
      
      <Card class="p-6 mb-6">
        <h2 class="text-xl font-semibold mb-4">Current Auth State</h2>
        <div class="space-y-2">
          <p><strong>Authenticated:</strong> {{ authStore.isAuthenticated }}</p>
          <p><strong>Loading:</strong> {{ authStore.loading }}</p>
          <p><strong>Token:</strong> {{ authStore.token ? 'Present' : 'None' }}</p>
          <p><strong>User:</strong> {{ authStore.user ? authStore.user.name : 'None' }}</p>
          <p><strong>Role:</strong> {{ authStore.user?.role || 'None' }}</p>
        </div>
      </Card>

      <Card class="p-6 mb-6">
        <h2 class="text-xl font-semibold mb-4">Role Tests</h2>
        <div class="space-y-2">
          <p><strong>Is Admin:</strong> {{ authStore.isAdmin }}</p>
          <p><strong>Is Pharmacist:</strong> {{ authStore.isPharmacist }}</p>
          <p><strong>Is Cashier:</strong> {{ authStore.isCashier }}</p>
          <p><strong>Can Access Admin:</strong> {{ authStore.canAccess(['ADMIN']) }}</p>
          <p><strong>Can Access Admin or Pharmacist:</strong> {{ authStore.canAccess(['ADMIN', 'PHARMACIST']) }}</p>
        </div>
      </Card>

      <Card class="p-6 mb-6">
        <h2 class="text-xl font-semibold mb-4">API Test</h2>
        <div class="space-y-4">
          <Button @click="testApiCall" :disabled="apiLoading">
            <Loader2Icon v-if="apiLoading" class="h-4 w-4 mr-2 animate-spin" />
            Test API Call
          </Button>
          <div v-if="apiResult" class="p-4 bg-accent rounded">
            <pre class="text-sm">{{ JSON.stringify(apiResult, null, 2) }}</pre>
          </div>
        </div>
      </Card>

      <Card class="p-6">
        <h2 class="text-xl font-semibold mb-4">Actions</h2>
        <div class="space-x-4">
          <Button @click="refreshUser" :disabled="authStore.loading">
            Refresh User
          </Button>
          <Button @click="logout" variant="outline">
            Logout
          </Button>
        </div>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Loader2Icon } from 'lucide-vue-next'
import Card from '../components/ui/card.vue'
import Button from '../components/ui/button.vue'

const authStore = useAuthStore()
const api = useApi()

const apiLoading = ref(false)
const apiResult = ref(null)

const testApiCall = async () => {
  apiLoading.value = true
  try {
    const result = await api.get('/auth/me')
    apiResult.value = result
  } catch (error: any) {
    apiResult.value = { error: error.message }
  } finally {
    apiLoading.value = false
  }
}

const refreshUser = async () => {
  await authStore.refreshUser()
}

const logout = async () => {
  await authStore.logout()
}
</script>
