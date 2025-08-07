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

Get all prescriptions with pagination.

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `status` (optional): Filter by status (PENDING, FILLED, EXPIRED)

**Response:**

```json
{
  "prescriptions": [
    {
      "id": "prescription-id",
      "customerId": "customer-id",
      "productId": "product-id",
      "quantity": 30,
      "dosage": "1 tablet daily",
      "status": "PENDING",
      "expiryDate": "2024-02-01",
      "customer": {
        "id": "customer-id",
        "name": "John Customer"
      },
      "product": {
        "id": "product-id",
        "name": "Prescription Drug"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 12,
    "pages": 2
  }
}
```

#### POST /prescriptions

Create a new prescription (requires authentication).

**Request Body:**

```json
{
  "customerId": "customer-id",
  "productId": "product-id",
  "quantity": 30,
  "dosage": "1 tablet daily",
  "expiryDate": "2024-02-01"
}
```

### Dashboard

#### GET /dashboard/stats

Get dashboard statistics.

**Response:**

```json
{
  "stats": {
    "totalSales": 15000.0,
    "totalProducts": 150,
    "lowStockProducts": 5,
    "expiringProducts": 3,
    "pendingPrescriptions": 8,
    "todaySales": 500.0,
    "monthlySales": 5000.0
  }
}
```

#### GET /dashboard/sales-chart

Get sales data for charts.

**Query Parameters:**

- `period` (optional): Time period (daily, weekly, monthly, default: daily)
- `days` (optional): Number of days (default: 7)

**Response:**

```json
{
  "data": [
    {
      "date": "2024-01-01",
      "sales": 500.0,
      "transactions": 25
    }
  ]
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

1. **Swagger UI**: Visit `http://localhost:3001/docs` for interactive documentation
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

## Support

For API support, contact: support@pharmacypos.com
