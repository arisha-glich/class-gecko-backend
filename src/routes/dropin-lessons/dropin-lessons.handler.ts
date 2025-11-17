import * as HttpStatusCodes from 'stoker/http-status-codes'
import type { DROPIN_LESSONS_ROUTES } from '~/routes/dropin-lessons/dropin-lessons.routes'
import * as dropInLessonsService from '~/services/dropin-lessons.service'
import type { HandlerMapFromRoutes } from '~/types'

export const DROPIN_LESSONS_HANDLER: HandlerMapFromRoutes<typeof DROPIN_LESSONS_ROUTES> = {
  createDropInLesson: async c => {
    const authUser = c.get('user')
    if (!authUser) {
      return c.json({ message: 'Unauthorized' }, HttpStatusCodes.UNAUTHORIZED)
    }

    const body = await c.req.valid('json')
    try {
      const lesson = await dropInLessonsService.createDropInLesson(body)
      return c.json(
        {
          message: 'Drop-in lesson created successfully',
          success: true,
          data: lesson,
        },
        HttpStatusCodes.CREATED
      )
    } catch (error) {
      console.error('Error creating drop-in lesson:', error)
      return c.json(
        { message: 'Failed to create drop-in lesson' },
        HttpStatusCodes.INTERNAL_SERVER_ERROR
      )
    }
  },

  getDropInLessons: async c => {
    const authUser = c.get('user')
    if (!authUser) {
      return c.json({ message: 'Unauthorized' }, HttpStatusCodes.UNAUTHORIZED)
    }

    try {
      const lessons = await dropInLessonsService.getDropInLessons()
      return c.json(
        {
          message: 'Drop-in lessons retrieved successfully',
          success: true,
          data: lessons,
        },
        HttpStatusCodes.OK
      )
    } catch (error) {
      console.error('Error fetching drop-in lessons:', error)
      return c.json(
        { message: 'Failed to fetch drop-in lessons' },
        HttpStatusCodes.INTERNAL_SERVER_ERROR
      )
    }
  },

  getDropInLesson: async c => {
    const authUser = c.get('user')
    if (!authUser) {
      return c.json({ message: 'Unauthorized' }, HttpStatusCodes.UNAUTHORIZED)
    }

    const { id } = c.req.valid('param')
    try {
      const lesson = await dropInLessonsService.getDropInLessonById(Number(id))
      if (!lesson) {
        return c.json({ message: 'Drop-in lesson not found' }, HttpStatusCodes.NOT_FOUND)
      }
      return c.json(
        {
          message: 'Drop-in lesson retrieved successfully',
          success: true,
          data: lesson,
        },
        HttpStatusCodes.OK
      )
    } catch (error) {
      console.error('Error fetching drop-in lesson:', error)
      return c.json(
        { message: 'Failed to fetch drop-in lesson' },
        HttpStatusCodes.INTERNAL_SERVER_ERROR
      )
    }
  },

  getDropInLessonsByClass: async c => {
    const authUser = c.get('user')
    if (!authUser) {
      return c.json({ message: 'Unauthorized' }, HttpStatusCodes.UNAUTHORIZED)
    }

    const { classId } = c.req.valid('param')
    try {
      const lessons = await dropInLessonsService.getDropInLessonsByClass(Number(classId))
      return c.json(
        {
          message: 'Drop-in lessons retrieved successfully',
          success: true,
          data: lessons,
        },
        HttpStatusCodes.OK
      )
    } catch (error) {
      console.error('Error fetching drop-in lessons:', error)
      return c.json(
        { message: 'Failed to fetch drop-in lessons' },
        HttpStatusCodes.INTERNAL_SERVER_ERROR
      )
    }
  },

  updateDropInLesson: async c => {
    const authUser = c.get('user')
    if (!authUser) {
      return c.json({ message: 'Unauthorized' }, HttpStatusCodes.UNAUTHORIZED)
    }

    const { id } = c.req.valid('param')
    const body = await c.req.valid('json')
    try {
      const lesson = await dropInLessonsService.updateDropInLesson(Number(id), body)
      if (!lesson) {
        return c.json({ message: 'Drop-in lesson not found' }, HttpStatusCodes.NOT_FOUND)
      }
      return c.json(
        {
          message: 'Drop-in lesson updated successfully',
          success: true,
          data: lesson,
        },
        HttpStatusCodes.OK
      )
    } catch (error) {
      console.error('Error updating drop-in lesson:', error)
      return c.json(
        { message: 'Failed to update drop-in lesson' },
        HttpStatusCodes.INTERNAL_SERVER_ERROR
      )
    }
  },

  deleteDropInLesson: async c => {
    const authUser = c.get('user')
    if (!authUser) {
      return c.json({ message: 'Unauthorized' }, HttpStatusCodes.UNAUTHORIZED)
    }

    const { id } = c.req.valid('param')
    try {
      const deleted = await dropInLessonsService.deleteDropInLesson(Number(id))
      if (!deleted) {
        return c.json({ message: 'Drop-in lesson not found' }, HttpStatusCodes.NOT_FOUND)
      }
      return c.json(
        {
          message: 'Drop-in lesson deleted successfully',
          success: true,
        },
        HttpStatusCodes.OK
      )
    } catch (error) {
      console.error('Error deleting drop-in lesson:', error)
      return c.json(
        { message: 'Failed to delete drop-in lesson' },
        HttpStatusCodes.INTERNAL_SERVER_ERROR
      )
    }
  },
}
