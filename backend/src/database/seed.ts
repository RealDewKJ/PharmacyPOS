import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@pharmacy.com' },
    update: {},
    create: {
      email: 'admin@pharmacy.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'ADMIN'
    }
  })

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { name: 'Pain Relief' },
      update: {},
      create: { name: 'Pain Relief', description: 'Pain relief medications' }
    }),
    prisma.category.upsert({
      where: { name: 'Antibiotics' },
      update: {},
      create: { name: 'Antibiotics', description: 'Antibiotic medications' }
    }),
    prisma.category.upsert({
      where: { name: 'Vitamins' },
      update: {},
      create: { name: 'Vitamins', description: 'Vitamin supplements' }
    }),
    prisma.category.upsert({
      where: { name: 'First Aid' },
      update: {},
      create: { name: 'First Aid', description: 'First aid supplies' }
    })
  ])

  // Create suppliers
  const suppliers = await Promise.all([
    prisma.supplier.upsert({
      where: { name: 'PharmaCorp' },
      update: {},
      create: {
        name: 'PharmaCorp',
        email: 'contact@pharmacorp.com',
        phone: '+1234567890',
        address: '123 Pharma Street, Medical City'
      }
    }),
    prisma.supplier.upsert({
      where: { name: 'MedSupply Co' },
      update: {},
      create: {
        name: 'MedSupply Co',
        email: 'info@medsupply.com',
        phone: '+0987654321',
        address: '456 Medical Avenue, Health Town'
      }
    })
  ])

  // Create sample products
  const products = await Promise.all([
    prisma.product.upsert({
      where: { sku: 'PARA001' },
      update: {},
      create: {
        name: 'Paracetamol 500mg',
        description: 'Pain relief tablets',
        sku: 'PARA001',
        barcode: '1234567890123',
        price: 5.99,
        costPrice: 3.50,
        stockQuantity: 100,
        minStockLevel: 20,
        categoryId: categories[0].id,
        supplierId: suppliers[0].id
      }
    }),
    prisma.product.upsert({
      where: { sku: 'IBUP002' },
      update: {},
      create: {
        name: 'Ibuprofen 400mg',
        description: 'Anti-inflammatory pain relief',
        sku: 'IBUP002',
        barcode: '1234567890124',
        price: 7.99,
        costPrice: 4.50,
        stockQuantity: 75,
        minStockLevel: 15,
        categoryId: categories[0].id,
        supplierId: suppliers[0].id
      }
    }),
    prisma.product.upsert({
      where: { sku: 'AMOX003' },
      update: {},
      create: {
        name: 'Amoxicillin 500mg',
        description: 'Antibiotic capsules',
        sku: 'AMOX003',
        barcode: '1234567890125',
        price: 15.99,
        costPrice: 8.50,
        stockQuantity: 50,
        minStockLevel: 10,
        requiresPrescription: true,
        categoryId: categories[1].id,
        supplierId: suppliers[1].id
      }
    }),
    prisma.product.upsert({
      where: { sku: 'VITC004' },
      update: {},
      create: {
        name: 'Vitamin C 1000mg',
        description: 'Vitamin C supplements',
        sku: 'VITC004',
        barcode: '1234567890126',
        price: 12.99,
        costPrice: 6.50,
        stockQuantity: 80,
        minStockLevel: 25,
        categoryId: categories[2].id,
        supplierId: suppliers[1].id
      }
    })
  ])

  // Create sample customers
  const customers = await Promise.all([
    prisma.customer.upsert({
      where: { email: 'john.doe@email.com' },
      update: {},
      create: {
        name: 'John Doe',
        email: 'john.doe@email.com',
        phone: '+1111111111',
        address: '123 Main Street, City'
      }
    }),
    prisma.customer.upsert({
      where: { email: 'jane.smith@email.com' },
      update: {},
      create: {
        name: 'Jane Smith',
        email: 'jane.smith@email.com',
        phone: '+2222222222',
        address: '456 Oak Avenue, Town'
      }
    })
  ])

  console.log('✅ Database seeded successfully!')
  console.log(`👤 Admin user created: ${admin.email}`)
  console.log(`📦 ${categories.length} categories created`)
  console.log(`🏢 ${suppliers.length} suppliers created`)
  console.log(`💊 ${products.length} products created`)
  console.log(`👥 ${customers.length} customers created`)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
