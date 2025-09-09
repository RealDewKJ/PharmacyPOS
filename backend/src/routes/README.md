# Routes Directory - Clean Architecture

This directory contains all API routes organized following Clean Architecture principles.

## Structure

```
src/routes/
├── index.ts              # Main routes exports
├── auth/                 # Authentication routes
│   ├── index.ts         # Route definitions
│   ├── controllers.ts   # Business logic
│   └── schemas.ts       # Validation schemas
├── products/            # Product management routes
│   ├── index.ts
│   ├── controllers.ts
│   └── schemas.ts
├── categories/          # Category management routes
│   ├── index.ts
│   ├── controllers.ts
│   └── schemas.ts
└── README.md           # This file
```

## Architecture Benefits

### 1. **Separation of Concerns**

- **Controllers**: Business logic and data processing
- **Schemas**: Request/response validation
- **Routes**: HTTP handling and routing

### 2. **Reusability**

- Controllers can be reused across different routes
- Schemas can be shared between similar endpoints

### 3. **Maintainability**

- Easy to locate and modify specific functionality
- Clear structure for team collaboration

### 4. **Testability**

- Each layer can be tested independently
- Controllers can be unit tested without HTTP concerns

## File Responsibilities

### `controllers.ts`

- Contains business logic
- Handles data processing
- Interacts with database through Prisma
- Returns structured data

### `schemas.ts`

- Defines request/response validation schemas
- Uses Elysia's `t` (TypeBox) for type safety
- Ensures data integrity

### `index.ts`

- Defines HTTP routes and endpoints
- Handles request/response
- Applies middleware (auth, validation)
- Maps to controller methods

## Example Usage

```typescript
// Import specific route
import { authRoutes } from "./routes/auth";

// Import all routes
import { authRoutes, productRoutes } from "./routes";

// Use in main app
app.use(authRoutes);
app.use(productRoutes);
```

## Adding New Routes

1. Create a new directory (e.g., `suppliers/`)
2. Create `controllers.ts`, `schemas.ts`, and `index.ts`
3. Export the route from `routes/index.ts`
4. Import and use in main application

## Route Groups

- **Public Routes**: No authentication required
- **Protected Routes**: Require authentication middleware

## Best Practices

1. **Keep controllers pure** - No HTTP-specific logic
2. **Validate everything** - Use schemas for all inputs/outputs
3. **Handle errors gracefully** - Return consistent error responses
4. **Document endpoints** - Use Swagger/OpenAPI annotations
5. **Follow naming conventions** - Use descriptive names
