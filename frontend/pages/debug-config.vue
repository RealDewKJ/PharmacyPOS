<template>
  <div class="p-8">
    <h1 class="text-2xl font-bold mb-4">Runtime Config Debug</h1>
    
    <div class="bg-gray-100 p-4 rounded-lg mb-4">
      <h2 class="text-lg font-semibold mb-2">API Base URL:</h2>
      <code class="bg-white p-2 rounded border">{{ config.public.apiBase }}</code>
    </div>

    <div class="bg-gray-100 p-4 rounded-lg mb-4">
      <h2 class="text-lg font-semibold mb-2">Full Runtime Config:</h2>
      <pre class="bg-white p-2 rounded border overflow-auto text-sm">{{ JSON.stringify(config, null, 2) }}</pre>
    </div>

    <div class="bg-gray-100 p-4 rounded-lg">
      <h2 class="text-lg font-semibold mb-2">Environment Variables:</h2>
      <pre class="bg-white p-2 rounded border overflow-auto text-sm">{{ JSON.stringify(envVars, null, 2) }}</pre>
    </div>
  </div>
</template>

<script setup>
const config = useRuntimeConfig()

// Get environment variables (only public ones are available on client)
const envVars = {
  API_BASE: process.env.API_BASE || 'Not set',
  NODE_ENV: process.env.NODE_ENV || 'Not set'
}

// Log to console as well
console.log('Runtime Config:', config)
console.log('API Base URL:', config.public.apiBase)
</script>
