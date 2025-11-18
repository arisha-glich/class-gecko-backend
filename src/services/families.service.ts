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

export interface UpdateFamilyInput {
  firstName?: string
  lastName?: string
  email?: string
  phoneCountryCode?: string
  phoneNumber?: string
  familyName?: string
  status?: string
  notes?: string
  address?: {
    street?: string
    city?: string
    state?: string
    zipcode?: string
    country?: string
  }
  emergencyContact?: {
    name?: string
    relation?: string
    phoneNo?: string
    email?: string
    useInEmergency?: boolean
  }
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

export async function getFamilies(
  organizationId: string,
  search?: string,
  status?: string,
  page = 1,
  limit = 10
) {
  const skip = (page - 1) * limit

  const where: any = { organizationId }

  if (search) {
    where.OR = [
      { familyName: { contains: search, mode: 'insensitive' as const } },
      { primaryParentFirstName: { contains: search, mode: 'insensitive' as const } },
      { primaryParentLastName: { contains: search, mode: 'insensitive' as const } },
      { primaryParentEmail: { contains: search, mode: 'insensitive' as const } },
      { primaryParentPhoneNumber: { contains: search, mode: 'insensitive' as const } },
      { account: { email: { contains: search, mode: 'insensitive' as const } } },
      { account: { phoneNo: { contains: search, mode: 'insensitive' as const } } },
    ]
  }

  if (status && status !== 'ALL' && status !== '') {
    where.status = status
  }

  const [families, total] = await Promise.all([
    prisma.family.findMany({
      where,
      skip,
      take: limit,
      include: {
        account: {
          select: {
            id: true,
            email: true,
            phoneNo: true,
          },
        },
        organization: {
          select: {
            id: true,
            business: {
              select: {
                companyName: true,
              },
            },
          },
        },
        students: {
          select: {
            id: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.family.count({ where }),
  ])

  return {
    data: families.map(family => ({
      id: family.id,
      familyName: family.familyName || `${family.primaryParentFirstName} ${family.primaryParentLastName}`,
      email: family.primaryParentEmail,
      phone: family.primaryParentPhoneNumber
        ? `${family.primaryParentPhoneCountry || ''} ${family.primaryParentPhoneNumber}`.trim()
        : family.account.phoneNo || '',
      students: family.students.length,
      status: family.status || 'ACTIVE',
      createdAt: family.createdAt.toISOString(),
    })),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  }
}

export async function getFamilyById(id: number, organizationId: string) {
  const family = await prisma.family.findFirst({
    where: { id, organizationId },
    include: {
      account: {
        select: {
          id: true,
          email: true,
          name: true,
          phoneNo: true,
          address: {
            select: {
              street: true,
              city: true,
              state: true,
              zipcode: true,
              country: true,
            },
          },
          contactInfo: {
            where: {
              useInEmergency: true,
            },
            take: 1,
          },
        },
      },
      organization: {
        select: {
          id: true,
          business: {
            select: {
              companyName: true,
            },
          },
        },
      },
    },
  })

  if (!family) {
    return null
  }

  const emergencyContact = family.account.contactInfo?.[0] || null

  return {
    id: family.id,
    familyName: family.familyName,
    primaryParentFirstName: family.primaryParentFirstName,
    primaryParentLastName: family.primaryParentLastName,
    primaryParentEmail: family.primaryParentEmail,
    primaryParentPhoneCountry: family.primaryParentPhoneCountry,
    primaryParentPhoneNumber: family.primaryParentPhoneNumber,
    status: family.status,
    notes: family.notes,
    memberSince: family.createdAt.toISOString(),
    contactInfo: {
      email: family.primaryParentEmail,
      phone: family.primaryParentPhoneNumber
        ? `${family.primaryParentPhoneCountry || ''} ${family.primaryParentPhoneNumber}`.trim()
        : family.account.phoneNo || '',
      linkedBusiness: family.organization.business?.companyName || 'N/A',
    },
    address: family.account.address
      ? {
          street: family.account.address.street,
          city: family.account.address.city,
          state: family.account.address.state,
          zipcode: family.account.address.zipcode,
          country: family.account.address.country,
        }
      : null,
    emergencyContact: emergencyContact
      ? {
          name: emergencyContact.relation || emergencyContact.email || 'N/A',
          relation: emergencyContact.relation || null,
          phone: emergencyContact.phoneNo || null,
          email: emergencyContact.email || null,
        }
      : null,
    user: {
      id: family.account.id,
      email: family.account.email,
      name: family.account.name,
      phoneNo: family.account.phoneNo,
    },
  }
}

export async function updateFamily(
  id: number,
  organizationId: string,
  data: UpdateFamilyInput
) {
  const family = await prisma.family.findFirst({
    where: { id, organizationId },
    include: { account: true },
  })

  if (!family) {
    throw new FamilyNotFoundError()
  }

  if (data.email && data.email !== family.account.email) {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    })
    if (existingUser) {
      throw new EmailAlreadyUsedError()
    }
  }

  const updateData: any = {}
  if (data.firstName) updateData.primaryParentFirstName = data.firstName
  if (data.lastName) updateData.primaryParentLastName = data.lastName
  if (data.phoneCountryCode) updateData.primaryParentPhoneCountry = data.phoneCountryCode
  if (data.phoneNumber) updateData.primaryParentPhoneNumber = data.phoneNumber
  if (data.familyName) updateData.familyName = data.familyName
  if (data.status !== undefined) updateData.status = data.status
  if (data.notes !== undefined) updateData.notes = data.notes

  const userUpdateData: any = {}
  if (data.email) userUpdateData.email = data.email
  if (data.firstName || data.lastName) {
    userUpdateData.name = `${data.firstName || family.primaryParentFirstName} ${data.lastName || family.primaryParentLastName}`.trim()
  }
  if (data.phoneNumber) {
    userUpdateData.phoneNo = `${data.phoneCountryCode || ''} ${data.phoneNumber}`.trim()
  }

  if (data.address) {
    if (family.account.addressId) {
      await prisma.address.update({
        where: { id: family.account.addressId },
        data: {
          street: data.address.street,
          city: data.address.city,
          state: data.address.state,
          zipcode: data.address.zipcode,
          country: data.address.country,
        },
      })
    } else {
      const address = await prisma.address.create({
        data: {
          street: data.address.street || '',
          city: data.address.city || '',
          state: data.address.state || '',
          zipcode: data.address.zipcode || '',
          country: data.address.country || '',
        },
      })
      userUpdateData.addressId = address.id
    }
  }

  if (data.emergencyContact) {
    const existingContact = await prisma.contactInfo.findFirst({
      where: {
        userId: family.userId,
        useInEmergency: true,
      },
    })

    if (existingContact) {
      await prisma.contactInfo.update({
        where: { id: existingContact.id },
        data: {
          relation: data.emergencyContact.relation,
          phoneNo: data.emergencyContact.phoneNo,
          email: data.emergencyContact.email,
          useInEmergency: data.emergencyContact.useInEmergency ?? true,
        },
      })
    } else {
      await prisma.contactInfo.create({
        data: {
          userId: family.userId,
          relation: data.emergencyContact.relation,
          phoneNo: data.emergencyContact.phoneNo,
          email: data.emergencyContact.email,
          useInEmergency: data.emergencyContact.useInEmergency ?? true,
        },
      })
    }
  }

  if (Object.keys(userUpdateData).length > 0) {
    await prisma.user.update({
      where: { id: family.userId },
      data: userUpdateData,
    })
  }

  if (data.email) updateData.primaryParentEmail = data.email
  if (Object.keys(updateData).length > 0) {
    await prisma.family.update({
      where: { id },
      data: updateData,
    })
  }

  return getFamilyById(id, organizationId)
}

export async function deleteFamily(id: number, organizationId: string) {
  const family = await prisma.family.findFirst({
    where: { id, organizationId },
  })

  if (!family) {
    throw new FamilyNotFoundError()
  }

  await prisma.family.delete({
    where: { id },
  })

  return { success: true }
}

export async function suspendFamily(id: number, organizationId: string, status: string) {
  const family = await prisma.family.findFirst({
    where: { id, organizationId },
  })

  if (!family) {
    throw new FamilyNotFoundError()
  }

  const updated = await prisma.family.update({
    where: { id },
    data: { status },
  })

  return updated
}

export async function getFamilyChildren(id: number, organizationId: string) {
  const family = await prisma.family.findFirst({
    where: { id, organizationId },
    include: {
      students: {
        include: {
          classBookings: {
            include: {
              class: {
                select: {
                  id: true,
                  title: true,
                  classType: true,
                },
              },
            },
            where: {
              status: {
                not: 'Cancelled',
              },
            },
          },
          dropInBookings: {
            include: {
              dropInClass: {
                select: {
                  id: true,
                  title: true,
                  classType: true,
                },
              },
            },
            where: {
              status: {
                not: 'Cancelled',
              },
            },
          },
        },
      },
    },
  })

  if (!family) {
    throw new FamilyNotFoundError()
  }

  const calculateAge = (dateOfBirth: Date | null): number | null => {
    if (!dateOfBirth) return null
    const today = new Date()
    let age = today.getFullYear() - dateOfBirth.getFullYear()
    const monthDiff = today.getMonth() - dateOfBirth.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dateOfBirth.getDate())) {
      age--
    }
    return age
  }

  return family.students.map(student => {
    const enrolledClasses = [
      ...student.classBookings.map(booking => ({
        id: booking.class.id,
        title: booking.class.title,
        classType: booking.class.classType,
      })),
      ...student.dropInBookings.map(booking => ({
        id: booking.dropInClass.id,
        title: booking.dropInClass.title,
        classType: booking.dropInClass.classType,
      })),
    ]

    return {
      id: student.id,
      firstName: student.firstName,
      lastName: student.lastName,
      dateOfBirth: student.dateOfBirth?.toISOString() || null,
      age: calculateAge(student.dateOfBirth),
      overallStatus: enrolledClasses.length > 0 ? 'Enrolled' : 'Not Enrolled',
      enrolledClasses,
    }
  })
}

export async function getFamilyPayments(id: number, organizationId: string) {
  const family = await prisma.family.findFirst({
    where: { id, organizationId },
    include: {
      account: {
        include: {
          orders: {
            include: {
              cart: {
                select: {
                  amount: true,
                  productTitle: true,
                  description: true,
                },
              },
              payment: {
                select: {
                  id: true,
                  refundId: true,
                },
              },
            },
            orderBy: {
              date: 'desc',
            },
          },
        },
      },
    },
  })

  if (!family) {
    throw new FamilyNotFoundError()
  }

  const allOrders = family.account.orders || []

  const invoices = allOrders.map((order, index) => {
    const payment = order.payment
    const isPaid = payment !== null && payment.refundId === null
    const amount = order.cart?.amount || 0

    return {
      invoiceId: `INV-${String(index + 1).padStart(3, '0')}`,
      date: order.date.toISOString().split('T')[0],
      description: order.cart?.productTitle || order.cart?.description || 'Class Enrollment',
      amount,
      status: isPaid ? 'Paid' : 'Pending',
    }
  })

  const totalPaid = invoices
    .filter(i => i.status === 'Paid')
    .reduce((sum, i) => sum + i.amount, 0)
  const totalInvoices = invoices.length
  const due = invoices.filter(i => i.status === 'Pending').reduce((sum, i) => sum + i.amount, 0)

  return {
    summary: {
      totalPaid,
      totalInvoices,
      due,
    },
    invoices,
  }
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
