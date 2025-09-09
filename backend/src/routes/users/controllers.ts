import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export class UserController {
  static async getAllUsers() {
    const users = await prisma.user.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    })
    return { users }
  }

  static async updateUserProfile(userId: string, data: {
    name: string
    currentPassword?: string
    newPassword?: string
  }) {
    const { name, currentPassword, newPassword } = data

    const updateData: any = { name }

    // If password change is requested
    if (newPassword) {
      if (!currentPassword) {
        throw new Error('Current password is required to change password')
      }

      // Verify current password
      const currentUser = await prisma.user.findUnique({
        where: { id: userId }
      })

      if (!currentUser) {
        throw new Error('User not found')
      }

      const isValidPassword = await bcrypt.compare(currentPassword, currentUser.password)
      if (!isValidPassword) {
        throw new Error('Current password is incorrect')
      }

      // Hash new password
      updateData.password = await bcrypt.hash(newPassword, 12)
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true
      }
    })

    return { user: updatedUser }
  }

  static async getUserById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true
      }
    })
    if (!user) {
      throw new Error('User not found')
    }
    return { user }
  }

  static async deactivateUser(id: string) {
    await prisma.user.update({
      where: { id },
      data: { isActive: false }
    })
    return { message: 'User deactivated successfully' }
  }
}
