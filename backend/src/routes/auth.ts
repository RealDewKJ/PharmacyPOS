import { Elysia, t } from 'elysia'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
import bcrypt from 'bcryptjs'

export const authRoutes = new Elysia({ prefix: '/auth' })
  .post('/login', async (context) => {
    try {
      const { body } = context
      const { email, password } = body

      console.log('Login attempt for email:', email)

      if (!email || !password) {
        throw new Error('Email and password are required')
      }

      const user = await prisma.user.findUnique({
        where: { email }
      })

      if (!user) {
        console.log('User not found for email:', email)
        throw new Error('Invalid credentials')
      }

      if (!user.isActive) {
        console.log('User is inactive for email:', email)
        throw new Error('Account is deactivated')
      }

      const isValidPassword = await bcrypt.compare(password, user.password)
      if (!isValidPassword) {
        console.log('Invalid password for email:', email)
        throw new Error('Invalid credentials')
      }

      console.log('Login successful for user:', user.name)

      const token = await (context as any).jwt.sign({
        id: user.id,
        email: user.email,
        role: user.role
      })

      return {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      }
    } catch (error: any) {
      console.error('Login error:', error)
      throw new Error(error.message || 'Login failed')
    }
  }, {
    body: t.Object({
      email: t.String(),
      password: t.String()
    }),
    detail: {
      tags: ['Auth'],
      summary: 'User Login',
      description: 'Authenticate a user with email and password. Returns a JWT token for subsequent API calls.',
      responses: {
        200: {
          description: 'Login successful',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  token: {
                    type: 'string',
                    description: 'JWT authentication token'
                  },
                  user: {
                    type: 'object',
                    properties: {
                      id: { type: 'string' },
                      email: { type: 'string' },
                      name: { type: 'string' },
                      role: { type: 'string', enum: ['ADMIN', 'PHARMACIST', 'CASHIER'] }
                    }
                  }
                }
              }
            }
          }
        },
        401: {
          description: 'Invalid credentials',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: { type: 'string', example: 'Invalid credentials' }
                }
              }
            }
          }
        }
      }
    }
  })
  .post('/register', async (context) => {
    const { body } = context
    const { email, password, name, role } = body

    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      throw new Error('User already exists')
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: role || 'CASHIER'
      }
    })

    const token = await (context as any).jwt.sign({
      id: user.id,
      email: user.email,
      role: user.role
    })

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    }
  }, {
    body: t.Object({
      email: t.String(),
      password: t.String(),
      name: t.String(),
      role: t.Optional(t.Union([t.Literal('ADMIN'), t.Literal('PHARMACIST'), t.Literal('CASHIER')]))
    }),
    detail: {
      tags: ['Auth'],
      summary: 'User Registration',
      description: 'Register a new user account. The role defaults to CASHIER if not specified.',
      responses: {
        200: {
          description: 'Registration successful',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  token: {
                    type: 'string',
                    description: 'JWT authentication token'
                  },
                  user: {
                    type: 'object',
                    properties: {
                      id: { type: 'string' },
                      email: { type: 'string' },
                      name: { type: 'string' },
                      role: { type: 'string', enum: ['ADMIN', 'PHARMACIST', 'CASHIER'] }
                    }
                  }
                }
              }
            }
          }
        },
        400: {
          description: 'User already exists',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: { type: 'string', example: 'User already exists' }
                }
              }
            }
          }
        }
      }
    }
  })
  .get('/me', async (context) => {
    const { headers } = context
    const authHeader = headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error('Authorization header missing or invalid format')
    }

    const token = authHeader.substring(7)
    if (!token) {
      throw new Error('JWT token is missing')
    }

    const payload = await (context as any).jwt.verify(token)
    
    if (!payload) {
      throw new Error('Invalid or expired JWT token')
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.id as string },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true
      }
    })

    if (!user) {
      throw new Error('User not found')
    }

    if (!user.isActive) {
      throw new Error('User account is inactive')
    }

    return { user }
  }, {
    detail: {
      tags: ['Auth'],
      summary: 'Get Current User',
      description: 'Retrieve the current authenticated user\'s profile information.',
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'User profile retrieved successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  user: {
                    type: 'object',
                    properties: {
                      id: { type: 'string' },
                      email: { type: 'string' },
                      name: { type: 'string' },
                      role: { type: 'string', enum: ['ADMIN', 'PHARMACIST', 'CASHIER'] },
                      isActive: { type: 'boolean' },
                      createdAt: { type: 'string', format: 'date-time' }
                    }
                  }
                }
              }
            }
          }
        },
        401: {
          description: 'No token provided or invalid token',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: { type: 'string', example: 'No token provided' }
                }
              }
            }
          }
        }
      }
    }
  })
  .post('/logout', async (context) => {
    // In a stateless JWT system, logout is handled client-side
    // But we can add server-side token blacklisting if needed
    return {
      message: 'Logged out successfully'
    }
  }, {
    detail: {
      tags: ['Auth'],
      summary: 'User Logout',
      description: 'Logout the current user. In JWT-based authentication, this is primarily handled client-side.',
      responses: {
        200: {
          description: 'Logout successful',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: {
                    type: 'string',
                    example: 'Logged out successfully'
                  }
                }
              }
            }
          }
        }
      }
    }
  })
