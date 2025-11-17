import prisma from '~/lib/prisma'

export interface CreateLessonData {
  classId: number
  title: string
  isTrial?: boolean
  status?: string
  attendanceId?: string
  notes?: string
  date: string
  startTime: string
  endTime?: string
  duration: number
}

export interface UpdateLessonData {
  classId?: number
  title?: string
  isTrial?: boolean
  status?: string
  attendanceId?: string
  notes?: string
  date?: string
  startTime?: string
  endTime?: string
  duration?: number
}

export async function createLesson(data: CreateLessonData) {
  return prisma.lesson.create({
    data: {
      classId: data.classId,
      title: data.title,
      isTrial: data.isTrial ?? false,
      status: data.status ?? 'scheduled',
      attendanceId: data.attendanceId,
      notes: data.notes,
      date: new Date(data.date),
      startTime: data.startTime,
      endTime: data.endTime,
      duration: data.duration,
    },
    include: {
      class: true,
    },
  })
}

export async function getLessons() {
  return prisma.lesson.findMany({
    include: {
      class: true,
    },
    orderBy: { date: 'asc' },
  })
}

export async function getLessonById(id: number) {
  return prisma.lesson.findUnique({
    where: { id },
    include: {
      class: {
        include: {
          teacher: true,
          location: true,
        },
      },
      trials: true,
    },
  })
}

export async function getLessonsByClass(classId: number) {
  return prisma.lesson.findMany({
    where: { classId },
    include: {
      class: true,
    },
    orderBy: { date: 'asc' },
  })
}

export async function updateLesson(id: number, data: UpdateLessonData) {
  const lesson = await prisma.lesson.findUnique({
    where: { id },
  })

  if (!lesson) {
    return null
  }

  return prisma.lesson.update({
    where: { id },
    data: {
      ...(data.classId && { classId: data.classId }),
      ...(data.title && { title: data.title }),
      ...(data.isTrial !== undefined && { isTrial: data.isTrial }),
      ...(data.status && { status: data.status }),
      ...(data.attendanceId !== undefined && { attendanceId: data.attendanceId }),
      ...(data.notes !== undefined && { notes: data.notes }),
      ...(data.date && { date: new Date(data.date) }),
      ...(data.startTime && { startTime: data.startTime }),
      ...(data.endTime !== undefined && { endTime: data.endTime }),
      ...(data.duration && { duration: data.duration }),
    },
    include: {
      class: true,
    },
  })
}

export async function deleteLesson(id: number) {
  const lesson = await prisma.lesson.findUnique({
    where: { id },
  })

  if (!lesson) {
    return null
  }

  await prisma.lesson.delete({
    where: { id },
  })

  return { success: true }
}
