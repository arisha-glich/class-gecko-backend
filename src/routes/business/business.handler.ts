import * as HttpStatusCodes from 'stoker/http-status-codes'
import type { BUSINESS_ROUTES } from '~/routes/business/business.routes'
import {
  BusinessNotFoundError,
  createBusiness,
  EmailAlreadyUsedError,
  getBusinessById,
  getBusinesses,
  getBusinessStudents,
  toggleBusinessStatus,
  updateBusiness,
  updateBusinessCommission,
} from '~/services/business.service'
import type { HandlerMapFromRoutes } from '~/types'

export const BUSINESS_HANDLER: HandlerMapFromRoutes<typeof BUSINESS_ROUTES> = {
  getBusinesses: async c => {
    const authUser = c.get('user')
    if (!authUser) {
      return c.json({ message: 'Unauthorized' }, HttpStatusCodes.UNAUTHORIZED)
    }

    try {
      const query = c.req.valid('query')
      const search = query.search
      const page = query.page ? parseInt(query.page, 10) : 1
      const limit = query.limit ? parseInt(query.limit, 10) : 10

      const result = await getBusinesses(search, page, limit)
      return c.json(
        {
          message: 'Businesses retrieved successfully',
          success: true,
          data: result,
        },
        HttpStatusCodes.OK
      )
    } catch (error) {
      console.error('Error fetching businesses:', error)
      return c.json(
        { message: 'Failed to retrieve businesses' },
        HttpStatusCodes.INTERNAL_SERVER_ERROR
      )
    }
  },

  getBusiness: async c => {
    const authUser = c.get('user')
    if (!authUser) {
      return c.json({ message: 'Unauthorized' }, HttpStatusCodes.UNAUTHORIZED)
    }

    try {
      const { id } = c.req.valid('param')
      const business = await getBusinessById(Number(id))

      if (!business) {
        return c.json({ message: 'Business not found' }, HttpStatusCodes.NOT_FOUND)
      }

      return c.json(
        {
          message: 'Business details retrieved successfully',
          success: true,
          data: business,
        },
        HttpStatusCodes.OK
      )
    } catch (error) {
      console.error('Error fetching business:', error)
      return c.json(
        { message: 'Failed to retrieve business' },
        HttpStatusCodes.INTERNAL_SERVER_ERROR
      )
    }
  },

  createBusiness: async c => {
    const authUser = c.get('user')
    if (!authUser) {
      return c.json({ message: 'Unauthorized' }, HttpStatusCodes.UNAUTHORIZED)
    }

    try {
      const body = await c.req.valid('json')
      const business = await createBusiness({
        schoolName: body.schoolName,
        email: body.email,
        phone: body.phone,
        address: body.address,
        website: body.website,
        commissionType: body.commissionType,
        commissionValue: body.commissionValue,
        status: body.status,
      })

      return c.json(
        {
          message: 'Business created successfully',
          success: true,
          data: business,
        },
        HttpStatusCodes.CREATED
      )
    } catch (error) {
      if (error instanceof EmailAlreadyUsedError) {
        return c.json({ message: 'Email already in use' }, HttpStatusCodes.CONFLICT)
      }
      console.error('Error creating business:', error)
      return c.json({ message: 'Failed to create business' }, HttpStatusCodes.INTERNAL_SERVER_ERROR)
    }
  },

  updateBusiness: async c => {
    const authUser = c.get('user')
    if (!authUser) {
      return c.json({ message: 'Unauthorized' }, HttpStatusCodes.UNAUTHORIZED)
    }

    try {
      const { id } = c.req.valid('param')
      const body = await c.req.valid('json')

      const business = await updateBusiness(Number(id), {
        schoolName: body.schoolName,
        email: body.email,
        phone: body.phone,
        address: body.address,
        website: body.website,
        status: body.status,
      })

      return c.json(
        {
          message: 'Business updated successfully',
          success: true,
          data: business,
        },
        HttpStatusCodes.OK
      )
    } catch (error) {
      if (error instanceof BusinessNotFoundError) {
        return c.json({ message: 'Business not found' }, HttpStatusCodes.NOT_FOUND)
      }
      console.error('Error updating business:', error)
      return c.json({ message: 'Failed to update business' }, HttpStatusCodes.INTERNAL_SERVER_ERROR)
    }
  },

  updateBusinessCommission: async c => {
    const authUser = c.get('user')
    if (!authUser) {
      return c.json({ message: 'Unauthorized' }, HttpStatusCodes.UNAUTHORIZED)
    }

    try {
      const { id } = c.req.valid('param')
      const body = await c.req.valid('json')

      const commission = await updateBusinessCommission(Number(id), {
        commissionType: body.commissionType,
        commissionValue: body.commissionValue,
        country: body.country,
        currency: body.currency,
      })

      return c.json(
        {
          message: 'Commission updated successfully',
          success: true,
          data: commission,
        },
        HttpStatusCodes.OK
      )
    } catch (error) {
      if (error instanceof BusinessNotFoundError) {
        return c.json({ message: 'Business not found' }, HttpStatusCodes.NOT_FOUND)
      }
      console.error('Error updating commission:', error)
      return c.json(
        { message: 'Failed to update commission' },
        HttpStatusCodes.INTERNAL_SERVER_ERROR
      )
    }
  },

  getBusinessStudents: async c => {
    const authUser = c.get('user')
    if (!authUser) {
      return c.json({ message: 'Unauthorized' }, HttpStatusCodes.UNAUTHORIZED)
    }

    try {
      const { id } = c.req.valid('param')
      const query = c.req.valid('query')
      const page = query.page ? parseInt(query.page, 10) : 1
      const limit = query.limit ? parseInt(query.limit, 10) : 10

      const result = await getBusinessStudents(Number(id), page, limit)
      return c.json(
        {
          message: 'Students retrieved successfully',
          success: true,
          data: result,
        },
        HttpStatusCodes.OK
      )
    } catch (error) {
      if (error instanceof BusinessNotFoundError) {
        return c.json({ message: 'Business not found' }, HttpStatusCodes.NOT_FOUND)
      }
      console.error('Error fetching students:', error)
      return c.json(
        { message: 'Failed to retrieve students' },
        HttpStatusCodes.INTERNAL_SERVER_ERROR
      )
    }
  },

  toggleBusinessStatus: async c => {
    const authUser = c.get('user')
    if (!authUser) {
      return c.json({ message: 'Unauthorized' }, HttpStatusCodes.UNAUTHORIZED)
    }

    try {
      const { id } = c.req.valid('param')
      const { status } = await c.req.valid('json')

      const result = await toggleBusinessStatus(Number(id), status)
      return c.json(
        {
          message: 'Business status updated successfully',
          success: true,
          data: result,
        },
        HttpStatusCodes.OK
      )
    } catch (error) {
      if (error instanceof BusinessNotFoundError) {
        return c.json({ message: 'Business not found' }, HttpStatusCodes.NOT_FOUND)
      }
      console.error('Error toggling status:', error)
      return c.json({ message: 'Failed to update status' }, HttpStatusCodes.INTERNAL_SERVER_ERROR)
    }
  },
}


