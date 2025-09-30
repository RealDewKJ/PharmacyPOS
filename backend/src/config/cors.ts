import { cors } from '@elysiajs/cors'

export const corsConfig = cors({
  origin: (request: Request) => {
    const origin = request.headers.get('origin')
    // Allow requests from localhost:3001 (frontend) and any other origins in development
    if (process.env.NODE_ENV === 'development') {
      return true // Allow all origins in development
    }
    // In production, you might want to restrict this to specific domains
    return origin === 'http://localhost:3001' || origin === 'http://127.0.0.1:3001'
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
})
