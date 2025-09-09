<template>
  <div class="min-h-screen bg-background">
    <div class="container mx-auto px-4 py-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-foreground">Theme Switcher Demo</h1>
        <p class="text-muted-foreground">Test the dark/light theme functionality</p>
      </div>

      <!-- Theme Controls -->
      <Card class="p-6 mb-8">
        <CardHeader>
          <CardTitle>Theme Controls</CardTitle>
          <CardDescription>Switch between light, dark, and system themes</CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="flex items-center gap-4">
            <span class="text-sm font-medium text-foreground">Current Theme:</span>
            <span class="px-2 py-1 bg-primary/10 text-primary rounded-md text-sm font-medium">
              {{ theme }}
            </span>
          </div>
          
          <div class="flex items-center gap-4">
            <ThemeSwitcher />
            <SimpleThemeToggle />
          </div>
          
          <div class="flex items-center gap-4">
            <Button @click="setTheme('light')" :variant="theme === 'light' ? 'default' : 'outline'">
              <SunIcon class="h-4 w-4 mr-2" />
              Light
            </Button>
            <Button @click="setTheme('dark')" :variant="theme === 'dark' ? 'default' : 'outline'">
              <MoonIcon class="h-4 w-4 mr-2" />
              Dark
            </Button>
            <Button @click="setTheme('system')" :variant="theme === 'system' ? 'default' : 'outline'">
              <MonitorIcon class="h-4 w-4 mr-2" />
              System
            </Button>
          </div>
        </CardContent>
      </Card>

      <!-- UI Components Demo -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Forms -->
        <Card class="p-6">
          <CardHeader>
            <CardTitle>Form Elements</CardTitle>
          </CardHeader>
          <CardContent class="space-y-4">
            <div>
              <label class="text-sm font-medium text-foreground">Email</label>
              <Input type="email" placeholder="Enter your email" />
            </div>
            <div>
              <label class="text-sm font-medium text-foreground">Password</label>
              <Input type="password" placeholder="Enter your password" />
            </div>
            <div>
              <label class="text-sm font-medium text-foreground">Select Option</label>
              <select class="w-full p-2 border border-input rounded-md bg-background text-foreground">
                <option>Option 1</option>
                <option>Option 2</option>
                <option>Option 3</option>
              </select>
            </div>
            <div class="flex items-center gap-2">
              <input type="checkbox" id="demo-checkbox" />
              <label for="demo-checkbox" class="text-sm text-foreground">Check this box</label>
            </div>
            <div class="flex items-center gap-2">
              <input type="radio" name="demo-radio" id="radio1" />
              <label for="radio1" class="text-sm text-foreground">Radio 1</label>
            </div>
            <div class="flex items-center gap-2">
              <input type="radio" name="demo-radio" id="radio2" />
              <label for="radio2" class="text-sm text-foreground">Radio 2</label>
            </div>
          </CardContent>
        </Card>

        <!-- Buttons -->
        <Card class="p-6">
          <CardHeader>
            <CardTitle>Buttons</CardTitle>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="flex flex-wrap gap-2">
              <Button>Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="destructive">Destructive</Button>
            </div>
            <div class="flex flex-wrap gap-2">
              <Button size="sm">Small</Button>
              <Button size="sm" variant="secondary">Small</Button>
              <Button size="sm" variant="outline">Small</Button>
            </div>
            <div class="flex flex-wrap gap-2">
              <Button disabled>Disabled</Button>
              <Button variant="outline" disabled>Disabled</Button>
            </div>
          </CardContent>
        </Card>

        <!-- Alerts -->
        <Card class="p-6">
          <CardHeader>
            <CardTitle>Alerts & Status</CardTitle>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="p-4 bg-green-100 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
              <p class="text-green-800 dark:text-green-400 text-sm">Success message</p>
            </div>
            <div class="p-4 bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
              <p class="text-red-800 dark:text-red-400 text-sm">Error message</p>
            </div>
            <div class="p-4 bg-yellow-100 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md">
              <p class="text-yellow-800 dark:text-yellow-400 text-sm">Warning message</p>
            </div>
            <div class="p-4 bg-blue-100 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
              <p class="text-blue-800 dark:text-blue-400 text-sm">Info message</p>
            </div>
          </CardContent>
        </Card>

        <!-- Data Display -->
        <Card class="p-6">
          <CardHeader>
            <CardTitle>Data Display</CardTitle>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-sm text-muted-foreground">Total Sales</span>
                <span class="font-medium text-foreground">฿12,345.67</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-muted-foreground">Products</span>
                <span class="font-medium text-foreground">1,234</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-muted-foreground">Customers</span>
                <span class="font-medium text-foreground">567</span>
              </div>
            </div>
            
            <div class="space-y-2">
              <div class="flex items-center gap-2">
                <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                <span class="text-sm text-foreground">Online</span>
              </div>
              <div class="flex items-center gap-2">
                <div class="w-3 h-3 bg-red-500 rounded-full"></div>
                <span class="text-sm text-foreground">Offline</span>
              </div>
              <div class="flex items-center gap-2">
                <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span class="text-sm text-foreground">Maintenance</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Code Example -->
      <Card class="p-6 mt-8">
        <CardHeader>
          <CardTitle>Usage Example</CardTitle>
        </CardHeader>
        <CardContent>
          <pre class="bg-muted p-4 rounded-md overflow-x-auto text-sm"><code>// In your component
import { useTheme } from '~/composables/useTheme'

const { theme, isDark, toggleTheme, setTheme } = useTheme()

// Use in template
&lt;button @click="toggleTheme"&gt;
  {{ isDark ? 'Light' : 'Dark' }} Mode
&lt;/button&gt;</code></pre>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { 
  SunIcon, 
  MoonIcon, 
  MonitorIcon 
} from 'lucide-vue-next'

import Card from '../components/ui/card.vue'
import CardHeader from '../components/ui/card-header.vue'
import CardContent from '../components/ui/card-content.vue'
import CardTitle from '../components/ui/card-title.vue'
import CardDescription from '../components/ui/card-description.vue'
import Input from '../components/ui/input.vue'
import Button from '../components/ui/button.vue'
import ThemeSwitcher from '../components/ui/theme-switcher.vue'
import SimpleThemeToggle from '../components/ui/simple-theme-toggle.vue'
import { useTheme } from '~/composables/useTheme'

const { theme, isDark, setTheme } = useTheme()
</script>
