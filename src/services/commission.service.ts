import prisma from '~/lib/prisma'

export class CommissionNotFoundError extends Error {
  constructor() {
    super('Commission not found')
    this.name = 'CommissionNotFoundError'
  }
}

export class BusinessNotFoundError extends Error {
  constructor() {
    super('Business not found')
    this.name = 'BusinessNotFoundError'
  }
}

export interface CreateGlobalCommissionInput {
  commissionType: 'PERCENTAGE' | 'FIXED' | 'TIERED'
  commissionValue: number
  country?: string
  currency?: string
  effectiveFrom?: Date
  appliesTo?: string
  minTransactionAmt?: number
  maxTransactionAmt?: number
  tierConfig?: Record<string, unknown>
}

export interface CreateOrganizationCommissionInput {
  businessId: number
  commissionType: 'PERCENTAGE' | 'FIXED' | 'TIERED'
  commissionValue: number
  country?: string
  currency?: string
  effectiveFrom?: Date
  appliesTo?: string
  minTransactionAmt?: number
  maxTransactionAmt?: number
  tierConfig?: Record<string, unknown>
}

export interface UpdateCommissionInput {
  commissionType?: 'PERCENTAGE' | 'FIXED' | 'TIERED'
  commissionValue?: number
  country?: string
  currency?: string
  effectiveFrom?: Date
  appliesTo?: string
  minTransactionAmt?: number
  maxTransactionAmt?: number
  tierConfig?: Record<string, unknown>
  isActive?: boolean
}

export interface CommissionResult {
  id: number
  businessId: number | null
  businessName: string | null
  effectiveFrom: Date
  country: string
  currency: string
  commissionType: string
  commissionValue: number
  tierConfig: Record<string, unknown> | null
  platformCommission: number
  platformAmount: number
  appliesTo: string
  minTransactionAmt: number | null
  maxTransactionAmt: number | null
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

/**
 * Create a global commission that applies to all organizations
 */
export async function createGlobalCommission(
  data: CreateGlobalCommissionInput
): Promise<CommissionResult> {
  // Normalize country code (USA -> US)
  const normalizedCountry = data.country === 'USA' ? 'US' : data.country || 'US'

  // Handle maxTransactionAmt: 0 should be null
  const maxTransactionAmt =
    data.maxTransactionAmt !== undefined && data.maxTransactionAmt > 0
      ? data.maxTransactionAmt
      : null

  // Deactivate existing global active commissions for the same country/currency
  // biome-ignore lint/suspicious/noExplicitAny: Prisma nullable field query requires type assertion
  await prisma.commission.updateMany({
    where: {
      businessId: null as any,
      country: normalizedCountry,
      currency: data.currency || 'USD',
      isActive: true,
    },
    data: {
      isActive: false,
    },
  })

  // Create new global commission
  // biome-ignore lint/suspicious/noExplicitAny: Prisma null and JSON handling requires any type
  const commission = await prisma.commission.create({
    data: {
      businessId: null as any, // null = global commission
      effectiveFrom: data.effectiveFrom || new Date(),
      country: normalizedCountry,
      currency: data.currency || 'USD',
      commissionType: data.commissionType,
      commissionValue: data.commissionValue,
      tierConfig: data.tierConfig ? (data.tierConfig as any) : null,
      platformCommission: 0,
      platformAmount: 0,
      appliesTo: data.appliesTo || 'ALL',
      minTransactionAmt: data.minTransactionAmt ?? null,
      maxTransactionAmt,
      isActive: true,
    },
  })

  return {
    id: commission.id,
    businessId: null,
    businessName: 'Global (All Organizations)',
    effectiveFrom: commission.effectiveFrom,
    country: commission.country,
    currency: commission.currency,
    commissionType: commission.commissionType,
    commissionValue: commission.commissionValue,
    tierConfig: (commission.tierConfig as Record<string, unknown>) || null,
    platformCommission: commission.platformCommission,
    platformAmount: commission.platformAmount,
    appliesTo: commission.appliesTo,
    minTransactionAmt: commission.minTransactionAmt,
    maxTransactionAmt: commission.maxTransactionAmt,
    isActive: commission.isActive,
    createdAt: commission.createdAt,
    updatedAt: commission.updatedAt,
  }
}

/**
 * Create a commission for a specific organization
 */
export async function createOrganizationCommission(
  data: CreateOrganizationCommissionInput
): Promise<CommissionResult> {
  // Verify business exists
  const business = await prisma.businessOrganization.findUnique({
    where: { id: data.businessId },
    select: { id: true, companyName: true },
  })

  if (!business) {
    throw new BusinessNotFoundError()
  }

  // Deactivate existing active commissions for this business
  await prisma.commission.updateMany({
    where: {
      businessId: data.businessId,
      country: data.country || 'US',
      currency: data.currency || 'USD',
      isActive: true,
    },
    data: {
      isActive: false,
    },
  })

  // Create new commission
  const commission = await prisma.commission.create({
    data: {
      businessId: data.businessId,
      effectiveFrom: data.effectiveFrom || new Date(),
      country: data.country || 'US',
      currency: data.currency || 'USD',
      commissionType: data.commissionType,
      commissionValue: data.commissionValue,
      tierConfig: (data.tierConfig as any) || null,
      platformCommission: 0,
      platformAmount: 0,
      appliesTo: data.appliesTo || 'ALL',
      minTransactionAmt: data.minTransactionAmt,
      maxTransactionAmt: data.maxTransactionAmt,
      isActive: true,
    },
  })

  return {
    id: commission.id,
    businessId: commission.businessId,
    businessName: business.companyName,
    effectiveFrom: commission.effectiveFrom,
    country: commission.country,
    currency: commission.currency,
    commissionType: commission.commissionType,
    commissionValue: commission.commissionValue,
    tierConfig: (commission.tierConfig as Record<string, unknown>) || null,
    platformCommission: commission.platformCommission,
    platformAmount: commission.platformAmount,
    appliesTo: commission.appliesTo,
    minTransactionAmt: commission.minTransactionAmt,
    maxTransactionAmt: commission.maxTransactionAmt,
    isActive: commission.isActive,
    createdAt: commission.createdAt,
    updatedAt: commission.updatedAt,
  }
}

/**
 * Get all commissions (global and organization-specific)
 */
export async function getAllCommissions(
  page = 1,
  limit = 10,
  businessId?: number,
  isActive?: boolean
) {
  const skip = (page - 1) * limit

  // biome-ignore lint/suspicious/noExplicitAny: Prisma where clause with nullable businessId requires any type
  const where: any = {}

  if (businessId !== undefined) {
    where.businessId = businessId
  } else {
    // If businessId is undefined, we want to get all (both global and organization-specific)
    // So we don't filter by businessId
  }

  if (isActive !== undefined) {
    where.isActive = isActive
  }

  const [commissions, total] = await Promise.all([
    prisma.commission.findMany({
      where,
      skip,
      take: limit,
      include: {
        business: {
          select: {
            id: true,
            companyName: true,
          },
        },
      },
      orderBy: [
        { businessId: 'asc' }, // Global commissions first (null)
        { effectiveFrom: 'desc' },
      ],
    }),
    prisma.commission.count({ where }),
  ])

  return {
    data: commissions.map(commission => ({
      id: commission.id,
      businessId: commission.businessId,
      businessName: commission.businessId
        ? commission.business?.companyName || 'Unknown Business'
        : 'Global (All Organizations)',
      effectiveFrom: commission.effectiveFrom,
      country: commission.country,
      currency: commission.currency,
      commissionType: commission.commissionType,
      commissionValue: commission.commissionValue,
      tierConfig: (commission.tierConfig as Record<string, unknown>) || null,
      platformCommission: commission.platformCommission,
      platformAmount: commission.platformAmount,
      appliesTo: commission.appliesTo,
      minTransactionAmt: commission.minTransactionAmt,
      maxTransactionAmt: commission.maxTransactionAmt,
      isActive: commission.isActive,
      createdAt: commission.createdAt,
      updatedAt: commission.updatedAt,
    })),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  }
}

/**
 * Get commission by ID
 */
export async function getCommissionById(id: number): Promise<CommissionResult | null> {
  const commission = await prisma.commission.findUnique({
    where: { id },
    include: {
      business: {
        select: {
          id: true,
          companyName: true,
        },
      },
    },
  })

  if (!commission) {
    return null
  }

  return {
    id: commission.id,
    businessId: commission.businessId,
    businessName: commission.businessId
      ? commission.business?.companyName || 'Unknown Business'
      : 'Global (All Organizations)',
    effectiveFrom: commission.effectiveFrom,
    country: commission.country,
    currency: commission.currency,
    commissionType: commission.commissionType,
    commissionValue: commission.commissionValue,
    tierConfig: (commission.tierConfig as Record<string, unknown>) || null,
    platformCommission: commission.platformCommission,
    platformAmount: commission.platformAmount,
    appliesTo: commission.appliesTo,
    minTransactionAmt: commission.minTransactionAmt,
    maxTransactionAmt: commission.maxTransactionAmt,
    isActive: commission.isActive,
    createdAt: commission.createdAt,
    updatedAt: commission.updatedAt,
  }
}

/**
 * Update commission by ID
 */
export async function updateCommission(
  id: number,
  data: UpdateCommissionInput
): Promise<CommissionResult> {
  const existing = await prisma.commission.findUnique({
    where: { id },
    include: {
      business: {
        select: {
          id: true,
          companyName: true,
        },
      },
    },
  })

  if (!existing) {
    throw new CommissionNotFoundError()
  }

  const updated = await prisma.commission.update({
    where: { id },
    data: {
      ...(data.commissionType && { commissionType: data.commissionType }),
      ...(data.commissionValue !== undefined && { commissionValue: data.commissionValue }),
      ...(data.country && { country: data.country }),
      ...(data.currency && { currency: data.currency }),
      ...(data.effectiveFrom && { effectiveFrom: data.effectiveFrom }),
      ...(data.appliesTo && { appliesTo: data.appliesTo }),
      ...(data.minTransactionAmt !== undefined && { minTransactionAmt: data.minTransactionAmt }),
      ...(data.maxTransactionAmt !== undefined && { maxTransactionAmt: data.maxTransactionAmt }),
      ...(data.tierConfig !== undefined && { tierConfig: data.tierConfig as any }),
      ...(data.isActive !== undefined && { isActive: data.isActive }),
    },
    include: {
      business: {
        select: {
          id: true,
          companyName: true,
        },
      },
    },
  })

  return {
    id: updated.id,
    businessId: updated.businessId,
    businessName: updated.businessId
      ? updated.business?.companyName || 'Unknown Business'
      : 'Global (All Organizations)',
    effectiveFrom: updated.effectiveFrom,
    country: updated.country,
    currency: updated.currency,
    commissionType: updated.commissionType,
    commissionValue: updated.commissionValue,
    tierConfig: (updated.tierConfig as Record<string, unknown>) || null,
    platformCommission: updated.platformCommission,
    platformAmount: updated.platformAmount,
    appliesTo: updated.appliesTo,
    minTransactionAmt: updated.minTransactionAmt,
    maxTransactionAmt: updated.maxTransactionAmt,
    isActive: updated.isActive,
    createdAt: updated.createdAt,
    updatedAt: updated.updatedAt,
  }
}

/**
 * Delete commission by ID
 */
export async function deleteCommission(id: number): Promise<boolean> {
  const existing = await prisma.commission.findUnique({
    where: { id },
    select: { id: true },
  })

  if (!existing) {
    return false
  }

  await prisma.commission.delete({
    where: { id },
  })

  return true
}

/**
 * Get commission for a specific business
 * Returns organization-specific commission if exists, otherwise returns global commission
 */
export async function getCommissionByBusinessId(
  businessId: number,
  country = 'US',
  currency = 'USD'
): Promise<CommissionResult | null> {
  // First, check if business exists
  const business = await prisma.businessOrganization.findUnique({
    where: { id: businessId },
    select: { id: true, companyName: true },
  })

  if (!business) {
    return null
  }

  // Check for organization-specific active commission
  const orgCommission = await prisma.commission.findFirst({
    where: {
      businessId,
      country,
      currency,
      isActive: true,
    },
    orderBy: {
      effectiveFrom: 'desc',
    },
    include: {
      business: {
        select: {
          id: true,
          companyName: true,
        },
      },
    },
  })

  if (orgCommission) {
    return {
      id: orgCommission.id,
      businessId: orgCommission.businessId,
      businessName: orgCommission.business?.companyName || 'Unknown Business',
      effectiveFrom: orgCommission.effectiveFrom,
      country: orgCommission.country,
      currency: orgCommission.currency,
      commissionType: orgCommission.commissionType,
      commissionValue: orgCommission.commissionValue,
      tierConfig: (orgCommission.tierConfig as Record<string, unknown>) || null,
      platformCommission: orgCommission.platformCommission,
      platformAmount: orgCommission.platformAmount,
      appliesTo: orgCommission.appliesTo,
      minTransactionAmt: orgCommission.minTransactionAmt,
      maxTransactionAmt: orgCommission.maxTransactionAmt,
      isActive: orgCommission.isActive,
      createdAt: orgCommission.createdAt,
      updatedAt: orgCommission.updatedAt,
    }
  }

  // If no organization-specific commission, get global commission
  // biome-ignore lint/suspicious/noExplicitAny: Prisma nullable field query requires type assertion
  const globalCommission = await prisma.commission.findFirst({
    where: {
      businessId: null as any,
      country,
      currency,
      isActive: true,
    },
    orderBy: {
      effectiveFrom: 'desc',
    },
  })

  if (!globalCommission) {
    return null
  }

  return {
    id: globalCommission.id,
    businessId: null,
    businessName: 'Global (All Organizations)',
    effectiveFrom: globalCommission.effectiveFrom,
    country: globalCommission.country,
    currency: globalCommission.currency,
    commissionType: globalCommission.commissionType,
    commissionValue: globalCommission.commissionValue,
    tierConfig: (globalCommission.tierConfig as Record<string, unknown>) || null,
    platformCommission: globalCommission.platformCommission,
    platformAmount: globalCommission.platformAmount,
    appliesTo: globalCommission.appliesTo,
    minTransactionAmt: globalCommission.minTransactionAmt,
    maxTransactionAmt: globalCommission.maxTransactionAmt,
    isActive: globalCommission.isActive,
    createdAt: globalCommission.createdAt,
    updatedAt: globalCommission.updatedAt,
  }
}

/**
 * Get active global commission (for default)
 */
export async function getActiveGlobalCommission(
  country = 'US',
  currency = 'USD'
): Promise<CommissionResult | null> {
  // Use proper Prisma null filter syntax for nullable field
  // biome-ignore lint/suspicious/noExplicitAny: Prisma nullable field query requires type assertion
  const commission = await prisma.commission.findFirst({
    where: {
      businessId: null as any,
      country,
      currency,
      isActive: true,
    },
    orderBy: {
      effectiveFrom: 'desc',
    },
  })

  if (!commission) {
    return null
  }

  return {
    id: commission.id,
    businessId: null,
    businessName: 'Global (All Organizations)',
    effectiveFrom: commission.effectiveFrom,
    country: commission.country,
    currency: commission.currency,
    commissionType: commission.commissionType,
    commissionValue: commission.commissionValue,
    tierConfig: (commission.tierConfig as Record<string, unknown>) || null,
    platformCommission: commission.platformCommission,
    platformAmount: commission.platformAmount,
    appliesTo: commission.appliesTo,
    minTransactionAmt: commission.minTransactionAmt,
    maxTransactionAmt: commission.maxTransactionAmt,
    isActive: commission.isActive,
    createdAt: commission.createdAt,
    updatedAt: commission.updatedAt,
  }
}
