import * as HttpStatusCodes from 'stoker/http-status-codes'
import type { ENROLLMENTS_ROUTES } from '~/routes/enrollments/enrollments.routes'
import * as enrollmentsService from '~/services/enrollments.service'
import type { HandlerMapFromRoutes } from '~/types'

export const ENROLLMENTS_HANDLER: HandlerMapFromRoutes<typeof ENROLLMENTS_ROUTES> = {
  createEnrollment: async c => {
    const authUser = c.get('user')
    if (!authUser) {
      return c.json({ message: 'Unauthorized' }, HttpStatusCodes.UNAUTHORIZED)
    }

    const body = await c.req.valid('json')
    try {
      const enrollment = await enrollmentsService.createEnrollment({
        userId: authUser.id,
        ...body,
      })
      return c.json(
        {
          message: 'Enrollment created successfully',
          success: true,
          data: enrollment,
        },
        HttpStatusCodes.CREATED
      )
    } catch (error) {
      console.error('Error creating enrollment:', error)
      return c.json(
        { message: 'Failed to create enrollment' },
        HttpStatusCodes.INTERNAL_SERVER_ERROR
      )
    }
  },

  getEnrollments: async c => {
    const authUser = c.get('user')
    if (!authUser) {
      return c.json({ message: 'Unauthorized' }, HttpStatusCodes.UNAUTHORIZED)
    }

    try {
      const enrollments = await enrollmentsService.getEnrollments(authUser.id)
      return c.json(
        {
          message: 'Enrollments retrieved successfully',
          success: true,
          data: enrollments,
        },
        HttpStatusCodes.OK
      )
    } catch (error) {
      console.error('Error fetching enrollments:', error)
      return c.json(
        { message: 'Failed to fetch enrollments' },
        HttpStatusCodes.INTERNAL_SERVER_ERROR
      )
    }
  },

  getEnrollment: async c => {
    const authUser = c.get('user')
    if (!authUser) {
      return c.json({ message: 'Unauthorized' }, HttpStatusCodes.UNAUTHORIZED)
    }

    const { id } = c.req.valid('param')
    try {
      const enrollment = await enrollmentsService.getEnrollmentById(Number(id))
      if (!enrollment) {
        return c.json({ message: 'Enrollment not found' }, HttpStatusCodes.NOT_FOUND)
      }
      return c.json(
        {
          message: 'Enrollment retrieved successfully',
          success: true,
          data: enrollment,
        },
        HttpStatusCodes.OK
      )
    } catch (error) {
      console.error('Error fetching enrollment:', error)
      return c.json(
        { message: 'Failed to fetch enrollment' },
        HttpStatusCodes.INTERNAL_SERVER_ERROR
      )
    }
  },

  getEnrollmentsByClass: async c => {
    const authUser = c.get('user')
    if (!authUser) {
      return c.json({ message: 'Unauthorized' }, HttpStatusCodes.UNAUTHORIZED)
    }

    const { classId } = c.req.valid('param')
    try {
      const enrollments = await enrollmentsService.getEnrollmentsByClass(Number(classId))
      return c.json(
        {
          message: 'Enrollments retrieved successfully',
          success: true,
          data: enrollments,
        },
        HttpStatusCodes.OK
      )
    } catch (error) {
      console.error('Error fetching enrollments:', error)
      return c.json(
        { message: 'Failed to fetch enrollments' },
        HttpStatusCodes.INTERNAL_SERVER_ERROR
      )
    }
  },

  updateEnrollment: async c => {
    const authUser = c.get('user')
    if (!authUser) {
      return c.json({ message: 'Unauthorized' }, HttpStatusCodes.UNAUTHORIZED)
    }

    const { id } = c.req.valid('param')
    const body = await c.req.valid('json')
    try {
      const enrollment = await enrollmentsService.updateEnrollment(Number(id), authUser.id, body)
      if (!enrollment) {
        return c.json({ message: 'Enrollment not found' }, HttpStatusCodes.NOT_FOUND)
      }
      return c.json(
        {
          message: 'Enrollment updated successfully',
          success: true,
          data: enrollment,
        },
        HttpStatusCodes.OK
      )
    } catch (error) {
      console.error('Error updating enrollment:', error)
      return c.json(
        { message: 'Failed to update enrollment' },
        HttpStatusCodes.INTERNAL_SERVER_ERROR
      )
    }
  },

  deleteEnrollment: async c => {
    const authUser = c.get('user')
    if (!authUser) {
      return c.json({ message: 'Unauthorized' }, HttpStatusCodes.UNAUTHORIZED)
    }

    const { id } = c.req.valid('param')
    try {
      const deleted = await enrollmentsService.deleteEnrollment(Number(id), authUser.id)
      if (!deleted) {
        return c.json({ message: 'Enrollment not found' }, HttpStatusCodes.NOT_FOUND)
      }
      return c.json(
        {
          message: 'Enrollment deleted successfully',
          success: true,
        },
        HttpStatusCodes.OK
      )
    } catch (error) {
      console.error('Error deleting enrollment:', error)
      return c.json(
        { message: 'Failed to delete enrollment' },
        HttpStatusCodes.INTERNAL_SERVER_ERROR
      )
    }
  },
}
