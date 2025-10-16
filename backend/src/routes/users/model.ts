import { t } from 'elysia'

// Request schemas
export const updateUserProfileSchema = t.Object({
  name: t.String(),
  currentPassword: t.Optional(t.String()),
  newPassword: t.Optional(t.String())
})

export const userParamsSchema = t.Object({
  id: t.String()
})

// Response schemas
export const userSchema = t.Object({
  id: t.String(),
  name: t.String(),
  email: t.String(),
  role: t.String(),
  isActive: t.Boolean(),
  createdAt: t.String()
})

export const userResponseSchema = t.Union([
  t.Object({
    user: userSchema
  }),
  t.Object({
    error: t.String()
  })
])

export const usersListResponseSchema = t.Union([
  t.Object({
    users: t.Array(userSchema)
  }),
  t.Object({
    error: t.String()
  })
])

export const deactivateUserResponseSchema = t.Union([
  t.Object({
    message: t.String()
  }),
  t.Object({
    error: t.String()
  })
])
