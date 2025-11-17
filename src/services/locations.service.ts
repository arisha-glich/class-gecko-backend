import prisma from '~/lib/prisma'

export interface CreateLocationData {
  name: string
  address: string
}

export interface UpdateLocationData extends Partial<CreateLocationData> {}

export async function createLocation(data: CreateLocationData) {
  return prisma.location.create({
    data: {
      name: data.name,
      address: data.address,
    },
  })
}

export async function getLocations() {
  return prisma.location.findMany({
    orderBy: { createdAt: 'desc' },
  })
}

export async function getLocationById(id: number) {
  return prisma.location.findUnique({
    where: { id },
  })
}

export async function updateLocation(id: number, data: UpdateLocationData) {
  const existing = await prisma.location.findUnique({
    where: { id },
    select: { id: true },
  })

  if (!existing) {
    return null
  }

  return prisma.location.update({
    where: { id },
    data: {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.address !== undefined && { address: data.address }),
    },
  })
}

export async function deleteLocation(id: number) {
  const existing = await prisma.location.findUnique({
    where: { id },
    select: { id: true },
  })

  if (!existing) {
    return false
  }

  await prisma.location.delete({
    where: { id },
  })

  return true
}
