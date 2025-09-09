# Configuration Directory

This directory contains all application configuration files following Clean Architecture principles.

## Structure

```
src/config/
├── index.ts          # Main configuration exports
├── swagger.ts        # Swagger/OpenAPI documentation config
├── cors.ts           # CORS configuration
├── jwt.ts            # JWT authentication config
└── README.md         # This file
```

## Benefits of This Structure

1. **Separation of Concerns**: Each configuration is in its own file
2. **Reusability**: Configurations can be imported and reused
3. **Maintainability**: Easy to modify individual configurations
4. **Testability**: Each config can be tested independently
5. **Environment Management**: Centralized environment variable handling

## Usage

```typescript
// Import specific config
import { swaggerConfig } from "./config/swagger";

// Import all configs
import { swaggerConfig, corsConfig, jwtConfig } from "./config";

// Import with environment variables
import { config } from "./config";
```

## Adding New Configurations

1. Create a new file in this directory (e.g., `database.ts`)
2. Export the configuration from `index.ts`
3. Import and use in your application
