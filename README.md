# Pharmacy POS System

A comprehensive Point of Sale system for pharmacies with web frontend, mobile app, and backend API built with modern technologies.

## Features

- **Inventory Management**: Track medicine stock, expiry dates, and suppliers
- **Sales Processing**: Quick checkout with barcode scanning support
- **Customer Management**: Store customer information and purchase history
- **Reporting**: Sales reports, inventory reports, and analytics
- **User Management**: Role-based access control (Admin, Pharmacist, Cashier)
- **Prescription Management**: Digital prescription handling
- **Barcode Integration**: Scan medicines for quick lookup
- **Multi-Platform Support**: Web application and mobile app
- **Real-time Dashboard**: Live statistics and analytics
- **Responsive Design**: Works on desktop, tablet, and mobile devices

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

### Mobile App

- **Flutter** - Cross-platform mobile framework
- **Dart** - Programming language
- **BLoC** - State management pattern
- **Clean Architecture** - Separation of concerns
- **Dio** - HTTP client
- **Go Router** - Navigation
- **Flutter ScreenUtil** - Responsive design

## Project Structure

```
pharmacy-pos/
├── frontend/              # Nuxt.js web frontend application
├── backend/               # Bun backend API
├── pharmacy_pos_mobile/   # Flutter mobile application
├── package.json           # Root package.json for workspace management
└── README.md             # This file
```

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- Flutter SDK 3.5.3+ (for mobile app)
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

5. For mobile app development:

```bash
cd pharmacy_pos_mobile
flutter pub get
flutter run
```

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

### Mobile App Development

```bash
cd pharmacy_pos_mobile
flutter run
```

For mobile app specific commands:

```bash
# Install dependencies
flutter pub get

# Generate code
flutter packages pub run build_runner build

# Run tests
flutter test

# Build for production
flutter build apk --release
```

## Building for Production

### Web Application

```bash
npm run build
```

### Mobile App

```bash
cd pharmacy_pos_mobile

# Android
flutter build apk --release

# iOS
flutter build ios --release

# Web
flutter build web --release
```

## Database Setup

The backend uses SQLite by default. To set up the database:

```bash
cd backend
bun run db:push
bun run db:seed
```

## Mobile App Features

The Flutter mobile application provides a comprehensive POS experience with:

- **Clean Architecture**: Separation of concerns with BLoC pattern
- **Responsive Design**: Works on phones, tablets, and desktop
- **Dark/Light Theme**: Toggle between themes
- **Real-time Dashboard**: Live statistics and analytics
- **Barcode Scanning**: Quick product lookup
- **Offline Support**: Works with cached data when offline
- **Performance Optimized**: Fast formatting and analysis tools

### Mobile App Architecture

```
lib/
├── core/                    # Core utilities and configurations
├── data/                    # Data layer (repositories, models)
├── domain/                  # Domain layer (entities, use cases)
└── presentation/            # Presentation layer (UI, BLoC)
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
