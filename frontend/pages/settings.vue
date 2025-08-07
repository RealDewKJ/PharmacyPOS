<template>
  <div class="min-h-screen bg-background">
    <div class="container mx-auto px-4 py-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-foreground">Settings</h1>
        <p class="text-muted-foreground">Manage system configuration and preferences</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Settings Navigation -->
        <div class="lg:col-span-1">
          <Card class="p-6">
            <CardHeader>
              <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent class="space-y-2">
              <button 
                v-for="section in settingsSections" 
                :key="section.id"
                @click="activeSection = section.id"
                :class="[
                  'w-full text-left p-3 rounded-md transition-colors',
                  activeSection === section.id 
                    ? 'bg-primary text-primary-foreground' 
                    : 'hover:bg-muted text-foreground'
                ]"
              >
                <div class="flex items-center gap-3">
                  <component :is="section.icon" class="h-4 w-4" />
                  <span>{{ section.title }}</span>
                </div>
              </button>
            </CardContent>
          </Card>
        </div>

        <!-- Settings Content -->
        <div class="lg:col-span-2">
          <!-- General Settings -->
          <Card v-if="activeSection === 'general'" class="p-6">
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Basic system configuration</CardDescription>
            </CardHeader>
            <CardContent class="space-y-6">
              <div>
                <label class="text-sm font-medium text-foreground">Pharmacy Name</label>
                <Input v-model="settings.pharmacyName" placeholder="Enter pharmacy name" class="mt-1" />
              </div>
              <div>
                <label class="text-sm font-medium text-foreground">Address</label>
                <textarea 
                  v-model="settings.address" 
                  class="w-full p-2 border border-input rounded-md bg-background text-foreground resize-none mt-1"
                  rows="3"
                  placeholder="Enter pharmacy address"
                ></textarea>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="text-sm font-medium text-foreground">Phone</label>
                  <Input v-model="settings.phone" placeholder="Enter phone number" class="mt-1" />
                </div>
                <div>
                  <label class="text-sm font-medium text-foreground">Email</label>
                  <Input v-model="settings.email" type="email" placeholder="Enter email" class="mt-1" />
                </div>
              </div>
              <div>
                <label class="text-sm font-medium text-foreground">Currency</label>
                <select v-model="settings.currency" class="w-full p-2 border border-input rounded-md bg-background text-foreground mt-1">
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>
              <div>
                <label class="text-sm font-medium text-foreground">Timezone</label>
                <select v-model="settings.timezone" class="w-full p-2 border border-input rounded-md bg-background text-foreground mt-1">
                  <option value="UTC">UTC</option>
                  <option value="EST">Eastern Time</option>
                  <option value="CST">Central Time</option>
                  <option value="MST">Mountain Time</option>
                  <option value="PST">Pacific Time</option>
                </select>
              </div>
            </CardContent>
          </Card>

          <!-- User Management -->
          <Card v-if="activeSection === 'users'" class="p-6">
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage system users and permissions</CardDescription>
            </CardHeader>
            <CardContent class="space-y-6">
              <div class="flex justify-between items-center">
                <h3 class="text-lg font-medium text-foreground">Users</h3>
                <Button @click="showAddUser = true">
                  <PlusIcon class="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </div>
              
              <div class="space-y-4">
                <div v-for="user in users" :key="user.id" class="flex items-center justify-between p-4 border border-border rounded-md">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span class="text-sm font-medium text-primary">
                        {{ user.name.charAt(0).toUpperCase() }}
                      </span>
                    </div>
                    <div>
                      <div class="font-medium text-foreground">{{ user.name }}</div>
                      <div class="text-sm text-muted-foreground">{{ user.email }}</div>
                    </div>
                  </div>
                  <div class="flex items-center gap-2">
                    <span :class="[
                      'px-2 py-1 rounded-md text-sm font-medium',
                      user.role === 'admin' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' : 
                      user.role === 'manager' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' : 
                      'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                    ]">
                      {{ user.role }}
                    </span>
                    <Button size="sm" variant="outline" @click="editUser(user)">
                      <Edit class="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="destructive" @click="deleteUser(user.id)">
                      <TrashIcon class="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <!-- Security Settings -->
          <Card v-if="activeSection === 'security'" class="p-6">
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Configure security and authentication</CardDescription>
            </CardHeader>
            <CardContent class="space-y-6">
              <div>
                <label class="text-sm font-medium text-foreground">Session Timeout (minutes)</label>
                <Input v-model="settings.sessionTimeout" type="number" placeholder="30" class="mt-1" />
              </div>
              <div>
                <label class="text-sm font-medium text-foreground">Password Policy</label>
                <div class="mt-2 space-y-2">
                  <div class="flex items-center gap-2">
                    <input type="checkbox" id="require-uppercase" v-model="settings.passwordPolicy.requireUppercase" />
                    <label for="require-uppercase" class="text-sm text-foreground">Require uppercase letters</label>
                  </div>
                  <div class="flex items-center gap-2">
                    <input type="checkbox" id="require-numbers" v-model="settings.passwordPolicy.requireNumbers" />
                    <label for="require-numbers" class="text-sm text-foreground">Require numbers</label>
                  </div>
                  <div class="flex items-center gap-2">
                    <input type="checkbox" id="require-symbols" v-model="settings.passwordPolicy.requireSymbols" />
                    <label for="require-symbols" class="text-sm text-foreground">Require special characters</label>
                  </div>
                </div>
              </div>
              <div>
                <label class="text-sm font-medium text-foreground">Minimum Password Length</label>
                <Input v-model="settings.passwordPolicy.minLength" type="number" placeholder="8" class="mt-1" />
              </div>
              <div>
                <label class="text-sm font-medium text-foreground">Two-Factor Authentication</label>
                <div class="mt-2">
                  <Button variant="outline" @click="enable2FA">
                    <ShieldIcon class="h-4 w-4 mr-2" />
                    Enable 2FA
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <!-- Backup & Restore -->
          <Card v-if="activeSection === 'backup'" class="p-6">
            <CardHeader>
              <CardTitle>Backup & Restore</CardTitle>
              <CardDescription>Manage data backup and restoration</CardDescription>
            </CardHeader>
            <CardContent class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button @click="createBackup">
                  <DownloadIcon class="h-4 w-4 mr-2" />
                  Create Backup
                </Button>
                <Button variant="outline" @click="restoreBackup">
                  <UploadIcon class="h-4 w-4 mr-2" />
                  Restore Backup
                </Button>
              </div>
              
              <div>
                <label class="text-sm font-medium text-foreground">Auto Backup</label>
                <div class="mt-2 space-y-2">
                  <div class="flex items-center gap-2">
                    <input type="checkbox" id="auto-backup" v-model="settings.autoBackup.enabled" />
                    <label for="auto-backup" class="text-sm text-foreground">Enable automatic backups</label>
                  </div>
                  <div v-if="settings.autoBackup.enabled">
                    <label class="text-sm font-medium text-foreground">Backup Frequency</label>
                    <select v-model="settings.autoBackup.frequency" class="w-full p-2 border border-input rounded-md bg-background text-foreground mt-1">
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div>
                <label class="text-sm font-medium text-foreground">Recent Backups</label>
                <div class="mt-2 space-y-2">
                  <div v-for="backup in recentBackups" :key="backup.id" class="flex items-center justify-between p-3 border border-border rounded-md">
                    <div>
                      <div class="font-medium text-foreground">{{ backup.name }}</div>
                      <div class="text-sm text-muted-foreground">{{ backup.date }}</div>
                    </div>
                    <div class="flex items-center gap-2">
                      <span class="text-sm text-muted-foreground">{{ backup.size }}</span>
                      <Button size="sm" variant="outline" @click="downloadBackup(backup.id)">
                        <DownloadIcon class="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <!-- Notifications -->
          <Card v-if="activeSection === 'notifications'" class="p-6">
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure system notifications</CardDescription>
            </CardHeader>
            <CardContent class="space-y-6">
              <div>
                <label class="text-sm font-medium text-foreground">Email Notifications</label>
                <div class="mt-2 space-y-2">
                  <div class="flex items-center gap-2">
                    <input type="checkbox" id="low-stock" v-model="settings.notifications.lowStock" />
                    <label for="low-stock" class="text-sm text-foreground">Low stock alerts</label>
                  </div>
                  <div class="flex items-center gap-2">
                    <input type="checkbox" id="expiry-alerts" v-model="settings.notifications.expiryAlerts" />
                    <label for="expiry-alerts" class="text-sm text-foreground">Expiry date alerts</label>
                  </div>
                  <div class="flex items-center gap-2">
                    <input type="checkbox" id="sales-reports" v-model="settings.notifications.salesReports" />
                    <label for="sales-reports" class="text-sm text-foreground">Daily sales reports</label>
                  </div>
                </div>
              </div>
              
              <div>
                <label class="text-sm font-medium text-foreground">SMS Notifications</label>
                <div class="mt-2 space-y-2">
                  <div class="flex items-center gap-2">
                    <input type="checkbox" id="sms-prescriptions" v-model="settings.notifications.smsPrescriptions" />
                    <label for="sms-prescriptions" class="text-sm text-foreground">Prescription ready notifications</label>
                  </div>
                  <div class="flex items-center gap-2">
                    <input type="checkbox" id="sms-refills" v-model="settings.notifications.smsRefills" />
                    <label for="sms-refills" class="text-sm text-foreground">Refill reminders</label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <!-- Save Button -->
      <div class="mt-8 flex justify-end">
        <Button @click="saveSettings" class="px-8">
          <SaveIcon class="h-4 w-4 mr-2" />
          Save Settings
        </Button>
      </div>

      <!-- Add User Modal -->
      <div v-if="showAddUser" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <Card class="w-full max-w-md mx-4">
          <CardHeader>
            <CardTitle>Add New User</CardTitle>
            <CardDescription>Create a new system user</CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <div>
              <label class="text-sm font-medium text-foreground">Name</label>
              <Input v-model="newUser.name" placeholder="Enter full name" />
            </div>
            <div>
              <label class="text-sm font-medium text-foreground">Email</label>
              <Input v-model="newUser.email" type="email" placeholder="Enter email" />
            </div>
            <div>
              <label class="text-sm font-medium text-foreground">Role</label>
              <select v-model="newUser.role" class="w-full p-2 border border-input rounded-md bg-background text-foreground">
                <option value="cashier">Cashier</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div class="flex gap-2 justify-end">
              <Button variant="outline" @click="showAddUser = false">Cancel</Button>
              <Button @click="addUser">Add User</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { 
  SettingsIcon,
  UsersIcon,
  ShieldIcon,
  DatabaseIcon,
  BellIcon,
  PlusIcon,
  Edit,
  TrashIcon,
  DownloadIcon,
  UploadIcon,
  SaveIcon
} from 'lucide-vue-next'

import Card from '../components/ui/card.vue'
import CardHeader from '../components/ui/card-header.vue'
import CardContent from '../components/ui/card-content.vue'
import CardTitle from '../components/ui/card-title.vue'
import CardDescription from '../components/ui/card-description.vue'
import Input from '../components/ui/input.vue'
import Button from '../components/ui/button.vue'

const settingsSections = [
  { id: 'general', title: 'General', icon: SettingsIcon },
  { id: 'users', title: 'Users', icon: UsersIcon },
  { id: 'security', title: 'Security', icon: ShieldIcon },
  { id: 'backup', title: 'Backup & Restore', icon: DatabaseIcon },
  { id: 'notifications', title: 'Notifications', icon: BellIcon }
]

const activeSection = ref('general')
const showAddUser = ref(false)

// Mock data - replace with actual API calls
const settings = ref({
  pharmacyName: 'City Pharmacy',
  address: '123 Main Street, City, State 12345',
  phone: '+1 (555) 123-4567',
  email: 'info@citypharmacy.com',
  currency: 'USD',
  timezone: 'EST',
  sessionTimeout: 30,
  passwordPolicy: {
    requireUppercase: true,
    requireNumbers: true,
    requireSymbols: false,
    minLength: 8
  },
  autoBackup: {
    enabled: true,
    frequency: 'daily'
  },
  notifications: {
    lowStock: true,
    expiryAlerts: true,
    salesReports: false,
    smsPrescriptions: true,
    smsRefills: true
  }
})

const users = ref([
  { id: 1, name: 'John Admin', email: 'john@pharmacy.com', role: 'admin' },
  { id: 2, name: 'Sarah Manager', email: 'sarah@pharmacy.com', role: 'manager' },
  { id: 3, name: 'Mike Cashier', email: 'mike@pharmacy.com', role: 'cashier' }
])

const recentBackups = ref([
  { id: 1, name: 'Backup_2024_01_15', date: '2024-01-15 14:30', size: '2.5 MB' },
  { id: 2, name: 'Backup_2024_01_14', date: '2024-01-14 14:30', size: '2.4 MB' },
  { id: 3, name: 'Backup_2024_01_13', date: '2024-01-13 14:30', size: '2.3 MB' }
])

const newUser = ref({
  name: '',
  email: '',
  role: 'cashier'
})

const saveSettings = () => {
  // Implement save settings functionality
  console.log('Saving settings:', settings.value)
}

const addUser = () => {
  if (newUser.value.name && newUser.value.email) {
    const user = {
      id: users.value.length + 1,
      ...newUser.value
    }
    users.value.push(user)
    newUser.value = { name: '', email: '', role: 'cashier' }
    showAddUser.value = false
  }
}

const editUser = (user: any) => {
  // Implement edit user functionality
  console.log('Edit user:', user)
}

const deleteUser = (userId: number) => {
  // Implement delete user functionality
  console.log('Delete user:', userId)
  users.value = users.value.filter(u => u.id !== userId)
}

const enable2FA = () => {
  // Implement 2FA setup
  console.log('Enable 2FA')
}

const createBackup = () => {
  // Implement backup creation
  console.log('Creating backup')
}

const restoreBackup = () => {
  // Implement backup restoration
  console.log('Restoring backup')
}

const downloadBackup = (backupId: number) => {
  // Implement backup download
  console.log('Downloading backup:', backupId)
}
</script>
