import { Elysia, t } from 'elysia'
import { BackupController } from './service'
import {
  backupParamsSchema,
  createBackupResponseSchema,
  listBackupsResponseSchema,
  restoreBackupResponseSchema,
  deleteBackupResponseSchema
} from './model'
import { authMiddleware } from '../../middleware/auth'

export const backupRoutes = new Elysia({ prefix: '/api/backup' })
  .use(authMiddleware)
  .post('/create', async ({ set }) => {
    try {
      return await BackupController.createBackup()
    } catch (error) {
      set.status = 500
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to create backup'
      }
    }
  }, {
    response: createBackupResponseSchema,
    detail: {
      tags: ['Backup'],
      summary: 'Create Database Backup',
      description: 'Create a backup of the current database'
    }
  })
  .get('/list', async ({ set }) => {
    try {
      return await BackupController.listBackups()
    } catch (error) {
      set.status = 500
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to list backups'
      }
    }
  }, {
    response: listBackupsResponseSchema,
    detail: {
      tags: ['Backup'],
      summary: 'List Backups',
      description: 'List all available database backups'
    }
  })
  .post('/restore/:name', async ({ params, set }) => {
    try {
      return await BackupController.restoreBackup(params.name)
    } catch (error) {
      set.status = 500
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to restore backup'
      }
    }
  }, {
    params: backupParamsSchema,
    response: restoreBackupResponseSchema,
    detail: {
      tags: ['Backup'],
      summary: 'Restore Database Backup',
      description: 'Restore database from a specific backup'
    }
  })
  .delete('/:name', async ({ params, set }) => {
    try {
      return await BackupController.deleteBackup(params.name)
    } catch (error) {
      set.status = 500
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to delete backup'
      }
    }
  }, {
    params: backupParamsSchema,
    response: deleteBackupResponseSchema,
    detail: {
      tags: ['Backup'],
      summary: 'Delete Backup',
      description: 'Delete a specific backup file'
    }
  })
