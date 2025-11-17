import * as HttpStatusCodes from 'stoker/http-status-codes'
import type { ORGANIZATION_ROUTES } from '~/routes/organization/organization.routes'
import {
  getOrganization,
  UserNotFoundError,
  updateOrganizationProfile,
} from '~/services/organization.service'
import type { HandlerMapFromRoutes } from '~/types'

export const ORGANIZATION_HANDLER: HandlerMapFromRoutes<typeof ORGANIZATION_ROUTES> = {
  getOrganization: async c => {
    const authUser = c.get('user')

    if (!authUser) {
      return c.json({ message: 'Unauthorized' }, HttpStatusCodes.UNAUTHORIZED)
    }

    try {
      const result = await getOrganization(authUser.id)
      return c.json(
        {
          message: 'Organization retrieved successfully',
          success: true,
          data: result,
        },
        HttpStatusCodes.OK
      )
    } catch (error) {
      console.error('Error fetching organization:', error)
      return c.json(
        { message: 'Failed to fetch organization' },
        HttpStatusCodes.INTERNAL_SERVER_ERROR
      )
    }
  },

  updateOrganization: async c => {
    const authUser = c.get('user')

    if (!authUser) {
      return c.json({ message: 'Unauthorized' }, HttpStatusCodes.UNAUTHORIZED)
    }

    const { phoneNo, organizationName, industry, students } = await c.req.valid('json')

    try {
      const result = await updateOrganizationProfile({
        userId: authUser.id,
        phoneNo,
        organizationName,
        industry,
        students,
      })

      return c.json(
        {
          message: 'Organization profile updated successfully',
          success: true,
          data: result,
        },
        HttpStatusCodes.OK
      )
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        return c.json({ message: 'User not found' }, HttpStatusCodes.NOT_FOUND)
      }
      console.error(error)
      return c.json(
        { message: 'Failed to update organization' },
        HttpStatusCodes.INTERNAL_SERVER_ERROR
      )
    }
  },
}
