import * as HttpStatusCodes from 'stoker/http-status-codes'
import type { COMMISSIONS_ROUTES } from '~/routes/commissions/commissions.routes'
import {
  BusinessNotFoundError,
  CommissionNotFoundError,
  createGlobalCommission,
  createOrganizationCommission,
  deleteCommission,
  getAllCommissions,
  getCommissionById,
  updateCommission,
} from '~/services/commission.service'
import type { HandlerMapFromRoutes } from '~/types'

/**
 * Check if user is admin
 */
function isAdmin(user: { role?: string } | null): boolean {
  return user?.role === 'ADMIN'
}

export const COMMISSIONS_HANDLER: HandlerMapFromRoutes<typeof COMMISSIONS_ROUTES> = {
  getCommissions: async c => {
    const authUser = c.get('user')
    if (!authUser) {
      return c.json({ message: 'Unauthorized' }, HttpStatusCodes.UNAUTHORIZED)
    }

    // if (!isAdmin(authUser)) {
    //   return c.json({ message: 'Admin access required' }, HttpStatusCodes.FORBIDDEN)
    // }

    try {
      const query = c.req.valid('query')
      const page = query.page ? Number(query.page) : 1
      const limit = query.limit ? Number(query.limit) : 10
      const businessId = query.businessId ? Number(query.businessId) : undefined
      const isActive = query.isActive ? query.isActive === 'true' : undefined

      const result = await getAllCommissions(page, limit, businessId, isActive)

      return c.json(
        {
          message: 'Commissions retrieved successfully',
          success: true,
          data: result,
        },
        HttpStatusCodes.OK
      )
    } catch (error) {
      console.error('Error fetching commissions:', error)
      return c.json(
        { message: 'Failed to retrieve commissions' },
        HttpStatusCodes.INTERNAL_SERVER_ERROR
      )
    }
  },

  getCommission: async c => {
    const authUser = c.get('user')
    if (!authUser) {
      return c.json({ message: 'Unauthorized' }, HttpStatusCodes.UNAUTHORIZED)
    }

    // if (!isAdmin(authUser)) {
    //   return c.json({ message: 'Admin access required' }, HttpStatusCodes.FORBIDDEN)
    // }

    try {
      const { id } = c.req.valid('param')
      const commission = await getCommissionById(Number(id))

      if (!commission) {
        return c.json({ message: 'Commission not found' }, HttpStatusCodes.NOT_FOUND)
      }

      return c.json(
        {
          message: 'Commission retrieved successfully',
          success: true,
          data: commission,
        },
        HttpStatusCodes.OK
      )
    } catch (error) {
      console.error('Error fetching commission:', error)
      return c.json(
        { message: 'Failed to retrieve commission' },
        HttpStatusCodes.INTERNAL_SERVER_ERROR
      )
    }
  },

  createGlobalCommission: async c => {
    const authUser = c.get('user')
    if (!authUser) {
      return c.json({ message: 'Unauthorized' }, HttpStatusCodes.UNAUTHORIZED)
    }

    // if (!isAdmin(authUser)) {
    //   return c.json({ message: 'Admin access required' }, HttpStatusCodes.FORBIDDEN)
    // }

    try {
      const body = await c.req.valid('json')

      const commission = await createGlobalCommission({
        commissionType: body.commissionType,
        commissionValue: body.commissionValue ?? 0,
        country: body.country,
        currency: body.currency,
        effectiveFrom: body.effectiveFrom ? new Date(body.effectiveFrom) : undefined,
        appliesTo: body.appliesTo,
        minTransactionAmt: body.minTransactionAmt,
        maxTransactionAmt: body.maxTransactionAmt,
        tierConfig: body.tierConfig as Record<string, unknown> | undefined,
      })

      return c.json(
        {
          message: 'Global commission created successfully',
          success: true,
          data: commission,
        },
        HttpStatusCodes.CREATED
      )
    } catch (error) {
      console.error('Error creating global commission:', error)

      // Return more detailed error message
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to create global commission'
      return c.json(
        {
          message: 'Failed to create global commission',
          error: errorMessage,
          details: error instanceof Error ? error.stack : undefined,
        },
        HttpStatusCodes.INTERNAL_SERVER_ERROR
      )
    }
  },

  createOrganizationCommission: async c => {
    const authUser = c.get('user')
    if (!authUser) {
      return c.json({ message: 'Unauthorized' }, HttpStatusCodes.UNAUTHORIZED)
    }

    // if (!isAdmin(authUser)) {
    //   return c.json({ message: 'Admin access required' }, HttpStatusCodes.FORBIDDEN)
    // }

    try {
      const body = await c.req.valid('json')

      const commission = await createOrganizationCommission({
        businessId: body.businessId,
        commissionType: body.commissionType,
        commissionValue: body.commissionValue,
        country: body.country,
        currency: body.currency,
        effectiveFrom: body.effectiveFrom ? new Date(body.effectiveFrom) : undefined,
        appliesTo: body.appliesTo,
        minTransactionAmt: body.minTransactionAmt,
        maxTransactionAmt: body.maxTransactionAmt,
        tierConfig: body.tierConfig as Record<string, unknown> | undefined,
      })

      return c.json(
        {
          message: 'Organization commission created successfully',
          success: true,
          data: commission,
        },
        HttpStatusCodes.CREATED
      )
    } catch (error) {
      if (error instanceof BusinessNotFoundError) {
        return c.json({ message: 'Business not found' }, HttpStatusCodes.NOT_FOUND)
      }
      console.error('Error creating organization commission:', error)
      return c.json(
        { message: 'Failed to create organization commission' },
        HttpStatusCodes.INTERNAL_SERVER_ERROR
      )
    }
  },

  updateCommission: async c => {
    const authUser = c.get('user')
    if (!authUser) {
      return c.json({ message: 'Unauthorized' }, HttpStatusCodes.UNAUTHORIZED)
    }

    // if (!isAdmin(authUser)) {
    //   return c.json({ message: 'Admin access required' }, HttpStatusCodes.FORBIDDEN)
    // }

    try {
      const { id } = c.req.valid('param')
      const body = await c.req.valid('json')

      const commission = await updateCommission(Number(id), {
        commissionType: body.commissionType,
        commissionValue: body.commissionValue,
        country: body.country,
        currency: body.currency,
        effectiveFrom: body.effectiveFrom ? new Date(body.effectiveFrom) : undefined,
        appliesTo: body.appliesTo,
        minTransactionAmt: body.minTransactionAmt,
        maxTransactionAmt: body.maxTransactionAmt,
        tierConfig: body.tierConfig as Record<string, unknown> | undefined,
        isActive: body.isActive,
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
      if (error instanceof CommissionNotFoundError) {
        return c.json({ message: 'Commission not found' }, HttpStatusCodes.NOT_FOUND)
      }
      console.error('Error updating commission:', error)
      return c.json(
        { message: 'Failed to update commission' },
        HttpStatusCodes.INTERNAL_SERVER_ERROR
      )
    }
  },

  deleteCommission: async c => {
    const authUser = c.get('user')
    if (!authUser) {
      return c.json({ message: 'Unauthorized' }, HttpStatusCodes.UNAUTHORIZED)
    }

    // if (!isAdmin(authUser)) {
    //   return c.json({ message: 'Admin access required' }, HttpStatusCodes.FORBIDDEN)
    // }

    try {
      const { id } = c.req.valid('param')
      const deleted = await deleteCommission(Number(id))

      if (!deleted) {
        return c.json({ message: 'Commission not found' }, HttpStatusCodes.NOT_FOUND)
      }

      return c.json(
        {
          message: 'Commission deleted successfully',
          success: true,
          data: { success: true },
        },
        HttpStatusCodes.OK
      )
    } catch (error) {
      console.error('Error deleting commission:', error)
      return c.json(
        { message: 'Failed to delete commission' },
        HttpStatusCodes.INTERNAL_SERVER_ERROR
      )
    }
  },
}
