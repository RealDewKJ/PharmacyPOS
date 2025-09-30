# Eden API Type-Safe Integration Guide

This guide explains how to use the type-safe Eden API integration in the Pharmacy POS frontend.

## Overview

Eden Treaty provides end-to-end type safety between your Elysia backend and frontend. This means:

- TypeScript types are automatically inferred from your backend API
- Compile-time error checking for API calls
- IntelliSense support for all API endpoints
- Runtime type validation

## Setup

The Eden API is already configured and ready to use. The setup includes:

1. **Backend**: Eden Treaty instance exported from `backend/src/eden.ts`
2. **Frontend**: Type-safe client in `frontend/lib/api.ts`
3. **Composables**: Easy-to-use composable in `frontend/composables/useEdenApi.ts`

## Usage

### Basic Usage

```vue
<script setup lang="ts">
import { useEdenApi } from "~/composables/useEdenApi";

const edenApi = useEdenApi();

// All API calls are type-safe
const response = await edenApi.auth.login("user@example.com", "password");
// response is typed as { token?: string; user?: any; sessionId?: string; error?: string }

const products = await edenApi.products.getAll();
// products is typed based on your backend response
</script>
```

### Available API Methods

#### Authentication

```typescript
// Login
const loginResponse = await edenApi.auth.login(email, password);

// Register
const registerResponse = await edenApi.auth.register(
  email,
  password,
  name,
  role
);

// Get profile
const profile = await edenApi.auth.getProfile();

// Logout
await edenApi.auth.logout(sessionId);

// Logout all sessions
await edenApi.auth.logoutAll();

// Refresh session
await edenApi.auth.refreshSession(sessionId);

// Get active sessions
const sessions = await edenApi.auth.getSessions();
```

#### Products

```typescript
// Get all products
const products = await edenApi.products.getAll();

// Get product by ID
const product = await edenApi.products.getById(id);

// Create product
const newProduct = await edenApi.products.create(productData);

// Update product
const updatedProduct = await edenApi.products.update(id, updateData);

// Delete product
await edenApi.products.delete(id);
```

#### Categories

```typescript
const categories = await edenApi.categories.getAll();
const category = await edenApi.categories.getById(id);
const newCategory = await edenApi.categories.create(categoryData);
const updatedCategory = await edenApi.categories.update(id, updateData);
await edenApi.categories.delete(id);
```

#### Suppliers

```typescript
const suppliers = await edenApi.suppliers.getAll();
const supplier = await edenApi.suppliers.getById(id);
const newSupplier = await edenApi.suppliers.create(supplierData);
const updatedSupplier = await edenApi.suppliers.update(id, updateData);
await edenApi.suppliers.delete(id);
```

#### Customers

```typescript
const customers = await edenApi.customers.getAll();
const customer = await edenApi.customers.getById(id);
const newCustomer = await edenApi.customers.create(customerData);
const updatedCustomer = await edenApi.customers.update(id, updateData);
await edenApi.customers.delete(id);
```

#### Sales

```typescript
const sales = await edenApi.sales.getAll();
const sale = await edenApi.sales.getById(id);
const newSale = await edenApi.sales.create(saleData);
const updatedSale = await edenApi.sales.update(id, updateData);
await edenApi.sales.delete(id);
```

#### Purchases

```typescript
const purchases = await edenApi.purchases.getAll();
const purchase = await edenApi.purchases.getById(id);
const newPurchase = await edenApi.purchases.create(purchaseData);
const updatedPurchase = await edenApi.purchases.update(id, updateData);
await edenApi.purchases.delete(id);
```

#### Prescriptions

```typescript
const prescriptions = await edenApi.prescriptions.getAll();
const prescription = await edenApi.prescriptions.getById(id);
const newPrescription = await edenApi.prescriptions.create(prescriptionData);
const updatedPrescription = await edenApi.prescriptions.update(id, updateData);
await edenApi.prescriptions.delete(id);
```

#### Users

```typescript
const users = await edenApi.users.getAll();
const user = await edenApi.users.getById(id);
const newUser = await edenApi.users.create(userData);
const updatedUser = await edenApi.users.update(id, updateData);
await edenApi.users.delete(id);
```

#### Dashboard

```typescript
const stats = await edenApi.dashboard.getStats();
```

#### Health Check

```typescript
const health = await edenApi.health.check();
```

### Error Handling

All API methods return responses that may contain an `error` field:

```typescript
const response = await edenApi.auth.login(email, password);

if (response.error) {
  console.error("Login failed:", response.error);
  // Handle error
} else {
  // Success - use response.token, response.user, etc.
  console.log("Login successful:", response.user);
}
```

### Using with Legacy API

The existing `useApi` composable has been updated to include Eden API:

```typescript
import { useApi } from "~/composables/useApi";

const api = useApi();

// Legacy methods (still available)
const response = await api.get("/products");

// New type-safe Eden methods
const products = await api.eden.products.getAll();
```

### Raw API Client

For advanced usage, you can access the raw Eden client:

```typescript
import { useEdenApi } from "~/composables/useEdenApi";

const edenApi = useEdenApi();

// Access raw API client
const rawResponse = await edenApi.api.products.get();
```

## Type Safety Benefits

1. **Compile-time checking**: TypeScript will catch API errors at compile time
2. **IntelliSense**: Full autocomplete support for all API methods and parameters
3. **Response typing**: All responses are properly typed based on your backend schema
4. **Parameter validation**: Request parameters are type-checked
5. **Error handling**: Consistent error response typing

## Example Component

See `frontend/components/EdenApiExample.vue` for a complete example of using the Eden API in a Vue component.

## Migration from Legacy API

To migrate from the legacy `$fetch` API to Eden:

1. Replace `$fetch` calls with Eden API methods
2. Update error handling to check for `response.error`
3. Use the typed response objects instead of `any`
4. Remove manual URL construction and headers

### Before (Legacy)

```typescript
const response = await $fetch("/auth/login", {
  method: "POST",
  body: { email, password },
});
```

### After (Eden)

```typescript
const response = await edenApi.auth.login(email, password);
```

## Configuration

The Eden client is configured in `frontend/lib/api.ts` and uses the `NUXT_PUBLIC_API_BASE_URL` environment variable for the backend URL.

## Troubleshooting

1. **Type errors**: Make sure your backend types are up to date
2. **Connection issues**: Check that the backend is running and accessible
3. **Authentication**: Ensure tokens are properly set in the auth store
4. **CORS**: Verify CORS configuration in the backend

## Next Steps

1. Update existing components to use Eden API
2. Add more specific type definitions for your domain models
3. Implement error boundaries for better error handling
4. Add loading states and optimistic updates
