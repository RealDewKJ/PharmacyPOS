import { prisma } from '../../index'

export class PrescriptionController {
  static async getAllPrescriptions() {
    const prescriptions = await prisma.prescription.findMany({
      include: {
        customer: true,
        items: {
          include: {
            product: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    return { prescriptions }
  }

  static async createPrescription(data: {
    customerId: string
    items: Array<{
      productId: string
      quantity: number
      dosage: string
      frequency: string
      duration: string
    }>
    notes?: string
    prescribedBy?: string
    expiryDate?: string
  }) {
    const { customerId, items, notes = '', prescribedBy = '', expiryDate } = data

    // Create prescription
    const prescription = await prisma.prescription.create({
      data: {
        customerId,
        prescribedBy,
        notes,
        expiryDate: expiryDate ? new Date(expiryDate) : null,
        items: {
          create: items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            dosage: item.dosage,
            frequency: item.frequency,
            duration: item.duration
          }))
        }
      },
      include: {
        customer: true,
        items: {
          include: {
            product: true
          }
        }
      }
    })

    return { prescription }
  }

  static async getPrescriptionById(id: string) {
    const prescription = await prisma.prescription.findUnique({
      where: { id },
      include: {
        customer: true,
        items: {
          include: {
            product: true
          }
        }
      }
    })
    if (!prescription) {
      throw new Error('Prescription not found')
    }
    return { prescription }
  }

  static async updatePrescriptionStatus(id: string, status: 'PENDING' | 'FILLED' | 'CANCELLED') {
    const prescription = await prisma.prescription.update({
      where: { id },
      data: { status },
      include: {
        customer: true,
        items: {
          include: {
            product: true
          }
        }
      }
    })
    return { prescription }
  }
}
