import fs from 'fs'
import path from 'path'
import { prisma } from '../../index'

// Create backup directory if it doesn't exist
const backupDir = path.join(process.cwd(), 'backups')
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true })
}

export class BackupController {
  static async createBackup() {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
      const backupName = `backup_${timestamp}.db`
      const backupPath = path.join(backupDir, backupName)
      
      // Get database path from environment
      const dbPath = process.env.DATABASE_URL?.replace('file:', '') || path.join(process.cwd(), 'prisma/dev.db')
      
      // Copy database file
      fs.copyFileSync(dbPath, backupPath)
      
      // Get file size
      const stats = fs.statSync(backupPath)
      const fileSizeInMB = (stats.size / (1024 * 1024)).toFixed(2)
      
      // Create backup record
      const backup = {
        id: Date.now(),
        name: backupName,
        date: new Date().toISOString(),
        size: `${fileSizeInMB} MB`,
        path: backupPath
      }
      
      return {
        success: true,
        message: 'Backup created successfully',
        backup
      }
    } catch (error) {
      console.error('Backup creation error:', error)
      throw new Error('Failed to create backup')
    }
  }

  static async listBackups() {
    try {
      const files = fs.readdirSync(backupDir)
      const backups = files
        .filter(file => file.endsWith('.db'))
        .map(file => {
          const filePath = path.join(backupDir, file)
          const stats = fs.statSync(filePath)
          return {
            id: stats.mtime.getTime(),
            name: file,
            date: stats.mtime.toISOString(),
            size: `${(stats.size / (1024 * 1024)).toFixed(2)} MB`,
            path: filePath
          }
        })
        .sort((a, b) => b.id - a.id) // Sort by date descending
      
      return {
        success: true,
        backups
      }
    } catch (error) {
      console.error('Backup listing error:', error)
      throw new Error('Failed to list backups')
    }
  }

  static async restoreBackup(backupName: string) {
    try {
      const backupPath = path.join(backupDir, backupName)
      
      if (!fs.existsSync(backupPath)) {
        throw new Error('Backup file not found')
      }
      
      // Get database path from environment
      const dbPath = process.env.DATABASE_URL?.replace('file:', '') || path.join(process.cwd(), 'prisma/dev.db')
      
      // Create backup of current database before restore
      const currentBackupName = `pre_restore_${Date.now()}.db`
      const currentBackupPath = path.join(backupDir, currentBackupName)
      fs.copyFileSync(dbPath, currentBackupPath)
      
      // Restore database
      fs.copyFileSync(backupPath, dbPath)
      
      return {
        success: true,
        message: 'Database restored successfully',
        restoredFrom: backupName,
        currentBackup: currentBackupName
      }
    } catch (error) {
      console.error('Backup restore error:', error)
      throw new Error('Failed to restore backup')
    }
  }

  static async deleteBackup(backupName: string) {
    try {
      const backupPath = path.join(backupDir, backupName)
      
      if (!fs.existsSync(backupPath)) {
        throw new Error('Backup file not found')
      }
      
      fs.unlinkSync(backupPath)
      
      return {
        success: true,
        message: 'Backup deleted successfully'
      }
    } catch (error) {
      console.error('Backup deletion error:', error)
      throw new Error('Failed to delete backup')
    }
  }
}
