
export { swaggerConfig } from './swagger'
export { corsConfig } from './cors'
export { jwtConfig } from './jwt'

import { config as dotenvConfig } from 'dotenv'
dotenvConfig({ path: './env.development' })

// Environment configuration
export const config = {
  port: parseInt(process.env.PORT || '3000'),
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL || 'file:./dev.db',
  jwtSecret: process.env.JWT_SECRET || 'fallback-secret',
  corsOrigin: process.env.CORS_ORIGIN || true
} as const
