# Theme Switcher Implementation

This document describes the theme switcher functionality implemented in the Pharmacy POS frontend.

## Overview

The theme switcher allows users to switch between light, dark, and system themes. It uses Tailwind CSS with CSS custom properties for seamless theme transitions.

## Features

- **Three Theme Options**: Light, Dark, and System (follows OS preference)
- **Persistent Storage**: Theme preference is saved in localStorage
- **System Preference Detection**: Automatically detects and follows OS theme preference
- **Smooth Transitions**: CSS transitions for theme changes
- **Multiple UI Components**: Dropdown switcher and simple toggle button

## Implementation Details

### 1. Theme Composable (`composables/useTheme.ts`)

The core theme management logic is handled by the `useTheme` composable:

```typescript
const { theme, isDark, toggleTheme, setTheme } = useTheme();
```

**Features:**

- Uses VueUse's `useLocalStorage` for persistence
- Uses VueUse's `usePreferredDark` for system preference detection
- Automatically applies theme to document element
- Provides reactive theme state

### 2. Theme Components

#### ThemeSwitcher (`components/ui/theme-switcher.vue`)

A dropdown component with three theme options:

- Light theme (Sun icon)
- Dark theme (Moon icon)
- System theme (Monitor icon)

#### SimpleThemeToggle (`components/ui/simple-theme-toggle.vue`)

A simple toggle button that cycles through themes:

- Light → Dark → System → Light

### 3. CSS Variables

The theme system uses CSS custom properties defined in `assets/css/main.css`:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  /* ... more variables */
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  /* ... dark theme variables */
}
```

### 4. Tailwind Configuration

Tailwind is configured with `darkMode: ["class"]` in `tailwind.config.js`, allowing manual control of dark mode via the `dark` class on the HTML element.

## Usage

### Basic Usage

```vue
<template>
  <div>
    <ThemeSwitcher />
    <SimpleThemeToggle />
  </div>
</template>

<script setup>
import { useTheme } from "~/composables/useTheme";

const { theme, isDark, toggleTheme, setTheme } = useTheme();
</script>
```

### Programmatic Theme Control

```typescript
// Set specific theme
setTheme("dark");

// Toggle between themes
toggleTheme();

// Check current theme
console.log(theme.value); // 'light', 'dark', or 'system'

// Check if dark mode is active
console.log(isDark.value); // true or false
```

## Integration

### Layout Integration

The theme switcher is integrated into the main layout (`layouts/default.vue`) in the navigation bar.

### Login Page

The login page includes a simple theme toggle in the top-right corner.

### Demo Page

Visit `/theme-demo` to see all theme components and test the functionality.

## Styling Guidelines

### Using Theme Colors

Always use the semantic color variables instead of hardcoded colors:

```vue
<!-- ✅ Good -->
<div class="bg-background text-foreground">
<div class="text-muted-foreground">
<div class="border-border">

<!-- ❌ Avoid -->
<div class="bg-white text-black">
<div class="text-gray-600">
<div class="border-gray-200">
```

### Status Colors

For status indicators, use the semantic destructive color or create theme-aware variants:

```vue
<!-- Status indicators -->
<span class="text-destructive">Error</span>
<span
  class="bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400"
>Success</span>
```

## Browser Support

- Modern browsers with CSS custom properties support
- Automatic fallback to light theme for older browsers
- No JavaScript required for basic functionality

## Performance

- Theme changes are instant with CSS variables
- No layout shifts during theme transitions
- Minimal JavaScript overhead
- Efficient localStorage usage

## Future Enhancements

Potential improvements:

- Theme transition animations
- Custom color schemes
- High contrast mode
- Reduced motion support
- Theme-aware images and icons
