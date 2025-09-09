import { t } from 'elysia'

// Request schemas
export const backupParamsSchema = t.Object({
  name: t.String()
})

// Response schemas
export const backupInfoSchema = t.Object({
  id: t.Number(),
  name: t.String(),
  date: t.String(),
  size: t.String(),
  path: t.String()
})

export const createBackupResponseSchema = t.Union([
  t.Object({
    success: t.Boolean(),
    message: t.String(),
    backup: backupInfoSchema
  }),
  t.Object({
    success: t.Boolean(),
    message: t.String()
  })
])

export const listBackupsResponseSchema = t.Union([
  t.Object({
    success: t.Boolean(),
    backups: t.Array(backupInfoSchema)
  }),
  t.Object({
    success: t.Boolean(),
    message: t.String()
  })
])

export const restoreBackupResponseSchema = t.Union([
  t.Object({
    success: t.Boolean(),
    message: t.String(),
    restoredFrom: t.String(),
    currentBackup: t.String()
  }),
  t.Object({
    success: t.Boolean(),
    message: t.String()
  })
])

export const deleteBackupResponseSchema = t.Union([
  t.Object({
    success: t.Boolean(),
    message: t.String()
  }),
  t.Object({
    success: t.Boolean(),
    message: t.String()
  })
])
