import * as HttpStatusCodes from 'stoker/http-status-codes'
import type { TRIALS_ROUTES } from '~/routes/trials/trials.routes'
import * as trialsService from '~/services/trials.service'
import type { HandlerMapFromRoutes } from '~/types'

export const TRIALS_HANDLER: HandlerMapFromRoutes<typeof TRIALS_ROUTES> = {
  createTrial: async c => {
    const authUser = c.get('user')
    if (!authUser) {
      return c.json({ message: 'Unauthorized' }, HttpStatusCodes.UNAUTHORIZED)
    }

    const body = await c.req.valid('json')
    try {
      const trial = await trialsService.createTrial({
        userId: authUser.id,
        ...body,
      })
      return c.json(
        {
          message: 'Trial created successfully',
          success: true,
          data: trial,
        },
        HttpStatusCodes.CREATED
      )
    } catch (error) {
      console.error('Error creating trial:', error)
      return c.json({ message: 'Failed to create trial' }, HttpStatusCodes.INTERNAL_SERVER_ERROR)
    }
  },

  getTrials: async c => {
    const authUser = c.get('user')
    if (!authUser) {
      return c.json({ message: 'Unauthorized' }, HttpStatusCodes.UNAUTHORIZED)
    }

    try {
      const trials = await trialsService.getTrials(authUser.id)
      return c.json(
        {
          message: 'Trials retrieved successfully',
          success: true,
          data: trials,
        },
        HttpStatusCodes.OK
      )
    } catch (error) {
      console.error('Error fetching trials:', error)
      return c.json({ message: 'Failed to fetch trials' }, HttpStatusCodes.INTERNAL_SERVER_ERROR)
    }
  },

  getTrial: async c => {
    const authUser = c.get('user')
    if (!authUser) {
      return c.json({ message: 'Unauthorized' }, HttpStatusCodes.UNAUTHORIZED)
    }

    const { id } = c.req.valid('param')
    try {
      const trial = await trialsService.getTrialById(Number(id))
      if (!trial) {
        return c.json({ message: 'Trial not found' }, HttpStatusCodes.NOT_FOUND)
      }
      return c.json(
        {
          message: 'Trial retrieved successfully',
          success: true,
          data: trial,
        },
        HttpStatusCodes.OK
      )
    } catch (error) {
      console.error('Error fetching trial:', error)
      return c.json({ message: 'Failed to fetch trial' }, HttpStatusCodes.INTERNAL_SERVER_ERROR)
    }
  },

  getTrialsByClass: async c => {
    const authUser = c.get('user')
    if (!authUser) {
      return c.json({ message: 'Unauthorized' }, HttpStatusCodes.UNAUTHORIZED)
    }

    const { classId } = c.req.valid('param')
    try {
      const trials = await trialsService.getTrialsByClass(Number(classId))
      return c.json(
        {
          message: 'Trials retrieved successfully',
          success: true,
          data: trials,
        },
        HttpStatusCodes.OK
      )
    } catch (error) {
      console.error('Error fetching trials:', error)
      return c.json({ message: 'Failed to fetch trials' }, HttpStatusCodes.INTERNAL_SERVER_ERROR)
    }
  },

  updateTrial: async c => {
    const authUser = c.get('user')
    if (!authUser) {
      return c.json({ message: 'Unauthorized' }, HttpStatusCodes.UNAUTHORIZED)
    }

    const { id } = c.req.valid('param')
    const body = await c.req.valid('json')
    try {
      const trial = await trialsService.updateTrial(Number(id), authUser.id, body)
      if (!trial) {
        return c.json({ message: 'Trial not found' }, HttpStatusCodes.NOT_FOUND)
      }
      return c.json(
        {
          message: 'Trial updated successfully',
          success: true,
          data: trial,
        },
        HttpStatusCodes.OK
      )
    } catch (error) {
      console.error('Error updating trial:', error)
      return c.json({ message: 'Failed to update trial' }, HttpStatusCodes.INTERNAL_SERVER_ERROR)
    }
  },

  deleteTrial: async c => {
    const authUser = c.get('user')
    if (!authUser) {
      return c.json({ message: 'Unauthorized' }, HttpStatusCodes.UNAUTHORIZED)
    }

    const { id } = c.req.valid('param')
    try {
      const deleted = await trialsService.deleteTrial(Number(id), authUser.id)
      if (!deleted) {
        return c.json({ message: 'Trial not found' }, HttpStatusCodes.NOT_FOUND)
      }
      return c.json(
        {
          message: 'Trial deleted successfully',
          success: true,
        },
        HttpStatusCodes.OK
      )
    } catch (error) {
      console.error('Error deleting trial:', error)
      return c.json({ message: 'Failed to delete trial' }, HttpStatusCodes.INTERNAL_SERVER_ERROR)
    }
  },
}
