import * as HttpStatusCodes from 'stoker/http-status-codes'
import type { HOLIDAYS_ROUTES } from '~/routes/holidays/holidays.routes'
import type { HandlerMapFromRoutes } from '~/types'
import * as holidaysService from '~/services/holidays.service'

export const HOLIDAYS_HANDLER: HandlerMapFromRoutes<typeof HOLIDAYS_ROUTES> = {
  createHoliday: async c => {
    const authUser = c.get('user')
    if (!authUser) {
      return c.json({ message: 'Unauthorized' }, HttpStatusCodes.UNAUTHORIZED)
    }

    const body = await c.req.valid('json')
    try {
      const holiday = await holidaysService.createHoliday({
        userId: authUser.id,
        ...body,
      })
      return c.json(
        {
          message: 'Holiday created successfully',
          success: true,
          data: holiday,
        },
        HttpStatusCodes.CREATED
      )
    } catch (error) {
      console.error('Error creating holiday:', error)
      return c.json(
        { message: 'Failed to create holiday' },
        HttpStatusCodes.INTERNAL_SERVER_ERROR
      )
    }
  },

  getHolidays: async c => {
    const authUser = c.get('user')
    if (!authUser) {
      return c.json({ message: 'Unauthorized' }, HttpStatusCodes.UNAUTHORIZED)
    }

    try {
      const holidays = await holidaysService.getHolidays(authUser.id)
      return c.json(
        {
          message: 'Holidays retrieved successfully',
          success: true,
          data: holidays,
        },
        HttpStatusCodes.OK
      )
    } catch (error) {
      console.error('Error fetching holidays:', error)
      return c.json(
        { message: 'Failed to fetch holidays' },
        HttpStatusCodes.INTERNAL_SERVER_ERROR
      )
    }
  },

  getHoliday: async c => {
    const authUser = c.get('user')
    if (!authUser) {
      return c.json({ message: 'Unauthorized' }, HttpStatusCodes.UNAUTHORIZED)
    }

    const { id } = c.req.valid('param')
    try {
      const holiday = await holidaysService.getHolidayById(Number(id), authUser.id)
      if (!holiday) {
        return c.json({ message: 'Holiday not found' }, HttpStatusCodes.NOT_FOUND)
      }
      return c.json(
        {
          message: 'Holiday retrieved successfully',
          success: true,
          data: holiday,
        },
        HttpStatusCodes.OK
      )
    } catch (error) {
      console.error('Error fetching holiday:', error)
      return c.json(
        { message: 'Failed to fetch holiday' },
        HttpStatusCodes.INTERNAL_SERVER_ERROR
      )
    }
  },

  updateHoliday: async c => {
    const authUser = c.get('user')
    if (!authUser) {
      return c.json({ message: 'Unauthorized' }, HttpStatusCodes.UNAUTHORIZED)
    }

    const { id } = c.req.valid('param')
    const body = await c.req.valid('json')
    try {
      const holiday = await holidaysService.updateHoliday(Number(id), authUser.id, body)
      if (!holiday) {
        return c.json({ message: 'Holiday not found' }, HttpStatusCodes.NOT_FOUND)
      }
      return c.json(
        {
          message: 'Holiday updated successfully',
          success: true,
          data: holiday,
        },
        HttpStatusCodes.OK
      )
    } catch (error) {
      console.error('Error updating holiday:', error)
      return c.json(
        { message: 'Failed to update holiday' },
        HttpStatusCodes.INTERNAL_SERVER_ERROR
      )
    }
  },

  deleteHoliday: async c => {
    const authUser = c.get('user')
    if (!authUser) {
      return c.json({ message: 'Unauthorized' }, HttpStatusCodes.UNAUTHORIZED)
    }

    const { id } = c.req.valid('param')
    try {
      const deleted = await holidaysService.deleteHoliday(Number(id), authUser.id)
      if (!deleted) {
        return c.json({ message: 'Holiday not found' }, HttpStatusCodes.NOT_FOUND)
      }
      return c.json(
        {
          message: 'Holiday deleted successfully',
          success: true,
        },
        HttpStatusCodes.OK
      )
    } catch (error) {
      console.error('Error deleting holiday:', error)
      return c.json(
        { message: 'Failed to delete holiday' },
        HttpStatusCodes.INTERNAL_SERVER_ERROR
      )
    }
  },
}

