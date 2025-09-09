// Configuration exports
export { swaggerConfig } from './swagger'
export { corsConfig } from './cors'
export { jwtConfig } from './jwt'

// Environment configuration
export const config = {
  port: process.env.PORT || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL || 'file:./dev.db',
  jwtSecret: process.env.JWT_SECRET || 'fallback-secret',
  corsOrigin: process.env.CORS_ORIGIN || true
} as const
