import * as HttpStatusCodes from 'stoker/http-status-codes'
import type { DROPIN_BOOKINGS_ROUTES } from '~/routes/dropin-bookings/dropin-bookings.routes'
import type { HandlerMapFromRoutes } from '~/types'
import * as dropInBookingsService from '~/services/dropin-bookings.service'

export const DROPIN_BOOKINGS_HANDLER: HandlerMapFromRoutes<typeof DROPIN_BOOKINGS_ROUTES> = {
  createDropInBooking: async c => {
    const authUser = c.get('user')
    if (!authUser) {
      return c.json({ message: 'Unauthorized' }, HttpStatusCodes.UNAUTHORIZED)
    }

    const body = await c.req.valid('json')
    try {
      const booking = await dropInBookingsService.createDropInBooking({
        userId: authUser.id,
        ...body,
      })
      return c.json(
        {
          message: 'Drop-in booking created successfully',
          success: true,
          data: booking,
        },
        HttpStatusCodes.CREATED
      )
    } catch (error) {
      console.error('Error creating drop-in booking:', error)
      return c.json(
        { message: 'Failed to create drop-in booking' },
        HttpStatusCodes.INTERNAL_SERVER_ERROR
      )
    }
  },

  getDropInBookings: async c => {
    const authUser = c.get('user')
    if (!authUser) {
      return c.json({ message: 'Unauthorized' }, HttpStatusCodes.UNAUTHORIZED)
    }

    try {
      const bookings = await dropInBookingsService.getDropInBookings(authUser.id)
      return c.json(
        {
          message: 'Drop-in bookings retrieved successfully',
          success: true,
          data: bookings,
        },
        HttpStatusCodes.OK
      )
    } catch (error) {
      console.error('Error fetching drop-in bookings:', error)
      return c.json(
        { message: 'Failed to fetch drop-in bookings' },
        HttpStatusCodes.INTERNAL_SERVER_ERROR
      )
    }
  },

  getDropInBooking: async c => {
    const authUser = c.get('user')
    if (!authUser) {
      return c.json({ message: 'Unauthorized' }, HttpStatusCodes.UNAUTHORIZED)
    }

    const { id } = c.req.valid('param')
    try {
      const booking = await dropInBookingsService.getDropInBookingById(
        Number(id),
        authUser.id
      )
      if (!booking) {
        return c.json({ message: 'Drop-in booking not found' }, HttpStatusCodes.NOT_FOUND)
      }
      return c.json(
        {
          message: 'Drop-in booking retrieved successfully',
          success: true,
          data: booking,
        },
        HttpStatusCodes.OK
      )
    } catch (error) {
      console.error('Error fetching drop-in booking:', error)
      return c.json(
        { message: 'Failed to fetch drop-in booking' },
        HttpStatusCodes.INTERNAL_SERVER_ERROR
      )
    }
  },

  getDropInBookingsByClass: async c => {
    const authUser = c.get('user')
    if (!authUser) {
      return c.json({ message: 'Unauthorized' }, HttpStatusCodes.UNAUTHORIZED)
    }

    const { classId } = c.req.valid('param')
    try {
      const bookings = await dropInBookingsService.getDropInBookingsByClass(
        Number(classId),
        authUser.id
      )
      return c.json(
        {
          message: 'Drop-in bookings retrieved successfully',
          success: true,
          data: bookings,
        },
        HttpStatusCodes.OK
      )
    } catch (error) {
      console.error('Error fetching drop-in bookings:', error)
      return c.json(
        { message: 'Failed to fetch drop-in bookings' },
        HttpStatusCodes.INTERNAL_SERVER_ERROR
      )
    }
  },

  updateDropInBooking: async c => {
    const authUser = c.get('user')
    if (!authUser) {
      return c.json({ message: 'Unauthorized' }, HttpStatusCodes.UNAUTHORIZED)
    }

    const { id } = c.req.valid('param')
    const body = await c.req.valid('json')
    try {
      const booking = await dropInBookingsService.updateDropInBooking(
        Number(id),
        authUser.id,
        body
      )
      if (!booking) {
        return c.json({ message: 'Drop-in booking not found' }, HttpStatusCodes.NOT_FOUND)
      }
      return c.json(
        {
          message: 'Drop-in booking updated successfully',
          success: true,
          data: booking,
        },
        HttpStatusCodes.OK
      )
    } catch (error) {
      console.error('Error updating drop-in booking:', error)
      return c.json(
        { message: 'Failed to update drop-in booking' },
        HttpStatusCodes.INTERNAL_SERVER_ERROR
      )
    }
  },

  deleteDropInBooking: async c => {
    const authUser = c.get('user')
    if (!authUser) {
      return c.json({ message: 'Unauthorized' }, HttpStatusCodes.UNAUTHORIZED)
    }

    const { id } = c.req.valid('param')
    try {
      const deleted = await dropInBookingsService.deleteDropInBooking(Number(id), authUser.id)
      if (!deleted) {
        return c.json({ message: 'Drop-in booking not found' }, HttpStatusCodes.NOT_FOUND)
      }
      return c.json(
        {
          message: 'Drop-in booking deleted successfully',
          success: true,
        },
        HttpStatusCodes.OK
      )
    } catch (error) {
      console.error('Error deleting drop-in booking:', error)
      return c.json(
        { message: 'Failed to delete drop-in booking' },
        HttpStatusCodes.INTERNAL_SERVER_ERROR
      )
    }
  },
}

