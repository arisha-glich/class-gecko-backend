import * as HttpStatusCodes from 'stoker/http-status-codes'
import type { REGISTRATION_FEES_ROUTES } from '~/routes/registration-fees/registration-fees.routes'
import type { HandlerMapFromRoutes } from '~/types'
import * as registrationFeesService from '~/services/registration-fees.service'

export const REGISTRATION_FEES_HANDLER: HandlerMapFromRoutes<
  typeof REGISTRATION_FEES_ROUTES
> = {
  createRegistrationFee: async c => {
    const authUser = c.get('user')
    if (!authUser) {
      return c.json({ message: 'Unauthorized' }, HttpStatusCodes.UNAUTHORIZED)
    }

    const body = await c.req.valid('json')
    try {
      const fee = await registrationFeesService.createRegistrationFee({
        userId: authUser.id,
        ...body,
      })
      return c.json(
        {
          message: 'Registration fee created successfully',
          success: true,
          data: fee,
        },
        HttpStatusCodes.CREATED
      )
    } catch (error) {
      console.error('Error creating registration fee:', error)
      return c.json(
        { message: 'Failed to create registration fee' },
        HttpStatusCodes.INTERNAL_SERVER_ERROR
      )
    }
  },

  getRegistrationFees: async c => {
    const authUser = c.get('user')
    if (!authUser) {
      return c.json({ message: 'Unauthorized' }, HttpStatusCodes.UNAUTHORIZED)
    }

    try {
      const fees = await registrationFeesService.getRegistrationFees(authUser.id)
      return c.json(
        {
          message: 'Registration fees retrieved successfully',
          success: true,
          data: fees,
        },
        HttpStatusCodes.OK
      )
    } catch (error) {
      console.error('Error fetching registration fees:', error)
      return c.json(
        { message: 'Failed to fetch registration fees' },
        HttpStatusCodes.INTERNAL_SERVER_ERROR
      )
    }
  },

  getRegistrationFee: async c => {
    const authUser = c.get('user')
    if (!authUser) {
      return c.json({ message: 'Unauthorized' }, HttpStatusCodes.UNAUTHORIZED)
    }

    const { id } = c.req.valid('param')
    try {
      const fee = await registrationFeesService.getRegistrationFeeById(
        Number(id),
        authUser.id
      )
      if (!fee) {
        return c.json({ message: 'Registration fee not found' }, HttpStatusCodes.NOT_FOUND)
      }
      return c.json(
        {
          message: 'Registration fee retrieved successfully',
          success: true,
          data: fee,
        },
        HttpStatusCodes.OK
      )
    } catch (error) {
      console.error('Error fetching registration fee:', error)
      return c.json(
        { message: 'Failed to fetch registration fee' },
        HttpStatusCodes.INTERNAL_SERVER_ERROR
      )
    }
  },

  updateRegistrationFee: async c => {
    const authUser = c.get('user')
    if (!authUser) {
      return c.json({ message: 'Unauthorized' }, HttpStatusCodes.UNAUTHORIZED)
    }

    const { id } = c.req.valid('param')
    const body = await c.req.valid('json')
    try {
      const fee = await registrationFeesService.updateRegistrationFee(
        Number(id),
        authUser.id,
        body
      )
      if (!fee) {
        return c.json({ message: 'Registration fee not found' }, HttpStatusCodes.NOT_FOUND)
      }
      return c.json(
        {
          message: 'Registration fee updated successfully',
          success: true,
          data: fee,
        },
        HttpStatusCodes.OK
      )
    } catch (error) {
      console.error('Error updating registration fee:', error)
      return c.json(
        { message: 'Failed to update registration fee' },
        HttpStatusCodes.INTERNAL_SERVER_ERROR
      )
    }
  },

  deleteRegistrationFee: async c => {
    const authUser = c.get('user')
    if (!authUser) {
      return c.json({ message: 'Unauthorized' }, HttpStatusCodes.UNAUTHORIZED)
    }

    const { id } = c.req.valid('param')
    try {
      const deleted = await registrationFeesService.deleteRegistrationFee(
        Number(id),
        authUser.id
      )
      if (!deleted) {
        return c.json({ message: 'Registration fee not found' }, HttpStatusCodes.NOT_FOUND)
      }
      return c.json(
        {
          message: 'Registration fee deleted successfully',
          success: true,
        },
        HttpStatusCodes.OK
      )
    } catch (error) {
      console.error('Error deleting registration fee:', error)
      return c.json(
        { message: 'Failed to delete registration fee' },
        HttpStatusCodes.INTERNAL_SERVER_ERROR
      )
    }
  },
}

