import prisma from '~/lib/prisma'

export interface CreateClassData {
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
  termId?: number
}

export interface UpdateClassData {
  title?: string
  description?: string
  startDate?: string
  endDate?: string
  frequency?: 'DAILY' | 'WEEKLY' | 'MONTHLY'
  recurringDay?: string
  startTimeOfClass?: string
  endTimeOfClass?: string
  duration?: number
  pricingPerLesson?: number
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
  termId?: number
}

export async function createClass(data: CreateClassData) {
  return prisma.class.create({
    data: {
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
      classType: data.classType ?? 'ONGOING_CLASS',
      termId: data.termId,
    },
    include: {
      location: true,
      teacher: true,
      term: true,
    },
  })
}

export async function getClasses() {
  return prisma.class.findMany({
    include: {
      location: true,
      teacher: true,
      term: true,
      _count: {
        select: {
          lessons: true,
          classBookings: true,
          trials: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })
}

export async function getClassById(id: number) {
  return prisma.class.findUnique({
    where: { id },
    include: {
      location: true,
      teacher: true,
      term: true,
      lessons: {
        orderBy: { date: 'asc' },
      },
      classBookings: {
        include: {
          student: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              familyId: true,
              medicalInfo: true,
              photoVideoConsent: true,
            },
          },
        },
      },
      trials: {
        include: {
          student: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              familyId: true,
            },
          },
        },
      },
    },
  })
}

export async function updateClass(id: number, data: UpdateClassData) {
  const classItem = await prisma.class.findUnique({
    where: { id },
  })

  if (!classItem) {
    return null
  }

  return prisma.class.update({
    where: { id },
    data: {
      ...(data.title && { title: data.title }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.startDate && { startDate: new Date(data.startDate) }),
      ...(data.endDate && { endDate: new Date(data.endDate) }),
      ...(data.frequency && { frequency: data.frequency }),
      ...(data.recurringDay !== undefined && { recurringDay: data.recurringDay }),
      ...(data.startTimeOfClass && { startTimeOfClass: data.startTimeOfClass }),
      ...(data.endTimeOfClass !== undefined && { endTimeOfClass: data.endTimeOfClass }),
      ...(data.duration && { duration: data.duration }),
      ...(data.pricingPerLesson && { pricingPerLesson: data.pricingPerLesson }),
      ...(data.classImage !== undefined && { classImage: data.classImage }),
      ...(data.locationId !== undefined && { locationId: data.locationId }),
      ...(data.teacherId !== undefined && { teacherId: data.teacherId }),
      ...(data.minimumAge !== undefined && { minimumAge: data.minimumAge }),
      ...(data.maximumAge !== undefined && { maximumAge: data.maximumAge }),
      ...(data.classColor !== undefined && { classColor: data.classColor }),
      ...(data.limitCapacity !== undefined && { limitCapacity: data.limitCapacity }),
      ...(data.capacity !== undefined && { capacity: data.capacity }),
      ...(data.allowPortalBooking !== undefined && { allowPortalBooking: data.allowPortalBooking }),
      ...(data.familyPortalTrial !== undefined && { familyPortalTrial: data.familyPortalTrial }),
      ...(data.globalClassDiscount !== undefined && {
        globalClassDiscount: data.globalClassDiscount,
      }),
      ...(data.siblingDiscount !== undefined && { siblingDiscount: data.siblingDiscount }),
      ...(data.classType && { classType: data.classType }),
      ...(data.termId !== undefined && { termId: data.termId }),
    },
    include: {
      location: true,
      teacher: true,
      term: true,
    },
  })
}

export async function deleteClass(id: number) {
  const classItem = await prisma.class.findUnique({
    where: { id },
  })

  if (!classItem) {
    return null
  }

  await prisma.class.delete({
    where: { id },
  })

  return { success: true }
}

export async function getClassesByTerm(termId: number) {
  return prisma.class.findMany({
    where: { termId },
    include: {
      location: true,
      teacher: true,
      _count: {
        select: {
          lessons: true,
          classBookings: true,
          trials: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })
}
