import { ref } from 'vue'

const API_BASE = 'http://localhost:3001/api/backup'

export interface Backup {
  id: number
  name: string
  date: string
  size: string
  path: string
}

export interface BackupStats {
  totalBackups: number
  totalSize: string
  oldestBackup: string | null
  newestBackup: string | null
}

export function useBackup() {
  const backups = ref<Backup[]>([])
  const stats = ref<BackupStats | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchBackups = async () => {
    try {
      loading.value = true
      error.value = null
      
      const response = await fetch(`${API_BASE}/list`)
      const data = await response.json()
      
      if (data.success) {
        backups.value = data.backups
      } else {
        error.value = data.message || 'Failed to fetch backups'
      }
    } catch (err) {
      error.value = 'Network error while fetching backups'
      console.error('Error fetching backups:', err)
    } finally {
      loading.value = false
    }
  }

  const createBackup = async () => {
    try {
      loading.value = true
      error.value = null
      
      const response = await fetch(`${API_BASE}/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      const data = await response.json()
      
      if (data.success) {
        // Refresh the backups list
        await fetchBackups()
        return data.backup
      } else {
        error.value = data.message || 'Failed to create backup'
        return null
      }
    } catch (err) {
      error.value = 'Network error while creating backup'
      console.error('Error creating backup:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  const restoreBackup = async (filename: string) => {
    try {
      loading.value = true
      error.value = null
      
      const response = await fetch(`${API_BASE}/restore/${filename}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      const data = await response.json()
      
      if (data.success) {
        return data
      } else {
        error.value = data.message || 'Failed to restore backup'
        return null
      }
    } catch (err) {
      error.value = 'Network error while restoring backup'
      console.error('Error restoring backup:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  const downloadBackup = async (filename: string) => {
    try {
      const response = await fetch(`${API_BASE}/download/${filename}`)
      
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = filename
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } else {
        const data = await response.json()
        error.value = data.message || 'Failed to download backup'
      }
    } catch (err) {
      error.value = 'Network error while downloading backup'
      console.error('Error downloading backup:', err)
    }
  }

  const deleteBackup = async (filename: string) => {
    try {
      loading.value = true
      error.value = null
      
      const response = await fetch(`${API_BASE}/delete/${filename}`, {
        method: 'DELETE'
      })
      
      const data = await response.json()
      
      if (data.success) {
        // Refresh the backups list
        await fetchBackups()
        return true
      } else {
        error.value = data.message || 'Failed to delete backup'
        return false
      }
    } catch (err) {
      error.value = 'Network error while deleting backup'
      console.error('Error deleting backup:', err)
      return false
    } finally {
      loading.value = false
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_BASE}/stats`)
      const data = await response.json()
      
      if (data.success) {
        stats.value = data.stats
      } else {
        error.value = data.message || 'Failed to fetch backup statistics'
      }
    } catch (err) {
      error.value = 'Network error while fetching backup statistics'
      console.error('Error fetching backup stats:', err)
    }
  }

  return {
    backups,
    stats,
    loading,
    error,
    fetchBackups,
    createBackup,
    restoreBackup,
    downloadBackup,
    deleteBackup,
    fetchStats
  }
}
