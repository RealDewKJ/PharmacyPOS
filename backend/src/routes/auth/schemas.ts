import { t } from 'elysia'

export const loginSchema = t.Object({
  email: t.String({ format: 'email' }),
  password: t.String({ minLength: 6 })
})

export const registerSchema = t.Object({
  email: t.String({ format: 'email' }),
  password: t.String({ minLength: 6 }),
  name: t.String({ minLength: 2 }),
  role: t.Optional(t.String({ enum: ['ADMIN', 'PHARMACIST', 'CASHIER'] }))
})

export const authResponseSchema = t.Union([
  t.Object({
    token: t.String(),
    user: t.Object({
      id: t.String(),
      email: t.String(),
      name: t.String(),
      role: t.String(),
      isActive: t.Boolean(),
      createdAt: t.Date()
    })
  }),
  t.Object({
    error: t.String()
  })
])

export const userProfileSchema = t.Union([
  t.Object({
    user: t.Object({
      id: t.String(),
      email: t.String(),
      name: t.String(),
      role: t.String(),
      isActive: t.Boolean(),
      createdAt: t.Date()
    })
  }),
  t.Object({
    error: t.String()
  })
])
