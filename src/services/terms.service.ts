import prisma from '~/lib/prisma'

export interface BillingOption {
  enabled: boolean
  type: 'Upfront' | 'Monthly' | 'Every two weeks' | 'Weekly' | 'Custom'
  paymentDate?: string // For Upfront payments
  frequency?: string // For recurring payments (e.g., "1 month", "2 weeks", "1 week")
  startDate?: string // When recurring payments start
  customName?: string // For Custom payment options
  customDescription?: string
  customFrequency?: string
  customStartDate?: string
}

export interface CreateTermData {
  userId: string
  title: string
  startDate: string
  endDate: string
  registrationFee?: boolean
  seasonSpecificFee?: boolean
  pricingType?: string
  billingOptions?: BillingOption[] // Array of billing options with enabled/disabled state
  pricing?: Record<string, unknown>
  seasonSpecificFees?: Array<{ name: string; amount: number; maxPerFamily?: number }>
}

export interface UpdateTermData {
  title?: string
  startDate?: string
  endDate?: string
  registrationFee?: boolean
  seasonSpecificFee?: boolean
  pricingType?: string
  billingOptions?: BillingOption[] // Array of billing options with enabled/disabled state
  pricing?: Record<string, unknown>
  seasonSpecificFees?: Array<{ name: string; amount: number; maxPerFamily?: number }>
}

export async function createTerm(data: CreateTermData) {
  const term = await prisma.terms.create({
    data: {
      userId: data.userId,
      title: data.title,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      registrationFee: data.registrationFee ?? false,
      seasonSpecificFee: data.seasonSpecificFee ?? false,
      pricingType: data.pricingType,
      paymentOptions: (data.billingOptions ?? []) as any, // Store billing options in paymentOptions JSON field
      pricing: (data.pricing ?? {}) as any,
      seasonSpecificFees: (data.seasonSpecificFees ?? null) as any,
    },
  })
  return transformTermResponse(term)
}

// Helper function to transform paymentOptions to billingOptions
function transformTermResponse(term: any) {
  if (!term) return term
  const { paymentOptions, ...rest } = term
  return {
    ...rest,
    billingOptions: paymentOptions || null,
  }
}

export async function getTerms(userId: string) {
  const terms = await prisma.terms.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  })
  return terms.map(transformTermResponse)
}

export async function getTermById(id: number) {
  const term = await prisma.terms.findUnique({
    where: { id },
    include: {
      classes: true,
      classBookings: true,
      waitlists: true,
      trials: true,
    },
  })
  return term ? transformTermResponse(term) : null
}

export async function updateTerm(id: number, userId: string, data: UpdateTermData) {
  const term = await prisma.terms.findFirst({
    where: { id, userId },
  })

  if (!term) {
    return null
  }

  const updated = await prisma.terms.update({
    where: { id },
    data: {
      ...(data.title && { title: data.title }),
      ...(data.startDate && { startDate: new Date(data.startDate) }),
      ...(data.endDate && { endDate: new Date(data.endDate) }),
      ...(data.registrationFee !== undefined && { registrationFee: data.registrationFee }),
      ...(data.seasonSpecificFee !== undefined && { seasonSpecificFee: data.seasonSpecificFee }),
      ...(data.pricingType && { pricingType: data.pricingType }),
      ...(data.billingOptions !== undefined && { paymentOptions: data.billingOptions as any }),
      ...(data.pricing && { pricing: data.pricing as any }),
      ...(data.seasonSpecificFees !== undefined && {
        seasonSpecificFees: data.seasonSpecificFees as any,
      }),
    },
  })
  return transformTermResponse(updated)
}

export async function deleteTerm(id: number, userId: string) {
  const term = await prisma.terms.findFirst({
    where: { id, userId },
  })

  if (!term) {
    return null
  }

  await prisma.terms.delete({
    where: { id },
  })

  return { success: true }
}
