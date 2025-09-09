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
    const product = await prisma.product.create({
      data,
      include: {
        category: true,
        supplier: true
      }
    })

    return { product }
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
}
