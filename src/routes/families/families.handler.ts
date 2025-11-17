import * as HttpStatusCodes from 'stoker/http-status-codes'
import type { FAMILIES_ROUTES } from '~/routes/families/families.routes'
import {
  createFamily as createFamilyService,
  createStudentForFamily,
  EmailAlreadyUsedError,
  FamilyNotFoundError,
  getFamilies as getFamiliesService,
  getFamilyById as getFamilyByIdService,
} from '~/services/families.service'
import type { HandlerMapFromRoutes } from '~/types'

export const FAMILIES_HANDLER: HandlerMapFromRoutes<typeof FAMILIES_ROUTES> = {
  createFamily: async c => {
    const authUser = c.get('user')
    if (!authUser) {
      return c.json({ message: 'Unauthorized' }, HttpStatusCodes.UNAUTHORIZED)
    }

    const body = await c.req.valid('json')
    try {
      const result = await createFamilyService({
        organizationId: authUser.id,
        ...body,
      })
      return c.json(
        {
          message: 'Family created successfully',
          success: true,
          data: result,
        },
        HttpStatusCodes.CREATED
      )
    } catch (error) {
      if (error instanceof EmailAlreadyUsedError) {
        return c.json({ message: 'Email already used' }, HttpStatusCodes.CONFLICT)
      }
      console.error('Error creating family:', error)
      return c.json({ message: 'Failed to create family' }, HttpStatusCodes.INTERNAL_SERVER_ERROR)
    }
  },

  getFamilies: async c => {
    const authUser = c.get('user')
    if (!authUser) {
      return c.json({ message: 'Unauthorized' }, HttpStatusCodes.UNAUTHORIZED)
    }

    const families = await getFamiliesService(authUser.id)
    return c.json(
      {
        message: 'Families retrieved successfully',
        success: true,
        data: families,
      },
      HttpStatusCodes.OK
    )
  },

  getFamily: async c => {
    const authUser = c.get('user')
    if (!authUser) {
      return c.json({ message: 'Unauthorized' }, HttpStatusCodes.UNAUTHORIZED)
    }

    const { id } = c.req.valid('param')
    const family = await getFamilyByIdService(Number(id), authUser.id)
    if (!family) {
      return c.json({ message: 'Family not found' }, HttpStatusCodes.NOT_FOUND)
    }

    return c.json(
      {
        message: 'Family retrieved successfully',
        success: true,
        data: family,
      },
      HttpStatusCodes.OK
    )
  },

  createStudent: async c => {
    const authUser = c.get('user')
    if (!authUser) {
      return c.json({ message: 'Unauthorized' }, HttpStatusCodes.UNAUTHORIZED)
    }

    const { id } = c.req.valid('param')
    const body = await c.req.valid('json')
    try {
      const student = await createStudentForFamily({
        familyId: Number(id),
        organizationId: authUser.id,
        ...body,
      })
      return c.json(
        {
          message: 'Student created successfully',
          success: true,
          data: student,
        },
        HttpStatusCodes.CREATED
      )
    } catch (error) {
      if (error instanceof FamilyNotFoundError) {
        return c.json({ message: 'Family not found' }, HttpStatusCodes.NOT_FOUND)
      }
      console.error('Error creating student:', error)
      return c.json({ message: 'Failed to create student' }, HttpStatusCodes.INTERNAL_SERVER_ERROR)
    }
  },
}
