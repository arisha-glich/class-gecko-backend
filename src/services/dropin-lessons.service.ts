import prisma from '~/lib/prisma'

export interface CreateDropInLessonData {
  dropInClassId: number
  title: string
  status?: string
  notes?: string
  date: string
  startTime: string
  endTime?: string
  duration: number
}

export interface UpdateDropInLessonData {
  dropInClassId?: number
  title?: string
  status?: string
  notes?: string
  date?: string
  startTime?: string
  endTime?: string
  duration?: number
}

export async function createDropInLesson(data: CreateDropInLessonData) {
  return prisma.dropInLesson.create({
    data: {
      dropInClassId: data.dropInClassId,
      title: data.title,
      status: data.status ?? 'scheduled',
      notes: data.notes,
      date: new Date(data.date),
      startTime: data.startTime,
      endTime: data.endTime,
      duration: data.duration,
    },
    include: {
      dropInClass: {
        include: {
          teacher: true,
          location: true,
        },
      },
    },
  })
}

export async function getDropInLessons() {
  return prisma.dropInLesson.findMany({
    include: {
      dropInClass: {
        include: {
          teacher: true,
          location: true,
        },
      },
    },
    orderBy: { date: 'asc' },
  })
}

export async function getDropInLessonById(id: number) {
  return prisma.dropInLesson.findUnique({
    where: { id },
    include: {
      dropInClass: {
        include: {
          teacher: true,
          location: true,
        },
      },
    },
  })
}

export async function getDropInLessonsByClass(dropInClassId: number) {
  return prisma.dropInLesson.findMany({
    where: { dropInClassId },
    include: {
      dropInClass: {
        include: {
          teacher: true,
          location: true,
        },
      },
    },
    orderBy: { date: 'asc' },
  })
}

export async function updateDropInLesson(id: number, data: UpdateDropInLessonData) {
  const lesson = await prisma.dropInLesson.findUnique({
    where: { id },
  })

  if (!lesson) {
    return null
  }

  return prisma.dropInLesson.update({
    where: { id },
    data: {
      ...(data.dropInClassId && { dropInClassId: data.dropInClassId }),
      ...(data.title && { title: data.title }),
      ...(data.status && { status: data.status }),
      ...(data.notes !== undefined && { notes: data.notes }),
      ...(data.date && { date: new Date(data.date) }),
      ...(data.startTime && { startTime: data.startTime }),
      ...(data.endTime !== undefined && { endTime: data.endTime }),
      ...(data.duration && { duration: data.duration }),
    },
    include: {
      dropInClass: {
        include: {
          teacher: true,
          location: true,
        },
      },
    },
  })
}

export async function deleteDropInLesson(id: number) {
  const lesson = await prisma.dropInLesson.findUnique({
    where: { id },
  })

  if (!lesson) {
    return null
  }

  await prisma.dropInLesson.delete({
    where: { id },
  })

  return { success: true }
}
