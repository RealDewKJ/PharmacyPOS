<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-2xl mx-auto">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-foreground">Profile</h1>
        <p class="text-muted-foreground">Manage your account information</p>
      </div>

      <Card class="p-6">
        <div v-if="authStore.user" class="space-y-6">
          <div class="flex items-center space-x-4">
            <div class="h-16 w-16 bg-primary rounded-full flex items-center justify-center">
              <span class="text-2xl font-bold text-primary-foreground">
                {{ authStore.user.name.charAt(0).toUpperCase() }}
              </span>
            </div>
            <div>
              <h2 class="text-xl font-semibold text-foreground">{{ authStore.user.name }}</h2>
              <p class="text-muted-foreground">{{ authStore.user.email }}</p>
              <span class="inline-block px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full mt-1">
                {{ authStore.user.role }}
              </span>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-foreground mb-2">Name</label>
              <Input v-model="form.name" placeholder="Enter your name" />
            </div>
            <div>
              <label class="block text-sm font-medium text-foreground mb-2">Email</label>
              <Input v-model="form.email" type="email" placeholder="Enter your email" disabled />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-foreground mb-2">Current Password</label>
              <Input v-model="form.currentPassword" type="password" placeholder="Enter current password" />
            </div>
            <div>
              <label class="block text-sm font-medium text-foreground mb-2">New Password</label>
              <Input v-model="form.newPassword" type="password" placeholder="Enter new password" />
            </div>
          </div>

          <div v-if="message" class="text-sm text-center" :class="messageType === 'success' ? 'text-green-600' : 'text-red-600'">
            {{ message }}
          </div>

          <div class="flex space-x-4">
            <Button @click="updateProfile" :disabled="loading">
              <Loader2Icon v-if="loading" class="h-4 w-4 mr-2 animate-spin" />
              Update Profile
            </Button>
            <Button variant="outline" @click="logout">
              Logout
            </Button>
          </div>
        </div>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Loader2Icon } from 'lucide-vue-next'
import Card from '../components/ui/card.vue'
import Input from '../components/ui/input.vue'
import Button from '../components/ui/button.vue'

const authStore = useAuthStore()
const api = useApi()

const form = ref({
  name: '',
  email: '',
  currentPassword: '',
  newPassword: ''
})

const loading = ref(false)
const message = ref('')
const messageType = ref<'success' | 'error'>('success')

onMounted(() => {
  if (authStore.user) {
    form.value.name = authStore.user.name
    form.value.email = authStore.user.email
  }
})

const updateProfile = async () => {
  loading.value = true
  message.value = ''

  try {
    const updateData: any = { name: form.value.name }
    
    if (form.value.newPassword) {
      updateData.currentPassword = form.value.currentPassword
      updateData.newPassword = form.value.newPassword
    }

    await api.put('/users/profile', updateData)
    
    // Refresh user data
    await authStore.refreshUser()
    
    message.value = 'Profile updated successfully'
    messageType.value = 'success'
    
    // Clear password fields
    form.value.currentPassword = ''
    form.value.newPassword = ''
  } catch (error: any) {
    message.value = error.data?.message || 'Failed to update profile'
    messageType.value = 'error'
  } finally {
    loading.value = false
  }
}

const logout = async () => {
  await authStore.logout()
}
</script>
