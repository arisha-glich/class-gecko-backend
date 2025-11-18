import prisma from '~/lib/prisma'

export class BusinessNotFoundError extends Error {
  constructor() {
    super('BUSINESS_NOT_FOUND')
  }
}

export class EmailAlreadyUsedError extends Error {
  constructor() {
    super('EMAIL_ALREADY_USED')
  }
}

export interface CreateBusinessInput {
  schoolName: string
  email: string
  phone: string
  address?: string
  website?: string
  commissionType: 'PERCENTAGE' | 'FIXED' | 'TIERED'
  commissionValue: number
  status?: boolean
}

export interface UpdateBusinessInput {
  schoolName?: string
  email?: string
  phone?: string
  address?: string
  website?: string
  status?: boolean
}

export interface UpdateCommissionInput {
  commissionType: 'PERCENTAGE' | 'FIXED' | 'TIERED'
  commissionValue: number
  country?: string
  currency?: string
}

export interface BusinessListResult {
  id: number
  schoolName: string
  email: string
  phone: string
  status: string
  user: {
    id: string
    email: string
    phoneNo: string | null
    name: string
  }
}

export interface BusinessDetailResult {
  id: number
  schoolName: string
  email: string
  phone: string
  address: string | null
  website: string | null
  status: string
  statistics: {
    totalStudents: number
    activeClasses: number
    totalRevenue: number
    earnedCommission: number
  }
  contactInfo: {
    email: string
    phone: string
    address: string | null
    website: string | null
  }
  commission: {
    commissionType: string
    commissionValue: number
  } | null
  user: {
    id: string
    email: string
    phoneNo: string | null
  }
}

export async function getBusinesses(search?: string, page = 1, limit = 10) {
  const skip = (page - 1) * limit

  const where = search
    ? {
        OR: [
          { companyName: { contains: search, mode: 'insensitive' as const } },
          { user: { email: { contains: search, mode: 'insensitive' as const } } },
          { user: { phoneNo: { contains: search, mode: 'insensitive' as const } } },
        ],
      }
    : {}

  const [businesses, total] = await Promise.all([
    prisma.businessOrganization.findMany({
      where,
      skip,
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            phoneNo: true,
            banned: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.businessOrganization.count({ where }),
  ])

  return {
    data: businesses.map(business => ({
      id: business.id,
      schoolName: business.companyName,
      email: business.user.email,
      phone: business.user.phoneNo || '',
      status: business.user.banned ? 'Inactive' : 'Active',
      user: {
        id: business.user.id,
        email: business.user.email,
        phoneNo: business.user.phoneNo,
      },
    })),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  }
}

export async function getBusinessById(id: number): Promise<BusinessDetailResult | null> {
  const business = await prisma.businessOrganization.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          phoneNo: true,
          banned: true,
          address: {
            select: {
              street: true,
              city: true,
              state: true,
              zipcode: true,
              country: true,
            },
          },
        },
      },
      commissions: {
        where: { isActive: true },
        orderBy: { effectiveFrom: 'desc' },
        take: 1,
      },
    },
  })

  if (!business) {
    return null
  }

  // Get statistics
  const now = new Date()
  const [totalStudents, activeClasses] = await Promise.all([
    prisma.student.count({
      where: {
        family: {
          organizationId: business.userId,
        },
      },
    }),
    prisma.class.count({
      where: {
        term: {
          userId: business.userId,
        },
        startDate: { lte: now },
        endDate: { gte: now },
      },
    }),
  ])

  // Calculate revenue from orders (which link to carts with amounts)
  const orders = await prisma.order.findMany({
    where: {
      user: {
        managedFamilies: {
          some: {
            organizationId: business.userId,
          },
        },
      },
      payment: {
        isNot: null,
      },
    },
    include: {
      cart: {
        select: {
          amount: true,
        },
      },
    },
  })

  const totalRevenue = orders.reduce((sum, order) => {
    return sum + (order.cart?.amount || 0)
  }, 0)

  // Calculate earned commission
  const activeCommission = business.commissions[0]
  const earnedCommission = activeCommission
    ? activeCommission.commissionType === 'PERCENTAGE'
      ? (totalRevenue * activeCommission.commissionValue) / 100
      : activeCommission.commissionValue
    : 0

  // Use business address if available, otherwise construct from user address
  const address =
    business.address ||
    (business.user.address
      ? `${business.user.address.street}, ${business.user.address.city}, ${business.user.address.state} ${business.user.address.zipcode}, ${business.user.address.country}`
      : null)

  return {
    id: business.id,
    schoolName: business.companyName,
    email: business.contactEmail || business.user.email,
    phone: business.contactPhone || business.user.phoneNo || '',
    address,
    website: null, // Add website field to schema if needed
    status: business.user.banned ? 'Inactive' : 'Active',
    statistics: {
      totalStudents: totalStudents,
      activeClasses: activeClasses,
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      earnedCommission: Math.round(earnedCommission * 100) / 100,
    },
    contactInfo: {
      email: business.contactEmail || business.user.email,
      phone: business.contactPhone || business.user.phoneNo || '',
      address,
      website: null,
    },
    commission: activeCommission
      ? {
          commissionType: activeCommission.commissionType,
          commissionValue: activeCommission.commissionValue,
        }
      : null,
    user: {
      id: business.user.id,
      email: business.user.email,
      phoneNo: business.user.phoneNo,
    },
  }
}

export async function createBusiness(data: CreateBusinessInput) {
  // Check if email already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
    select: { id: true },
  })

  if (existingUser) {
    throw new EmailAlreadyUsedError()
  }

  // Create user account for the business
  // Store owner information in user fields (email, phoneNo, name)
  const user = await prisma.user.create({
    data: {
      email: data.email, // ownerEmail stored in email field
      phoneNo: data.phone, // ownerPhoneNo stored in phoneNo field
      name: data.schoolName, // ownerName stored in name field
      role: 'BUSINESS',
      banned: !(data.status ?? true),
    },
  })

  // Create business organization
  const business = await prisma.businessOrganization.create({
    data: {
      userId: user.id,
      companyName: data.schoolName,
      address: data.address,
      contactPhone: data.phone,
      contactEmail: data.email,
      industry: 'Education',
      language: 'en',
      currency: 'USD',
      timeZone: 'UTC',
      websiteTheme: 'default',
      timeFormat: '24h',
      startDateForWeeklyCalendar: new Date(),
      ageCutoffDate: new Date(),
    },
  })

  // Create commission setting
  await prisma.commission.create({
    data: {
      businessId: business.id,
      effectiveFrom: new Date(),
      country: 'US',
      currency: 'USD',
      commissionType: data.commissionType,
      commissionValue: data.commissionValue,
      platformCommission: 0,
      platformAmount: 0,
      appliesTo: 'ALL',
      isActive: true,
    },
  })

  return {
    id: business.id,
    schoolName: business.companyName,
    email: business.contactEmail || user.email,
    phone: business.contactPhone || user.phoneNo || '',
    status: user.banned ? 'Inactive' : 'Active',
    user: {
      id: user.id,
      email: user.email,
      phoneNo: user.phoneNo,
      name: user.name,
    },
  }
}

export async function updateBusiness(id: number, data: UpdateBusinessInput) {
  const business = await prisma.businessOrganization.findUnique({
    where: { id },
    include: { user: true },
  })

  if (!business) {
    throw new BusinessNotFoundError()
  }

  // Update user if email or phone changed
  if (data.email || data.phone || data.status !== undefined) {
    await prisma.user.update({
      where: { id: business.userId },
      data: {
        ...(data.email && { email: data.email }),
        ...(data.phone && { phoneNo: data.phone }),
        ...(data.status !== undefined && { banned: !data.status }),
      },
    })
  }

  // Update business organization
  const updatedBusiness = await prisma.businessOrganization.update({
    where: { id },
    data: {
      ...(data.schoolName && { companyName: data.schoolName }),
      ...(data.address !== undefined && { address: data.address }),
      ...(data.phone && { contactPhone: data.phone }),
      ...(data.email && { contactEmail: data.email }),
    },
  })

  // Get updated user data
  const updatedUser = await prisma.user.findUnique({
    where: { id: business.userId },
    select: {
      email: true,
      phoneNo: true,
      banned: true,
    },
  })

  return {
    id: updatedBusiness.id,
    schoolName: updatedBusiness.companyName,
    email: updatedUser?.email || business.user.email,
    phone: updatedUser?.phoneNo || business.user.phoneNo || '',
    status:
      data.status !== undefined
        ? data.status
          ? 'Active'
          : 'Inactive'
        : (updatedUser?.banned ?? business.user.banned)
          ? 'Inactive'
          : 'Active',
    user: {
      id: business.userId,
      email: updatedUser?.email || business.user.email,
      phoneNo: updatedUser?.phoneNo || business.user.phoneNo,
    },
  }
}

export async function updateBusinessCommission(businessId: number, data: UpdateCommissionInput) {
  const business = await prisma.businessOrganization.findUnique({
    where: { id: businessId },
  })

  if (!business) {
    throw new BusinessNotFoundError()
  }

  // Deactivate existing active commissions
  await prisma.commission.updateMany({
    where: {
      businessId,
      isActive: true,
    },
    data: {
      isActive: false,
    },
  })

  // Create new commission
  const commission = await prisma.commission.create({
    data: {
      businessId,
      effectiveFrom: new Date(),
      country: data.country || 'US',
      currency: data.currency || 'USD',
      commissionType: data.commissionType,
      commissionValue: data.commissionValue,
      platformCommission: 0,
      platformAmount: 0,
      appliesTo: 'ALL',
      isActive: true,
    },
  })

  return {
    commissionType: commission.commissionType,
    commissionValue: commission.commissionValue,
  }
}

export async function getBusinessStudents(businessId: number, page = 1, limit = 10) {
  const business = await prisma.businessOrganization.findUnique({
    where: { id: businessId },
    select: { userId: true },
  })

  if (!business) {
    throw new BusinessNotFoundError()
  }

  const skip = (page - 1) * limit

  const [students, total] = await Promise.all([
    prisma.student.findMany({
      where: {
        family: {
          organizationId: business.userId,
        },
      },
      skip,
      take: limit,
      include: {
        family: {
          select: {
            id: true,
            familyName: true,
            primaryParentEmail: true,
            primaryParentPhoneNumber: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.student.count({
      where: {
        family: {
          organizationId: business.userId,
        },
      },
    }),
  ])

  return {
    data: students.map(student => ({
      id: student.id,
      studentName: `${student.firstName} ${student.lastName}`,
      email: student.family?.primaryParentEmail || '',
      phone: student.family?.primaryParentPhoneNumber || '',
      status: 'Active',
    })),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  }
}

export async function toggleBusinessStatus(id: number, status: boolean) {
  const business = await prisma.businessOrganization.findUnique({
    where: { id },
    select: { userId: true },
  })

  if (!business) {
    throw new BusinessNotFoundError()
  }

  await prisma.user.update({
    where: { id: business.userId },
    data: {
      banned: !status,
    },
  })

  return {
    id,
    status: status ? 'Active' : 'Inactive',
  }
}
