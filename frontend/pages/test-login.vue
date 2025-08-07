<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-2xl mx-auto">
      <h1 class="text-3xl font-bold text-foreground mb-8">Login Button Test</h1>
      
      <Card class="p-6 mb-6">
        <h2 class="text-xl font-semibold mb-4">Current State</h2>
        <div class="space-y-2">
          <p><strong>Authenticated:</strong> {{ authStore.isAuthenticated }}</p>
          <p><strong>User:</strong> {{ authStore.user ? authStore.user.name : 'None' }}</p>
          <p><strong>Token:</strong> {{ authStore.token ? 'Present' : 'None' }}</p>
        </div>
      </Card>

      <Card class="p-6 mb-6">
        <h2 class="text-xl font-semibold mb-4">Actions</h2>
        <div class="space-x-4">
          <NuxtLink to="/login">
            <Button>Go to Login Page</Button>
          </NuxtLink>
          <Button @click="logout" variant="outline" v-if="authStore.isAuthenticated">
            Logout
          </Button>
        </div>
      </Card>

      <Card class="p-6">
        <h2 class="text-xl font-semibold mb-4">Navigation</h2>
        <div class="space-x-4">
          <NuxtLink to="/">
            <Button variant="outline">Dashboard</Button>
          </NuxtLink>
          <NuxtLink to="/auth-test">
            <Button variant="outline">Auth Test</Button>
          </NuxtLink>
        </div>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import Card from '../components/ui/card.vue'
import Button from '../components/ui/button.vue'

const authStore = useAuthStore()

const logout = async () => {
  await authStore.logout()
}
</script>
