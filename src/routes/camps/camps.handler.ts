import * as HttpStatusCodes from 'stoker/http-status-codes'
import type { CAMPS_ROUTES } from '~/routes/camps/camps.routes'
import * as campsService from '~/services/camps.service'
import type { HandlerMapFromRoutes } from '~/types'

export const CAMPS_HANDLER: HandlerMapFromRoutes<typeof CAMPS_ROUTES> = {
  createCamp: async c => {
    const authUser = c.get('user')
    if (!authUser) {
      return c.json({ message: 'Unauthorized' }, HttpStatusCodes.UNAUTHORIZED)
    }

    const body = await c.req.valid('json')
    try {
      const camp = await campsService.createCamp({
        userId: authUser.id,
        ...body,
      })
      return c.json(
        {
          message: 'Camp created successfully',
          success: true,
          data: camp,
        },
        HttpStatusCodes.CREATED
      )
    } catch (error) {
      console.error('Error creating camp:', error)
      return c.json({ message: 'Failed to create camp' }, HttpStatusCodes.INTERNAL_SERVER_ERROR)
    }
  },

  getCamps: async c => {
    const authUser = c.get('user')
    if (!authUser) {
      return c.json({ message: 'Unauthorized' }, HttpStatusCodes.UNAUTHORIZED)
    }

    try {
      const camps = await campsService.getCamps(authUser.id)
      return c.json(
        {
          message: 'Camps retrieved successfully',
          success: true,
          data: camps,
        },
        HttpStatusCodes.OK
      )
    } catch (error) {
      console.error('Error fetching camps:', error)
      return c.json({ message: 'Failed to fetch camps' }, HttpStatusCodes.INTERNAL_SERVER_ERROR)
    }
  },

  getCamp: async c => {
    const authUser = c.get('user')
    if (!authUser) {
      return c.json({ message: 'Unauthorized' }, HttpStatusCodes.UNAUTHORIZED)
    }

    const { id } = c.req.valid('param')
    try {
      const camp = await campsService.getCampById(Number(id), authUser.id)
      if (!camp) {
        return c.json({ message: 'Camp not found' }, HttpStatusCodes.NOT_FOUND)
      }
      return c.json(
        {
          message: 'Camp retrieved successfully',
          success: true,
          data: camp,
        },
        HttpStatusCodes.OK
      )
    } catch (error) {
      console.error('Error fetching camp:', error)
      return c.json({ message: 'Failed to fetch camp' }, HttpStatusCodes.INTERNAL_SERVER_ERROR)
    }
  },

  updateCamp: async c => {
    const authUser = c.get('user')
    if (!authUser) {
      return c.json({ message: 'Unauthorized' }, HttpStatusCodes.UNAUTHORIZED)
    }

    const { id } = c.req.valid('param')
    const body = await c.req.valid('json')
    try {
      const camp = await campsService.updateCamp(Number(id), authUser.id, body)
      if (!camp) {
        return c.json({ message: 'Camp not found' }, HttpStatusCodes.NOT_FOUND)
      }
      return c.json(
        {
          message: 'Camp updated successfully',
          success: true,
          data: camp,
        },
        HttpStatusCodes.OK
      )
    } catch (error) {
      console.error('Error updating camp:', error)
      return c.json({ message: 'Failed to update camp' }, HttpStatusCodes.INTERNAL_SERVER_ERROR)
    }
  },

  deleteCamp: async c => {
    const authUser = c.get('user')
    if (!authUser) {
      return c.json({ message: 'Unauthorized' }, HttpStatusCodes.UNAUTHORIZED)
    }

    const { id } = c.req.valid('param')
    try {
      const deleted = await campsService.deleteCamp(Number(id), authUser.id)
      if (!deleted) {
        return c.json({ message: 'Camp not found' }, HttpStatusCodes.NOT_FOUND)
      }
      return c.json(
        {
          message: 'Camp deleted successfully',
          success: true,
        },
        HttpStatusCodes.OK
      )
    } catch (error) {
      console.error('Error deleting camp:', error)
      return c.json({ message: 'Failed to delete camp' }, HttpStatusCodes.INTERNAL_SERVER_ERROR)
    }
  },
}
