<template>
  <div class="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
    <!-- Theme Toggle in top right corner -->
    <div class="absolute top-4 right-4">
      <SimpleThemeToggle />
    </div>
    
    <div class="max-w-md w-full space-y-8">
      <div>
        <div class="mx-auto h-12 w-12 bg-primary rounded-lg flex items-center justify-center">
          <PillIcon class="h-8 w-8 text-primary-foreground" />
        </div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-foreground">
          Pharmacy POS
        </h2>
        <p class="mt-2 text-center text-sm text-muted-foreground">
          Sign in to your account
        </p>
      </div>
      
      <Card class="p-6">
        <form @submit.prevent="handleLogin" class="space-y-6">
          <div>
            <label for="email" class="block text-sm font-medium text-foreground">
              Email address
            </label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              placeholder="Enter your email"
              class="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-foreground">
              Password
            </label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              required
              placeholder="Enter your password"
              class="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <div v-if="error" class="text-destructive text-sm text-center">
            {{ error }}
          </div>

          <Button type="submit" class="w-full" :disabled="authStore.loading">
            <Loader2Icon v-if="authStore.loading" class="h-4 w-4 mr-2 animate-spin" />
            {{ authStore.loading ? 'Signing in...' : 'Sign in' }}
          </Button>
        </form>

        <div class="mt-6 text-center">
          <p class="text-sm text-muted-foreground">
            Demo credentials:
          </p>
          <p class="text-xs text-muted-foreground/70 mt-1">
            Email: admin@pharmacy.com<br>
            Password: admin123
          </p>
        </div>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { PillIcon, Loader2Icon } from 'lucide-vue-next'
import Card from '../components/ui/card.vue'
import Button from '../components/ui/button.vue'

const authStore = useAuthStore()
const router = useRouter()

const form = reactive({
  email: '',
  password: ''
})

const error = ref('')

watch(() => form.email, (newVal) => {
  console.log('Email changed to:', newVal)
})

watch(() => form.password, (newVal) => {
  console.log('Password changed to:', newVal)
})

const handleLogin = async () => {
  error.value = ''
  console.log('form.email', form.email)
  console.log('form.password', form.password)
  try {
    await authStore.login(form.email, form.password)
    await router.push('/')
  } catch (err: any) {
    error.value = err.message || 'Login failed. Please try again.'
  }
}
</script>
