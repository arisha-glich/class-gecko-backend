import * as HttpStatusCodes from 'stoker/http-status-codes'
import type { LESSONS_ROUTES } from '~/routes/lessons/lessons.routes'
import * as lessonsService from '~/services/lessons.service'
import type { HandlerMapFromRoutes } from '~/types'

export const LESSONS_HANDLER: HandlerMapFromRoutes<typeof LESSONS_ROUTES> = {
  createLesson: async c => {
    const authUser = c.get('user')
    if (!authUser) {
      return c.json({ message: 'Unauthorized' }, HttpStatusCodes.UNAUTHORIZED)
    }

    const body = await c.req.valid('json')
    try {
      const lesson = await lessonsService.createLesson(body)
      return c.json(
        {
          message: 'Lesson created successfully',
          success: true,
          data: lesson,
        },
        HttpStatusCodes.CREATED
      )
    } catch (error) {
      console.error('Error creating lesson:', error)
      return c.json({ message: 'Failed to create lesson' }, HttpStatusCodes.INTERNAL_SERVER_ERROR)
    }
  },

  getLessons: async c => {
    const authUser = c.get('user')
    if (!authUser) {
      return c.json({ message: 'Unauthorized' }, HttpStatusCodes.UNAUTHORIZED)
    }

    try {
      const lessons = await lessonsService.getLessons()
      return c.json(
        {
          message: 'Lessons retrieved successfully',
          success: true,
          data: lessons,
        },
        HttpStatusCodes.OK
      )
    } catch (error) {
      console.error('Error fetching lessons:', error)
      return c.json({ message: 'Failed to fetch lessons' }, HttpStatusCodes.INTERNAL_SERVER_ERROR)
    }
  },

  getLesson: async c => {
    const authUser = c.get('user')
    if (!authUser) {
      return c.json({ message: 'Unauthorized' }, HttpStatusCodes.UNAUTHORIZED)
    }

    const { id } = c.req.valid('param')
    try {
      const lesson = await lessonsService.getLessonById(Number(id))
      if (!lesson) {
        return c.json({ message: 'Lesson not found' }, HttpStatusCodes.NOT_FOUND)
      }
      return c.json(
        {
          message: 'Lesson retrieved successfully',
          success: true,
          data: lesson,
        },
        HttpStatusCodes.OK
      )
    } catch (error) {
      console.error('Error fetching lesson:', error)
      return c.json({ message: 'Failed to fetch lesson' }, HttpStatusCodes.INTERNAL_SERVER_ERROR)
    }
  },

  getLessonsByClass: async c => {
    const authUser = c.get('user')
    if (!authUser) {
      return c.json({ message: 'Unauthorized' }, HttpStatusCodes.UNAUTHORIZED)
    }

    const { classId } = c.req.valid('param')
    try {
      const lessons = await lessonsService.getLessonsByClass(Number(classId))
      return c.json(
        {
          message: 'Lessons retrieved successfully',
          success: true,
          data: lessons,
        },
        HttpStatusCodes.OK
      )
    } catch (error) {
      console.error('Error fetching lessons:', error)
      return c.json({ message: 'Failed to fetch lessons' }, HttpStatusCodes.INTERNAL_SERVER_ERROR)
    }
  },

  updateLesson: async c => {
    const authUser = c.get('user')
    if (!authUser) {
      return c.json({ message: 'Unauthorized' }, HttpStatusCodes.UNAUTHORIZED)
    }

    const { id } = c.req.valid('param')
    const body = await c.req.valid('json')
    try {
      const lesson = await lessonsService.updateLesson(Number(id), body)
      if (!lesson) {
        return c.json({ message: 'Lesson not found' }, HttpStatusCodes.NOT_FOUND)
      }
      return c.json(
        {
          message: 'Lesson updated successfully',
          success: true,
          data: lesson,
        },
        HttpStatusCodes.OK
      )
    } catch (error) {
      console.error('Error updating lesson:', error)
      return c.json({ message: 'Failed to update lesson' }, HttpStatusCodes.INTERNAL_SERVER_ERROR)
    }
  },

  deleteLesson: async c => {
    const authUser = c.get('user')
    if (!authUser) {
      return c.json({ message: 'Unauthorized' }, HttpStatusCodes.UNAUTHORIZED)
    }

    const { id } = c.req.valid('param')
    try {
      const deleted = await lessonsService.deleteLesson(Number(id))
      if (!deleted) {
        return c.json({ message: 'Lesson not found' }, HttpStatusCodes.NOT_FOUND)
      }
      return c.json(
        {
          message: 'Lesson deleted successfully',
          success: true,
        },
        HttpStatusCodes.OK
      )
    } catch (error) {
      console.error('Error deleting lesson:', error)
      return c.json({ message: 'Failed to delete lesson' }, HttpStatusCodes.INTERNAL_SERVER_ERROR)
    }
  },
}
