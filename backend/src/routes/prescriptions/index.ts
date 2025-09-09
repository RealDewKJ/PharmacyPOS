import { Elysia, t } from 'elysia'
import { PrescriptionController } from './controllers'
import {
  createPrescriptionSchema,
  updatePrescriptionStatusSchema,
  prescriptionParamsSchema,
  prescriptionResponseSchema,
  prescriptionsListResponseSchema
} from './schemas'
import { authMiddleware } from '../../middleware/auth'

export const prescriptionRoutes = new Elysia({ prefix: '/prescriptions' })
  .use(authMiddleware)
  .get('/', async () => {
    try {
      return await PrescriptionController.getAllPrescriptions()
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Failed to get prescriptions'
      }
    }
  }, {
    response: prescriptionsListResponseSchema,
    detail: {
      tags: ['Prescriptions'],
      summary: 'Get All Prescriptions',
      description: 'Retrieve all prescriptions with customer and product details'
    }
  })
  .post('/', async ({ body }) => {
    try {
      return await PrescriptionController.createPrescription(body)
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Failed to create prescription'
      }
    }
  }, {
    body: createPrescriptionSchema,
    response: prescriptionResponseSchema,
    detail: {
      tags: ['Prescriptions'],
      summary: 'Create Prescription',
      description: 'Create a new prescription'
    }
  })
  .get('/:id', async ({ params }) => {
    try {
      return await PrescriptionController.getPrescriptionById(params.id)
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Failed to get prescription'
      }
    }
  }, {
    params: prescriptionParamsSchema,
    response: prescriptionResponseSchema,
    detail: {
      tags: ['Prescriptions'],
      summary: 'Get Prescription by ID',
      description: 'Retrieve a specific prescription by ID'
    }
  })
  .put('/:id/status', async ({ params, body }) => {
    try {
      return await PrescriptionController.updatePrescriptionStatus(params.id, body.status)
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Failed to update prescription status'
      }
    }
  }, {
    params: prescriptionParamsSchema,
    body: updatePrescriptionStatusSchema,
    response: prescriptionResponseSchema,
    detail: {
      tags: ['Prescriptions'],
      summary: 'Update Prescription Status',
      description: 'Update the status of a prescription'
    }
  })
