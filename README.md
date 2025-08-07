# Pharmacy POS System

A modern Point of Sale system for pharmacies built with Nuxt.js TypeScript frontend and Bun TypeScript backend.

## Features

- **Inventory Management**: Track medicine stock, expiry dates, and suppliers
- **Sales Processing**: Quick checkout with barcode scanning support
- **Customer Management**: Store customer information and purchase history
- **Reporting**: Sales reports, inventory reports, and analytics
- **User Management**: Role-based access control (Admin, Pharmacist, Cashier)
- **Prescription Management**: Digital prescription handling
- **Barcode Integration**: Scan medicines for quick lookup

## Tech Stack

### Frontend

- **Nuxt.js 3** - Vue.js framework
- **TypeScript** - Type safety
- **Shadcn/ui** - Modern UI components
- **Tailwind CSS** - Styling
- **Pinia** - State management
- **VueUse** - Vue composition utilities

### Backend

- **Bun** - JavaScript runtime
- **TypeScript** - Type safety
- **Elysia** - Web framework
- **Prisma** - Database ORM
- **SQLite** - Database (can be changed to PostgreSQL/MySQL)
- **JWT** - Authentication

## Project Structure

```
pharmacy-pos/
├── frontend/          # Nuxt.js frontend application
├── backend/           # Bun backend API
├── package.json       # Root package.json for workspace management
└── README.md         # This file
```

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- Git

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd pharmacy-pos
```

2. Install dependencies:

```bash
npm run install:all
```

3. Set up environment variables:

```bash
# Copy environment files
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env
```

4. Start the development servers:

```bash
npm run dev
```

The application will be available at:

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

## Development

### Frontend Development

```bash
cd frontend
npm run dev
```

### Backend Development

```bash
cd backend
bun run dev
```

## Building for Production

```bash
npm run build
```

## Database Setup

The backend uses SQLite by default. To set up the database:

```bash
cd backend
bun run db:push
bun run db:seed
```

## API Documentation

The API documentation is available at `http://localhost:3001/docs` when the backend is running.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License
