import { prisma } from '../../index'

export class CategoryController {
  static async getAllCategories() {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' }
    })
    return { categories }
  }

  static async getCategoryById(id: string) {
    const category = await prisma.category.findUnique({
      where: { id },
      include: { products: true }
    })

    if (!category) {
      throw new Error('Category not found')
    }

    return { category }
  }

  static async createCategory(data: { name: string; description?: string }) {
    const category = await prisma.category.create({
      data
    })

    return { category }
  }

  static async updateCategory(id: string, data: { name?: string; description?: string }) {
    const category = await prisma.category.update({
      where: { id },
      data
    })

    return { category }
  }

  static async deleteCategory(id: string) {
    await prisma.category.delete({
      where: { id }
    })

    return { message: 'Category deleted successfully' }
  }
}
