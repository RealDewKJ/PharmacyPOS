const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testProductsSearch() {
  try {
    console.log('Testing products search...')
    
    // Test basic search
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        OR: [
          { name: { contains: 'Vita' } },
          { sku: { contains: 'Vita' } },
          { barcode: { contains: 'Vita' } }
        ]
      },
      include: {
        category: true,
        supplier: true
      }
    })
    
    console.log('Search results:', products)
    console.log('Number of products found:', products.length)
    
    // Test all products
    const allProducts = await prisma.product.findMany({
      where: { isActive: true },
      include: {
        category: true,
        supplier: true
      }
    })
    
    console.log('All products:', allProducts.map(p => ({ name: p.name, sku: p.sku })))
    console.log('Total products in database:', allProducts.length)
    
  } catch (error) {
    console.error('Error testing products:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testProductsSearch()
