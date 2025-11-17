import prisma from '~/lib/prisma'

export interface CreateDropInClassData {
  userId: string
  title: string
  description?: string
  startDate: string
  endDate: string
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY'
  recurringDay?: string
  startTimeOfClass: string
  endTimeOfClass?: string
  duration: number
  pricingPerLesson: number
  classImage?: string
  locationId?: number
  teacherId?: number
  minimumAge?: number
  maximumAge?: number
  classColor?: string
  limitCapacity?: boolean
  capacity?: number
  allowPortalBooking?: boolean
  familyPortalTrial?: boolean
  globalClassDiscount?: boolean
  siblingDiscount?: boolean
  classType?: 'ONGOING_CLASS' | 'DROP_CLASS'
}

export interface UpdateDropInClassData extends Partial<CreateDropInClassData> {}

const includeConfig = {
  location: true,
  teacher: true,
}

export async function createDropInClass(data: CreateDropInClassData) {
  const dropInClass = await prisma.dropInClass.create({
    data: {
      userId: data.userId,
      title: data.title,
      description: data.description,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      frequency: data.frequency,
      recurringDay: data.recurringDay,
      startTimeOfClass: data.startTimeOfClass,
      endTimeOfClass: data.endTimeOfClass,
      duration: data.duration,
      pricingPerLesson: data.pricingPerLesson,
      classImage: data.classImage,
      locationId: data.locationId,
      teacherId: data.teacherId,
      minimumAge: data.minimumAge,
      maximumAge: data.maximumAge,
      classColor: data.classColor,
      limitCapacity: data.limitCapacity ?? false,
      capacity: data.capacity,
      allowPortalBooking: data.allowPortalBooking ?? true,
      familyPortalTrial: data.familyPortalTrial ?? false,
      globalClassDiscount: data.globalClassDiscount ?? false,
      siblingDiscount: data.siblingDiscount ?? false,
      classType: data.classType ?? 'DROP_CLASS',
    },
    include: includeConfig,
  })

  return dropInClass
}

export async function getDropInClasses(userId: string) {
  return prisma.dropInClass.findMany({
    where: { userId },
    include: includeConfig,
    orderBy: { createdAt: 'desc' },
  })
}

export async function getDropInClassById(id: number, userId: string) {
  return prisma.dropInClass.findFirst({
    where: { id, userId },
    include: includeConfig,
  })
}

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Data mapping function with many optional fields
function buildDropInClassUpdateData(data: UpdateDropInClassData) {
  return {
    ...(data.title !== undefined && { title: data.title }),
    ...(data.description !== undefined && { description: data.description }),
    ...(data.startDate && { startDate: new Date(data.startDate) }),
    ...(data.endDate && { endDate: new Date(data.endDate) }),
    ...(data.frequency && { frequency: data.frequency }),
    ...(data.recurringDay !== undefined && { recurringDay: data.recurringDay }),
    ...(data.startTimeOfClass !== undefined && { startTimeOfClass: data.startTimeOfClass }),
    ...(data.endTimeOfClass !== undefined && { endTimeOfClass: data.endTimeOfClass }),
    ...(data.duration !== undefined && { duration: data.duration }),
    ...(data.pricingPerLesson !== undefined && { pricingPerLesson: data.pricingPerLesson }),
    ...(data.classImage !== undefined && { classImage: data.classImage }),
    ...(data.locationId !== undefined && { locationId: data.locationId }),
    ...(data.teacherId !== undefined && { teacherId: data.teacherId }),
    ...(data.minimumAge !== undefined && { minimumAge: data.minimumAge }),
    ...(data.maximumAge !== undefined && { maximumAge: data.maximumAge }),
    ...(data.classColor !== undefined && { classColor: data.classColor }),
    ...(data.limitCapacity !== undefined && { limitCapacity: data.limitCapacity }),
    ...(data.capacity !== undefined && { capacity: data.capacity }),
    ...(data.allowPortalBooking !== undefined && {
      allowPortalBooking: data.allowPortalBooking,
    }),
    ...(data.familyPortalTrial !== undefined && { familyPortalTrial: data.familyPortalTrial }),
    ...(data.globalClassDiscount !== undefined && {
      globalClassDiscount: data.globalClassDiscount,
    }),
    ...(data.siblingDiscount !== undefined && { siblingDiscount: data.siblingDiscount }),
    ...(data.classType !== undefined && { classType: data.classType }),
  }
}

export async function updateDropInClass(id: number, userId: string, data: UpdateDropInClassData) {
  const existing = await prisma.dropInClass.findFirst({
    where: { id, userId },
    select: { id: true },
  })

  if (!existing) {
    return null
  }

  const updated = await prisma.dropInClass.update({
    where: { id },
    data: buildDropInClassUpdateData(data),
    include: includeConfig,
  })

  return updated
}

export async function deleteDropInClass(id: number, userId: string) {
  const existing = await prisma.dropInClass.findFirst({
    where: { id, userId },
    select: { id: true },
  })

  if (!existing) {
    return false
  }

  await prisma.dropInClass.delete({
    where: { id },
  })

  return true
}
