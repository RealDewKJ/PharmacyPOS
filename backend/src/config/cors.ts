import { cors } from '@elysiajs/cors'

export const corsConfig = cors({
  origin: process.env.CORS_ORIGIN || true, 
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
})
