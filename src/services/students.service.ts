import prisma from '~/lib/prisma'

export interface UpdateStudentData {
  firstName?: string
  lastName?: string
  dateOfBirth?: string | null
  gender?: string | null
  medicalInfo?: string | null
  photoVideoConsent?: boolean
  height?: number | null
  neck?: number | null
  girth?: number | null
  chest?: number | null
  braSize?: string | null
  waist?: number | null
  hips?: number | null
  inseam?: number | null
  shoeSize?: string | null
  tshirtSize?: string | null
}

export async function getStudents(organizationId: string) {
  return prisma.student.findMany({
    where: {
      family: {
        organizationId,
      },
    },
    include: {
      family: {
        select: {
          id: true,
          familyName: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })
}

export async function getStudentsByFamily(familyId: number, organizationId: string) {
  return prisma.student.findMany({
    where: {
      familyId,
      family: {
        organizationId,
      },
    },
    include: {
      family: {
        select: {
          id: true,
          familyName: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })
}

export async function getStudentById(id: number, organizationId: string) {
  return prisma.student.findFirst({
    where: {
      id,
      family: {
        organizationId,
      },
    },
    include: {
      family: {
        select: {
          id: true,
          familyName: true,
        },
      },
    },
  })
}

export async function updateStudent(id: number, organizationId: string, data: UpdateStudentData) {
  const existing = await prisma.student.findFirst({
    where: {
      id,
      family: {
        organizationId,
      },
    },
    select: { id: true },
  })

  if (!existing) {
    return null
  }

  const updated = await prisma.student.update({
    where: { id },
    data: {
      ...(data.firstName !== undefined && { firstName: data.firstName }),
      ...(data.lastName !== undefined && { lastName: data.lastName }),
      ...(data.dateOfBirth !== undefined && {
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
      }),
      ...(data.gender !== undefined && { gender: data.gender }),
      ...(data.medicalInfo !== undefined && { medicalInfo: data.medicalInfo }),
      ...(data.photoVideoConsent !== undefined && {
        photoVideoConsent: data.photoVideoConsent,
      }),
      ...(data.height !== undefined && { height: data.height }),
      ...(data.neck !== undefined && { neck: data.neck }),
      ...(data.girth !== undefined && { girth: data.girth }),
      ...(data.chest !== undefined && { chest: data.chest }),
      ...(data.braSize !== undefined && { braSize: data.braSize }),
      ...(data.waist !== undefined && { waist: data.waist }),
      ...(data.hips !== undefined && { hips: data.hips }),
      ...(data.inseam !== undefined && { inseam: data.inseam }),
      ...(data.shoeSize !== undefined && { shoeSize: data.shoeSize }),
      ...(data.tshirtSize !== undefined && { tshirtSize: data.tshirtSize }),
    },
    include: {
      family: {
        select: {
          id: true,
          familyName: true,
        },
      },
    },
  })

  return updated
}

export async function deleteStudent(id: number, organizationId: string) {
  const existing = await prisma.student.findFirst({
    where: {
      id,
      family: {
        organizationId,
      },
    },
    select: { id: true },
  })

  if (!existing) {
    return false
  }

  await prisma.student.delete({
    where: { id },
  })

  return true
}
