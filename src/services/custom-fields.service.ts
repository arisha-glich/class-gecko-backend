import prisma from '~/lib/prisma'

export interface CreateCustomFieldData {
  userId: string
  appliesTo: string
  question: string
  answerType: string
  options?: unknown
  isRequired?: boolean
  isActive?: boolean
}

export interface UpdateCustomFieldData extends Partial<CreateCustomFieldData> {}

export async function createCustomField(data: CreateCustomFieldData) {
  return prisma.customField.create({
    data: {
      userId: data.userId,
      appliesTo: data.appliesTo,
      question: data.question,
      answerType: data.answerType,
      // biome-ignore lint/suspicious/noExplicitAny: Prisma JSON field requires any type
      options: (data.options ?? null) as any,
      isRequired: data.isRequired ?? false,
      isActive: data.isActive ?? true,
    },
  })
}

export async function getCustomFields(userId: string) {
  return prisma.customField.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  })
}

export async function getCustomFieldById(id: number, userId: string) {
  return prisma.customField.findFirst({
    where: { id, userId },
  })
}

export async function updateCustomField(id: number, userId: string, data: UpdateCustomFieldData) {
  const existing = await prisma.customField.findFirst({
    where: { id, userId },
    select: { id: true },
  })

  if (!existing) {
    return null
  }

  return prisma.customField.update({
    where: { id },
    data: {
      ...(data.appliesTo !== undefined && { appliesTo: data.appliesTo }),
      ...(data.question !== undefined && { question: data.question }),
      ...(data.answerType !== undefined && { answerType: data.answerType }),
      ...(data.options !== undefined && {
        // biome-ignore lint/suspicious/noExplicitAny: Prisma JSON field requires any type
        options: (data.options ?? null) as any,
      }),
      ...(data.isRequired !== undefined && { isRequired: data.isRequired }),
      ...(data.isActive !== undefined && { isActive: data.isActive }),
    },
  })
}

export async function deleteCustomField(id: number, userId: string) {
  const existing = await prisma.customField.findFirst({
    where: { id, userId },
    select: { id: true },
  })

  if (!existing) {
    return false
  }

  await prisma.customField.delete({
    where: { id },
  })

  return true
}
