# Pharmacy POS API Documentation

## Overview

The Pharmacy POS API is a comprehensive REST API for managing a pharmacy point-of-sale system. It provides endpoints for product management, sales processing, inventory tracking, customer management, and more.

## Base URL

```
http://localhost:3001
```

## Authentication

Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## API Endpoints

### Authentication

#### POST /auth/login

Authenticate a user with email and password.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "PHARMACIST"
  }
}
```

#### POST /auth/register

Register a new user account.

**Request Body:**

```json
{
  "email": "newuser@example.com",
  "password": "password123",
  "name": "Jane Doe",
  "role": "CASHIER"
}
```

**Response:** Same as login response.

#### GET /auth/me

Get current user profile (requires authentication).

**Response:**

```json
{
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "PHARMACIST",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Products

#### GET /products

Get all products with pagination and search.

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search by name, SKU, or barcode
- `category` (optional): Filter by category ID

**Response:**

```json
{
  "products": [
    {
      "id": "product-id",
      "name": "Aspirin 500mg",
      "description": "Pain relief medication",
      "barcode": "1234567890123",
      "sku": "ASP-500-001",
      "price": 9.99,
      "costPrice": 5.99,
      "stockQuantity": 100,
      "minStockLevel": 20,
      "expiryDate": "2025-12-31",
      "requiresPrescription": false,
      "category": {
        "id": "category-id",
        "name": "Pain Relief"
      },
      "supplier": {
        "id": "supplier-id",
        "name": "PharmaCorp"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "pages": 5
  }
}
```

#### GET /products/barcode/:barcode

Get product by barcode (useful for POS scanning).

**Response:**

```json
{
  "product": {
    "id": "product-id",
    "name": "Aspirin 500mg",
    "price": 9.99,
    "stockQuantity": 100,
    "requiresPrescription": false
  }
}
```

#### GET /products/low-stock

Get products with low stock (stock <= minStockLevel).

**Response:**

```json
{
  "products": [
    {
      "id": "product-id",
      "name": "Aspirin 500mg",
      "stockQuantity": 15,
      "minStockLevel": 20
    }
  ]
}
```

#### GET /products/expiring

Get products expiring within specified days.

**Query Parameters:**

- `days` (optional): Days until expiry (default: 30)

**Response:**

```json
{
  "products": [
    {
      "id": "product-id",
      "name": "Aspirin 500mg",
      "expiryDate": "2024-02-15",
      "stockQuantity": 50
    }
  ]
}
```

#### POST /products

Create a new product (requires authentication).

**Request Body:**

```json
{
  "name": "New Product",
  "description": "Product description",
  "barcode": "1234567890123",
  "sku": "NEW-001",
  "price": 15.99,
  "costPrice": 10.99,
  "stockQuantity": 50,
  "minStockLevel": 10,
  "expiryDate": "2025-12-31",
  "requiresPrescription": false,
  "categoryId": "category-id",
  "supplierId": "supplier-id"
}
```

#### PUT /products/:id

Update a product (requires authentication).

**Request Body:** Same as POST but all fields are optional.

#### DELETE /products/:id

Soft delete a product (requires authentication).

**Response:**

```json
{
  "message": "Product deleted successfully"
}
```

### Sales

#### GET /sales

Get all sales with pagination and date filtering.

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `startDate` (optional): Start date filter (YYYY-MM-DD)
- `endDate` (optional): End date filter (YYYY-MM-DD)

**Response:**

```json
{
  "sales": [
    {
      "id": "sale-id",
      "customerId": "customer-id",
      "userId": "user-id",
      "paymentMethod": "CASH",
      "discount": 5.0,
      "tax": 2.5,
      "subtotal": 100.0,
      "total": 97.5,
      "createdAt": "2024-01-01T10:00:00.000Z",
      "customer": {
        "id": "customer-id",
        "name": "John Customer"
      },
      "items": [
        {
          "id": "item-id",
          "productId": "product-id",
          "quantity": 2,
          "price": 9.99,
          "total": 19.98,
          "product": {
            "id": "product-id",
            "name": "Aspirin 500mg"
          }
        }
      ]
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```

#### POST /sales

Create a new sale transaction (requires authentication).

**Request Body:**

```json
{
  "items": [
    {
      "productId": "product-id",
      "quantity": 2,
      "price": 9.99
    }
  ],
  "customerId": "customer-id",
  "paymentMethod": "CASH",
  "discount": 5.0,
  "tax": 2.5
}
```

**Response:**

```json
{
  "sale": {
    "id": "sale-id",
    "total": 97.50,
    "items": [...],
    "customer": {...}
  }
}
```

### Categories

#### GET /categories

Get all product categories.

**Response:**

```json
{
  "categories": [
    {
      "id": "category-id",
      "name": "Pain Relief",
      "description": "Pain relief medications"
    }
  ]
}
```

#### POST /categories

Create a new category (requires authentication).

**Request Body:**

```json
{
  "name": "New Category",
  "description": "Category description"
}
```

### Customers

#### GET /customers

Get all customers with pagination.

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search by name or email

**Response:**

```json
{
  "customers": [
    {
      "id": "customer-id",
      "name": "John Customer",
      "email": "john@example.com",
      "phone": "+1234567890",
      "address": "123 Main St"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 15,
    "pages": 2
  }
}
```

#### POST /customers

Create a new customer (requires authentication).

**Request Body:**

```json
{
  "name": "New Customer",
  "email": "new@example.com",
  "phone": "+1234567890",
  "address": "456 Oak St"
}
```

### Suppliers

#### GET /suppliers

Get all suppliers.

**Response:**

```json
{
  "suppliers": [
    {
      "id": "supplier-id",
      "name": "PharmaCorp",
      "email": "contact@pharmacorp.com",
      "phone": "+1234567890",
      "address": "789 Business Ave"
    }
  ]
}
```

#### POST /suppliers

Create a new supplier (requires authentication).

**Request Body:**

```json
{
  "name": "New Supplier",
  "email": "contact@newsupplier.com",
  "phone": "+1234567890",
  "address": "321 Commerce St"
}
```

### Purchases

#### GET /purchases

Get all purchase orders with pagination.

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `status` (optional): Filter by status (PENDING, RECEIVED, CANCELLED)

**Response:**

```json
{
  "purchases": [
    {
      "id": "purchase-id",
      "supplierId": "supplier-id",
      "status": "PENDING",
      "total": 500.0,
      "createdAt": "2024-01-01T09:00:00.000Z",
      "supplier": {
        "id": "supplier-id",
        "name": "PharmaCorp"
      },
      "items": [
        {
          "id": "item-id",
          "productId": "product-id",
          "quantity": 50,
          "price": 10.0,
          "total": 500.0,
          "product": {
            "id": "product-id",
            "name": "Aspirin 500mg"
          }
        }
      ]
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 8,
    "pages": 1
  }
}
```

#### POST /purchases

Create a new purchase order (requires authentication).

**Request Body:**

```json
{
  "supplierId": "supplier-id",
  "items": [
    {
      "productId": "product-id",
      "quantity": 50,
      "price": 10.0
    }
  ]
}
```

### Prescriptions

#### GET /prescriptions

Get all prescriptions with customer and product details.

**Response:**

```json
{
  "prescriptions": [
    {
      "id": "prescription-id",
      "customerId": "customer-id",
      "prescribedBy": "Dr. Smith",
      "notes": "Take with food",
      "status": "PENDING",
      "expiryDate": "2024-02-01",
      "createdAt": "2024-01-01T10:00:00.000Z",
      "updatedAt": "2024-01-01T10:00:00.000Z",
      "customer": {
        "id": "customer-id",
        "name": "John Customer",
        "email": "john@example.com",
        "phone": "+1234567890"
      },
      "items": [
        {
          "id": "item-id",
          "productId": "product-id",
          "quantity": 30,
          "dosage": "1 tablet daily",
          "frequency": "Once daily",
          "duration": "30 days",
          "product": {
            "id": "product-id",
            "name": "Prescription Drug",
            "sku": "RX-001",
            "barcode": "1234567890123"
          }
        }
      ]
    }
  ]
}
```

#### POST /prescriptions

Create a new prescription (requires authentication).

**Request Body:**

```json
{
  "customerId": "customer-id",
  "items": [
    {
      "productId": "product-id",
      "quantity": 30,
      "dosage": "1 tablet daily",
      "frequency": "Once daily",
      "duration": "30 days"
    }
  ],
  "notes": "Take with food",
  "prescribedBy": "Dr. Smith",
  "expiryDate": "2024-02-01"
}
```

#### GET /prescriptions/:id

Get a specific prescription by ID (requires authentication).

**Response:**

```json
{
  "prescription": {
    "id": "prescription-id",
    "customerId": "customer-id",
    "prescribedBy": "Dr. Smith",
    "notes": "Take with food",
    "status": "PENDING",
    "expiryDate": "2024-02-01",
    "createdAt": "2024-01-01T10:00:00.000Z",
    "updatedAt": "2024-01-01T10:00:00.000Z",
    "customer": {
      "id": "customer-id",
      "name": "John Customer",
      "email": "john@example.com",
      "phone": "+1234567890"
    },
    "items": [
      {
        "id": "item-id",
        "productId": "product-id",
        "quantity": 30,
        "dosage": "1 tablet daily",
        "frequency": "Once daily",
        "duration": "30 days",
        "product": {
          "id": "product-id",
          "name": "Prescription Drug",
          "sku": "RX-001",
          "barcode": "1234567890123"
        }
      }
    ]
  }
}
```

#### PUT /prescriptions/:id/status

Update prescription status (requires authentication).

**Request Body:**

```json
{
  "status": "FILLED"
}
```

**Response:**

```json
{
  "prescription": {
    "id": "prescription-id",
    "status": "FILLED",
    "updatedAt": "2024-01-01T11:00:00.000Z"
  }
}
```

### Dashboard

#### GET /dashboard/stats

Get dashboard statistics.

**Response:**

```json
{
  "stats": {
    "totalProducts": 150,
    "totalRevenue": 15000.0,
    "totalSales": 250,
    "lowStockProducts": 5,
    "totalCustomers": 45,
    "totalSuppliers": 12
  }
}
```

#### GET /dashboard/recent-sales

Get the 10 most recent sales.

**Response:**

```json
{
  "recentSales": [
    {
      "id": "sale-id",
      "customerId": "customer-id",
      "userId": "user-id",
      "paymentMethod": "CASH",
      "discount": 5.0,
      "tax": 2.5,
      "subtotal": 100.0,
      "total": 97.5,
      "createdAt": "2024-01-01T10:00:00.000Z",
      "customer": {
        "id": "customer-id",
        "name": "John Customer"
      },
      "items": [
        {
          "id": "item-id",
          "productId": "product-id",
          "quantity": 2,
          "price": 9.99,
          "total": 19.98,
          "product": {
            "id": "product-id",
            "name": "Aspirin 500mg"
          }
        }
      ]
    }
  ]
}
```

#### GET /dashboard/sales-by-period

Get sales data for a specific time period.

**Query Parameters:**

- `period` (required): Time period (day, week, month, year)

**Response:**

```json
{
  "period": "month",
  "totalRevenue": 5000.0,
  "totalSales": 150,
  "sales": [
    {
      "id": "sale-id",
      "total": 97.5,
      "createdAt": "2024-01-01T10:00:00.000Z",
      "items": [...]
    }
  ]
}
```

#### GET /dashboard/top-products

Get the top selling products.

**Query Parameters:**

- `limit` (optional): Number of products to return (default: 10)

**Response:**

```json
{
  "topProducts": [
    {
      "product": {
        "id": "product-id",
        "name": "Aspirin 500mg",
        "sku": "ASP-500-001",
        "price": 9.99
      },
      "totalQuantity": 150,
      "totalRevenue": 1498.5
    }
  ]
}
```

### Users

#### GET /users

Get all active users.

**Response:**

```json
{
  "users": [
    {
      "id": "user-id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "PHARMACIST",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### GET /users/:id

Get a specific user by ID.

**Response:**

```json
{
  "user": {
    "id": "user-id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "PHARMACIST",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### PUT /users/profile

Update current user profile (requires authentication).

**Request Body:**

```json
{
  "name": "Updated Name",
  "currentPassword": "oldpassword",
  "newPassword": "newpassword"
}
```

**Response:**

```json
{
  "user": {
    "id": "user-id",
    "name": "Updated Name",
    "email": "john@example.com",
    "role": "PHARMACIST",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### DELETE /users/:id

Deactivate a user by ID (requires authentication).

**Response:**

```json
{
  "message": "User deactivated successfully"
}
```

### Backup

#### POST /api/backup/create

Create a database backup (requires authentication).

**Response:**

```json
{
  "success": true,
  "message": "Backup created successfully",
  "backup": {
    "id": 1704067200000,
    "name": "backup_2024-01-01T00-00-00-000Z.db",
    "date": "2024-01-01T00:00:00.000Z",
    "size": "2.5 MB",
    "path": "/path/to/backup.db"
  }
}
```

#### GET /api/backup/list

List all available backups (requires authentication).

**Response:**

```json
{
  "success": true,
  "backups": [
    {
      "id": 1704067200000,
      "name": "backup_2024-01-01T00-00-00-000Z.db",
      "date": "2024-01-01T00:00:00.000Z",
      "size": "2.5 MB",
      "path": "/path/to/backup.db"
    }
  ]
}
```

#### POST /api/backup/restore/:name

Restore database from a specific backup (requires authentication).

**Response:**

```json
{
  "success": true,
  "message": "Database restored successfully",
  "restoredFrom": "backup_2024-01-01T00-00-00-000Z.db",
  "currentBackup": "pre_restore_1704067200000.db"
}
```

#### DELETE /api/backup/:name

Delete a specific backup file (requires authentication).

**Response:**

```json
{
  "success": true,
  "message": "Backup deleted successfully"
}
```

## Error Responses

All endpoints return standard HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

Error responses include a message field:

```json
{
  "message": "Error description"
}
```

## Rate Limiting

API requests are limited to 100 requests per minute per IP address.

## Testing the API

You can test the API using:

1. **Swagger UI**: Visit `http://localhost:3001/swagger` for interactive documentation
2. **cURL**: Use the examples above with cURL commands
3. **Postman**: Import the endpoints into Postman for testing

## Example cURL Commands

### Login

```bash
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}'
```

### Get Products

```bash
curl -X GET "http://localhost:3001/products?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Create Product

```bash
curl -X POST http://localhost:3001/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "New Product",
    "price": 15.99,
    "costPrice": 10.99,
    "stockQuantity": 50,
    "categoryId": "category-id"
  }'
```

### Get Dashboard Stats

```bash
curl -X GET http://localhost:3001/dashboard/stats \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get Top Products

```bash
curl -X GET "http://localhost:3001/dashboard/top-products?limit=5" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get Users

```bash
curl -X GET http://localhost:3001/users \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Create Backup

```bash
curl -X POST http://localhost:3001/api/backup/create \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### List Backups

```bash
curl -X GET http://localhost:3001/api/backup/list \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Create Prescription

```bash
curl -X POST http://localhost:3001/prescriptions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "customerId": "customer-id",
    "items": [
      {
        "productId": "product-id",
        "quantity": 30,
        "dosage": "1 tablet daily",
        "frequency": "Once daily",
        "duration": "30 days"
      }
    ],
    "notes": "Take with food",
    "prescribedBy": "Dr. Smith"
  }'
```

## Support

For API support, contact: support@pharmacypos.com
