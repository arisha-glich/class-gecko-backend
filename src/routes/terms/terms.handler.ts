import * as HttpStatusCodes from 'stoker/http-status-codes'
import type { TERMS_ROUTES } from '~/routes/terms/terms.routes'
import * as termsService from '~/services/terms.service'
import type { HandlerMapFromRoutes } from '~/types'

export const TERMS_HANDLER: HandlerMapFromRoutes<typeof TERMS_ROUTES> = {
  createTerm: async c => {
    const authUser = c.get('user')
    if (!authUser) {
      return c.json({ message: 'Unauthorized' }, HttpStatusCodes.UNAUTHORIZED)
    }

    const body = await c.req.valid('json')
    const { pricing, ...rest } = body
    try {
      const term = await termsService.createTerm({
        userId: authUser.id,
        ...rest,
        pricing: pricing as Record<string, unknown> | undefined,
      })
      return c.json(
        {
          message: 'Term created successfully',
          success: true,
          data: term,
        },
        HttpStatusCodes.CREATED
      )
    } catch (error) {
      console.error('Error creating term:', error)
      return c.json({ message: 'Failed to create term' }, HttpStatusCodes.INTERNAL_SERVER_ERROR)
    }
  },

  getTerms: async c => {
    const authUser = c.get('user')
    if (!authUser) {
      return c.json({ message: 'Unauthorized' }, HttpStatusCodes.UNAUTHORIZED)
    }

    try {
      const terms = await termsService.getTerms(authUser.id)
      return c.json(
        {
          message: 'Terms retrieved successfully',
          success: true,
          data: terms,
        },
        HttpStatusCodes.OK
      )
    } catch (error) {
      console.error('Error fetching terms:', error)
      return c.json({ message: 'Failed to fetch terms' }, HttpStatusCodes.INTERNAL_SERVER_ERROR)
    }
  },

  getTerm: async c => {
    const authUser = c.get('user')
    if (!authUser) {
      return c.json({ message: 'Unauthorized' }, HttpStatusCodes.UNAUTHORIZED)
    }

    const { id } = c.req.valid('param')
    try {
      const term = await termsService.getTermById(Number(id))
      if (!term) {
        return c.json({ message: 'Term not found' }, HttpStatusCodes.NOT_FOUND)
      }
      return c.json(
        {
          message: 'Term retrieved successfully',
          success: true,
          data: term,
        },
        HttpStatusCodes.OK
      )
    } catch (error) {
      console.error('Error fetching term:', error)
      return c.json({ message: 'Failed to fetch term' }, HttpStatusCodes.INTERNAL_SERVER_ERROR)
    }
  },

  updateTerm: async c => {
    const authUser = c.get('user')
    if (!authUser) {
      return c.json({ message: 'Unauthorized' }, HttpStatusCodes.UNAUTHORIZED)
    }

    const { id } = c.req.valid('param')
    const body = await c.req.valid('json')
    const { pricing, ...rest } = body
    try {
      const term = await termsService.updateTerm(Number(id), authUser.id, {
        ...rest,
        pricing: pricing as Record<string, unknown> | undefined,
      })
      if (!term) {
        return c.json({ message: 'Term not found' }, HttpStatusCodes.NOT_FOUND)
      }
      return c.json(
        {
          message: 'Term updated successfully',
          success: true,
          data: term,
        },
        HttpStatusCodes.OK
      )
    } catch (error) {
      console.error('Error updating term:', error)
      return c.json({ message: 'Failed to update term' }, HttpStatusCodes.INTERNAL_SERVER_ERROR)
    }
  },

  deleteTerm: async c => {
    const authUser = c.get('user')
    if (!authUser) {
      return c.json({ message: 'Unauthorized' }, HttpStatusCodes.UNAUTHORIZED)
    }

    const { id } = c.req.valid('param')
    try {
      const deleted = await termsService.deleteTerm(Number(id), authUser.id)
      if (!deleted) {
        return c.json({ message: 'Term not found' }, HttpStatusCodes.NOT_FOUND)
      }
      return c.json(
        {
          message: 'Term deleted successfully',
          success: true,
        },
        HttpStatusCodes.OK
      )
    } catch (error) {
      console.error('Error deleting term:', error)
      return c.json({ message: 'Failed to delete term' }, HttpStatusCodes.INTERNAL_SERVER_ERROR)
    }
  },
}
