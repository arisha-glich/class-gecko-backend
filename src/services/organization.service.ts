import type { Prisma } from '~/generated/prisma'
import prisma from '~/lib/prisma'

export class UserNotFoundError extends Error {
  constructor() {
    super('USER_NOT_FOUND')
  }
}

export interface UpdateOrganizationProfileInput {
  userId: string
  phoneNo: string
  organizationName: string
  industry: string
  students: number
}

export interface UpdateOrganizationProfileResult {
  user: {
    id: string
    phoneNo: string | null
    onboardingStage: string | null
    meta: Prisma.JsonValue
  }
  organization: {
    id: number
    companyName: string
    industry: string
  }
}

function toJsonValue(value: unknown): Prisma.JsonValue {
  if (
    value === null ||
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  ) {
    return value
  }

  if (Array.isArray(value)) {
    return value.map(item => toJsonValue(item)) as Prisma.JsonArray
  }

  if (typeof value === 'object' && value !== null) {
    return Object.entries(value as Record<string, unknown>).reduce<Prisma.JsonObject>(
      (acc, [key, val]) => {
        acc[key] = toJsonValue(val)
        return acc
      },
      {}
    )
  }

  return null
}

function toJsonObject(value: unknown): Prisma.JsonObject {
  const parsed = toJsonValue(value)
  if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
    return parsed as Prisma.JsonObject
  }
  return {}
}

export async function updateOrganizationProfile({
  userId,
  phoneNo,
  organizationName,
  industry,
  students,
}: UpdateOrganizationProfileInput): Promise<UpdateOrganizationProfileResult> {
  const [userRecord, organizationRecord] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { meta: true },
    }),
    prisma.businessOrganization.findUnique({
      where: { userId },
      select: { id: true },
    }),
  ])

  if (!userRecord) {
    throw new UserNotFoundError()
  }

  const meta = toJsonObject(userRecord.meta)
  meta.students = students

  const organizationId =
    organizationRecord?.id ??
    (
      await prisma.businessOrganization.create({
        data: {
          userId,
          companyName: organizationName,
          industry,
          language: 'en',
          currency: 'USD',
          timeZone: 'UTC',
          websiteTheme: 'default',
          timeFormat: '24h',
          startDateForWeeklyCalendar: new Date(),
          ageCutoffDate: new Date(),
          logo: null,
        },
        select: { id: true },
      })
    ).id

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      phoneNo,
      onboardingStage: 'organization-updated',
      meta: meta as Prisma.JsonObject,
    },
    select: {
      id: true,
      phoneNo: true,
      onboardingStage: true,
      meta: true,
    },
  })

  const updatedOrganization = await prisma.businessOrganization.update({
    where: { id: organizationId },
    data: {
      companyName: organizationName,
      industry,
    },
    select: {
      id: true,
      companyName: true,
      industry: true,
    },
  })

  return {
    user: updatedUser,
    organization: updatedOrganization,
  }
}

export interface GetOrganizationResult {
  organization: {
    id: number
    companyName: string
    industry: string
    language: string
    currency: string
    timeZone: string
    websiteTheme: string
    timeFormat: string
    startDateForWeeklyCalendar: string
    ageCutoffDate: string
    logo: string | null
  } | null
}

export async function getOrganization(userId: string): Promise<GetOrganizationResult> {
  const organization = await prisma.businessOrganization.findUnique({
    where: { userId },
    select: {
      id: true,
      companyName: true,
      industry: true,
      language: true,
      currency: true,
      timeZone: true,
      websiteTheme: true,
      timeFormat: true,
      startDateForWeeklyCalendar: true,
      ageCutoffDate: true,
      logo: true,
    },
  })

  return {
    organization: organization
      ? {
          ...organization,
          startDateForWeeklyCalendar: organization.startDateForWeeklyCalendar.toISOString(),
          ageCutoffDate: organization.ageCutoffDate.toISOString(),
        }
      : null,
  }
}
