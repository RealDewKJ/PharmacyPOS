import { cors } from '@elysiajs/cors'

export const corsConfig = cors({
  origin: (request: Request) => {
    const origin = request.headers.get('origin')
    if (process.env.NODE_ENV === 'development') {
      return true 
    }
    return origin === 'http://localhost:3001' || origin === 'http://127.0.0.1:3001'
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
})
