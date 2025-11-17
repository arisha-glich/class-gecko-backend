import * as HttpStatusCodes from 'stoker/http-status-codes'
import type { WAITLIST_ROUTES } from '~/routes/waitlist/waitlist.routes'
import * as waitlistService from '~/services/waitlist.service'
import type { HandlerMapFromRoutes } from '~/types'

export const WAITLIST_HANDLER: HandlerMapFromRoutes<typeof WAITLIST_ROUTES> = {
  createWaitlist: async c => {
    const authUser = c.get('user')
    if (!authUser) {
      return c.json({ message: 'Unauthorized' }, HttpStatusCodes.UNAUTHORIZED)
    }

    const body = await c.req.valid('json')
    try {
      const waitlistEntry = await waitlistService.createWaitlist({
        userId: authUser.id,
        ...body,
      })
      return c.json(
        {
          message: 'Added to waitlist successfully',
          success: true,
          data: waitlistEntry,
        },
        HttpStatusCodes.CREATED
      )
    } catch (error) {
      console.error('Error adding to waitlist:', error)
      return c.json({ message: 'Failed to add to waitlist' }, HttpStatusCodes.INTERNAL_SERVER_ERROR)
    }
  },

  getWaitlist: async c => {
    const authUser = c.get('user')
    if (!authUser) {
      return c.json({ message: 'Unauthorized' }, HttpStatusCodes.UNAUTHORIZED)
    }

    try {
      const waitlist = await waitlistService.getWaitlist(authUser.id)
      return c.json(
        {
          message: 'Waitlist retrieved successfully',
          success: true,
          data: waitlist,
        },
        HttpStatusCodes.OK
      )
    } catch (error) {
      console.error('Error fetching waitlist:', error)
      return c.json({ message: 'Failed to fetch waitlist' }, HttpStatusCodes.INTERNAL_SERVER_ERROR)
    }
  },

  getWaitlistEntry: async c => {
    const authUser = c.get('user')
    if (!authUser) {
      return c.json({ message: 'Unauthorized' }, HttpStatusCodes.UNAUTHORIZED)
    }

    const { id } = c.req.valid('param')
    try {
      const waitlistEntry = await waitlistService.getWaitlistById(Number(id))
      if (!waitlistEntry) {
        return c.json({ message: 'Waitlist entry not found' }, HttpStatusCodes.NOT_FOUND)
      }
      return c.json(
        {
          message: 'Waitlist entry retrieved successfully',
          success: true,
          data: waitlistEntry,
        },
        HttpStatusCodes.OK
      )
    } catch (error) {
      console.error('Error fetching waitlist entry:', error)
      return c.json(
        { message: 'Failed to fetch waitlist entry' },
        HttpStatusCodes.INTERNAL_SERVER_ERROR
      )
    }
  },

  getWaitlistByClass: async c => {
    const authUser = c.get('user')
    if (!authUser) {
      return c.json({ message: 'Unauthorized' }, HttpStatusCodes.UNAUTHORIZED)
    }

    const { classId } = c.req.valid('param')
    try {
      const waitlist = await waitlistService.getWaitlistByClass(Number(classId))
      return c.json(
        {
          message: 'Waitlist retrieved successfully',
          success: true,
          data: waitlist,
        },
        HttpStatusCodes.OK
      )
    } catch (error) {
      console.error('Error fetching waitlist:', error)
      return c.json({ message: 'Failed to fetch waitlist' }, HttpStatusCodes.INTERNAL_SERVER_ERROR)
    }
  },

  updateWaitlist: async c => {
    const authUser = c.get('user')
    if (!authUser) {
      return c.json({ message: 'Unauthorized' }, HttpStatusCodes.UNAUTHORIZED)
    }

    const { id } = c.req.valid('param')
    const body = await c.req.valid('json')
    try {
      const waitlistEntry = await waitlistService.updateWaitlist(Number(id), authUser.id, body)
      if (!waitlistEntry) {
        return c.json({ message: 'Waitlist entry not found' }, HttpStatusCodes.NOT_FOUND)
      }
      return c.json(
        {
          message: 'Waitlist entry updated successfully',
          success: true,
          data: waitlistEntry,
        },
        HttpStatusCodes.OK
      )
    } catch (error) {
      console.error('Error updating waitlist entry:', error)
      return c.json(
        { message: 'Failed to update waitlist entry' },
        HttpStatusCodes.INTERNAL_SERVER_ERROR
      )
    }
  },

  deleteWaitlist: async c => {
    const authUser = c.get('user')
    if (!authUser) {
      return c.json({ message: 'Unauthorized' }, HttpStatusCodes.UNAUTHORIZED)
    }

    const { id } = c.req.valid('param')
    try {
      const deleted = await waitlistService.deleteWaitlist(Number(id), authUser.id)
      if (!deleted) {
        return c.json({ message: 'Waitlist entry not found' }, HttpStatusCodes.NOT_FOUND)
      }
      return c.json(
        {
          message: 'Removed from waitlist successfully',
          success: true,
        },
        HttpStatusCodes.OK
      )
    } catch (error) {
      console.error('Error removing from waitlist:', error)
      return c.json(
        { message: 'Failed to remove from waitlist' },
        HttpStatusCodes.INTERNAL_SERVER_ERROR
      )
    }
  },
}
