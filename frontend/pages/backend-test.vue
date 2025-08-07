<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-2xl mx-auto">
      <h1 class="text-3xl font-bold text-foreground mb-8">Backend Connection Test</h1>
      
      <Card class="p-6 mb-6">
        <h2 class="text-xl font-semibold mb-4">Configuration</h2>
        <div class="space-y-2">
          <p><strong>API Base URL:</strong> {{ config.public.apiBase }}</p>
          <p><strong>Environment:</strong> {{ process.env.NODE_ENV }}</p>
        </div>
      </Card>

      <Card class="p-6 mb-6">
        <h2 class="text-xl font-semibold mb-4">Connection Tests</h2>
        <div class="space-y-4">
          <div>
            <Button @click="testConnection" :disabled="testing">
              <Loader2Icon v-if="testing" class="h-4 w-4 mr-2 animate-spin" />
              Test Backend Connection
            </Button>
          </div>
          
          <div v-if="connectionResult" class="p-4 bg-accent rounded">
            <pre class="text-sm">{{ JSON.stringify(connectionResult, null, 2) }}</pre>
          </div>
        </div>
      </Card>

      <Card class="p-6 mb-6">
        <h2 class="text-xl font-semibold mb-4">Login Test</h2>
        <div class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-foreground mb-2">Email</label>
              <Input v-model="testEmail" placeholder="admin@pharmacy.com" />
            </div>
            <div>
              <label class="block text-sm font-medium text-foreground mb-2">Password</label>
              <Input v-model="testPassword" type="password" placeholder="admin123" />
            </div>
          </div>
          
          <div>
            <Button @click="testLogin" :disabled="testingLogin">
              <Loader2Icon v-if="testingLogin" class="h-4 w-4 mr-2 animate-spin" />
              Test Login
            </Button>
          </div>
          
          <div v-if="loginResult" class="p-4 bg-accent rounded">
            <pre class="text-sm">{{ JSON.stringify(loginResult, null, 2) }}</pre>
          </div>
        </div>
      </Card>

      <Card class="p-6">
        <h2 class="text-xl font-semibold mb-4">Troubleshooting</h2>
        <div class="space-y-2 text-sm">
          <p><strong>1. Check if backend is running:</strong></p>
          <code class="block bg-muted p-2 rounded">cd backend && npm run dev</code>
          
          <p><strong>2. Check backend URL:</strong></p>
          <code class="block bg-muted p-2 rounded">{{ config.public.apiBase }}</code>
          
          <p><strong>3. Test backend directly:</strong></p>
          <code class="block bg-muted p-2 rounded">curl {{ config.public.apiBase }}</code>
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
import Input from '../components/ui/input.vue'

const config = useRuntimeConfig()

const testing = ref(false)
const testingLogin = ref(false)
const connectionResult = ref(null)
const loginResult = ref(null)
const testEmail = ref('admin@pharmacy.com')
const testPassword = ref('admin123')

const testConnection = async () => {
  testing.value = true
  connectionResult.value = null
  
  try {
    const response = await $fetch(`${config.public.apiBase}/`)
    connectionResult.value = {
      success: true,
      data: response,
      status: 'Connected successfully'
    }
  } catch (error: any) {
    connectionResult.value = {
      success: false,
      error: {
        message: error.message,
        status: error.status,
        statusCode: error.statusCode,
        data: error.data
      },
      status: 'Connection failed'
    }
  } finally {
    testing.value = false
  }
}

const testLogin = async () => {
  testingLogin.value = true
  loginResult.value = null
  
  try {
    const response = await $fetch(`${config.public.apiBase}/auth/login`, {
      method: 'POST',
      body: {
        email: testEmail.value,
        password: testPassword.value
      }
    })
    
    loginResult.value = {
      success: true,
      data: {
        user: response.user,
        token: response.token ? `${response.token.substring(0, 20)}...` : null
      },
      status: 'Login successful'
    }
  } catch (error: any) {
    loginResult.value = {
      success: false,
      error: {
        message: error.message,
        status: error.status,
        statusCode: error.statusCode,
        data: error.data
      },
      status: 'Login failed'
    }
  } finally {
    testingLogin.value = false
  }
}
</script>
