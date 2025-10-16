import { jwt } from '@elysiajs/jwt'

export const jwtConfig = jwt({
  name: 'jwt',
  secret: process.env.JWT_SECRET || (() => {
    throw new Error('JWT_SECRET environment variable is required')
  })(),
  exp: '15m'
})