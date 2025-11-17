import prisma from '~/lib/prisma'

export interface DiscountTierInput {
  studentsPerFamily?: number | null
  classesPerStudent?: number | null
  percentageOff: number
}

export interface CreateDiscountData {
  userId: string
  title: string
  description?: string
  discountType: 'PERCENTAGE' | 'FIXED'
  discountValue: number
  appliesTo: string
  applicableClassIds?: unknown
  applicableClassTypes?: unknown
  minEnrollmentCount?: number | null
  siblingConfig?: unknown
  validFrom: string
  validUntil: string
  maxUsesTotal?: number | null
  maxUsesPerFamily?: number | null
  category?: 'MULTIPLE_STUDENT' | 'CLASS_BY_STUDENT' | 'CLASS_BY_FAMILY'
  isActive?: boolean
  tiers?: DiscountTierInput[]
}

export interface UpdateDiscountData extends Partial<CreateDiscountData> {
  tiers?: DiscountTierInput[] | null
}

const includeConfig = {
  tiers: true,
}

export async function createDiscount(data: CreateDiscountData) {
  return prisma.$transaction(async tx => {
    const discount = await tx.discount.create({
      data: {
        title: data.title,
        description: data.description,
        discountType: data.discountType,
        discountValue: data.discountValue,
        appliesTo: data.appliesTo,
        applicableClassIds: (data.applicableClassIds ?? null) as any,
        applicableClassTypes: (data.applicableClassTypes ?? null) as any,
        minEnrollmentCount: data.minEnrollmentCount ?? null,
        siblingConfig: (data.siblingConfig ?? null) as any,
        validFrom: new Date(data.validFrom),
        validUntil: new Date(data.validUntil),
        maxUsesTotal: data.maxUsesTotal ?? null,
        maxUsesPerFamily: data.maxUsesPerFamily ?? null,
        isActive: data.isActive ?? true,
        userId: data.userId,
        category: data.category ?? null,
      },
    })

    if (data.tiers && data.tiers.length > 0) {
      await tx.discountTier.createMany({
        data: data.tiers.map(tier => ({
          discountId: discount.id,
          studentsPerFamily: tier.studentsPerFamily ?? null,
          classesPerStudent: tier.classesPerStudent ?? null,
          percentageOff: tier.percentageOff,
        })),
      })
    }

    return tx.discount.findUnique({
      where: { id: discount.id },
      include: includeConfig,
    })
  })
}

export async function getDiscounts(userId: string) {
  return prisma.discount.findMany({
    where: {
      OR: [{ userId }, { userId: null }],
    },
    include: includeConfig,
    orderBy: { createdAt: 'desc' },
  })
}

export async function getDiscountById(id: number, userId: string) {
  return prisma.discount.findFirst({
    where: {
      id,
      OR: [{ userId }, { userId: null }],
    },
    include: includeConfig,
  })
}

export async function updateDiscount(id: number, userId: string, data: UpdateDiscountData) {
  return prisma.$transaction(async tx => {
    const existing = await tx.discount.findFirst({
      where: { id, OR: [{ userId }, { userId: null }] },
      select: { id: true },
    })
    if (!existing) {
      return null
    }

    const updated = await tx.discount.update({
      where: { id },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.discountType !== undefined && { discountType: data.discountType }),
        ...(data.discountValue !== undefined && { discountValue: data.discountValue }),
        ...(data.appliesTo !== undefined && { appliesTo: data.appliesTo }),
        ...(data.applicableClassIds !== undefined && {
          applicableClassIds: (data.applicableClassIds ?? null) as any,
        }),
        ...(data.applicableClassTypes !== undefined && {
          applicableClassTypes: (data.applicableClassTypes ?? null) as any,
        }),
        ...(data.minEnrollmentCount !== undefined && {
          minEnrollmentCount: data.minEnrollmentCount,
        }),
        ...(data.siblingConfig !== undefined && {
          siblingConfig: (data.siblingConfig ?? null) as any,
        }),
        ...(data.validFrom !== undefined && { validFrom: new Date(data.validFrom) }),
        ...(data.validUntil !== undefined && { validUntil: new Date(data.validUntil) }),
        ...(data.maxUsesTotal !== undefined && { maxUsesTotal: data.maxUsesTotal }),
        ...(data.maxUsesPerFamily !== undefined && { maxUsesPerFamily: data.maxUsesPerFamily }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
        ...(data.category !== undefined && { category: data.category }),
      },
    })

    if (data.tiers) {
      await tx.discountTier.deleteMany({
        where: { discountId: id },
      })
      if (data.tiers.length > 0) {
        await tx.discountTier.createMany({
          data: data.tiers.map(tier => ({
            discountId: id,
            studentsPerFamily: tier.studentsPerFamily ?? null,
            classesPerStudent: tier.classesPerStudent ?? null,
            percentageOff: tier.percentageOff,
          })),
        })
      }
    }

    return tx.discount.findUnique({
      where: { id },
      include: includeConfig,
    })
  })
}

export async function deleteDiscount(id: number, userId: string) {
  const existing = await prisma.discount.findFirst({
    where: { id, OR: [{ userId }, { userId: null }] },
    select: { id: true },
  })
  if (!existing) {
    return false
  }
  await prisma.discount.delete({
    where: { id },
  })
  return true
}
