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
  // Owner Information
  ownerName: string
  ownerEmail: string
  ownerPhone: string
  ownerAddress?: string
  // Commission
  commissionType: 'PERCENTAGE' | 'FIXED' | 'TIERED'
  commissionValue: number | null
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
  commissionValue: number | null
  country?: string
  currency?: string
}

export interface BusinessListResult {
  id: number
  schoolName: string
  location: string | null
  ownership: string | null // Owner name
  registered: Date // Registration date
  status: string
}

export interface BusinessDetailResult {
  id: number
  schoolName: string
  email: string
  phone: string
  address: string | null
  website: string | null
  status: string
  registered: Date
  userId: string // Business owner's User ID - use this as organizationId when creating families
  owner: {
    name: string | null
    email: string
    phone: string | null
    address: string | null
  }
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
    commissionValue: number | null
    isGlobal?: boolean
  } | null
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
            name: true,
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
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.businessOrganization.count({ where }),
  ])

  return {
    data: businesses.map(business => {
      const location =
        business.address ||
        (business.user.address
          ? `${business.user.address.city}, ${business.user.address.state}`
          : null)

      return {
        id: business.id,
        schoolName: business.companyName,
        location,
        ownership: business.user.name || null,
        registered: business.createdAt,
        status: business.user.banned ? 'Inactive' : 'Active',
      }
    }),
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
          name: true,
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
  // First check for organization-specific commission, then fall back to global
  let activeCommission = business.commissions[0] // Organization-specific commission
  let isGlobalCommission = false

  // If no organization-specific commission, get global commission
  if (!activeCommission) {
    // Use proper Prisma null filter syntax for nullable field
    // biome-ignore lint/suspicious/noExplicitAny: Prisma nullable field query requires type assertion
    const globalCommission = await prisma.commission.findFirst({
      where: {
        businessId: null as any,
        country: 'US', // Default country, can be made dynamic
        currency: 'USD', // Default currency, can be made dynamic
        isActive: true,
      },
      orderBy: {
        effectiveFrom: 'desc',
      },
    })
    if (globalCommission) {
      activeCommission = globalCommission
      isGlobalCommission = true
    }
  }

  const earnedCommission = activeCommission
    ? activeCommission.commissionType === 'PERCENTAGE'
      ? (totalRevenue * activeCommission.commissionValue) / 100
      : activeCommission.commissionValue
    : null

  // Use business address if available, otherwise construct from user address
  const address =
    business.address ||
    (business.user.address
      ? `${business.user.address.street}, ${business.user.address.city}, ${business.user.address.state} ${business.user.address.zipcode}, ${business.user.address.country}`
      : null)

  // Owner address
  const ownerAddress = business.user.address
    ? `${business.user.address.street}, ${business.user.address.city}, ${business.user.address.state} ${business.user.address.zipcode}, ${business.user.address.country}`
    : null

  return {
    id: business.id,
    schoolName: business.companyName,
    email: business.contactEmail || business.user.email,
    phone: business.contactPhone || business.user.phoneNo || '',
    address,
    website: null,
    status: business.user.banned ? 'Inactive' : 'Active',
    registered: business.createdAt,
    owner: {
      name: business.user.name,
      email: business.user.email,
      phone: business.user.phoneNo,
      address: ownerAddress,
    },
    // Include userId for debugging - this should match family.organizationId
    userId: business.userId,
    statistics: {
      totalStudents: totalStudents,
      activeClasses: activeClasses,
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      earnedCommission: earnedCommission ? Math.round(earnedCommission * 100) / 100 : 0,
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
          isGlobal: isGlobalCommission,
        }
      : null,
  }
}

export async function createBusiness(data: CreateBusinessInput) {
  // Check if owner email already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: data.ownerEmail },
    select: { id: true },
  })

  if (existingUser) {
    throw new EmailAlreadyUsedError()
  }

  // Create address for owner if provided
  let ownerAddressId: number | undefined
  if (data.ownerAddress) {
    const addressParts = data.ownerAddress.split(',').map(s => s.trim())
    const ownerAddressRecord = await prisma.address.create({
      data: {
        street: addressParts[0] || '',
        city: addressParts[1] || '',
        state: addressParts[2] || '',
        zipcode: addressParts[3] || '',
        country: addressParts[4] || 'US',
      },
    })
    ownerAddressId = ownerAddressRecord.id
  }

  // Create user account for the business owner
  const user = await prisma.user.create({
    data: {
      email: data.ownerEmail,
      phoneNo: data.ownerPhone,
      name: data.ownerName,
      role: 'BUSINESS',
      banned: !(data.status ?? true),
      addressId: ownerAddressId,
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

  // Create commission setting only if commissionType and commissionValue are provided
  // Otherwise, the business will use the global commission
  if (data.commissionType && data.commissionValue !== null && data.commissionValue !== undefined) {
    await prisma.commission.create({
      data: {
        business: {
          connect: { id: business.id },
        },
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
  }

  return {
    id: business.id,
    schoolName: business.companyName,
    email: business.contactEmail || user.email,
    phone: business.contactPhone || user.phoneNo || '',
    status: user.banned ? 'Inactive' : 'Active',
    address: business.address,
    owner: {
      name: user.name,
      email: user.email,
      phone: user.phoneNo,
      address: data.ownerAddress || null,
    },
    commission:
      data.commissionType && data.commissionValue !== null && data.commissionValue !== undefined
        ? {
            commissionType: data.commissionType,
            commissionValue: data.commissionValue,
          }
        : null,
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
    email: updatedBusiness.contactEmail || updatedUser?.email || business.user.email,
    phone: updatedBusiness.contactPhone || updatedUser?.phoneNo || business.user.phoneNo || '',
    status:
      data.status !== undefined
        ? data.status
          ? 'Active'
          : 'Inactive'
        : (updatedUser?.banned ?? business.user.banned)
          ? 'Inactive'
          : 'Active',
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
      business: {
        connect: { id: businessId },
      },
      effectiveFrom: new Date(),
      country: data.country || 'US',
      currency: data.currency || 'USD',
      commissionType: data.commissionType,
      commissionValue: data.commissionValue ?? 0,
      platformCommission: 0,
      platformAmount: 0,
      appliesTo: 'ALL',
      isActive: true,
    },
  })

  return {
    commissionType: commission.commissionType,
    commissionValue: commission.commissionValue ?? (null as any),
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
