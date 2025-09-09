import { Elysia, t } from 'elysia'
import { UserController } from './controllers'
import {
  updateUserProfileSchema,
  userParamsSchema,
  userResponseSchema,
  usersListResponseSchema,
  deactivateUserResponseSchema
} from './schemas'
import { strictAuthMiddleware } from '../../middleware/auth'

export const userRoutes = new Elysia({ prefix: '/users' })
  // Public routes (no auth required)
  .get('/', async () => {
    try {
      return await UserController.getAllUsers()
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Failed to get users'
      }
    }
  }, {
    response: usersListResponseSchema,
    detail: {
      tags: ['Users'],
      summary: 'Get All Users',
      description: 'Retrieve all active users'
    }
  })
  // Protected routes (auth required)
  .group('/profile', app => app
    .use(strictAuthMiddleware)
    .put('/', async ({ body, user }) => {
      try {
        return await UserController.updateUserProfile(user.id, body)
      } catch (error) {
        return {
          error: error instanceof Error ? error.message : 'Failed to update profile'
        }
      }
    }, {
      body: updateUserProfileSchema,
      response: userResponseSchema,
      detail: {
        tags: ['Users'],
        summary: 'Update User Profile',
        description: 'Update the current user\'s profile information including name and password'
      }
    })
  )
  .get('/:id', async ({ params }) => {
    try {
      return await UserController.getUserById(params.id)
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Failed to get user'
      }
    }
  }, {
    params: userParamsSchema,
    response: userResponseSchema,
    detail: {
      tags: ['Users'],
      summary: 'Get User by ID',
      description: 'Retrieve a specific user by ID'
    }
  })
  .delete('/:id', async ({ params }) => {
    try {
      return await UserController.deactivateUser(params.id)
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Failed to deactivate user'
      }
    }
  }, {
    params: userParamsSchema,
    response: deactivateUserResponseSchema,
    detail: {
      tags: ['Users'],
      summary: 'Deactivate User',
      description: 'Deactivate a user by ID'
    }
  })
