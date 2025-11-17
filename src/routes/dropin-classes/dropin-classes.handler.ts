import * as HttpStatusCodes from 'stoker/http-status-codes'
import type { DROPIN_CLASSES_ROUTES } from '~/routes/dropin-classes/dropin-classes.routes'
import * as dropInClassesService from '~/services/dropin-classes.service'
import type { HandlerMapFromRoutes } from '~/types'

export const DROPIN_CLASSES_HANDLER: HandlerMapFromRoutes<typeof DROPIN_CLASSES_ROUTES> = {
  createDropInClass: async c => {
    const authUser = c.get('user')
    if (!authUser) {
      return c.json({ message: 'Unauthorized' }, HttpStatusCodes.UNAUTHORIZED)
    }
    const body = await c.req.valid('json')
    try {
      const classItem = await dropInClassesService.createDropInClass({
        userId: authUser.id,
        ...body,
      })
      return c.json(
        { message: 'Drop-in class created successfully', success: true, data: classItem },
        HttpStatusCodes.CREATED
      )
    } catch (error) {
      console.error('Error creating drop-in class:', error)
      return c.json(
        { message: 'Failed to create drop-in class' },
        HttpStatusCodes.INTERNAL_SERVER_ERROR
      )
    }
  },

  getDropInClasses: async c => {
    const authUser = c.get('user')
    if (!authUser) {
      return c.json({ message: 'Unauthorized' }, HttpStatusCodes.UNAUTHORIZED)
    }
    const classes = await dropInClassesService.getDropInClasses(authUser.id)
    return c.json(
      { message: 'Drop-in classes retrieved successfully', success: true, data: classes },
      HttpStatusCodes.OK
    )
  },

  getDropInClass: async c => {
    const authUser = c.get('user')
    if (!authUser) {
      return c.json({ message: 'Unauthorized' }, HttpStatusCodes.UNAUTHORIZED)
    }
    const { id } = c.req.valid('param')
    const classItem = await dropInClassesService.getDropInClassById(Number(id), authUser.id)
    if (!classItem) {
      return c.json({ message: 'Drop-in class not found' }, HttpStatusCodes.NOT_FOUND)
    }
    return c.json(
      { message: 'Drop-in class retrieved successfully', success: true, data: classItem },
      HttpStatusCodes.OK
    )
  },

  updateDropInClass: async c => {
    const authUser = c.get('user')
    if (!authUser) {
      return c.json({ message: 'Unauthorized' }, HttpStatusCodes.UNAUTHORIZED)
    }
    const { id } = c.req.valid('param')
    const body = await c.req.valid('json')
    const classItem = await dropInClassesService.updateDropInClass(Number(id), authUser.id, body)
    if (!classItem) {
      return c.json({ message: 'Drop-in class not found' }, HttpStatusCodes.NOT_FOUND)
    }
    return c.json(
      { message: 'Drop-in class updated successfully', success: true, data: classItem },
      HttpStatusCodes.OK
    )
  },

  deleteDropInClass: async c => {
    const authUser = c.get('user')
    if (!authUser) {
      return c.json({ message: 'Unauthorized' }, HttpStatusCodes.UNAUTHORIZED)
    }
    const { id } = c.req.valid('param')
    const deleted = await dropInClassesService.deleteDropInClass(Number(id), authUser.id)
    if (!deleted) {
      return c.json({ message: 'Drop-in class not found' }, HttpStatusCodes.NOT_FOUND)
    }
    return c.json(
      { message: 'Drop-in class deleted successfully', success: true, data: { success: true } },
      HttpStatusCodes.OK
    )
  },
}
