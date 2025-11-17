import prisma from '~/lib/prisma'

export interface CreateEnrollmentData {
  userId: string
  classId: number
  termId?: number
  studentId: number
  enrollmentStartDate: string
  enrollmentEndDate: string
  paymentOption: string
}

export interface UpdateEnrollmentData {
  classId?: number
  termId?: number
  studentId?: number
  enrollmentStartDate?: string
  enrollmentEndDate?: string
  paymentOption?: string
  status?: string
}

export async function createEnrollment(data: CreateEnrollmentData) {
  return prisma.classBooking.create({
    data: {
      userId: data.userId,
      classId: data.classId,
      termId: data.termId,
      studentId: data.studentId,
      enrollmentStartDate: new Date(data.enrollmentStartDate),
      enrollmentEndDate: new Date(data.enrollmentEndDate),
      paymentOption: data.paymentOption,
      status: 'Active',
    },
    include: {
      class: true,
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
      term: true,
    },
  })
}

export async function getEnrollments(userId: string) {
  return prisma.classBooking.findMany({
    where: { userId },
    include: {
      class: true,
      student: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          familyId: true,
        },
      },
      term: true,
    },
    orderBy: { createdAt: 'desc' },
  })
}

export async function getEnrollmentById(id: number) {
  return prisma.classBooking.findUnique({
    where: { id },
    include: {
      class: {
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
      term: true,
      payment: true,
    },
  })
}

export async function getEnrollmentsByClass(classId: number) {
  return prisma.classBooking.findMany({
    where: { classId },
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
      term: true,
    },
    orderBy: { createdAt: 'desc' },
  })
}

export async function updateEnrollment(id: number, userId: string, data: UpdateEnrollmentData) {
  const enrollment = await prisma.classBooking.findFirst({
    where: { id, userId },
  })

  if (!enrollment) {
    return null
  }

  return prisma.classBooking.update({
    where: { id },
    data: {
      ...(data.classId && { classId: data.classId }),
      ...(data.termId !== undefined && { termId: data.termId }),
      ...(data.studentId && { studentId: data.studentId }),
      ...(data.enrollmentStartDate && { enrollmentStartDate: new Date(data.enrollmentStartDate) }),
      ...(data.enrollmentEndDate && { enrollmentEndDate: new Date(data.enrollmentEndDate) }),
      ...(data.paymentOption && { paymentOption: data.paymentOption }),
      ...(data.status && { status: data.status }),
    },
    include: {
      class: true,
      student: {
        include: {
          user: true,
        },
      },
      term: true,
    },
  })
}

export async function deleteEnrollment(id: number, userId: string) {
  const enrollment = await prisma.classBooking.findFirst({
    where: { id, userId },
  })

  if (!enrollment) {
    return null
  }

  await prisma.classBooking.delete({
    where: { id },
  })

  return { success: true }
}
