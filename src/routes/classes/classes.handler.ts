import * as HttpStatusCodes from 'stoker/http-status-codes'
import type { CLASSES_ROUTES } from '~/routes/classes/classes.routes'
import * as classesService from '~/services/classes.service'
import type { HandlerMapFromRoutes } from '~/types'

export const CLASSES_HANDLER: HandlerMapFromRoutes<typeof CLASSES_ROUTES> = {
  createClass: async c => {
    const authUser = c.get('user')
    if (!authUser) {
      return c.json({ message: 'Unauthorized' }, HttpStatusCodes.UNAUTHORIZED)
    }

    const body = await c.req.valid('json')
    try {
      const classItem = await classesService.createClass(body)
      return c.json(
        {
          message: 'Class created successfully',
          success: true,
          data: classItem,
        },
        HttpStatusCodes.CREATED
      )
    } catch (error) {
      console.error('Error creating class:', error)
      return c.json({ message: 'Failed to create class' }, HttpStatusCodes.INTERNAL_SERVER_ERROR)
    }
  },

  getClasses: async c => {
    const authUser = c.get('user')
    if (!authUser) {
      return c.json({ message: 'Unauthorized' }, HttpStatusCodes.UNAUTHORIZED)
    }

    try {
      const classes = await classesService.getClasses()
      return c.json(
        {
          message: 'Classes retrieved successfully',
          success: true,
          data: classes,
        },
        HttpStatusCodes.OK
      )
    } catch (error) {
      console.error('Error fetching classes:', error)
      return c.json({ message: 'Failed to fetch classes' }, HttpStatusCodes.INTERNAL_SERVER_ERROR)
    }
  },

  getClass: async c => {
    const authUser = c.get('user')
    if (!authUser) {
      return c.json({ message: 'Unauthorized' }, HttpStatusCodes.UNAUTHORIZED)
    }

    const { id } = c.req.valid('param')
    try {
      const classItem = await classesService.getClassById(Number(id))
      if (!classItem) {
        return c.json({ message: 'Class not found' }, HttpStatusCodes.NOT_FOUND)
      }
      return c.json(
        {
          message: 'Class retrieved successfully',
          success: true,
          data: classItem,
        },
        HttpStatusCodes.OK
      )
    } catch (error) {
      console.error('Error fetching class:', error)
      return c.json({ message: 'Failed to fetch class' }, HttpStatusCodes.INTERNAL_SERVER_ERROR)
    }
  },

  updateClass: async c => {
    const authUser = c.get('user')
    if (!authUser) {
      return c.json({ message: 'Unauthorized' }, HttpStatusCodes.UNAUTHORIZED)
    }

    const { id } = c.req.valid('param')
    const body = await c.req.valid('json')
    try {
      const classItem = await classesService.updateClass(Number(id), body)
      if (!classItem) {
        return c.json({ message: 'Class not found' }, HttpStatusCodes.NOT_FOUND)
      }
      return c.json(
        {
          message: 'Class updated successfully',
          success: true,
          data: classItem,
        },
        HttpStatusCodes.OK
      )
    } catch (error) {
      console.error('Error updating class:', error)
      return c.json({ message: 'Failed to update class' }, HttpStatusCodes.INTERNAL_SERVER_ERROR)
    }
  },

  deleteClass: async c => {
    const authUser = c.get('user')
    if (!authUser) {
      return c.json({ message: 'Unauthorized' }, HttpStatusCodes.UNAUTHORIZED)
    }

    const { id } = c.req.valid('param')
    try {
      const deleted = await classesService.deleteClass(Number(id))
      if (!deleted) {
        return c.json({ message: 'Class not found' }, HttpStatusCodes.NOT_FOUND)
      }
      return c.json(
        {
          message: 'Class deleted successfully',
          success: true,
        },
        HttpStatusCodes.OK
      )
    } catch (error) {
      console.error('Error deleting class:', error)
      return c.json({ message: 'Failed to delete class' }, HttpStatusCodes.INTERNAL_SERVER_ERROR)
    }
  },

  getClassesByTerm: async c => {
    const authUser = c.get('user')
    if (!authUser) {
      return c.json({ message: 'Unauthorized' }, HttpStatusCodes.UNAUTHORIZED)
    }

    const { termId } = c.req.valid('param')
    try {
      const classes = await classesService.getClassesByTerm(Number(termId))
      return c.json(
        {
          message: 'Classes retrieved successfully',
          success: true,
          data: classes,
        },
        HttpStatusCodes.OK
      )
    } catch (error) {
      console.error('Error fetching classes:', error)
      return c.json({ message: 'Failed to fetch classes' }, HttpStatusCodes.INTERNAL_SERVER_ERROR)
    }
  },
}
