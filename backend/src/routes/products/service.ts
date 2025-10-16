// Service handle business logic, decoupled from Elysia controller
import { Elysia } from 'elysia'
import { prisma } from '../../index'

import type { ProductModel } from './model'

export abstract class Product {
  static async getAllProducts(query: ProductModel.QuerySchema) {
    const { page = '1', limit = '10', search = '', category = '', sort = 'name', includeInactive = 'false' } = query
    const skip = (parseInt(page) - 1) * parseInt(limit)
    
    const where = {
      ...(includeInactive === 'false' && { isActive: true }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { sku: { contains: search, mode: 'insensitive' as const } },
          { barcode: { contains: search } },
          { description: { contains: search, mode: 'insensitive' as const } }
        ]
      }),
      ...(category && { categoryId: category })
    }

    let orderBy: any = { name: 'asc' }
    if (sort === 'popular') {
      orderBy = { name: 'asc' }
    } else if (sort === 'price_asc') {
      orderBy = { price: 'asc' }
    } else if (sort === 'price_desc') {
      orderBy = { price: 'desc' }
    } else if (sort === 'stock_low') {
      orderBy = { stockQuantity: 'asc' }
    } else if (sort === 'name') {
      orderBy = { name: 'asc' }
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
        orderBy
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
      const error = new Error('Product not found')
      ;(error as any).status = 404
      throw error
    }

    return { product }
  }

  static async getProductByBarcode(barcode: string) {
    const product = await prisma.product.findUnique({
      where: { barcode },
      include: {
        category: true,
        supplier: true
      }
    })

    if (!product) {
      const error = new Error('Product not found')
      ;(error as any).status = 404
      throw error
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

  static async createProduct(data: ProductModel.CreateBody) {
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

  static async updateProduct(id: string, data: ProductModel.UpdateBody) {
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
      const error = new Error('Validation error')
      ;(error as any).status = 400
      throw error
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
