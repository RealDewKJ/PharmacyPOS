import { prisma } from '../../index'

export class ProductController {
  static async getAllProducts(query: {
    page?: string;
    limit?: string;
    search?: string;
    category?: string;
  }) {
    const { page = '1', limit = '10', search = '', category = '' } = query
    const skip = (parseInt(page) - 1) * parseInt(limit)
    
    const where = {
      isActive: true,
      ...(search && {
        OR: [
          { name: { contains: search } },
          { sku: { contains: search } },
          { barcode: { contains: search } }
        ]
      }),
      ...(category && { categoryId: category })
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: parseInt(limit),
        include: {
          category: true,
          supplier: true
        },
        orderBy: { name: 'asc' }
      }),
      prisma.product.count({ where })
    ])

    return {
      products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    }
  }

  static async getProductById(id: string) {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        supplier: true
      }
    })

    if (!product) {
      throw new Error('Product not found')
    }

    return { product }
  }

  static async getProductByBarcode(barcode: string) {
    const product = await prisma.product.findUnique({
      where: { barcode },
      select: {
        id: true,
        name: true,
        price: true,
        stockQuantity: true,
        requiresPrescription: true
      }
    })

    if (!product) {
      throw new Error('Product not found')
    }

    return { product }
  }

  static async getLowStockProducts() {
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        stockQuantity: {
          lte: prisma.product.fields.minStockLevel
        }
      },
      select: {
        id: true,
        name: true,
        stockQuantity: true,
        minStockLevel: true
      }
    })

    return { products }
  }

  static async getExpiringProducts(days: number = 30) {
    const expiryDate = new Date()
    expiryDate.setDate(expiryDate.getDate() + days)

    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        expiryDate: {
          lte: expiryDate,
          gte: new Date()
        }
      },
      select: {
        id: true,
        name: true,
        expiryDate: true,
        stockQuantity: true
      }
    })

    return { products }
  }

  static async createProduct(data: {
    name: string;
    description?: string;
    barcode?: string;
    sku: string;
    price: number;
    costPrice: number;
    stockQuantity: number;
    minStockLevel: number;
    expiryDate?: Date;
    requiresPrescription: boolean;
    categoryId: string;
    supplierId?: string;
  }) {
    // Auto-generate barcode if not provided
    let barcode = data.barcode
    if (!barcode) {
      barcode = await this.generateUniqueBarcodeInternal()
    }

    const product = await prisma.product.create({
      data: {
        ...data,
        barcode
      },
      include: {
        category: true,
        supplier: true
      }
    })

    return { product }
  }

  private static async generateUniqueBarcodeInternal(): Promise<string> {
    let barcode: string = ''
    let isUnique = false
    
    while (!isUnique) {
      // Generate 13-digit barcode (EAN-13 format)
      barcode = this.generateBarcode()
      
      // Check if barcode already exists
      const existingProduct = await prisma.product.findUnique({
        where: { barcode }
      })
      
      if (!existingProduct) {
        isUnique = true
      }
    }
    
    return barcode
  }

  private static generateBarcode(): string {
    // Generate a 13-digit barcode starting with 8 (internal use)
    // Format: 8 + 11 random digits + check digit
    const prefix = '8'
    const randomDigits = Math.random().toString().slice(2, 13) // 11 digits
    const barcodeWithoutCheck = prefix + randomDigits
    
    // Calculate check digit (simplified EAN-13 algorithm)
    const checkDigit = this.calculateCheckDigit(barcodeWithoutCheck)
    
    return barcodeWithoutCheck + checkDigit
  }

  private static calculateCheckDigit(barcode: string): string {
    let sum = 0
    for (let i = 0; i < barcode.length; i++) {
      const digit = parseInt(barcode[i])
      sum += i % 2 === 0 ? digit : digit * 3
    }
    const checkDigit = (10 - (sum % 10)) % 10
    return checkDigit.toString()
  }

  static async updateProduct(id: string, data: Partial<{
    name: string;
    description: string;
    barcode: string;
    sku: string;
    price: number;
    costPrice: number;
    stockQuantity: number;
    minStockLevel: number;
    expiryDate: Date;
    requiresPrescription: boolean;
    categoryId: string;
    supplierId: string;
  }>) {
    const product = await prisma.product.update({
      where: { id },
      data,
      include: {
        category: true,
        supplier: true
      }
    })

    return { product }
  }

  static async deleteProduct(id: string) {
    await prisma.product.update({
      where: { id },
      data: { isActive: false }
    })

    return { message: 'Product deleted successfully' }
  }

  // Generate barcode for manual assignment
  static async generateUniqueBarcode() {
    const barcode = await this.generateUniqueBarcodeInternal()
    return { barcode }
  }

  // Update barcode for existing product
  static async updateProductBarcode(id: string, barcode: string) {
    // Check if barcode already exists
    const existingProduct = await prisma.product.findUnique({
      where: { barcode }
    })

    if (existingProduct && existingProduct.id !== id) {
      throw new Error('Barcode already exists for another product')
    }

    const product = await prisma.product.update({
      where: { id },
      data: { barcode },
      select: {
        id: true,
        name: true,
        barcode: true
      }
    })

    return { product }
  }

  // Get products without barcode
  static async getProductsWithoutBarcode() {
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        barcode: null
      },
      select: {
        id: true,
        name: true,
        sku: true,
        price: true
      }
    })

    return { products }
  }
}
