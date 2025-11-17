import prisma from '~/lib/prisma'

export class EmailAlreadyUsedError extends Error {
  constructor() {
    super('EMAIL_ALREADY_USED')
  }
}

export class FamilyNotFoundError extends Error {
  constructor() {
    super('FAMILY_NOT_FOUND')
  }
}

export interface CreateFamilyInput {
  organizationId: string
  firstName: string
  lastName: string
  email: string
  password: string
  phoneCountryCode?: string
  phoneNumber?: string
  sendPortalInvitation?: boolean
  familyName?: string
}

export interface CreateStudentInput {
  familyId: number
  organizationId: string
  firstName: string
  lastName: string
  dateOfBirth?: string
  gender?: string
  medicalInfo?: string
  photoVideoConsent?: boolean
}

function sanitizeUser<T extends { password?: string | null }>(user: T) {
  const { password: _password, ...rest } = user
  return rest
}

export async function createFamily(data: CreateFamilyInput) {
  const existing = await prisma.user.findUnique({
    where: { email: data.email },
    select: { id: true },
  })

  if (existing) {
    throw new EmailAlreadyUsedError()
  }

  const hashedPassword = await Bun.password.hash(data.password)

  const user = await prisma.user.create({
    data: {
      email: data.email,
      password: hashedPassword,
      name: `${data.firstName} ${data.lastName}`.trim(),
      role: 'FAMILY',
      phoneNo: data.phoneNumber
        ? `${data.phoneCountryCode ?? ''} ${data.phoneNumber}`.trim()
        : null,
      sendInvitationOnSignup: data.sendPortalInvitation ?? false,
    },
  })

  const family = await prisma.family.create({
    data: {
      organizationId: data.organizationId,
      userId: user.id,
      familyName: data.familyName || `${data.lastName} Family`,
      primaryParentFirstName: data.firstName,
      primaryParentLastName: data.lastName,
      primaryParentEmail: data.email,
      primaryParentPhoneCountry: data.phoneCountryCode,
      primaryParentPhoneNumber: data.phoneNumber,
      sendPortalInvitation: data.sendPortalInvitation ?? false,
    },
    include: {
      students: true,
    },
  })

  return {
    family,
    user: sanitizeUser(user),
  }
}

export async function getFamilies(organizationId: string) {
  const families = await prisma.family.findMany({
    where: { organizationId },
    orderBy: { createdAt: 'desc' },
    include: {
      students: true,
    },
  })
  return families
}

export async function getFamilyById(id: number, organizationId: string) {
  const family = await prisma.family.findFirst({
    where: { id, organizationId },
    include: {
      students: true,
    },
  })
  return family
}

export async function createStudentForFamily(data: CreateStudentInput) {
  const family = await prisma.family.findFirst({
    where: {
      id: data.familyId,
      organizationId: data.organizationId,
    },
    select: { id: true },
  })

  if (!family) {
    throw new FamilyNotFoundError()
  }

  const student = await prisma.student.create({
    data: {
      familyId: family.id,
      firstName: data.firstName,
      lastName: data.lastName,
      dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
      gender: data.gender,
      medicalInfo: data.medicalInfo,
      photoVideoConsent: data.photoVideoConsent ?? false,
    },
  })

  return student
}
