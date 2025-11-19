# API Response & Error Handling Best Practices

## 📋 Overview

This document outlines the best practices for handling API responses and errors in our Pharmacy POS system using ElysiaJS and TypeScript.

## 🏗️ Architecture Pattern

We follow a **3-layer architecture** with clear separation of concerns:

```
Controller (index.ts) → Service (service.ts) → Database (Prisma)
     ↓                      ↓
  HTTP Layer          Business Logic
```

## 📁 File Structure

```
backend/src/
├── types/
│   ├── common-responses.ts    # Common response schemas
│   └── errors.ts              # Custom error classes
├── modules/
│   └── [module-name]/
│       ├── model.ts           # Data validation schemas
│       ├── service.ts         # Business logic
│       └── index.ts           # HTTP routes
```

## 🎯 Response Structure

### Success Response Format

```typescript
{
  success: true,
  data: T,                    // Actual data
  message?: string,           // Optional success message
  timestamp: string           // ISO timestamp
}
```

### Error Response Format

```typescript
{
  success: false,
  error: {
    message: string,          // Human-readable error message
    code: string,             // Error code for programmatic handling
    statusCode: number,       // HTTP status code
    timestamp: string,        // ISO timestamp
    path?: string            // Optional API path where error occurred
  }
}
```

## 🔧 Implementation Guide

### 1. Model Layer (`model.ts`)

**Purpose:** Define data structures and validation schemas

```typescript
import { t } from 'elysia'
import { CommonResponses } from '../../types/common-responses'

export namespace ModuleModel {
  // Base data schema
  export const entity = t.Object({
    id: t.String(),
    name: t.String(),
    // ... other fields
  })
  export type Entity = typeof entity.static

  // Request schemas
  export const createEntityBody = t.Object({
    name: t.String(),
    // ... other fields
  })
  export type CreateEntityBody = typeof createEntityBody.static

  // Data schemas for success responses
  export const entityData = t.Object({
    entity: entity
  })
  export type EntityData = typeof entityData.static

  // Response schemas using common structure
  export const createEntityResponse = t.Union([
    t.Object({
      success: t.Literal(true),
      data: entityData,
      message: t.Optional(t.String()),
      timestamp: t.String()
    }),
    CommonResponses.errorResponse
  ])
  export type CreateEntityResponse = typeof createEntityResponse.static
}
```

### 2. Service Layer (`service.ts`)

**Purpose:** Handle business logic and data operations

```typescript
import { CommonResponses } from '../../types/common-responses'
import { CustomError } from '../../types/errors'
import type { ModuleModel } from './model'

export abstract class Module {
  static async createEntity(data: ModuleModel.CreateEntityBody): Promise<ModuleModel.CreateEntityResponse> {
    try {
      // Business logic validation
      if (someCondition) {
        throw new CustomError('Error message')
      }

      // Database operation
      const entity = await prisma.entity.create({ data })

      // Return success response
      return CommonResponses.createSuccessData({
        entity: this.formatEntity(entity)
      }, 'Entity created successfully')
    } catch (error) {
      if (error instanceof CustomError) {
        throw error  // Re-throw custom errors
      }
      // Return generic error response
      return CommonResponses.createErrorData(
        'Failed to create entity',
        'ENTITY_CREATE_ERROR',
        500
      )
    }
  }

  private static formatEntity(entity: any): ModuleModel.Entity {
    return {
      ...entity,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString()
    }
  }
}
```

### 3. Controller Layer (`index.ts`)

**Purpose:** Handle HTTP routing and request validation

```typescript
import { Elysia } from 'elysia'
import { Module } from './service'
import { ModuleModel } from './model'

export const module = new Elysia({ prefix: '/module' })
  .post(
    '/',
    async ({ body }) => {
      return await Module.createEntity(body)
    },
    {
      body: ModuleModel.createEntityBody,
      response: ModuleModel.createEntityResponse,
      detail: {
        tags: ['Module'],
        summary: 'Create Entity',
        description: 'Create a new entity'
      }
    }
  )
```

## 🚨 Error Handling Strategy

### Custom Error Classes

```typescript
// In types/errors.ts
export class EntityNotFoundError extends BusinessLogicError {
  constructor(message: string = 'Entity not found') {
    super(message, 404, 'ENTITY_NOT_FOUND')
  }
}

export class EntityAlreadyExistsError extends BusinessLogicError {
  constructor(message: string = 'Entity already exists') {
    super(message, 409, 'ENTITY_ALREADY_EXISTS')
  }
}
```

### Error Handling Flow

1. **Service Layer:** Throw custom errors for business logic violations
2. **Controller Layer:** Let Elysia handle HTTP error responses
3. **Client:** Receive consistent error format

```typescript
// Service throws error
throw new EntityNotFoundError('Entity with ID 123 not found')

// Elysia automatically converts to HTTP response
// Client receives:
{
  "success": false,
  "error": {
    "message": "Entity with ID 123 not found",
    "code": "ENTITY_NOT_FOUND",
    "statusCode": 404,
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
}
```

## 📊 Common Response Helpers

### Success Response Helper

```typescript
// Create success response
const response = CommonResponses.createSuccessData(
  { entity: formattedEntity },  // data
  'Entity created successfully' // message
)
```

### Error Response Helper

```typescript
// Create error response
const response = CommonResponses.createErrorData(
  'Failed to create entity',    // message
  'ENTITY_CREATE_ERROR',        // code
  500,                          // statusCode
  '/api/entities'               // path (optional)
)
```

## 🎨 Response Examples

### Successful GET Request

```json
{
  "success": true,
  "data": {
    "customers": [
      {
        "id": "123",
        "name": "John Doe",
        "email": "john@example.com",
        "isActive": true,
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    ]
  },
  "message": "Customers retrieved successfully",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Successful POST Request

```json
{
  "success": true,
  "data": {
    "customer": {
      "id": "123",
      "name": "John Doe",
      "email": "john@example.com",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  },
  "message": "Customer created successfully",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Error Response

```json
{
  "success": false,
  "error": {
    "message": "Customer not found",
    "code": "CUSTOMER_NOT_FOUND",
    "statusCode": 404,
    "timestamp": "2024-01-01T00:00:00.000Z",
    "path": "/api/customers/123"
  }
}
```

## ✅ Best Practices Checklist

### Model Layer
- [ ] Use namespace pattern for organization
- [ ] Define both Elysia schema and TypeScript types
- [ ] Use CommonResponses for consistent response structure
- [ ] Separate data schemas from response schemas

### Service Layer
- [ ] Use abstract class for static methods
- [ ] Throw custom errors for business logic violations
- [ ] Use CommonResponses helpers for responses
- [ ] Handle database errors gracefully
- [ ] Format data consistently (dates, etc.)

### Controller Layer
- [ ] Keep controllers thin - only routing and validation
- [ ] Use proper HTTP methods and status codes
- [ ] Include Swagger documentation
- [ ] Let Elysia handle error conversion

### Error Handling
- [ ] Create specific error classes for different scenarios
- [ ] Use appropriate HTTP status codes
- [ ] Provide meaningful error messages
- [ ] Include error codes for programmatic handling
- [ ] Log errors for debugging

### Response Consistency
- [ ] Always include success flag
- [ ] Use consistent data structure
- [ ] Include timestamps
- [ ] Provide optional success messages
- [ ] Use proper error codes and status codes

## 🔍 Testing Response Structure

### Unit Test Example

```typescript
import { Module } from './service'
import { ModuleModel } from './model'

describe('Module Service', () => {
  it('should return success response for valid data', async () => {
    const result = await Module.createEntity({ name: 'Test' })
    
    expect(result).toMatchObject({
      success: true,
      data: expect.any(Object),
      timestamp: expect.any(String)
    })
  })

  it('should return error response for invalid data', async () => {
    const result = await Module.createEntity({ name: '' })
    
    expect(result).toMatchObject({
      success: false,
      error: {
        message: expect.any(String),
        code: expect.any(String),
        statusCode: expect.any(Number),
        timestamp: expect.any(String)
      }
    })
  })
})
```

## 🚀 Migration Guide

### From Old Response Format

**Before:**
```typescript
return { customer: formattedCustomer }
return { error: 'Something went wrong' }
```

**After:**
```typescript
return CommonResponses.createSuccessData(
  { customer: formattedCustomer },
  'Customer retrieved successfully'
)
return CommonResponses.createErrorData(
  'Something went wrong',
  'CUSTOMER_ERROR',
  500
)
```

## 📚 Additional Resources

- [ElysiaJS Documentation](https://elysiajs.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Prisma Documentation](https://www.prisma.io/docs/)

---

**Note:** This document should be updated as the system evolves and new patterns are established.
