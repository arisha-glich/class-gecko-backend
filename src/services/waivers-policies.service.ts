import prisma from '~/lib/prisma'

export interface CreateWaiverPolicyData {
  userId: string
  title: string
  description: string
  permission: string
}

export interface UpdateWaiverPolicyData extends Partial<CreateWaiverPolicyData> {}

export async function createWaiverPolicy(data: CreateWaiverPolicyData) {
  return prisma.waiversPolicies.create({
    data: {
      userId: data.userId,
      title: data.title,
      description: data.description,
      permission: data.permission,
    },
  })
}

export async function getWaiverPolicies(userId: string) {
  return prisma.waiversPolicies.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  })
}

export async function getWaiverPolicyById(id: number, userId: string) {
  return prisma.waiversPolicies.findFirst({
    where: { id, userId },
  })
}

export async function updateWaiverPolicy(id: number, userId: string, data: UpdateWaiverPolicyData) {
  const existing = await prisma.waiversPolicies.findFirst({
    where: { id, userId },
    select: { id: true },
  })

  if (!existing) {
    return null
  }

  return prisma.waiversPolicies.update({
    where: { id },
    data: {
      ...(data.title !== undefined && { title: data.title }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.permission !== undefined && { permission: data.permission }),
    },
  })
}

export async function deleteWaiverPolicy(id: number, userId: string) {
  const existing = await prisma.waiversPolicies.findFirst({
    where: { id, userId },
    select: { id: true },
  })

  if (!existing) {
    return false
  }

  await prisma.waiversPolicies.delete({
    where: { id },
  })

  return true
}
