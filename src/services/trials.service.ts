import prisma from '~/lib/prisma'

export interface CreateTrialData {
  userId: string
  classId: number
  termId?: number
  studentId: number
  lessonId?: number
  date?: string
  status?: string
  notes?: string
}

export interface UpdateTrialData {
  classId?: number
  termId?: number
  studentId?: number
  lessonId?: number
  date?: string
  status?: string
  notes?: string
}

export async function createTrial(data: CreateTrialData) {
  return prisma.trial.create({
    data: {
      userId: data.userId,
      classId: data.classId,
      termId: data.termId,
      studentId: data.studentId,
      lessonId: data.lessonId,
      date: data.date ? new Date(data.date) : null,
      status: data.status ?? 'pending',
      notes: data.notes,
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
      lesson: true,
    },
  })
}

export async function getTrials(userId: string) {
  return prisma.trial.findMany({
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
      lesson: true,
    },
    orderBy: { createdAt: 'desc' },
  })
}

export async function getTrialById(id: number) {
  return prisma.trial.findUnique({
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
          medicalInfo: true,
          photoVideoConsent: true,
        },
      },
      term: true,
      lesson: true,
    },
  })
}

export async function getTrialsByClass(classId: number) {
  return prisma.trial.findMany({
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
      lesson: true,
    },
    orderBy: { createdAt: 'desc' },
  })
}

export async function updateTrial(id: number, userId: string, data: UpdateTrialData) {
  const trial = await prisma.trial.findFirst({
    where: { id, userId },
  })

  if (!trial) {
    return null
  }

  return prisma.trial.update({
    where: { id },
    data: {
      ...(data.classId && { classId: data.classId }),
      ...(data.termId !== undefined && { termId: data.termId }),
      ...(data.studentId && { studentId: data.studentId }),
      ...(data.lessonId !== undefined && { lessonId: data.lessonId }),
      ...(data.date && { date: new Date(data.date) }),
      ...(data.status && { status: data.status }),
      ...(data.notes !== undefined && { notes: data.notes }),
    },
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
      lesson: true,
    },
  })
}

export async function deleteTrial(id: number, userId: string) {
  const trial = await prisma.trial.findFirst({
    where: { id, userId },
  })

  if (!trial) {
    return null
  }

  await prisma.trial.delete({
    where: { id },
  })

  return { success: true }
}
