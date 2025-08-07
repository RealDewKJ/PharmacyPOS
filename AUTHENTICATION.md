# Authentication System Documentation

## Overview

The Pharmacy POS system implements a complete JWT-based authentication system with role-based access control (RBAC) for both frontend and backend.

## Backend Authentication

### Features

- JWT token-based authentication
- Password hashing with bcrypt
- Role-based access control (ADMIN, PHARMACIST, CASHIER)
- User profile management
- Token verification middleware

### API Endpoints

#### POST /auth/login

Authenticate user with email and password.

**Request:**

```json
{
  "email": "admin@pharmacy.com",
  "password": "admin123"
}
```

**Response:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user-id",
    "email": "admin@pharmacy.com",
    "name": "Admin User",
    "role": "ADMIN"
  }
}
```

#### GET /auth/me

Get current user profile (requires authentication).

**Headers:**

```
Authorization: Bearer <token>
```

**Response:**

```json
{
  "user": {
    "id": "user-id",
    "email": "admin@pharmacy.com",
    "name": "Admin User",
    "role": "ADMIN",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### POST /auth/logout

Logout endpoint (client-side token removal).

#### PUT /users/profile

Update user profile (requires authentication).

**Request:**

```json
{
  "name": "New Name",
  "currentPassword": "old-password",
  "newPassword": "new-password"
}
```

### Middleware

#### Auth Middleware

Located in `backend/src/middleware/auth.ts`, this middleware:

- Extracts JWT token from Authorization header
- Verifies token validity
- Fetches user data from database
- Adds user object to request context

### Database Schema

```sql
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  name      String
  role      Role     @default(CASHIER)
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

enum Role {
  ADMIN
  PHARMACIST
  CASHIER
}
```

## Frontend Authentication

### Features

- Pinia store for state management
- Automatic token handling
- Role-based route protection
- Persistent authentication
- User profile management

### Store (Pinia)

#### Auth Store (`frontend/stores/auth.ts`)

Manages authentication state and provides:

**State:**

- `user`: Current user object
- `token`: JWT token
- `isAuthenticated`: Authentication status
- `loading`: Loading state

**Getters:**

- `isAdmin`: Check if user is admin
- `isPharmacist`: Check if user is pharmacist
- `isCashier`: Check if user is cashier
- `canAccess(roles)`: Check if user can access specific roles

**Actions:**

- `login(email, password)`: Authenticate user
- `logout()`: Logout user
- `checkAuth()`: Check authentication status
- `refreshUser()`: Refresh user data

### Composables

#### useApi (`frontend/composables/useApi.ts`)

Provides authenticated API calls with automatic token handling:

```typescript
const api = useApi();

// GET request
const data = await api.get("/users");

// POST request
const result = await api.post("/auth/login", { email, password });

// PUT request
const updated = await api.put("/users/profile", { name: "New Name" });
```

### Middleware

#### Auth Middleware (`frontend/middleware/auth.ts`)

Protects routes requiring authentication:

- Redirects to login if not authenticated
- Redirects to dashboard if already logged in

#### Role Middleware (`frontend/middleware/role.ts`)

Protects routes based on user roles:

- Checks if user has required roles
- Redirects if access denied

### Pages

#### Login Page (`frontend/pages/login.vue`)

- User authentication form
- Demo credentials display
- Error handling
- Loading states

#### Profile Page (`frontend/pages/profile.vue`)

- User profile management
- Password change functionality
- Logout option

## Setup Instructions

### 1. Backend Setup

```bash
cd backend
npm install
npm run db:push
npm run db:seed
npm run dev
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### 3. Environment Variables

Create `.env` file in backend directory:

```env
JWT_SECRET=your-secret-key-here
DATABASE_URL="file:./dev.db"
```

### 4. Database Seeding

The seed script creates an admin user:

- Email: `admin@pharmacy.com`
- Password: `admin123`
- Role: `ADMIN`

## Usage Examples

### Protected Routes

Add middleware to pages that require authentication:

```vue
<script setup>
definePageMeta({
  middleware: ["auth"],
});
</script>
```

### Role-Based Access

```vue
<script setup>
definePageMeta({
  middleware: ["auth", "role"],
  meta: {
    roles: ["ADMIN", "PHARMACIST"],
  },
});
</script>
```

### Conditional Rendering

```vue
<template>
  <div v-if="authStore.isAdmin">Admin only content</div>

  <div v-if="authStore.canAccess(['ADMIN', 'PHARMACIST'])">
    Admin or Pharmacist content
  </div>
</template>
```

### API Calls

```vue
<script setup>
const api = useApi();

const fetchData = async () => {
  try {
    const data = await api.get("/products");
    // Handle data
  } catch (error) {
    // Handle error (automatic logout on 401)
  }
};
</script>
```

## Security Features

1. **JWT Tokens**: Secure, stateless authentication
2. **Password Hashing**: bcrypt with salt rounds
3. **Role-Based Access**: Granular permission control
4. **Token Verification**: Server-side token validation
5. **Automatic Logout**: On token expiration or 401 errors
6. **CORS Protection**: Configured for security
7. **Input Validation**: Request body validation

## Testing

Visit `/auth-test` page to test authentication functionality:

- Current auth state
- Role permissions
- API calls
- User actions

## Troubleshooting

### Common Issues

1. **Token Expired**: User will be automatically logged out
2. **Invalid Credentials**: Check email/password combination
3. **CORS Errors**: Ensure backend CORS is configured correctly
4. **Database Connection**: Verify DATABASE_URL in environment

### Debug Mode

Enable debug logging in backend by setting:

```env
DEBUG=true
```

## Future Enhancements

1. **Token Refresh**: Implement refresh token mechanism
2. **Two-Factor Authentication**: Add 2FA support
3. **Session Management**: Track active sessions
4. **Audit Logging**: Log authentication events
5. **Password Policies**: Enforce password requirements
