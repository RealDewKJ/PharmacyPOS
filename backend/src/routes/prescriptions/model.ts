import { t } from 'elysia'

// Request schemas
export const createPrescriptionSchema = t.Object({
  customerId: t.String(),
  items: t.Array(t.Object({
    productId: t.String(),
    quantity: t.Number(),
    dosage: t.String(),
    frequency: t.String(),
    duration: t.String()
  })),
  notes: t.Optional(t.String()),
  prescribedBy: t.Optional(t.String()),
  expiryDate: t.Optional(t.String())
})

export const updatePrescriptionStatusSchema = t.Object({
  status: t.Union([
    t.Literal('PENDING'),
    t.Literal('FILLED'),
    t.Literal('CANCELLED')
  ])
})

export const prescriptionParamsSchema = t.Object({
  id: t.String()
})

// Response schemas
export const prescriptionItemSchema = t.Object({
  id: t.String(),
  productId: t.String(),
  quantity: t.Number(),
  dosage: t.String(),
  frequency: t.String(),
  duration: t.String(),
  product: t.Object({
    id: t.String(),
    name: t.String(),
    sku: t.String(),
    barcode: t.Union([t.String(), t.Null()])
  })
})

export const prescriptionSchema = t.Object({
  id: t.String(),
  customerId: t.String(),
  prescribedBy: t.Union([t.String(), t.Null()]),
  notes: t.Union([t.String(), t.Null()]),
  status: t.String(),
  expiryDate: t.Union([t.String(), t.Null()]),
  createdAt: t.String(),
  updatedAt: t.String(),
  customer: t.Object({
    id: t.String(),
    name: t.String(),
    email: t.Union([t.String(), t.Null()]),
    phone: t.Union([t.String(), t.Null()])
  }),
  items: t.Array(prescriptionItemSchema)
})

export const prescriptionResponseSchema = t.Union([
  t.Object({
    prescription: prescriptionSchema
  }),
  t.Object({
    error: t.String()
  })
])

export const prescriptionsListResponseSchema = t.Union([
  t.Object({
    prescriptions: t.Array(prescriptionSchema)
  }),
  t.Object({
    error: t.String()
  })
])
