import prisma from '~/lib/prisma'

export interface CreateHolidayData {
  userId: string
  name: string
  isRecurring?: boolean
  affectsClass?: boolean
  startDate: string
  endDate: string
}

export interface UpdateHolidayData extends Partial<CreateHolidayData> {}

export async function createHoliday(data: CreateHolidayData) {
  return prisma.holiday.create({
    data: {
      userId: data.userId,
      name: data.name,
      isRecurring: data.isRecurring ?? false,
      affectsClass: data.affectsClass ?? false,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
    },
  })
}

export async function getHolidays(userId: string) {
  return prisma.holiday.findMany({
    where: { userId },
    orderBy: { startDate: 'asc' },
  })
}

export async function getHolidayById(id: number, userId: string) {
  return prisma.holiday.findFirst({
    where: { id, userId },
  })
}

export async function updateHoliday(id: number, userId: string, data: UpdateHolidayData) {
  const existing = await prisma.holiday.findFirst({
    where: { id, userId },
    select: { id: true },
  })

  if (!existing) {
    return null
  }

  return prisma.holiday.update({
    where: { id },
    data: {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.isRecurring !== undefined && { isRecurring: data.isRecurring }),
      ...(data.affectsClass !== undefined && { affectsClass: data.affectsClass }),
      ...(data.startDate && { startDate: new Date(data.startDate) }),
      ...(data.endDate && { endDate: new Date(data.endDate) }),
    },
  })
}

export async function deleteHoliday(id: number, userId: string) {
  const existing = await prisma.holiday.findFirst({
    where: { id, userId },
    select: { id: true },
  })

  if (!existing) {
    return false
  }

  await prisma.holiday.delete({
    where: { id },
  })

  return true
}
