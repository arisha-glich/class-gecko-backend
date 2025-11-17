import prisma from '~/lib/prisma'

export interface CreateRegistrationFeeData {
  userId: string
  title: string
  pricePerStudent: number
  maxPerFamily?: number | null
  renewalType: string
  renewalDate?: string | null
  isActive?: boolean
}

export interface UpdateRegistrationFeeData extends Partial<CreateRegistrationFeeData> {}

export async function createRegistrationFee(data: CreateRegistrationFeeData) {
  return prisma.registrationFee.create({
    data: {
      userId: data.userId,
      title: data.title,
      pricePerStudent: data.pricePerStudent,
      maxPerFamily: data.maxPerFamily ?? null,
      renewalType: data.renewalType,
      renewalDate: data.renewalDate ? new Date(data.renewalDate) : null,
      isActive: data.isActive ?? true,
    },
  })
}

export async function getRegistrationFees(userId: string) {
  return prisma.registrationFee.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  })
}

export async function getRegistrationFeeById(id: number, userId: string) {
  return prisma.registrationFee.findFirst({
    where: { id, userId },
  })
}

export async function updateRegistrationFee(
  id: number,
  userId: string,
  data: UpdateRegistrationFeeData
) {
  const existing = await prisma.registrationFee.findFirst({
    where: { id, userId },
    select: { id: true },
  })

  if (!existing) {
    return null
  }

  return prisma.registrationFee.update({
    where: { id },
    data: {
      ...(data.title !== undefined && { title: data.title }),
      ...(data.pricePerStudent !== undefined && { pricePerStudent: data.pricePerStudent }),
      ...(data.maxPerFamily !== undefined && { maxPerFamily: data.maxPerFamily }),
      ...(data.renewalType !== undefined && { renewalType: data.renewalType }),
      ...(data.renewalDate !== undefined && {
        renewalDate: data.renewalDate ? new Date(data.renewalDate) : null,
      }),
      ...(data.isActive !== undefined && { isActive: data.isActive }),
    },
  })
}

export async function deleteRegistrationFee(id: number, userId: string) {
  const existing = await prisma.registrationFee.findFirst({
    where: { id, userId },
    select: { id: true },
  })

  if (!existing) {
    return false
  }

  await prisma.registrationFee.delete({
    where: { id },
  })

  return true
}
