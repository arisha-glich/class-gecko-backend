import prisma from '~/lib/prisma'

export interface CreateCampData {
  userId: string
  title: string
  startDate: string
  endDate?: string | null
  allowParentsToBookIndividualDays?: boolean
  allowParentsToBookHalfDaySession?: boolean
  offerEarlyDropoff?: boolean
  offerLatePickup?: boolean
}

export interface UpdateCampData {
  title?: string
  startDate?: string
  endDate?: string | null
  allowParentsToBookIndividualDays?: boolean
  allowParentsToBookHalfDaySession?: boolean
  offerEarlyDropoff?: boolean
  offerLatePickup?: boolean
}

function mapCamp(camp: any) {
  return camp
}

export async function createCamp(data: CreateCampData) {
  const camp = await prisma.camp.create({
    data: {
      userId: data.userId,
      title: data.title,
      startDate: new Date(data.startDate),
      endDate: data.endDate ? new Date(data.endDate) : null,
      allowParentsToBookIndividualDays: data.allowParentsToBookIndividualDays ?? false,
      allowParentsToBookHalfDaySession: data.allowParentsToBookHalfDaySession ?? false,
      offerEarlyDropoff: data.offerEarlyDropoff ?? false,
      offerLatePickup: data.offerLatePickup ?? false,
    },
  })
  return mapCamp(camp)
}

export async function getCamps(userId: string) {
  const camps = await prisma.camp.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  })
  return camps.map(mapCamp)
}

export async function getCampById(id: number, userId: string) {
  const camp = await prisma.camp.findFirst({
    where: { id, userId },
  })
  return camp ? mapCamp(camp) : null
}

export async function updateCamp(id: number, userId: string, data: UpdateCampData) {
  const existingCamp = await prisma.camp.findFirst({
    where: { id, userId },
  })
  if (!existingCamp) {
    return null
  }

  const camp = await prisma.camp.update({
    where: { id },
    data: {
      ...(data.title ? { title: data.title } : {}),
      ...(data.startDate ? { startDate: new Date(data.startDate) } : {}),
      ...(data.endDate !== undefined
        ? { endDate: data.endDate ? new Date(data.endDate) : null }
        : {}),
      ...(data.allowParentsToBookIndividualDays !== undefined
        ? { allowParentsToBookIndividualDays: data.allowParentsToBookIndividualDays }
        : {}),
      ...(data.allowParentsToBookHalfDaySession !== undefined
        ? { allowParentsToBookHalfDaySession: data.allowParentsToBookHalfDaySession }
        : {}),
      ...(data.offerEarlyDropoff !== undefined
        ? { offerEarlyDropoff: data.offerEarlyDropoff }
        : {}),
      ...(data.offerLatePickup !== undefined ? { offerLatePickup: data.offerLatePickup } : {}),
    },
  })
  return mapCamp(camp)
}

export async function deleteCamp(id: number, userId: string) {
  const existingCamp = await prisma.camp.findFirst({
    where: { id, userId },
    select: { id: true },
  })
  if (!existingCamp) {
    return false
  }

  await prisma.camp.delete({
    where: { id },
  })
  return true
}
