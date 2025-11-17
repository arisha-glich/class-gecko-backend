import prisma from '~/lib/prisma'

export interface CreateWaitlistData {
  userId: string
  termId?: number
  studentId: number
  classId?: number
}

export interface UpdateWaitlistData {
  termId?: number
  studentId?: number
  classId?: number
}

export async function createWaitlist(data: CreateWaitlistData) {
  return prisma.waitlist.create({
    data: {
      userId: data.userId,
      termId: data.termId,
      studentId: data.studentId,
      classId: data.classId,
    },
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
      class: true,
      term: true,
    },
  })
}

export async function getWaitlist(userId: string) {
  return prisma.waitlist.findMany({
    where: { userId },
    include: {
      student: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          familyId: true,
        },
      },
      class: true,
      term: true,
    },
    orderBy: { createdAt: 'desc' },
  })
}

export async function getWaitlistById(id: number) {
  return prisma.waitlist.findUnique({
    where: { id },
    include: {
      student: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          familyId: true,
        },
      },
      class: true,
      term: true,
    },
  })
}

export async function getWaitlistByClass(classId: number) {
  return prisma.waitlist.findMany({
    where: { classId },
    include: {
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

export async function updateWaitlist(id: number, userId: string, data: UpdateWaitlistData) {
  const waitlistEntry = await prisma.waitlist.findFirst({
    where: { id, userId },
  })

  if (!waitlistEntry) {
    return null
  }

  return prisma.waitlist.update({
    where: { id },
    data: {
      ...(data.termId !== undefined && { termId: data.termId }),
      ...(data.studentId && { studentId: data.studentId }),
      ...(data.classId !== undefined && { classId: data.classId }),
    },
    include: {
      student: {
        include: {
          user: true,
        },
      },
      class: true,
      term: true,
    },
  })
}

export async function deleteWaitlist(id: number, userId: string) {
  const waitlistEntry = await prisma.waitlist.findFirst({
    where: { id, userId },
  })

  if (!waitlistEntry) {
    return null
  }

  await prisma.waitlist.delete({
    where: { id },
  })

  return { success: true }
}
