# Frontend Documentation - Pharmacy POS System

## ภาพรวม (Overview)

Frontend ของระบบ Pharmacy POS ถูกสร้างด้วย **Nuxt 3** และ **Vue 3** โดยใช้ TypeScript และ Tailwind CSS สำหรับการออกแบบ UI

## โครงสร้างโฟลเดอร์ (Folder Structure)

### 📁 `/assets/`

**หน้าที่**: เก็บไฟล์ static resources

- `css/main.css` - ไฟล์ CSS หลักที่กำหนด global styles และ CSS variables สำหรับ theme system

### 📁 `/components/`

**หน้าที่**: เก็บ Vue components ที่สามารถนำกลับมาใช้ได้ (Reusable Components)

#### `/components/ui/`

UI Components ที่สร้างขึ้นเอง:

- `button.vue` - ปุ่มต่างๆ (Primary, Secondary, Ghost, etc.)
- `card.vue` - Card container component
- `card-content.vue` - Card content wrapper
- `card-description.vue` - Card description text
- `card-header.vue` - Card header section
- `card-title.vue` - Card title text
- `input.vue` - Input field component
- `language-switcher.vue` - ตัวเปลี่ยนภาษา
- `simple-theme-toggle.vue` - ตัวเปลี่ยน theme แบบง่าย
- `theme-switcher.vue` - ตัวเปลี่ยน theme แบบเต็ม

### 📁 `/composables/`

**หน้าที่**: เก็บ Vue composables สำหรับ logic ที่ใช้ร่วมกัน

- `useApi.ts` - **API Client**

  - จัดการการเรียก API ไปยัง backend
  - เพิ่ม Authorization header อัตโนมัติ
  - จัดการ error handling (401 redirect to login)
  - มี methods: `get()`, `post()`, `put()`, `delete()`, `patch()`

- `useBackup.ts` - **Backup Management**

  - จัดการการ backup และ restore ข้อมูล

- `useLanguage.ts` - **Internationalization**

  - จัดการการเปลี่ยนภาษา
  - ใช้ร่วมกับ i18n system

- `useTheme.ts` - **Theme Management**
  - จัดการ dark/light/system theme
  - ใช้ localStorage เก็บ theme preference
  - ใช้ `@vueuse/core` สำหรับ reactive theme switching

### 📁 `/layouts/`

**หน้าที่**: เก็บ layout templates สำหรับหน้าต่างๆ

- `default.vue` - **Main Layout**
  - Navigation bar พร้อม logo และ user menu
  - Sidebar navigation สำหรับเมนูหลัก
  - Theme switcher และ language switcher
  - User authentication state management
  - Responsive design

### 📁 `/middleware/`

**หน้าที่**: เก็บ route middleware สำหรับการควบคุมการเข้าถึง

- `auth.ts` - **Authentication Middleware**

  - ตรวจสอบการ login ก่อนเข้าหน้าใดๆ
  - Redirect ไป login ถ้ายังไม่ได้ login
  - Redirect ไปหน้าแรกถ้า login แล้วแต่พยายามเข้า login page

- `role.ts` - **Role-based Access Control**
  - ตรวจสอบสิทธิ์การเข้าถึงตาม role ของ user
  - รองรับ roles: ADMIN, PHARMACIST, CASHIER

### 📁 `/pages/`

**หน้าที่**: เก็บหน้าเว็บไซต์ (Auto-routing by Nuxt)

#### หน้าหลัก (Main Pages):

- `index.vue` - **Dashboard** - หน้าหลักแสดงสถิติและข้อมูลสำคัญ
- `login.vue` - **Login Page** - หน้าเข้าสู่ระบบ
- `pos.vue` - **Point of Sale** - หน้าขายสินค้า
- `products.vue` - **Product Management** - จัดการสินค้า
- `customers.vue` - **Customer Management** - จัดการลูกค้า
- `suppliers.vue` - **Supplier Management** - จัดการผู้จัดจำหน่าย
- `sales.vue` - **Sales Report** - รายงานการขาย
- `prescriptions.vue` - **Prescription Management** - จัดการใบสั่งยา
- `settings.vue` - **Settings** - ตั้งค่าระบบ
- `profile.vue` - **User Profile** - ข้อมูลผู้ใช้

#### หน้าทดสอบ (Test Pages):

- `auth-test.vue` - ทดสอบระบบ authentication
- `backend-test.vue` - ทดสอบการเชื่อมต่อ backend
- `test-login.vue` - ทดสอบหน้า login
- `debug-config.vue` - ตรวจสอบ configuration
- `theme-demo.vue` - ทดสอบ theme system

### 📁 `/plugins/`

**หน้าที่**: เก็บ Nuxt plugins ที่จะทำงานตอนเริ่มต้นแอป

- `auth.client.ts` - **Client-side Auth Plugin**

  - ตรวจสอบ authentication state ตอนเริ่มต้นแอป
  - เรียก `authStore.checkAuth()` เพื่อ restore session

- `theme.client.ts` - **Client-side Theme Plugin**
  - ตั้งค่า theme ตอนเริ่มต้นแอป
  - ใช้ `useTheme()` เพื่อ apply theme ที่เก็บไว้

### 📁 `/stores/`

**หน้าที่**: เก็บ Pinia stores สำหรับ state management

- `auth.ts` - **Authentication Store**
  - จัดการ user state, token, และ authentication status
  - Methods: `login()`, `logout()`, `checkAuth()`, `refreshUser()`
  - Getters: `isAdmin`, `isPharmacist`, `isCashier`, `hasRole()`, `canAccess()`
  - ใช้ localStorage เก็บ token และ user data

### 📁 `/lib/`

**หน้าที่**: เก็บ utility functions และ helper functions

- `utils.ts` - **Utility Functions**
  - Helper functions ที่ใช้ร่วมกัน
  - Class name utilities สำหรับ Tailwind CSS

### 📁 `/locales/`

**หน้าที่**: เก็บไฟล์ translation สำหรับ i18n (Internationalization)

- รองรับหลายภาษา
- ใช้ร่วมกับ `useLanguage.ts` composable

## ไฟล์ Configuration หลัก

### `package.json`

**Dependencies หลัก:**

- `nuxt: ^3.8.0` - Nuxt 3 framework
- `vue: ^3.3.0` - Vue 3
- `@pinia/nuxt: ^0.5.0` - State management
- `@vueuse/nuxt: ^10.5.0` - Vue composition utilities
- `@nuxtjs/tailwindcss: ^6.10.0` - Tailwind CSS integration
- `radix-vue: ^1.2.0` - UI component library
- `lucide-vue-next: ^0.294.0` - Icon library

### `nuxt.config.ts`

**การตั้งค่าหลัก:**

- Modules: TailwindCSS, Pinia, VueUse
- CSS: `~/assets/css/main.css`
- Runtime Config: API base URL
- Nitro preset: Vercel (สำหรับ deployment)

### `tailwind.config.js`

**การตั้งค่า Tailwind CSS:**

- Dark mode: class-based
- Custom color system สำหรับ theme
- Animation keyframes
- Container settings

### `tsconfig.json`

**การตั้งค่า TypeScript:**

- Strict mode enabled
- Path aliases: `~` และ `@` ไปยัง root directory

## Architecture Patterns

### 1. **Composition API Pattern**

- ใช้ `<script setup>` syntax
- ใช้ composables สำหรับ shared logic
- Reactive state management ด้วย `ref()` และ `computed()`

### 2. **State Management Pattern**

- ใช้ Pinia สำหรับ global state
- Local state ใช้ `ref()` และ `reactive()`
- Persistent state ใช้ localStorage

### 3. **Component Architecture**

- Atomic Design principles
- Reusable UI components ใน `/components/ui/`
- Layout components ใน `/layouts/`
- Page components ใน `/pages/`

### 4. **API Integration Pattern**

- Centralized API client ใน `useApi.ts`
- Automatic token management
- Error handling และ retry logic
- Type-safe API calls

### 5. **Authentication Pattern**

- JWT token-based authentication
- Automatic token refresh
- Role-based access control
- Route protection ด้วย middleware

## การทำงานของระบบ

### 1. **การเริ่มต้นแอป (App Initialization)**

1. Nuxt เริ่มต้นและโหลด plugins
2. `auth.client.ts` ตรวจสอบ authentication state
3. `theme.client.ts` ตั้งค่า theme
4. Layout ถูกโหลดและแสดง navigation

### 2. **การ Authentication**

1. User login ผ่าน `authStore.login()`
2. Token ถูกเก็บใน localStorage และ Pinia store
3. `useApi.ts` เพิ่ม Authorization header อัตโนมัติ
4. Middleware ตรวจสอบ authentication state

### 3. **การจัดการ Theme**

1. `useTheme.ts` จัดการ theme state
2. ใช้ `@vueuse/core` สำหรับ reactive theme switching
3. Theme ถูกเก็บใน localStorage
4. CSS variables ถูกอัปเดตตาม theme

### 4. **การเรียก API**

1. Components ใช้ `useApi()` composable
2. API calls ถูกส่งไปยัง backend
3. Error handling และ token refresh
4. Response ถูกส่งกลับไปยัง component

## Best Practices

### 1. **Code Organization**

- แยก logic ออกเป็น composables
- ใช้ TypeScript สำหรับ type safety
- ตั้งชื่อไฟล์และ function ให้ชัดเจน

### 2. **Performance**

- ใช้ `lazy loading` สำหรับ components
- ใช้ `computed()` สำหรับ derived state
- ใช้ `watchEffect()` สำหรับ side effects

### 3. **Security**

- ตรวจสอบ authentication ใน middleware
- ใช้ role-based access control
- Sanitize user input

### 4. **User Experience**

- Responsive design
- Loading states
- Error handling
- Theme switching

## การพัฒนา (Development)

### การรันโปรเจค:

```bash
# ติดตั้ง dependencies
npm install

# รัน development server
npm run dev

# Build สำหรับ production
npm run build

# Preview production build
npm run preview
```

### Environment Variables:

```env
NUXT_PUBLIC_API_BASE_URL=http://localhost:3000
```

## การ Deploy

### Vercel:

- ใช้ `vercel.json` สำหรับ configuration
- Nitro preset ตั้งเป็น 'vercel'
- Automatic deployment จาก Git

## สรุป

Frontend ของระบบ Pharmacy POS ถูกออกแบบให้เป็น modern, scalable, และ maintainable โดยใช้ Nuxt 3, Vue 3, และ TypeScript ร่วมกับ Tailwind CSS สำหรับ UI และ Pinia สำหรับ state management ระบบรองรับ authentication, theme switching, และ internationalization พร้อมกับ responsive design ที่ทำงานได้ดีบนทุกอุปกรณ์
