import * as HttpStatusCodes from 'stoker/http-status-codes'
import type { WAIVERS_POLICIES_ROUTES } from '~/routes/waivers-policies/waivers-policies.routes'
import type { HandlerMapFromRoutes } from '~/types'
import * as waiversPoliciesService from '~/services/waivers-policies.service'

export const WAIVERS_POLICIES_HANDLER: HandlerMapFromRoutes<
  typeof WAIVERS_POLICIES_ROUTES
> = {
  createWaiverPolicy: async c => {
    const authUser = c.get('user')
    if (!authUser) {
      return c.json({ message: 'Unauthorized' }, HttpStatusCodes.UNAUTHORIZED)
    }

    const body = await c.req.valid('json')
    try {
      const policy = await waiversPoliciesService.createWaiverPolicy({
        userId: authUser.id,
        ...body,
      })
      return c.json(
        {
          message: 'Waiver/policy created successfully',
          success: true,
          data: policy,
        },
        HttpStatusCodes.CREATED
      )
    } catch (error) {
      console.error('Error creating waiver/policy:', error)
      return c.json(
        { message: 'Failed to create waiver/policy' },
        HttpStatusCodes.INTERNAL_SERVER_ERROR
      )
    }
  },

  getWaiverPolicies: async c => {
    const authUser = c.get('user')
    if (!authUser) {
      return c.json({ message: 'Unauthorized' }, HttpStatusCodes.UNAUTHORIZED)
    }

    try {
      const policies = await waiversPoliciesService.getWaiverPolicies(authUser.id)
      return c.json(
        {
          message: 'Waivers/policies retrieved successfully',
          success: true,
          data: policies,
        },
        HttpStatusCodes.OK
      )
    } catch (error) {
      console.error('Error fetching waivers/policies:', error)
      return c.json(
        { message: 'Failed to fetch waivers/policies' },
        HttpStatusCodes.INTERNAL_SERVER_ERROR
      )
    }
  },

  getWaiverPolicy: async c => {
    const authUser = c.get('user')
    if (!authUser) {
      return c.json({ message: 'Unauthorized' }, HttpStatusCodes.UNAUTHORIZED)
    }

    const { id } = c.req.valid('param')
    try {
      const policy = await waiversPoliciesService.getWaiverPolicyById(Number(id), authUser.id)
      if (!policy) {
        return c.json({ message: 'Waiver/policy not found' }, HttpStatusCodes.NOT_FOUND)
      }
      return c.json(
        {
          message: 'Waiver/policy retrieved successfully',
          success: true,
          data: policy,
        },
        HttpStatusCodes.OK
      )
    } catch (error) {
      console.error('Error fetching waiver/policy:', error)
      return c.json(
        { message: 'Failed to fetch waiver/policy' },
        HttpStatusCodes.INTERNAL_SERVER_ERROR
      )
    }
  },

  updateWaiverPolicy: async c => {
    const authUser = c.get('user')
    if (!authUser) {
      return c.json({ message: 'Unauthorized' }, HttpStatusCodes.UNAUTHORIZED)
    }

    const { id } = c.req.valid('param')
    const body = await c.req.valid('json')
    try {
      const policy = await waiversPoliciesService.updateWaiverPolicy(Number(id), authUser.id, body)
      if (!policy) {
        return c.json({ message: 'Waiver/policy not found' }, HttpStatusCodes.NOT_FOUND)
      }
      return c.json(
        {
          message: 'Waiver/policy updated successfully',
          success: true,
          data: policy,
        },
        HttpStatusCodes.OK
      )
    } catch (error) {
      console.error('Error updating waiver/policy:', error)
      return c.json(
        { message: 'Failed to update waiver/policy' },
        HttpStatusCodes.INTERNAL_SERVER_ERROR
      )
    }
  },

  deleteWaiverPolicy: async c => {
    const authUser = c.get('user')
    if (!authUser) {
      return c.json({ message: 'Unauthorized' }, HttpStatusCodes.UNAUTHORIZED)
    }

    const { id } = c.req.valid('param')
    try {
      const deleted = await waiversPoliciesService.deleteWaiverPolicy(Number(id), authUser.id)
      if (!deleted) {
        return c.json({ message: 'Waiver/policy not found' }, HttpStatusCodes.NOT_FOUND)
      }
      return c.json(
        {
          message: 'Waiver/policy deleted successfully',
          success: true,
        },
        HttpStatusCodes.OK
      )
    } catch (error) {
      console.error('Error deleting waiver/policy:', error)
      return c.json(
        { message: 'Failed to delete waiver/policy' },
        HttpStatusCodes.INTERNAL_SERVER_ERROR
      )
    }
  },
}

