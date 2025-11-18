import * as HttpStatusCodes from 'stoker/http-status-codes'
import type { FAMILIES_ROUTES } from '~/routes/families/families.routes'
import {
  createFamily as createFamilyService,
  createStudentForFamily,
  deleteFamily,
  EmailAlreadyUsedError,
  FamilyNotFoundError,
  getFamilies as getFamiliesService,
  getFamilyById as getFamilyByIdService,
  getFamilyChildren,
  getFamilyPayments,
  suspendFamily,
  updateFamily,
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

    try {
      const query = c.req.valid('query')
      const search = query.search
      const status = query.status
      const page = query.page ? parseInt(query.page, 10) : 1
      const limit = query.limit ? parseInt(query.limit, 10) : 10

      const result = await getFamiliesService(authUser.id, search, status, page, limit)
      return c.json(
        {
          message: 'Families retrieved successfully',
          success: true,
          data: result,
        },
        HttpStatusCodes.OK
      )
    } catch (error) {
      console.error('Error fetching families:', error)
      return c.json(
        { message: 'Failed to retrieve families' },
        HttpStatusCodes.INTERNAL_SERVER_ERROR
      )
    }
  },

  getFamily: async c => {
    const authUser = c.get('user')
    if (!authUser) {
      return c.json({ message: 'Unauthorized' }, HttpStatusCodes.UNAUTHORIZED)
    }

    try {
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
    } catch (error) {
      console.error('Error fetching family:', error)
      return c.json({ message: 'Failed to retrieve family' }, HttpStatusCodes.INTERNAL_SERVER_ERROR)
    }
  },

  updateFamily: async c => {
    const authUser = c.get('user')
    if (!authUser) {
      return c.json({ message: 'Unauthorized' }, HttpStatusCodes.UNAUTHORIZED)
    }

    try {
      const { id } = c.req.valid('param')
      const body = await c.req.valid('json')

      const family = await updateFamily(Number(id), authUser.id, body)
      return c.json(
        {
          message: 'Family updated successfully',
          success: true,
          data: family,
        },
        HttpStatusCodes.OK
      )
    } catch (error) {
      if (error instanceof FamilyNotFoundError) {
        return c.json({ message: 'Family not found' }, HttpStatusCodes.NOT_FOUND)
      }
      if (error instanceof EmailAlreadyUsedError) {
        return c.json({ message: 'Email already used' }, HttpStatusCodes.CONFLICT)
      }
      console.error('Error updating family:', error)
      return c.json({ message: 'Failed to update family' }, HttpStatusCodes.INTERNAL_SERVER_ERROR)
    }
  },

  deleteFamily: async c => {
    const authUser = c.get('user')
    if (!authUser) {
      return c.json({ message: 'Unauthorized' }, HttpStatusCodes.UNAUTHORIZED)
    }

    try {
      const { id } = c.req.valid('param')
      await deleteFamily(Number(id), authUser.id)
      return c.json(
        {
          message: 'Family deleted successfully',
          success: true,
          data: { success: true },
        },
        HttpStatusCodes.OK
      )
    } catch (error) {
      if (error instanceof FamilyNotFoundError) {
        return c.json({ message: 'Family not found' }, HttpStatusCodes.NOT_FOUND)
      }
      console.error('Error deleting family:', error)
      return c.json({ message: 'Failed to delete family' }, HttpStatusCodes.INTERNAL_SERVER_ERROR)
    }
  },

  suspendFamily: async c => {
    const authUser = c.get('user')
    if (!authUser) {
      return c.json({ message: 'Unauthorized' }, HttpStatusCodes.UNAUTHORIZED)
    }

    try {
      const { id } = c.req.valid('param')
      const { status } = await c.req.valid('json')

      const family = await suspendFamily(Number(id), authUser.id, status)
      return c.json(
        {
          message: 'Family status updated successfully',
          success: true,
          data: family,
        },
        HttpStatusCodes.OK
      )
    } catch (error) {
      if (error instanceof FamilyNotFoundError) {
        return c.json({ message: 'Family not found' }, HttpStatusCodes.NOT_FOUND)
      }
      console.error('Error updating family status:', error)
      return c.json(
        { message: 'Failed to update family status' },
        HttpStatusCodes.INTERNAL_SERVER_ERROR
      )
    }
  },

  getFamilyChildren: async c => {
    const authUser = c.get('user')
    if (!authUser) {
      return c.json({ message: 'Unauthorized' }, HttpStatusCodes.UNAUTHORIZED)
    }

    try {
      const { id } = c.req.valid('param')
      const children = await getFamilyChildren(Number(id), authUser.id)
      return c.json(
        {
          message: 'Family children retrieved successfully',
          success: true,
          data: children,
        },
        HttpStatusCodes.OK
      )
    } catch (error) {
      if (error instanceof FamilyNotFoundError) {
        return c.json({ message: 'Family not found' }, HttpStatusCodes.NOT_FOUND)
      }
      console.error('Error fetching children:', error)
      return c.json(
        { message: 'Failed to retrieve children' },
        HttpStatusCodes.INTERNAL_SERVER_ERROR
      )
    }
  },

  getFamilyPayments: async c => {
    const authUser = c.get('user')
    if (!authUser) {
      return c.json({ message: 'Unauthorized' }, HttpStatusCodes.UNAUTHORIZED)
    }

    try {
      const { id } = c.req.valid('param')
      const payments = await getFamilyPayments(Number(id), authUser.id)
      return c.json(
        {
          message: 'Payment history retrieved successfully',
          success: true,
          data: payments,
        },
        HttpStatusCodes.OK
      )
    } catch (error) {
      if (error instanceof FamilyNotFoundError) {
        return c.json({ message: 'Family not found' }, HttpStatusCodes.NOT_FOUND)
      }
      console.error('Error fetching payments:', error)
      return c.json(
        { message: 'Failed to retrieve payment history' },
        HttpStatusCodes.INTERNAL_SERVER_ERROR
      )
    }
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
