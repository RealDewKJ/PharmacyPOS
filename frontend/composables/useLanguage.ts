import { ref, computed } from 'vue'

// Translation data
const translations = {
  en: {
    pos: {
      title: "Point of Sale",
      subtitle: "Process sales and manage transactions",
      addProducts: "Add Products",
      searchPlaceholder: "Search products by name, SKU, or barcode...",
      search: "Search",
      searchResults: "Search Results",
      stock: "Stock",
      shoppingCart: "Shopping Cart",
      noItemsInCart: "No items in cart",
      customer: "Customer",
      walkInCustomer: "Walk-in Customer",
      paymentMethod: "Payment Method",
      cash: "Cash",
      card: "Card",
      bankTransfer: "Bank Transfer",
      mobileMoney: "Mobile Money",
      discount: "Discount",
      tax: "Tax",
      subtotal: "Subtotal",
      total: "Total",
      completeSale: "Complete Sale",
      processing: "Processing...",
      saleCompleted: "Sale completed successfully!",
      saleError: "Error processing sale. Please try again."
    },
    dashboard: {
      title: "Dashboard",
      subtitle: "Welcome to Pharmacy POS System",
      totalProducts: "Total Products",
      totalRevenue: "Total Revenue",
      totalSales: "Total Sales",
      lowStockItems: "Low Stock Items",
      quickActions: "Quick Actions",
      newSale: "New Sale",
      manageProducts: "Manage Products",
      manageCustomers: "Manage Customers",
      recentSales: "Recent Sales",
      noRecentSales: "No recent sales",
      walkInCustomer: "Walk-in Customer",
      systemStatus: "System Status",
      database: "Database",
      apiServer: "API Server",
      lastBackup: "Last Backup",
      online: "Online",
      running: "Running"
    },
    customers: {
      title: "Customers",
      subtitle: "Manage customer information and history",
      searchPlaceholder: "Search customers...",
      addCustomer: "Add Customer",
      customerList: "Customer List",
      customerListDescription: "All registered customers in the system",
      name: "Name",
      email: "Email",
      phone: "Phone",
      totalOrders: "Total Orders",
      lastVisit: "Last Visit",
      actions: "Actions",
      view: "View",
      edit: "Edit",
      delete: "Delete",
      addNewCustomer: "Add New Customer",
      addNewCustomerDescription: "Enter customer information",
      fullName: "Full Name",
      fullNamePlaceholder: "Enter full name",
      emailPlaceholder: "Enter email",
      phonePlaceholder: "Enter phone number",
      address: "Address",
      addressPlaceholder: "Enter address",
      cancel: "Cancel",
      addCustomerButton: "Add Customer"
    },
    products: {
      title: "Products",
      subtitle: "Manage your pharmacy inventory",
      addProduct: "Add Product",
      searchPlaceholder: "Search products...",
      search: "Search",
      allCategories: "All Categories",
      selectCategory: "Select Category",
      selectSupplier: "Select Supplier",
      supplier: "Supplier",
      name: "Name",
      sku: "SKU",
      category: "Category",
      price: "Price",
      stock: "Stock",
      status: "Status",
      actions: "Actions",
      active: "Active",
      inactive: "Inactive",
      edit: "Edit",
      delete: "Delete",
      previous: "Previous",
      next: "Next",
      page: "Page",
      of: "of",
      editProduct: "Edit Product",
      addNewProduct: "Add New Product",
      description: "Description",
      costPrice: "Cost Price",
      stockQuantity: "Stock Quantity",
      minStockLevel: "Min Stock Level",
      barcode: "Barcode",
      requiresPrescription: "Requires Prescription",
      saving: "Saving...",
      update: "Update",
      create: "Create",
      deleteConfirm: "Are you sure you want to delete this product?"
    },
    common: {
      language: "Language",
      english: "English",
      thai: "ไทย"
    }
  },
  th: {
    pos: {
      title: "จุดขาย",
      subtitle: "ประมวลผลการขายและจัดการธุรกรรม",
      addProducts: "เพิ่มสินค้า",
      searchPlaceholder: "ค้นหาสินค้าตามชื่อ, SKU, หรือบาร์โค้ด...",
      search: "ค้นหา",
      searchResults: "ผลการค้นหา",
      stock: "สต็อก",
      shoppingCart: "ตะกร้าสินค้า",
      noItemsInCart: "ไม่มีสินค้าในตะกร้า",
      customer: "ลูกค้า",
      walkInCustomer: "ลูกค้าเดินเข้า",
      paymentMethod: "วิธีการชำระเงิน",
      cash: "เงินสด",
      card: "บัตร",
      bankTransfer: "โอนเงินผ่านธนาคาร",
      mobileMoney: "เงินมือถือ",
      discount: "ส่วนลด",
      tax: "ภาษี",
      subtotal: "ยอดรวมย่อย",
      total: "ยอดรวม",
      completeSale: "เสร็จสิ้นการขาย",
      processing: "กำลังประมวลผล...",
      saleCompleted: "การขายเสร็จสิ้นเรียบร้อยแล้ว!",
      saleError: "เกิดข้อผิดพลาดในการประมวลผลการขาย กรุณาลองใหม่อีกครั้ง"
    },
    dashboard: {
      title: "แดชบอร์ด",
      subtitle: "ยินดีต้อนรับสู่ระบบ POS ร้านขายยา",
      totalProducts: "สินค้าทั้งหมด",
      totalRevenue: "รายได้รวม",
      totalSales: "การขายรวม",
      lowStockItems: "สินค้าสต็อกต่ำ",
      quickActions: "การดำเนินการด่วน",
      newSale: "ขายใหม่",
      manageProducts: "จัดการสินค้า",
      manageCustomers: "จัดการลูกค้า",
      recentSales: "การขายล่าสุด",
      noRecentSales: "ไม่มีการขายล่าสุด",
      walkInCustomer: "ลูกค้าเดินเข้า",
      systemStatus: "สถานะระบบ",
      database: "ฐานข้อมูล",
      apiServer: "เซิร์ฟเวอร์ API",
      lastBackup: "การสำรองข้อมูลล่าสุด",
      online: "ออนไลน์",
      running: "กำลังทำงาน"
    },
    customers: {
      title: "ลูกค้า",
      subtitle: "จัดการข้อมูลลูกค้าและประวัติ",
      searchPlaceholder: "ค้นหาลูกค้า...",
      addCustomer: "เพิ่มลูกค้า",
      customerList: "รายชื่อลูกค้า",
      customerListDescription: "ลูกค้าทั้งหมดที่ลงทะเบียนในระบบ",
      name: "ชื่อ",
      email: "อีเมล",
      phone: "โทรศัพท์",
      totalOrders: "คำสั่งซื้อรวม",
      lastVisit: "การเยี่ยมล่าสุด",
      actions: "การดำเนินการ",
      view: "ดู",
      edit: "แก้ไข",
      delete: "ลบ",
      addNewCustomer: "เพิ่มลูกค้าใหม่",
      addNewCustomerDescription: "ป้อนข้อมูลลูกค้า",
      fullName: "ชื่อเต็ม",
      fullNamePlaceholder: "ป้อนชื่อเต็ม",
      emailPlaceholder: "ป้อนอีเมล",
      phonePlaceholder: "ป้อนหมายเลขโทรศัพท์",
      address: "ที่อยู่",
      addressPlaceholder: "ป้อนที่อยู่",
      cancel: "ยกเลิก",
      addCustomerButton: "เพิ่มลูกค้า"
    },
    products: {
      title: "สินค้า",
      subtitle: "จัดการสินค้าคงคลังร้านขายยา",
      addProduct: "เพิ่มสินค้า",
      searchPlaceholder: "ค้นหาสินค้า...",
      search: "ค้นหา",
      allCategories: "หมวดหมู่ทั้งหมด",
      selectCategory: "เลือกหมวดหมู่",
      selectSupplier: "เลือกซัพพลายเออร์",
      supplier: "ซัพพลายเออร์",
      name: "ชื่อ",
      sku: "รหัสสินค้า",
      category: "หมวดหมู่",
      price: "ราคา",
      stock: "สต็อก",
      status: "สถานะ",
      actions: "การดำเนินการ",
      active: "ใช้งาน",
      inactive: "ไม่ใช้งาน",
      edit: "แก้ไข",
      delete: "ลบ",
      previous: "ก่อนหน้า",
      next: "ถัดไป",
      page: "หน้า",
      of: "จาก",
      editProduct: "แก้ไขสินค้า",
      addNewProduct: "เพิ่มสินค้าใหม่",
      description: "คำอธิบาย",
      costPrice: "ต้นทุน",
      stockQuantity: "จำนวนสต็อก",
      minStockLevel: "ระดับสต็อกขั้นต่ำ",
      barcode: "บาร์โค้ด",
      requiresPrescription: "ต้องมีใบสั่งยา",
      saving: "กำลังบันทึก...",
      update: "อัปเดต",
      create: "สร้าง",
      deleteConfirm: "คุณแน่ใจหรือไม่ที่จะลบสินค้านี้?"
    },
    common: {
      language: "ภาษา",
      english: "English",
      thai: "ไทย"
    }
  }
}

// Language state
const currentLanguage = ref<'en' | 'th'>('en')

// Initialize language from localStorage
if (process.client) {
  const savedLanguage = localStorage.getItem('language') as 'en' | 'th'
  if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'th')) {
    currentLanguage.value = savedLanguage
  }
}

// Computed translations
const t = computed(() => translations[currentLanguage.value])

// Language options
const languageOptions = [
  { value: 'en', label: 'English', icon: '🇺🇸' },
  { value: 'th', label: 'ไทย', icon: '🇹🇭' }
]

// Functions
const setLanguage = (lang: 'en' | 'th') => {
  currentLanguage.value = lang
  if (process.client) {
    localStorage.setItem('language', lang)
  }
}

const getCurrentLanguage = () => currentLanguage.value

export function useLanguage() {
  return {
    t,
    currentLanguage,
    languageOptions,
    setLanguage,
    getCurrentLanguage
  }
}