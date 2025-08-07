import { Elysia, t } from 'elysia'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
import { strictAuthMiddleware } from '../middleware/auth'
import bcrypt from 'bcryptjs'

export const userRoutes = new Elysia({ prefix: '/users' })
  // Public routes (no auth required)
  .get('/', async () => {
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
  })
  // Protected routes (auth required)
  .group('/profile', app => app
    .use(strictAuthMiddleware)
    .put('/', async (context) => {
      try {
        const { body, user } = context
        const { name, currentPassword, newPassword } = body

        const updateData: any = { name }

        // If password change is requested
        if (newPassword) {
          if (!currentPassword) {
            throw new Error('Current password is required to change password')
          }

          // Verify current password
          const currentUser = await prisma.user.findUnique({
            where: { id: user.id }
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
          where: { id: user.id },
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
      } catch (error: any) {
        throw new Error(error.message || 'Failed to update profile')
      }
    }, {
      body: t.Object({
        name: t.String(),
        currentPassword: t.Optional(t.String()),
        newPassword: t.Optional(t.String())
      }),
      detail: {
        tags: ['Users'],
        summary: 'Update User Profile',
        description: 'Update the current user\'s profile information including name and password.',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Profile updated successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    user: {
                      type: 'object',
                      properties: {
                        id: { type: 'string' },
                        name: { type: 'string' },
                        email: { type: 'string' },
                        role: { type: 'string' },
                        isActive: { type: 'boolean' },
                        createdAt: { type: 'string', format: 'date-time' }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        400: {
          description: 'Bad request',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: { type: 'string' }
                }
              }
            }
          }
        }
      }
    })
  )
