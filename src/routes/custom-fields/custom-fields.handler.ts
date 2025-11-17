import * as HttpStatusCodes from 'stoker/http-status-codes'
import type { CUSTOM_FIELDS_ROUTES } from '~/routes/custom-fields/custom-fields.routes'
import * as customFieldsService from '~/services/custom-fields.service'
import type { HandlerMapFromRoutes } from '~/types'

export const CUSTOM_FIELDS_HANDLER: HandlerMapFromRoutes<typeof CUSTOM_FIELDS_ROUTES> = {
  createCustomField: async c => {
    const authUser = c.get('user')
    if (!authUser) {
      return c.json({ message: 'Unauthorized' }, HttpStatusCodes.UNAUTHORIZED)
    }

    const body = await c.req.valid('json')
    try {
      const field = await customFieldsService.createCustomField({
        userId: authUser.id,
        ...body,
      })
      return c.json(
        {
          message: 'Custom field created successfully',
          success: true,
          data: field,
        },
        HttpStatusCodes.CREATED
      )
    } catch (error) {
      console.error('Error creating custom field:', error)
      return c.json(
        { message: 'Failed to create custom field' },
        HttpStatusCodes.INTERNAL_SERVER_ERROR
      )
    }
  },

  getCustomFields: async c => {
    const authUser = c.get('user')
    if (!authUser) {
      return c.json({ message: 'Unauthorized' }, HttpStatusCodes.UNAUTHORIZED)
    }

    try {
      const fields = await customFieldsService.getCustomFields(authUser.id)
      return c.json(
        {
          message: 'Custom fields retrieved successfully',
          success: true,
          data: fields,
        },
        HttpStatusCodes.OK
      )
    } catch (error) {
      console.error('Error fetching custom fields:', error)
      return c.json(
        { message: 'Failed to fetch custom fields' },
        HttpStatusCodes.INTERNAL_SERVER_ERROR
      )
    }
  },

  getCustomField: async c => {
    const authUser = c.get('user')
    if (!authUser) {
      return c.json({ message: 'Unauthorized' }, HttpStatusCodes.UNAUTHORIZED)
    }

    const { id } = c.req.valid('param')
    try {
      const field = await customFieldsService.getCustomFieldById(Number(id), authUser.id)
      if (!field) {
        return c.json({ message: 'Custom field not found' }, HttpStatusCodes.NOT_FOUND)
      }
      return c.json(
        {
          message: 'Custom field retrieved successfully',
          success: true,
          data: field,
        },
        HttpStatusCodes.OK
      )
    } catch (error) {
      console.error('Error fetching custom field:', error)
      return c.json(
        { message: 'Failed to fetch custom field' },
        HttpStatusCodes.INTERNAL_SERVER_ERROR
      )
    }
  },

  updateCustomField: async c => {
    const authUser = c.get('user')
    if (!authUser) {
      return c.json({ message: 'Unauthorized' }, HttpStatusCodes.UNAUTHORIZED)
    }

    const { id } = c.req.valid('param')
    const body = await c.req.valid('json')
    try {
      const field = await customFieldsService.updateCustomField(Number(id), authUser.id, body)
      if (!field) {
        return c.json({ message: 'Custom field not found' }, HttpStatusCodes.NOT_FOUND)
      }
      return c.json(
        {
          message: 'Custom field updated successfully',
          success: true,
          data: field,
        },
        HttpStatusCodes.OK
      )
    } catch (error) {
      console.error('Error updating custom field:', error)
      return c.json(
        { message: 'Failed to update custom field' },
        HttpStatusCodes.INTERNAL_SERVER_ERROR
      )
    }
  },

  deleteCustomField: async c => {
    const authUser = c.get('user')
    if (!authUser) {
      return c.json({ message: 'Unauthorized' }, HttpStatusCodes.UNAUTHORIZED)
    }

    const { id } = c.req.valid('param')
    try {
      const deleted = await customFieldsService.deleteCustomField(Number(id), authUser.id)
      if (!deleted) {
        return c.json({ message: 'Custom field not found' }, HttpStatusCodes.NOT_FOUND)
      }
      return c.json(
        {
          message: 'Custom field deleted successfully',
          success: true,
        },
        HttpStatusCodes.OK
      )
    } catch (error) {
      console.error('Error deleting custom field:', error)
      return c.json(
        { message: 'Failed to delete custom field' },
        HttpStatusCodes.INTERNAL_SERVER_ERROR
      )
    }
  },
}
