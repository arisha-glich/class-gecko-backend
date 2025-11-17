import * as HttpStatusCodes from 'stoker/http-status-codes'
import type { LOCATIONS_ROUTES } from '~/routes/locations/locations.routes'
import * as locationsService from '~/services/locations.service'
import type { HandlerMapFromRoutes } from '~/types'

export const LOCATIONS_HANDLER: HandlerMapFromRoutes<typeof LOCATIONS_ROUTES> = {
  createLocation: async c => {
    const authUser = c.get('user')
    if (!authUser) {
      return c.json({ message: 'Unauthorized' }, HttpStatusCodes.UNAUTHORIZED)
    }

    const body = await c.req.valid('json')
    try {
      const location = await locationsService.createLocation(body)
      return c.json(
        {
          message: 'Location created successfully',
          success: true,
          data: location,
        },
        HttpStatusCodes.CREATED
      )
    } catch (error) {
      console.error('Error creating location:', error)
      return c.json({ message: 'Failed to create location' }, HttpStatusCodes.INTERNAL_SERVER_ERROR)
    }
  },

  getLocations: async c => {
    const authUser = c.get('user')
    if (!authUser) {
      return c.json({ message: 'Unauthorized' }, HttpStatusCodes.UNAUTHORIZED)
    }

    try {
      const locations = await locationsService.getLocations()
      return c.json(
        {
          message: 'Locations retrieved successfully',
          success: true,
          data: locations,
        },
        HttpStatusCodes.OK
      )
    } catch (error) {
      console.error('Error fetching locations:', error)
      return c.json({ message: 'Failed to fetch locations' }, HttpStatusCodes.INTERNAL_SERVER_ERROR)
    }
  },

  getLocation: async c => {
    const authUser = c.get('user')
    if (!authUser) {
      return c.json({ message: 'Unauthorized' }, HttpStatusCodes.UNAUTHORIZED)
    }

    const { id } = c.req.valid('param')
    try {
      const location = await locationsService.getLocationById(Number(id))
      if (!location) {
        return c.json({ message: 'Location not found' }, HttpStatusCodes.NOT_FOUND)
      }
      return c.json(
        {
          message: 'Location retrieved successfully',
          success: true,
          data: location,
        },
        HttpStatusCodes.OK
      )
    } catch (error) {
      console.error('Error fetching location:', error)
      return c.json({ message: 'Failed to fetch location' }, HttpStatusCodes.INTERNAL_SERVER_ERROR)
    }
  },

  updateLocation: async c => {
    const authUser = c.get('user')
    if (!authUser) {
      return c.json({ message: 'Unauthorized' }, HttpStatusCodes.UNAUTHORIZED)
    }

    const { id } = c.req.valid('param')
    const body = await c.req.valid('json')
    try {
      const location = await locationsService.updateLocation(Number(id), body)
      if (!location) {
        return c.json({ message: 'Location not found' }, HttpStatusCodes.NOT_FOUND)
      }
      return c.json(
        {
          message: 'Location updated successfully',
          success: true,
          data: location,
        },
        HttpStatusCodes.OK
      )
    } catch (error) {
      console.error('Error updating location:', error)
      return c.json({ message: 'Failed to update location' }, HttpStatusCodes.INTERNAL_SERVER_ERROR)
    }
  },

  deleteLocation: async c => {
    const authUser = c.get('user')
    if (!authUser) {
      return c.json({ message: 'Unauthorized' }, HttpStatusCodes.UNAUTHORIZED)
    }

    const { id } = c.req.valid('param')
    try {
      const deleted = await locationsService.deleteLocation(Number(id))
      if (!deleted) {
        return c.json({ message: 'Location not found' }, HttpStatusCodes.NOT_FOUND)
      }
      return c.json(
        {
          message: 'Location deleted successfully',
          success: true,
        },
        HttpStatusCodes.OK
      )
    } catch (error) {
      console.error('Error deleting location:', error)
      return c.json({ message: 'Failed to delete location' }, HttpStatusCodes.INTERNAL_SERVER_ERROR)
    }
  },
}
