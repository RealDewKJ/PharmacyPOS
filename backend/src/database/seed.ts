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
    }),
    prisma.category.upsert({
      where: { name: 'Cardiovascular' },
      update: {},
      create: { name: 'Cardiovascular', description: 'Heart and blood vessel medications' }
    }),
    prisma.category.upsert({
      where: { name: 'Diabetes' },
      update: {},
      create: { name: 'Diabetes', description: 'Diabetes management medications' }
    }),
    prisma.category.upsert({
      where: { name: 'Respiratory' },
      update: {},
      create: { name: 'Respiratory', description: 'Respiratory system medications' }
    }),
    prisma.category.upsert({
      where: { name: 'Digestive' },
      update: {},
      create: { name: 'Digestive', description: 'Digestive system medications' }
    }),
    prisma.category.upsert({
      where: { name: 'Neurological' },
      update: {},
      create: { name: 'Neurological', description: 'Nervous system medications' }
    }),
    prisma.category.upsert({
      where: { name: 'Dermatology' },
      update: {},
      create: { name: 'Dermatology', description: 'Skin care medications' }
    }),
    prisma.category.upsert({
      where: { name: 'Hormonal' },
      update: {},
      create: { name: 'Hormonal', description: 'Hormone-related medications' }
    }),
    prisma.category.upsert({
      where: { name: 'Antihistamines' },
      update: {},
      create: { name: 'Antihistamines', description: 'Allergy and antihistamine medications' }
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
    }),
    prisma.supplier.upsert({
      where: { name: 'ThaiMed Solutions' },
      update: {},
      create: {
        name: 'ThaiMed Solutions',
        email: 'sales@thaimed.com',
        phone: '+66812345678',
        address: '789 Sukhumvit Road, Bangkok 10110'
      }
    }),
    prisma.supplier.upsert({
      where: { name: 'Bangkok Pharma' },
      update: {},
      create: {
        name: 'Bangkok Pharma',
        email: 'orders@bangkokpharma.co.th',
        phone: '+66876543210',
        address: '456 Silom Road, Bangkok 10500'
      }
    }),
    prisma.supplier.upsert({
      where: { name: 'MediCare Thailand' },
      update: {},
      create: {
        name: 'MediCare Thailand',
        email: 'info@medicarethailand.com',
        phone: '+66890123456',
        address: '321 Rama IV Road, Bangkok 10330'
      }
    }),
    prisma.supplier.upsert({
      where: { name: 'HealthFirst Distributors' },
      update: {},
      create: {
        name: 'HealthFirst Distributors',
        email: 'contact@healthfirst.co.th',
        phone: '+66823456789',
        address: '654 Petchaburi Road, Bangkok 10400'
      }
    })
  ])

  const products = await Promise.all([
    // Pain Relief Medications
    prisma.product.upsert({
      where: { sku: 'PARA001' },
      update: {},
      create: {
        name: 'Paracetamol 500mg',
        description: 'Pain relief tablets',
        sku: 'PARA001',
        barcode: '1234567890123',
        price: 25.00,
        costPrice: 15.00,
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
        price: 35.00,
        costPrice: 20.00,
        stockQuantity: 75,
        minStockLevel: 15,
        categoryId: categories[0].id,
        supplierId: suppliers[0].id
      }
    }),
    prisma.product.upsert({
      where: { sku: 'ASP003' },
      update: {},
      create: {
        name: 'Aspirin 300mg',
        description: 'Pain relief and blood thinner',
        sku: 'ASP003',
        barcode: '1234567890125',
        price: 30.00,
        costPrice: 18.00,
        stockQuantity: 80,
        minStockLevel: 20,
        categoryId: categories[0].id,
        supplierId: suppliers[1].id
      }
    }),
    prisma.product.upsert({
      where: { sku: 'NAPR004' },
      update: {},
      create: {
        name: 'Naproxen 250mg',
        description: 'Anti-inflammatory pain relief',
        sku: 'NAPR004',
        barcode: '1234567890126',
        price: 45.00,
        costPrice: 28.00,
        stockQuantity: 60,
        minStockLevel: 12,
        categoryId: categories[0].id,
        supplierId: suppliers[1].id
      }
    }),
    prisma.product.upsert({
      where: { sku: 'DICL005' },
      update: {},
      create: {
        name: 'Diclofenac 50mg',
        description: 'Anti-inflammatory pain relief',
        sku: 'DICL005',
        barcode: '1234567890127',
        price: 40.00,
        costPrice: 25.00,
        stockQuantity: 70,
        minStockLevel: 15,
        categoryId: categories[0].id,
        supplierId: suppliers[2].id
      }
    }),

    // Antibiotics
    prisma.product.upsert({
      where: { sku: 'AMOX003' },
      update: {},
      create: {
        name: 'Amoxicillin 500mg',
        description: 'Antibiotic capsules',
        sku: 'AMOX003',
        barcode: '1234567890128',
        price: 65.00,
        costPrice: 40.00,
        stockQuantity: 50,
        minStockLevel: 10,
        requiresPrescription: true,
        categoryId: categories[1].id,
        supplierId: suppliers[1].id
      }
    }),
    prisma.product.upsert({
      where: { sku: 'AMPI006' },
      update: {},
      create: {
        name: 'Ampicillin 250mg',
        description: 'Antibiotic capsules',
        sku: 'AMPI006',
        barcode: '1234567890129',
        price: 55.00,
        costPrice: 35.00,
        stockQuantity: 45,
        minStockLevel: 10,
        requiresPrescription: true,
        categoryId: categories[1].id,
        supplierId: suppliers[2].id
      }
    }),
    prisma.product.upsert({
      where: { sku: 'CIPR007' },
      update: {},
      create: {
        name: 'Ciprofloxacin 500mg',
        description: 'Broad spectrum antibiotic',
        sku: 'CIPR007',
        barcode: '1234567890130',
        price: 85.00,
        costPrice: 55.00,
        stockQuantity: 40,
        minStockLevel: 8,
        requiresPrescription: true,
        categoryId: categories[1].id,
        supplierId: suppliers[3].id
      }
    }),
    prisma.product.upsert({
      where: { sku: 'ERYT008' },
      update: {},
      create: {
        name: 'Erythromycin 250mg',
        description: 'Antibiotic tablets',
        sku: 'ERYT008',
        barcode: '1234567890131',
        price: 75.00,
        costPrice: 48.00,
        stockQuantity: 35,
        minStockLevel: 8,
        requiresPrescription: true,
        categoryId: categories[1].id,
        supplierId: suppliers[4].id
      }
    }),
    prisma.product.upsert({
      where: { sku: 'TETR009' },
      update: {},
      create: {
        name: 'Tetracycline 250mg',
        description: 'Antibiotic capsules',
        sku: 'TETR009',
        barcode: '1234567890132',
        price: 70.00,
        costPrice: 45.00,
        stockQuantity: 30,
        minStockLevel: 6,
        requiresPrescription: true,
        categoryId: categories[1].id,
        supplierId: suppliers[5].id
      }
    }),

    // Vitamins
    prisma.product.upsert({
      where: { sku: 'VITC004' },
      update: {},
      create: {
        name: 'Vitamin C 1000mg',
        description: 'Vitamin C supplements',
        sku: 'VITC004',
        barcode: '1234567890133',
        price: 55.00,
        costPrice: 35.00,
        stockQuantity: 80,
        minStockLevel: 25,
        categoryId: categories[2].id,
        supplierId: suppliers[1].id
      }
    }),
    prisma.product.upsert({
      where: { sku: 'VITD010' },
      update: {},
      create: {
        name: 'Vitamin D3 1000IU',
        description: 'Vitamin D supplements',
        sku: 'VITD010',
        barcode: '1234567890134',
        price: 65.00,
        costPrice: 40.00,
        stockQuantity: 70,
        minStockLevel: 20,
        categoryId: categories[2].id,
        supplierId: suppliers[2].id
      }
    }),
    prisma.product.upsert({
      where: { sku: 'VITB011' },
      update: {},
      create: {
        name: 'Vitamin B Complex',
        description: 'B-complex vitamin tablets',
        sku: 'VITB011',
        barcode: '1234567890135',
        price: 45.00,
        costPrice: 28.00,
        stockQuantity: 90,
        minStockLevel: 25,
        categoryId: categories[2].id,
        supplierId: suppliers[3].id
      }
    }),
    prisma.product.upsert({
      where: { sku: 'VITE012' },
      update: {},
      create: {
        name: 'Vitamin E 400IU',
        description: 'Vitamin E capsules',
        sku: 'VITE012',
        barcode: '1234567890136',
        price: 50.00,
        costPrice: 32.00,
        stockQuantity: 75,
        minStockLevel: 20,
        categoryId: categories[2].id,
        supplierId: suppliers[4].id
      }
    }),
    prisma.product.upsert({
      where: { sku: 'MULT013' },
      update: {},
      create: {
        name: 'Multivitamin Tablets',
        description: 'Complete multivitamin supplement',
        sku: 'MULT013',
        barcode: '1234567890137',
        price: 85.00,
        costPrice: 55.00,
        stockQuantity: 60,
        minStockLevel: 15,
        categoryId: categories[2].id,
        supplierId: suppliers[5].id
      }
    }),

    // First Aid
    prisma.product.upsert({
      where: { sku: 'BAND014' },
      update: {},
      create: {
        name: 'Bandages (Pack of 10)',
        description: 'Adhesive bandages',
        sku: 'BAND014',
        barcode: '1234567890138',
        price: 25.00,
        costPrice: 15.00,
        stockQuantity: 120,
        minStockLevel: 30,
        categoryId: categories[3].id,
        supplierId: suppliers[0].id
      }
    }),
    prisma.product.upsert({
      where: { sku: 'GAUZ015' },
      update: {},
      create: {
        name: 'Gauze Pads 4x4',
        description: 'Sterile gauze pads',
        sku: 'GAUZ015',
        barcode: '1234567890139',
        price: 35.00,
        costPrice: 22.00,
        stockQuantity: 80,
        minStockLevel: 20,
        categoryId: categories[3].id,
        supplierId: suppliers[1].id
      }
    }),
    prisma.product.upsert({
      where: { sku: 'ANTI016' },
      update: {},
      create: {
        name: 'Antiseptic Solution',
        description: 'Antiseptic wound cleaner',
        sku: 'ANTI016',
        barcode: '1234567890140',
        price: 40.00,
        costPrice: 25.00,
        stockQuantity: 60,
        minStockLevel: 15,
        categoryId: categories[3].id,
        supplierId: suppliers[2].id
      }
    }),
    prisma.product.upsert({
      where: { sku: 'THER017' },
      update: {},
      create: {
        name: 'Digital Thermometer',
        description: 'Electronic thermometer',
        sku: 'THER017',
        barcode: '1234567890141',
        price: 150.00,
        costPrice: 95.00,
        stockQuantity: 25,
        minStockLevel: 5,
        categoryId: categories[3].id,
        supplierId: suppliers[3].id
      }
    }),
    prisma.product.upsert({
      where: { sku: 'ICE018' },
      update: {},
      create: {
        name: 'Ice Pack',
        description: 'Reusable ice pack',
        sku: 'ICE018',
        barcode: '1234567890142',
        price: 45.00,
        costPrice: 28.00,
        stockQuantity: 40,
        minStockLevel: 10,
        categoryId: categories[3].id,
        supplierId: suppliers[4].id
      }
    }),

    // Cardiovascular
    prisma.product.upsert({
      where: { sku: 'ATEN019' },
      update: {},
      create: {
        name: 'Atenolol 50mg',
        description: 'Beta blocker for hypertension',
        sku: 'ATEN019',
        barcode: '1234567890143',
        price: 45.00,
        costPrice: 28.00,
        stockQuantity: 50,
        minStockLevel: 10,
        requiresPrescription: true,
        categoryId: categories[4].id,
        supplierId: suppliers[2].id
      }
    }),
    prisma.product.upsert({
      where: { sku: 'LISI020' },
      update: {},
      create: {
        name: 'Lisinopril 10mg',
        description: 'ACE inhibitor for hypertension',
        sku: 'LISI020',
        barcode: '1234567890144',
        price: 55.00,
        costPrice: 35.00,
        stockQuantity: 45,
        minStockLevel: 10,
        requiresPrescription: true,
        categoryId: categories[4].id,
        supplierId: suppliers[3].id
      }
    }),
    prisma.product.upsert({
      where: { sku: 'SIMV021' },
      update: {},
      create: {
        name: 'Simvastatin 20mg',
        description: 'Cholesterol lowering medication',
        sku: 'SIMV021',
        barcode: '1234567890145',
        price: 65.00,
        costPrice: 40.00,
        stockQuantity: 40,
        minStockLevel: 8,
        requiresPrescription: true,
        categoryId: categories[4].id,
        supplierId: suppliers[4].id
      }
    }),
    prisma.product.upsert({
      where: { sku: 'DIGO022' },
      update: {},
      create: {
        name: 'Digoxin 0.25mg',
        description: 'Heart medication',
        sku: 'DIGO022',
        barcode: '1234567890146',
        price: 35.00,
        costPrice: 22.00,
        stockQuantity: 30,
        minStockLevel: 6,
        requiresPrescription: true,
        categoryId: categories[4].id,
        supplierId: suppliers[5].id
      }
    }),
    prisma.product.upsert({
      where: { sku: 'NITR023' },
      update: {},
      create: {
        name: 'Nitroglycerin 0.5mg',
        description: 'Heart medication for angina',
        sku: 'NITR023',
        barcode: '1234567890147',
        price: 75.00,
        costPrice: 48.00,
        stockQuantity: 25,
        minStockLevel: 5,
        requiresPrescription: true,
        categoryId: categories[4].id,
        supplierId: suppliers[0].id
      }
    }),

    // Diabetes
    prisma.product.upsert({
      where: { sku: 'METF024' },
      update: {},
      create: {
        name: 'Metformin 500mg',
        description: 'Diabetes medication',
        sku: 'METF024',
        barcode: '1234567890148',
        price: 40.00,
        costPrice: 25.00,
        stockQuantity: 60,
        minStockLevel: 12,
        requiresPrescription: true,
        categoryId: categories[5].id,
        supplierId: suppliers[1].id
      }
    }),
    prisma.product.upsert({
      where: { sku: 'GLIP025' },
      update: {},
      create: {
        name: 'Glipizide 5mg',
        description: 'Diabetes medication',
        sku: 'GLIP025',
        barcode: '1234567890149',
        price: 50.00,
        costPrice: 32.00,
        stockQuantity: 45,
        minStockLevel: 10,
        requiresPrescription: true,
        categoryId: categories[5].id,
        supplierId: suppliers[2].id
      }
    }),
    prisma.product.upsert({
      where: { sku: 'INSU026' },
      update: {},
      create: {
        name: 'Insulin Syringes (Pack of 10)',
        description: 'Insulin injection syringes',
        sku: 'INSU026',
        barcode: '1234567890150',
        price: 85.00,
        costPrice: 55.00,
        stockQuantity: 30,
        minStockLevel: 8,
        categoryId: categories[5].id,
        supplierId: suppliers[3].id
      }
    }),
    prisma.product.upsert({
      where: { sku: 'GLUC027' },
      update: {},
      create: {
        name: 'Glucose Test Strips',
        description: 'Blood glucose test strips',
        sku: 'GLUC027',
        barcode: '1234567890151',
        price: 120.00,
        costPrice: 80.00,
        stockQuantity: 25,
        minStockLevel: 5,
        categoryId: categories[5].id,
        supplierId: suppliers[4].id
      }
    }),
    prisma.product.upsert({
      where: { sku: 'ACAR028' },
      update: {},
      create: {
        name: 'Acarbose 50mg',
        description: 'Diabetes medication',
        sku: 'ACAR028',
        barcode: '1234567890152',
        price: 65.00,
        costPrice: 40.00,
        stockQuantity: 35,
        minStockLevel: 8,
        requiresPrescription: true,
        categoryId: categories[5].id,
        supplierId: suppliers[5].id
      }
    }),

    // Respiratory
    prisma.product.upsert({
      where: { sku: 'SALB029' },
      update: {},
      create: {
        name: 'Salbutamol Inhaler',
        description: 'Bronchodilator inhaler',
        sku: 'SALB029',
        barcode: '1234567890153',
        price: 95.00,
        costPrice: 60.00,
        stockQuantity: 40,
        minStockLevel: 8,
        requiresPrescription: true,
        categoryId: categories[6].id,
        supplierId: suppliers[0].id
      }
    }),
    prisma.product.upsert({
      where: { sku: 'BECL030' },
      update: {},
      create: {
        name: 'Beclomethasone Inhaler',
        description: 'Steroid inhaler for asthma',
        sku: 'BECL030',
        barcode: '1234567890154',
        price: 110.00,
        costPrice: 70.00,
        stockQuantity: 35,
        minStockLevel: 8,
        requiresPrescription: true,
        categoryId: categories[6].id,
        supplierId: suppliers[1].id
      }
    }),
    prisma.product.upsert({
      where: { sku: 'COUG031' },
      update: {},
      create: {
        name: 'Cough Syrup',
        description: 'Expectorant cough syrup',
        sku: 'COUG031',
        barcode: '1234567890155',
        price: 35.00,
        costPrice: 22.00,
        stockQuantity: 80,
        minStockLevel: 20,
        categoryId: categories[6].id,
        supplierId: suppliers[2].id
      }
    }),
    prisma.product.upsert({
      where: { sku: 'DECO032' },
      update: {},
      create: {
        name: 'Decongestant Tablets',
        description: 'Nasal decongestant',
        sku: 'DECO032',
        barcode: '1234567890156',
        price: 30.00,
        costPrice: 18.00,
        stockQuantity: 70,
        minStockLevel: 15,
        categoryId: categories[6].id,
        supplierId: suppliers[3].id
      }
    }),
    prisma.product.upsert({
      where: { sku: 'MONT033' },
      update: {},
      create: {
        name: 'Montelukast 10mg',
        description: 'Asthma prevention medication',
        sku: 'MONT033',
        barcode: '1234567890157',
        price: 75.00,
        costPrice: 48.00,
        stockQuantity: 30,
        minStockLevel: 8,
        requiresPrescription: true,
        categoryId: categories[6].id,
        supplierId: suppliers[4].id
      }
    }),

    // Digestive
    prisma.product.upsert({
      where: { sku: 'OMEP034' },
      update: {},
      create: {
        name: 'Omeprazole 20mg',
        description: 'Proton pump inhibitor',
        sku: 'OMEP034',
        barcode: '1234567890158',
        price: 50.00,
        costPrice: 32.00,
        stockQuantity: 60,
        minStockLevel: 12,
        categoryId: categories[7].id,
        supplierId: suppliers[5].id
      }
    }),
    prisma.product.upsert({
      where: { sku: 'RANI035' },
      update: {},
      create: {
        name: 'Ranitidine 150mg',
        description: 'H2 blocker for acid reflux',
        sku: 'RANI035',
        barcode: '1234567890159',
        price: 40.00,
        costPrice: 25.00,
        stockQuantity: 70,
        minStockLevel: 15,
        categoryId: categories[7].id,
        supplierId: suppliers[0].id
      }
    }),
    prisma.product.upsert({
      where: { sku: 'DOME036' },
      update: {},
      create: {
        name: 'Domperidone 10mg',
        description: 'Anti-nausea medication',
        sku: 'DOME036',
        barcode: '1234567890160',
        price: 35.00,
        costPrice: 22.00,
        stockQuantity: 50,
        minStockLevel: 10,
        categoryId: categories[7].id,
        supplierId: suppliers[1].id
      }
    }),
    prisma.product.upsert({
      where: { sku: 'LAXA037' },
      update: {},
      create: {
        name: 'Laxative Tablets',
        description: 'Constipation relief',
        sku: 'LAXA037',
        barcode: '1234567890161',
        price: 25.00,
        costPrice: 15.00,
        stockQuantity: 80,
        minStockLevel: 20,
        categoryId: categories[7].id,
        supplierId: suppliers[2].id
      }
    }),
    prisma.product.upsert({
      where: { sku: 'ANTI038' },
      update: {},
      create: {
        name: 'Antacid Tablets',
        description: 'Acid neutralizer',
        sku: 'ANTI038',
        barcode: '1234567890162',
        price: 20.00,
        costPrice: 12.00,
        stockQuantity: 100,
        minStockLevel: 25,
        categoryId: categories[7].id,
        supplierId: suppliers[3].id
      }
    }),

    // Neurological
    prisma.product.upsert({
      where: { sku: 'CARB039' },
      update: {},
      create: {
        name: 'Carbamazepine 200mg',
        description: 'Anticonvulsant medication',
        sku: 'CARB039',
        barcode: '1234567890163',
        price: 65.00,
        costPrice: 40.00,
        stockQuantity: 30,
        minStockLevel: 6,
        requiresPrescription: true,
        categoryId: categories[8].id,
        supplierId: suppliers[4].id
      }
    }),
    prisma.product.upsert({
      where: { sku: 'PHEN040' },
      update: {},
      create: {
        name: 'Phenytoin 100mg',
        description: 'Anticonvulsant medication',
        sku: 'PHEN040',
        barcode: '1234567890164',
        price: 55.00,
        costPrice: 35.00,
        stockQuantity: 25,
        minStockLevel: 5,
        requiresPrescription: true,
        categoryId: categories[8].id,
        supplierId: suppliers[5].id
      }
    }),
    prisma.product.upsert({
      where: { sku: 'DIAZ041' },
      update: {},
      create: {
        name: 'Diazepam 5mg',
        description: 'Anxiolytic medication',
        sku: 'DIAZ041',
        barcode: '1234567890165',
        price: 45.00,
        costPrice: 28.00,
        stockQuantity: 20,
        minStockLevel: 4,
        requiresPrescription: true,
        categoryId: categories[8].id,
        supplierId: suppliers[0].id
      }
    }),
    prisma.product.upsert({
      where: { sku: 'FLUO042' },
      update: {},
      create: {
        name: 'Fluoxetine 20mg',
        description: 'Antidepressant medication',
        sku: 'FLUO042',
        barcode: '1234567890166',
        price: 60.00,
        costPrice: 38.00,
        stockQuantity: 35,
        minStockLevel: 8,
        requiresPrescription: true,
        categoryId: categories[8].id,
        supplierId: suppliers[1].id
      }
    }),
    prisma.product.upsert({
      where: { sku: 'AMIT043' },
      update: {},
      create: {
        name: 'Amitriptyline 25mg',
        description: 'Antidepressant medication',
        sku: 'AMIT043',
        barcode: '1234567890167',
        price: 50.00,
        costPrice: 32.00,
        stockQuantity: 30,
        minStockLevel: 6,
        requiresPrescription: true,
        categoryId: categories[8].id,
        supplierId: suppliers[2].id
      }
    }),

    // Dermatology
    prisma.product.upsert({
      where: { sku: 'HYDR044' },
      update: {},
      create: {
        name: 'Hydrocortisone Cream 1%',
        description: 'Topical steroid cream',
        sku: 'HYDR044',
        barcode: '1234567890168',
        price: 35.00,
        costPrice: 22.00,
        stockQuantity: 60,
        minStockLevel: 15,
        categoryId: categories[9].id,
        supplierId: suppliers[3].id
      }
    }),
    prisma.product.upsert({
      where: { sku: 'CLOT045' },
      update: {},
      create: {
        name: 'Clotrimazole Cream',
        description: 'Antifungal cream',
        sku: 'CLOT045',
        barcode: '1234567890169',
        price: 40.00,
        costPrice: 25.00,
        stockQuantity: 50,
        minStockLevel: 12,
        categoryId: categories[9].id,
        supplierId: suppliers[4].id
      }
    }),
    prisma.product.upsert({
      where: { sku: 'BENZ046' },
      update: {},
      create: {
        name: 'Benzoyl Peroxide Gel 5%',
        description: 'Acne treatment gel',
        sku: 'BENZ046',
        barcode: '1234567890170',
        price: 45.00,
        costPrice: 28.00,
        stockQuantity: 40,
        minStockLevel: 10,
        categoryId: categories[9].id,
        supplierId: suppliers[5].id
      }
    }),
    prisma.product.upsert({
      where: { sku: 'CALM047' },
      update: {},
      create: {
        name: 'Calamine Lotion',
        description: 'Skin soothing lotion',
        sku: 'CALM047',
        barcode: '1234567890171',
        price: 30.00,
        costPrice: 18.00,
        stockQuantity: 70,
        minStockLevel: 18,
        categoryId: categories[9].id,
        supplierId: suppliers[0].id
      }
    }),
    prisma.product.upsert({
      where: { sku: 'SUN048' },
      update: {},
      create: {
        name: 'Sunscreen SPF 50',
        description: 'Sun protection lotion',
        sku: 'SUN048',
        barcode: '1234567890172',
        price: 85.00,
        costPrice: 55.00,
        stockQuantity: 35,
        minStockLevel: 8,
        categoryId: categories[9].id,
        supplierId: suppliers[1].id
      }
    }),

    // Hormonal
    prisma.product.upsert({
      where: { sku: 'LEVO049' },
      update: {},
      create: {
        name: 'Levothyroxine 50mcg',
        description: 'Thyroid hormone replacement',
        sku: 'LEVO049',
        barcode: '1234567890173',
        price: 45.00,
        costPrice: 28.00,
        stockQuantity: 40,
        minStockLevel: 8,
        requiresPrescription: true,
        categoryId: categories[10].id,
        supplierId: suppliers[2].id
      }
    }),
    prisma.product.upsert({
      where: { sku: 'PRED050' },
      update: {},
      create: {
        name: 'Prednisolone 5mg',
        description: 'Corticosteroid medication',
        sku: 'PRED050',
        barcode: '1234567890174',
        price: 35.00,
        costPrice: 22.00,
        stockQuantity: 50,
        minStockLevel: 10,
        requiresPrescription: true,
        categoryId: categories[10].id,
        supplierId: suppliers[3].id
      }
    }),
    prisma.product.upsert({
      where: { sku: 'ESTR051' },
      update: {},
      create: {
        name: 'Estradiol 2mg',
        description: 'Hormone replacement therapy',
        sku: 'ESTR051',
        barcode: '1234567890175',
        price: 75.00,
        costPrice: 48.00,
        stockQuantity: 25,
        minStockLevel: 5,
        requiresPrescription: true,
        categoryId: categories[10].id,
        supplierId: suppliers[4].id
      }
    }),
    prisma.product.upsert({
      where: { sku: 'TESTO052' },
      update: {},
      create: {
        name: 'Testosterone Gel 1%',
        description: 'Hormone replacement therapy',
        sku: 'TESTO052',
        barcode: '1234567890176',
        price: 120.00,
        costPrice: 80.00,
        stockQuantity: 20,
        minStockLevel: 4,
        requiresPrescription: true,
        categoryId: categories[10].id,
        supplierId: suppliers[5].id
      }
    }),
    prisma.product.upsert({
      where: { sku: 'PROG053' },
      update: {},
      create: {
        name: 'Progesterone 200mg',
        description: 'Hormone replacement therapy',
        sku: 'PROG053',
        barcode: '1234567890177',
        price: 65.00,
        costPrice: 40.00,
        stockQuantity: 30,
        minStockLevel: 6,
        requiresPrescription: true,
        categoryId: categories[10].id,
        supplierId: suppliers[0].id
      }
    }),

    // Antihistamines
    prisma.product.upsert({
      where: { sku: 'LORA054' },
      update: {},
      create: {
        name: 'Loratadine 10mg',
        description: 'Antihistamine tablets',
        sku: 'LORA054',
        barcode: '1234567890178',
        price: 30.00,
        costPrice: 18.00,
        stockQuantity: 80,
        minStockLevel: 20,
        categoryId: categories[11].id,
        supplierId: suppliers[1].id
      }
    }),
    prisma.product.upsert({
      where: { sku: 'CETI055' },
      update: {},
      create: {
        name: 'Cetirizine 10mg',
        description: 'Antihistamine tablets',
        sku: 'CETI055',
        barcode: '1234567890179',
        price: 35.00,
        costPrice: 22.00,
        stockQuantity: 75,
        minStockLevel: 18,
        categoryId: categories[11].id,
        supplierId: suppliers[2].id
      }
    }),
    prisma.product.upsert({
      where: { sku: 'DIPH056' },
      update: {},
      create: {
        name: 'Diphenhydramine 25mg',
        description: 'Antihistamine tablets',
        sku: 'DIPH056',
        barcode: '1234567890180',
        price: 25.00,
        costPrice: 15.00,
        stockQuantity: 90,
        minStockLevel: 22,
        categoryId: categories[11].id,
        supplierId: suppliers[3].id
      }
    }),
    prisma.product.upsert({
      where: { sku: 'FEXO057' },
      update: {},
      create: {
        name: 'Fexofenadine 120mg',
        description: 'Antihistamine tablets',
        sku: 'FEXO057',
        barcode: '1234567890181',
        price: 40.00,
        costPrice: 25.00,
        stockQuantity: 60,
        minStockLevel: 15,
        categoryId: categories[11].id,
        supplierId: suppliers[4].id
      }
    }),
    prisma.product.upsert({
      where: { sku: 'CHLO058' },
      update: {},
      create: {
        name: 'Chlorpheniramine 4mg',
        description: 'Antihistamine tablets',
        sku: 'CHLO058',
        barcode: '1234567890182',
        price: 20.00,
        costPrice: 12.00,
        stockQuantity: 100,
        minStockLevel: 25,
        categoryId: categories[11].id,
        supplierId: suppliers[5].id
      }
    }),

    // Additional Pain Relief
    prisma.product.upsert({
      where: { sku: 'TRAM059' },
      update: {},
      create: {
        name: 'Tramadol 50mg',
        description: 'Pain relief tablets',
        sku: 'TRAM059',
        barcode: '1234567890183',
        price: 55.00,
        costPrice: 35.00,
        stockQuantity: 40,
        minStockLevel: 8,
        requiresPrescription: true,
        categoryId: categories[0].id,
        supplierId: suppliers[0].id
      }
    }),
    prisma.product.upsert({
      where: { sku: 'CODE060' },
      update: {},
      create: {
        name: 'Codeine 30mg',
        description: 'Pain relief tablets',
        sku: 'CODE060',
        barcode: '1234567890184',
        price: 45.00,
        costPrice: 28.00,
        stockQuantity: 30,
        minStockLevel: 6,
        requiresPrescription: true,
        categoryId: categories[0].id,
        supplierId: suppliers[1].id
      }
    }),
    prisma.product.upsert({
      where: { sku: 'MORP061' },
      update: {},
      create: {
        name: 'Morphine 10mg',
        description: 'Strong pain relief tablets',
        sku: 'MORP061',
        barcode: '1234567890185',
        price: 85.00,
        costPrice: 55.00,
        stockQuantity: 20,
        minStockLevel: 4,
        requiresPrescription: true,
        categoryId: categories[0].id,
        supplierId: suppliers[2].id
      }
    }),
    prisma.product.upsert({
      where: { sku: 'GABA062' },
      update: {},
      create: {
        name: 'Gabapentin 300mg',
        description: 'Neuropathic pain relief',
        sku: 'GABA062',
        barcode: '1234567890186',
        price: 65.00,
        costPrice: 40.00,
        stockQuantity: 35,
        minStockLevel: 8,
        requiresPrescription: true,
        categoryId: categories[0].id,
        supplierId: suppliers[3].id
      }
    }),
    prisma.product.upsert({
      where: { sku: 'PREG063' },
      update: {},
      create: {
        name: 'Pregabalin 75mg',
        description: 'Neuropathic pain relief',
        sku: 'PREG063',
        barcode: '1234567890187',
        price: 75.00,
        costPrice: 48.00,
        stockQuantity: 30,
        minStockLevel: 6,
        requiresPrescription: true,
        categoryId: categories[0].id,
        supplierId: suppliers[4].id
      }
    }),

    // Additional Antibiotics
    prisma.product.upsert({
      where: { sku: 'AZIT064' },
      update: {},
      create: {
        name: 'Azithromycin 250mg',
        description: 'Macrolide antibiotic',
        sku: 'AZIT064',
        barcode: '1234567890188',
        price: 70.00,
        costPrice: 45.00,
        stockQuantity: 40,
        minStockLevel: 8,
        requiresPrescription: true,
        categoryId: categories[1].id,
        supplierId: suppliers[5].id
      }
    }),
    prisma.product.upsert({
      where: { sku: 'CLAR065' },
      update: {},
      create: {
        name: 'Clarithromycin 250mg',
        description: 'Macrolide antibiotic',
        sku: 'CLAR065',
        barcode: '1234567890189',
        price: 80.00,
        costPrice: 50.00,
        stockQuantity: 35,
        minStockLevel: 8,
        requiresPrescription: true,
        categoryId: categories[1].id,
        supplierId: suppliers[0].id
      }
    }),
    prisma.product.upsert({
      where: { sku: 'LEVO066' },
      update: {},
      create: {
        name: 'Levofloxacin 500mg',
        description: 'Fluoroquinolone antibiotic',
        sku: 'LEVO066',
        barcode: '1234567890190',
        price: 90.00,
        costPrice: 58.00,
        stockQuantity: 30,
        minStockLevel: 6,
        requiresPrescription: true,
        categoryId: categories[1].id,
        supplierId: suppliers[1].id
      }
    }),
    prisma.product.upsert({
      where: { sku: 'VANC067' },
      update: {},
      create: {
        name: 'Vancomycin 500mg',
        description: 'Glycopeptide antibiotic',
        sku: 'VANC067',
        barcode: '1234567890191',
        price: 150.00,
        costPrice: 95.00,
        stockQuantity: 15,
        minStockLevel: 3,
        requiresPrescription: true,
        categoryId: categories[1].id,
        supplierId: suppliers[2].id
      }
    }),
    prisma.product.upsert({
      where: { sku: 'GENT068' },
      update: {},
      create: {
        name: 'Gentamicin 80mg',
        description: 'Aminoglycoside antibiotic',
        sku: 'GENT068',
        barcode: '1234567890192',
        price: 60.00,
        costPrice: 38.00,
        stockQuantity: 25,
        minStockLevel: 5,
        requiresPrescription: true,
        categoryId: categories[1].id,
        supplierId: suppliers[3].id
      }
    }),

    // Additional Vitamins
    prisma.product.upsert({
      where: { sku: 'FOLI069' },
      update: {},
      create: {
        name: 'Folic Acid 5mg',
        description: 'Folate supplement',
        sku: 'FOLI069',
        barcode: '1234567890193',
        price: 25.00,
        costPrice: 15.00,
        stockQuantity: 90,
        minStockLevel: 22,
        categoryId: categories[2].id,
        supplierId: suppliers[4].id
      }
    }),
    prisma.product.upsert({
      where: { sku: 'IRON070' },
      update: {},
      create: {
        name: 'Iron Supplement 100mg',
        description: 'Iron tablets',
        sku: 'IRON070',
        barcode: '1234567890194',
        price: 40.00,
        costPrice: 25.00,
        stockQuantity: 70,
        minStockLevel: 18,
        categoryId: categories[2].id,
        supplierId: suppliers[5].id
      }
    }),
    prisma.product.upsert({
      where: { sku: 'CALC071' },
      update: {},
      create: {
        name: 'Calcium Carbonate 500mg',
        description: 'Calcium supplement',
        sku: 'CALC071',
        barcode: '1234567890195',
        price: 35.00,
        costPrice: 22.00,
        stockQuantity: 80,
        minStockLevel: 20,
        categoryId: categories[2].id,
        supplierId: suppliers[0].id
      }
    }),
    prisma.product.upsert({
      where: { sku: 'MAGN072' },
      update: {},
      create: {
        name: 'Magnesium 250mg',
        description: 'Magnesium supplement',
        sku: 'MAGN072',
        barcode: '1234567890196',
        price: 30.00,
        costPrice: 18.00,
        stockQuantity: 75,
        minStockLevel: 18,
        categoryId: categories[2].id,
        supplierId: suppliers[1].id
      }
    }),
    prisma.product.upsert({
      where: { sku: 'ZINC073' },
      update: {},
      create: {
        name: 'Zinc 50mg',
        description: 'Zinc supplement',
        sku: 'ZINC073',
        barcode: '1234567890197',
        price: 28.00,
        costPrice: 17.00,
        stockQuantity: 85,
        minStockLevel: 21,
        categoryId: categories[2].id,
        supplierId: suppliers[2].id
      }
    }),

    // Additional First Aid
    prisma.product.upsert({
      where: { sku: 'ADHE074' },
      update: {},
      create: {
        name: 'Adhesive Tape',
        description: 'Medical adhesive tape',
        sku: 'ADHE074',
        barcode: '1234567890198',
        price: 20.00,
        costPrice: 12.00,
        stockQuantity: 100,
        minStockLevel: 25,
        categoryId: categories[3].id,
        supplierId: suppliers[3].id
      }
    }),
    prisma.product.upsert({
      where: { sku: 'COTT075' },
      update: {},
      create: {
        name: 'Cotton Swabs (Pack of 100)',
        description: 'Sterile cotton swabs',
        sku: 'COTT075',
        barcode: '1234567890199',
        price: 30.00,
        costPrice: 18.00,
        stockQuantity: 80,
        minStockLevel: 20,
        categoryId: categories[3].id,
        supplierId: suppliers[4].id
      }
    }),
    prisma.product.upsert({
      where: { sku: 'SCIS076' },
      update: {},
      create: {
        name: 'Surgical Scissors',
        description: 'Medical scissors',
        sku: 'SCIS076',
        barcode: '1234567890200',
        price: 65.00,
        costPrice: 40.00,
        stockQuantity: 20,
        minStockLevel: 4,
        categoryId: categories[3].id,
        supplierId: suppliers[5].id
      }
    }),
    prisma.product.upsert({
      where: { sku: 'TWEE077' },
      update: {},
      create: {
        name: 'Medical Tweezers',
        description: 'Sterile medical tweezers',
        sku: 'TWEE077',
        barcode: '1234567890201',
        price: 45.00,
        costPrice: 28.00,
        stockQuantity: 30,
        minStockLevel: 6,
        categoryId: categories[3].id,
        supplierId: suppliers[0].id
      }
    }),
    prisma.product.upsert({
      where: { sku: 'GLOV078' },
      update: {},
      create: {
        name: 'Disposable Gloves (Box of 100)',
        description: 'Latex-free disposable gloves',
        sku: 'GLOV078',
        barcode: '1234567890202',
        price: 85.00,
        costPrice: 55.00,
        stockQuantity: 40,
        minStockLevel: 10,
        categoryId: categories[3].id,
        supplierId: suppliers[1].id
      }
    }),

    // Additional Cardiovascular
    prisma.product.upsert({
      where: { sku: 'LOSA079' },
      update: {},
      create: {
        name: 'Losartan 50mg',
        description: 'ARB for hypertension',
        sku: 'LOSA079',
        barcode: '1234567890203',
        price: 50.00,
        costPrice: 32.00,
        stockQuantity: 45,
        minStockLevel: 10,
        requiresPrescription: true,
        categoryId: categories[4].id,
        supplierId: suppliers[2].id
      }
    }),
    prisma.product.upsert({
      where: { sku: 'VALS080' },
      update: {},
      create: {
        name: 'Valsartan 80mg',
        description: 'ARB for hypertension',
        sku: 'VALS080',
        barcode: '1234567890204',
        price: 55.00,
        costPrice: 35.00,
        stockQuantity: 40,
        minStockLevel: 8,
        requiresPrescription: true,
        categoryId: categories[4].id,
        supplierId: suppliers[3].id
      }
    }),
    prisma.product.upsert({
      where: { sku: 'ATOR081' },
      update: {},
      create: {
        name: 'Atorvastatin 20mg',
        description: 'Statin for cholesterol',
        sku: 'ATOR081',
        barcode: '1234567890205',
        price: 70.00,
        costPrice: 45.00,
        stockQuantity: 35,
        minStockLevel: 8,
        requiresPrescription: true,
        categoryId: categories[4].id,
        supplierId: suppliers[4].id
      }
    }),
    prisma.product.upsert({
      where: { sku: 'WARF082' },
      update: {},
      create: {
        name: 'Warfarin 5mg',
        description: 'Anticoagulant medication',
        sku: 'WARF082',
        barcode: '1234567890206',
        price: 40.00,
        costPrice: 25.00,
        stockQuantity: 30,
        minStockLevel: 6,
        requiresPrescription: true,
        categoryId: categories[4].id,
        supplierId: suppliers[5].id
      }
    }),
    prisma.product.upsert({
      where: { sku: 'CLOP083' },
      update: {},
      create: {
        name: 'Clopidogrel 75mg',
        description: 'Antiplatelet medication',
        sku: 'CLOP083',
        barcode: '1234567890207',
        price: 60.00,
        costPrice: 38.00,
        stockQuantity: 40,
        minStockLevel: 8,
        requiresPrescription: true,
        categoryId: categories[4].id,
        supplierId: suppliers[0].id
      }
    }),

    // Additional Diabetes
    prisma.product.upsert({
      where: { sku: 'GLIM084' },
      update: {},
      create: {
        name: 'Glimiperide 2mg',
        description: 'Sulfonylurea for diabetes',
        sku: 'GLIM084',
        barcode: '1234567890208',
        price: 45.00,
        costPrice: 28.00,
        stockQuantity: 50,
        minStockLevel: 10,
        requiresPrescription: true,
        categoryId: categories[5].id,
        supplierId: suppliers[1].id
      }
    }),
    prisma.product.upsert({
      where: { sku: 'PIOG085' },
      update: {},
      create: {
        name: 'Pioglitazone 15mg',
        description: 'Thiazolidinedione for diabetes',
        sku: 'PIOG085',
        barcode: '1234567890209',
        price: 65.00,
        costPrice: 40.00,
        stockQuantity: 35,
        minStockLevel: 8,
        requiresPrescription: true,
        categoryId: categories[5].id,
        supplierId: suppliers[2].id
      }
    }),
    prisma.product.upsert({
      where: { sku: 'SITA086' },
      update: {},
      create: {
        name: 'Sitagliptin 100mg',
        description: 'DPP-4 inhibitor for diabetes',
        sku: 'SITA086',
        barcode: '1234567890210',
        price: 85.00,
        costPrice: 55.00,
        stockQuantity: 30,
        minStockLevel: 6,
        requiresPrescription: true,
        categoryId: categories[5].id,
        supplierId: suppliers[3].id
      }
    }),
    prisma.product.upsert({
      where: { sku: 'CANAG087' },
      update: {},
      create: {
        name: 'Canagliflozin 100mg',
        description: 'SGLT2 inhibitor for diabetes',
        sku: 'CANAG087',
        barcode: '1234567890211',
        price: 95.00,
        costPrice: 60.00,
        stockQuantity: 25,
        minStockLevel: 5,
        requiresPrescription: true,
        categoryId: categories[5].id,
        supplierId: suppliers[4].id
      }
    }),
    prisma.product.upsert({
      where: { sku: 'INSU088' },
      update: {},
      create: {
        name: 'Insulin Pen Needles (Box of 100)',
        description: 'Insulin injection needles',
        sku: 'INSU088',
        barcode: '1234567890212',
        price: 120.00,
        costPrice: 80.00,
        stockQuantity: 20,
        minStockLevel: 4,
        categoryId: categories[5].id,
        supplierId: suppliers[5].id
      }
    }),

    // Additional Respiratory
    prisma.product.upsert({
      where: { sku: 'BUDES089' },
      update: {},
      create: {
        name: 'Budesonide Inhaler',
        description: 'Steroid inhaler for asthma',
        sku: 'BUDES089',
        barcode: '1234567890213',
        price: 100.00,
        costPrice: 65.00,
        stockQuantity: 30,
        minStockLevel: 6,
        requiresPrescription: true,
        categoryId: categories[6].id,
        supplierId: suppliers[0].id
      }
    }),
    prisma.product.upsert({
      where: { sku: 'FORM090' },
      update: {},
      create: {
        name: 'Formoterol Inhaler',
        description: 'Long-acting bronchodilator',
        sku: 'FORM090',
        barcode: '1234567890214',
        price: 90.00,
        costPrice: 58.00,
        stockQuantity: 25,
        minStockLevel: 5,
        requiresPrescription: true,
        categoryId: categories[6].id,
        supplierId: suppliers[1].id
      }
    }),
    prisma.product.upsert({
      where: { sku: 'THEO091' },
      update: {},
      create: {
        name: 'Theophylline 200mg',
        description: 'Bronchodilator tablets',
        sku: 'THEO091',
        barcode: '1234567890215',
        price: 50.00,
        costPrice: 32.00,
        stockQuantity: 40,
        minStockLevel: 8,
        requiresPrescription: true,
        categoryId: categories[6].id,
        supplierId: suppliers[2].id
      }
    }),
    prisma.product.upsert({
      where: { sku: 'PRED092' },
      update: {},
      create: {
        name: 'Prednisone 5mg',
        description: 'Oral steroid for respiratory',
        sku: 'PRED092',
        barcode: '1234567890216',
        price: 35.00,
        costPrice: 22.00,
        stockQuantity: 50,
        minStockLevel: 10,
        requiresPrescription: true,
        categoryId: categories[6].id,
        supplierId: suppliers[3].id
      }
    }),
    prisma.product.upsert({
      where: { sku: 'NEBU093' },
      update: {},
      create: {
        name: 'Nebulizer Solution',
        description: 'Respiratory nebulizer solution',
        sku: 'NEBU093',
        barcode: '1234567890217',
        price: 65.00,
        costPrice: 40.00,
        stockQuantity: 30,
        minStockLevel: 6,
        requiresPrescription: true,
        categoryId: categories[6].id,
        supplierId: suppliers[4].id
      }
    }),

    // Additional Digestive
    prisma.product.upsert({
      where: { sku: 'LANS094' },
      update: {},
      create: {
        name: 'Lansoprazole 30mg',
        description: 'Proton pump inhibitor',
        sku: 'LANS094',
        barcode: '1234567890218',
        price: 55.00,
        costPrice: 35.00,
        stockQuantity: 50,
        minStockLevel: 10,
        categoryId: categories[7].id,
        supplierId: suppliers[5].id
      }
    }),
    prisma.product.upsert({
      where: { sku: 'PANT095' },
      update: {},
      create: {
        name: 'Pantoprazole 40mg',
        description: 'Proton pump inhibitor',
        sku: 'PANT095',
        barcode: '1234567890219',
        price: 60.00,
        costPrice: 38.00,
        stockQuantity: 45,
        minStockLevel: 10,
        categoryId: categories[7].id,
        supplierId: suppliers[0].id
      }
    }),
    prisma.product.upsert({
      where: { sku: 'SUCR096' },
      update: {},
      create: {
        name: 'Sucralfate 1g',
        description: 'Gastric protectant',
        sku: 'SUCR096',
        barcode: '1234567890220',
        price: 45.00,
        costPrice: 28.00,
        stockQuantity: 40,
        minStockLevel: 8,
        categoryId: categories[7].id,
        supplierId: suppliers[1].id
      }
    }),
    prisma.product.upsert({
      where: { sku: 'MISO097' },
      update: {},
      create: {
        name: 'Misoprostol 200mcg',
        description: 'Gastric protectant',
        sku: 'MISO097',
        barcode: '1234567890221',
        price: 50.00,
        costPrice: 32.00,
        stockQuantity: 35,
        minStockLevel: 8,
        requiresPrescription: true,
        categoryId: categories[7].id,
        supplierId: suppliers[2].id
      }
    }),
    prisma.product.upsert({
      where: { sku: 'BISM098' },
      update: {},
      create: {
        name: 'Bismuth Subsalicylate',
        description: 'Antidiarrheal medication',
        sku: 'BISM098',
        barcode: '1234567890222',
        price: 30.00,
        costPrice: 18.00,
        stockQuantity: 60,
        minStockLevel: 15,
        categoryId: categories[7].id,
        supplierId: suppliers[3].id
      }
    }),

    // Additional Neurological
    prisma.product.upsert({
      where: { sku: 'VALP099' },
      update: {},
      create: {
        name: 'Valproic Acid 500mg',
        description: 'Anticonvulsant medication',
        sku: 'VALP099',
        barcode: '1234567890223',
        price: 70.00,
        costPrice: 45.00,
        stockQuantity: 25,
        minStockLevel: 5,
        requiresPrescription: true,
        categoryId: categories[8].id,
        supplierId: suppliers[4].id
      }
    }),
    prisma.product.upsert({
      where: { sku: 'LAMO100' },
      update: {},
      create: {
        name: 'Lamotrigine 25mg',
        description: 'Anticonvulsant medication',
        sku: 'LAMO100',
        barcode: '1234567890224',
        price: 65.00,
        costPrice: 40.00,
        stockQuantity: 30,
        minStockLevel: 6,
        requiresPrescription: true,
        categoryId: categories[8].id,
        supplierId: suppliers[5].id
      }
    }),
    prisma.product.upsert({
      where: { sku: 'TOPIR101' },
      update: {},
      create: {
        name: 'Topiramate 25mg',
        description: 'Anticonvulsant medication',
        sku: 'TOPIR101',
        barcode: '1234567890225',
        price: 75.00,
        costPrice: 48.00,
        stockQuantity: 25,
        minStockLevel: 5,
        requiresPrescription: true,
        categoryId: categories[8].id,
        supplierId: suppliers[0].id
      }
    }),
    prisma.product.upsert({
      where: { sku: 'LEVE102' },
      update: {},
      create: {
        name: 'Levetiracetam 500mg',
        description: 'Anticonvulsant medication',
        sku: 'LEVE102',
        barcode: '1234567890226',
        price: 80.00,
        costPrice: 50.00,
        stockQuantity: 20,
        minStockLevel: 4,
        requiresPrescription: true,
        categoryId: categories[8].id,
        supplierId: suppliers[1].id
      }
    }),
    prisma.product.upsert({
      where: { sku: 'OXCA103' },
      update: {},
      create: {
        name: 'Oxcarbazepine 300mg',
        description: 'Anticonvulsant medication',
        sku: 'OXCA103',
        barcode: '1234567890227',
        price: 70.00,
        costPrice: 45.00,
        stockQuantity: 25,
        minStockLevel: 5,
        requiresPrescription: true,
        categoryId: categories[8].id,
        supplierId: suppliers[2].id
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
