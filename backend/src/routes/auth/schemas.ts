import { t } from 'elysia'

export const loginSchema = t.Object({
  email: t.String({ format: 'email', default: '' }),
  password: t.String({ minLength: 6, default: '' })
})

export const registerSchema = t.Object({
  email: t.String({ format: 'email', default: '' }),
  password: t.String({ minLength: 6, default: '' }),
  name: t.String({ minLength: 2, default: '' }),
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
    }),
    sessionId: t.String()
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

export const logoutSchema = t.Object({
  sessionId: t.String()
})

export const sessionResponseSchema = t.Union([
  t.Object({
    success: t.Boolean(),
    message: t.String(),
    deletedSessions: t.Optional(t.Number()),
    activeSessions: t.Optional(t.Array(t.String())),
    count: t.Optional(t.Number())
  }),
  t.Object({
    error: t.String()
  })
])
