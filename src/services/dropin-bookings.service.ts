import prisma from '~/lib/prisma'

export interface CreateDropInBookingData {
  userId: string
  dropInClassId: number
  studentId: number
  enrollmentDate?: string
  paymentOption?: string
  status?: string
}

export interface UpdateDropInBookingData {
  dropInClassId?: number
  studentId?: number
  enrollmentDate?: string
  paymentOption?: string
  status?: string
}

export async function createDropInBooking(data: CreateDropInBookingData) {
  return prisma.dropInClassBooking.create({
    data: {
      userId: data.userId,
      dropInClassId: data.dropInClassId,
      studentId: data.studentId,
      enrollmentDate: data.enrollmentDate ? new Date(data.enrollmentDate) : new Date(),
      paymentOption: data.paymentOption,
      status: data.status ?? 'Active',
    },
    include: {
      dropInClass: {
        include: {
          teacher: true,
          location: true,
        },
      },
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
  })
}

export async function getDropInBookings(userId: string) {
  return prisma.dropInClassBooking.findMany({
    where: { userId },
    include: {
      dropInClass: {
        include: {
          teacher: true,
          location: true,
        },
      },
      student: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          familyId: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })
}

export async function getDropInBookingById(id: number, userId: string) {
  return prisma.dropInClassBooking.findFirst({
    where: { id, userId },
    include: {
      dropInClass: {
        include: {
          teacher: true,
          location: true,
        },
      },
      student: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          familyId: true,
        },
      },
    },
  })
}

export async function getDropInBookingsByClass(dropInClassId: number, userId: string) {
  return prisma.dropInClassBooking.findMany({
    where: { dropInClassId, userId },
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
    orderBy: { createdAt: 'desc' },
  })
}

export async function updateDropInBooking(
  id: number,
  userId: string,
  data: UpdateDropInBookingData
) {
  const booking = await prisma.dropInClassBooking.findFirst({
    where: { id, userId },
  })

  if (!booking) {
    return null
  }

  return prisma.dropInClassBooking.update({
    where: { id },
    data: {
      ...(data.dropInClassId && { dropInClassId: data.dropInClassId }),
      ...(data.studentId && { studentId: data.studentId }),
      ...(data.enrollmentDate && { enrollmentDate: new Date(data.enrollmentDate) }),
      ...(data.paymentOption !== undefined && { paymentOption: data.paymentOption }),
      ...(data.status && { status: data.status }),
    },
    include: {
      dropInClass: {
        include: {
          teacher: true,
          location: true,
        },
      },
      student: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          familyId: true,
        },
      },
    },
  })
}

export async function deleteDropInBooking(id: number, userId: string) {
  const booking = await prisma.dropInClassBooking.findFirst({
    where: { id, userId },
  })

  if (!booking) {
    return null
  }

  await prisma.dropInClassBooking.delete({
    where: { id },
  })

  return { success: true }
}
