# Pharmacy POS System

A comprehensive Point of Sale system for pharmacies with web frontend, mobile app, and backend API built with modern technologies.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Development](#development)
- [Building for Production](#building-for-production)
- [Database Setup](#database-setup)
- [Mobile App Features](#mobile-app-features)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

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

The Flutter mobile app follows Clean Architecture principles with clear separation of concerns:

```
pharmacy_pos_mobile/lib/
├── main.dart                           # App entry point
├── core/                              # Core utilities and configurations
│   ├── constants/                      # App constants and configurations
│   │   ├── api_constants.dart         # API endpoints and configurations
│   │   └── app_theme.dart             # Theme definitions
│   ├── di/                            # Dependency injection
│   │   └── injection_container.dart   # Service locator setup
│   ├── errors/                        # Error handling
│   │   ├── exceptions.dart            # Custom exceptions
│   │   └── failures.dart              # Failure classes
│   ├── network/                       # Network layer
│   │   └── api_client.dart            # HTTP client configuration
│   ├── router/                        # Navigation
│   │   └── app_router.dart            # Route definitions
│   ├── usecases/                      # Base use case
│   │   └── usecase.dart               # Abstract use case class
│   └── utils/                         # Utility functions
│       ├── constants.dart             # App constants
│       ├── theme_provider.dart        # Theme state management
│       └── validators.dart            # Input validation helpers
├── data/                              # Data layer (External)
│   ├── datasources/                   # Data sources
│   │   ├── auth_remote_datasource.dart
│   │   ├── dashboard_remote_datasource.dart
│   │   ├── product_remote_datasource.dart
│   │   └── sale_remote_datasource.dart
│   ├── models/                        # Data models (JSON serialization)
│   │   ├── backup_model.dart
│   │   ├── dashboard_model.dart
│   │   ├── pagination_model.dart
│   │   ├── prescription_model.dart
│   │   ├── product_model.dart
│   │   ├── purchase_model.dart
│   │   ├── sale_model.dart
│   │   └── user_model.dart
│   └── repositories/                  # Repository implementations
│       ├── auth_repository_impl.dart
│       ├── dashboard_repository_impl.dart
│       ├── product_repository_impl.dart
│       └── sale_repository_impl.dart
├── domain/                            # Domain layer (Business Logic)
│   ├── entities/                      # Business entities
│   │   ├── backup.dart
│   │   ├── dashboard.dart
│   │   ├── pagination.dart
│   │   ├── prescription.dart
│   │   ├── product.dart
│   │   ├── purchase.dart
│   │   ├── sale.dart
│   │   └── user.dart
│   ├── repositories/                  # Repository interfaces
│   │   ├── auth_repository.dart
│   │   ├── backup_repository.dart
│   │   ├── dashboard_repository.dart
│   │   ├── prescription_repository.dart
│   │   ├── product_repository.dart
│   │   └── sale_repository.dart
│   └── usecases/                      # Business use cases
│       ├── auth/                      # Authentication use cases
│       │   ├── get_current_user_usecase.dart
│       │   ├── login_usecase.dart
│       │   ├── logout_usecase.dart
│       │   └── register_usecase.dart
│       ├── dashboard/                 # Dashboard use cases
│       │   ├── get_dashboard_stats_usecase.dart
│       │   └── get_recent_sales_usecase.dart
│       └── product/                   # Product use cases
│           ├── get_product_by_barcode_usecase.dart
│           └── get_products_usecase.dart
└── presentation/                      # Presentation layer (UI)
    ├── bloc/                          # State management (BLoC pattern)
    │   ├── auth/                      # Authentication BLoC
    │   │   ├── auth_bloc.dart
    │   │   ├── auth_event.dart
    │   │   └── auth_state.dart
    │   ├── dashboard/                 # Dashboard BLoC
    │   │   ├── dashboard_bloc.dart
    │   │   ├── dashboard_event.dart
    │   │   └── dashboard_state.dart
    │   └── product/                   # Product BLoC
    │       ├── product_bloc.dart
    │       ├── product_event.dart
    │       └── product_state.dart
    ├── views/                         # Screen widgets
    │   ├── dashboard_screen.dart
    │   ├── login_screen.dart
    │   └── splash_screen.dart
    └── widgets/                       # Reusable UI components
        ├── custom_app_bar.dart
        ├── custom_card.dart
        ├── error_widget.dart
        ├── loading_widget.dart
        └── responsive_wrapper.dart
```

#### Architecture Flow

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Presentation  │    │     Domain      │    │      Data       │
│     Layer       │    │     Layer       │    │     Layer       │
│                 │    │                 │    │                 │
│  ┌───────────┐  │    │  ┌───────────┐  │    │  ┌───────────┐  │
│  │   BLoC    │──┼────┼──│  UseCase  │──┼────┼──│Repository │  │
│  │           │  │    │  │           │  │    │  │           │  │
│  └───────────┘  │    │  └───────────┘  │    │  └───────────┘  │
│  ┌───────────┐  │    │  ┌───────────┐  │    │  ┌───────────┐  │
│  │   Views   │  │    │  │ Entities  │  │    │  │  Models   │  │
│  │           │  │    │  │           │  │    │  │           │  │
│  └───────────┘  │    │  └───────────┘  │    │  └───────────┘  │
│  ┌───────────┐  │    │                 │    │  ┌───────────┐  │
│  │  Widgets  │  │    │                 │    │  │DataSource │  │
│  │           │  │    │                 │    │  │           │  │
│  └───────────┘  │    │                 │    │  └───────────┘  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

#### Key Features of the Architecture:

- **Clean Architecture**: Clear separation between presentation, domain, and data layers
- **BLoC Pattern**: State management using Business Logic Component pattern
- **Dependency Injection**: Centralized dependency management
- **Repository Pattern**: Abstraction layer for data access
- **Use Cases**: Encapsulation of business logic
- **Error Handling**: Centralized error management with custom exceptions and failures
- **Responsive Design**: Mobile-first approach with responsive widgets

## API Documentation

The API documentation is available at `http://10.91.114.239:3001/docs` when the backend is running.

### Key API Endpoints

#### Authentication

- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `GET /auth/me` - Get current user

#### Products

- `GET /products` - List all products
- `GET /products/barcode/:barcode` - Get product by barcode
- `POST /products` - Create new product
- `PUT /products/:id` - Update product
- `DELETE /products/:id` - Delete product

#### Sales

- `GET /sales` - List all sales
- `POST /sales` - Create new sale
- `GET /sales/:id` - Get sale details

#### Dashboard

- `GET /dashboard/stats` - Get dashboard statistics
- `GET /dashboard/recent-sales` - Get recent sales

#### Prescriptions

- `GET /prescriptions` - List prescriptions
- `POST /prescriptions` - Create prescription
- `PUT /prescriptions/:id` - Update prescription

## Deployment

### Production Environment

The system is designed to run in a production environment with the following setup:

- **Backend API**: `http://10.91.114.239:3001`
- **Frontend**: Deployed web application
- **Mobile App**: Available for Android and iOS

### Environment Variables

#### Backend (.env)

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-jwt-secret"
PORT=3001
```

#### Frontend (.env)

```env
NUXT_PUBLIC_API_BASE_URL=http://10.91.114.239:3001
```

#### Mobile App

Update `lib/core/constants/api_constants.dart` with the correct API URL.

## Troubleshooting

### Common Issues

1. **API Connection Issues**

   - Ensure the backend is running on the correct port
   - Check firewall settings
   - Verify API URL configuration

2. **Mobile App Issues**

   - Clear app cache and restart
   - Check network connectivity
   - Verify API endpoint accessibility

3. **Database Issues**
   - Run database migrations: `bun run db:push`
   - Reset database: `bun run db:reset`
   - Check database file permissions

### Performance Issues

- **Slow API responses**: Check database indexes
- **Mobile app lag**: Clear cache and restart
- **Build issues**: Clear node_modules and reinstall

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests if applicable
5. Commit your changes (`git commit -m 'Add some amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support and questions:

- Create an issue in the repository
- Contact the development team
- Check the documentation first

## Changelog

### Version 1.2.0

- Enhanced mobile app with new design system
- Updated API endpoints and configuration
- Improved architecture documentation
- Added comprehensive API documentation

### Version 1.1.0

- Performance optimizations
- Developer experience improvements
- Enhanced mobile app features

### Version 1.0.0

- Initial release
- Basic POS functionality
- Web and mobile applications
