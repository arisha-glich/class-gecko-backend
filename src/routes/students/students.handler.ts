import * as HttpStatusCodes from 'stoker/http-status-codes'
import type { STUDENTS_ROUTES } from '~/routes/students/students.routes'
import {
  deleteStudent as deleteStudentService,
  getStudentById,
  getStudentsByFamily as getStudentsByFamilyService,
  getStudents as getStudentsService,
  updateStudent as updateStudentService,
} from '~/services/students.service'
import type { HandlerMapFromRoutes } from '~/types'

export const STUDENTS_HANDLER: HandlerMapFromRoutes<typeof STUDENTS_ROUTES> = {
  getStudents: async c => {
    const authUser = c.get('user')
    if (!authUser) {
      return c.json({ message: 'Unauthorized' }, HttpStatusCodes.UNAUTHORIZED)
    }

    const students = await getStudentsService(authUser.id)
    return c.json(
      {
        message: 'Students retrieved successfully',
        success: true,
        data: students,
      },
      HttpStatusCodes.OK
    )
  },

  getStudent: async c => {
    const authUser = c.get('user')
    if (!authUser) {
      return c.json({ message: 'Unauthorized' }, HttpStatusCodes.UNAUTHORIZED)
    }

    const { id } = c.req.valid('param')
    const student = await getStudentById(Number(id), authUser.id)
    if (!student) {
      return c.json({ message: 'Student not found' }, HttpStatusCodes.NOT_FOUND)
    }

    return c.json(
      {
        message: 'Student retrieved successfully',
        success: true,
        data: student,
      },
      HttpStatusCodes.OK
    )
  },

  getStudentsByFamily: async c => {
    const authUser = c.get('user')
    if (!authUser) {
      return c.json({ message: 'Unauthorized' }, HttpStatusCodes.UNAUTHORIZED)
    }

    const { familyId } = c.req.valid('param')
    const students = await getStudentsByFamilyService(Number(familyId), authUser.id)
    return c.json(
      {
        message: 'Students retrieved successfully',
        success: true,
        data: students,
      },
      HttpStatusCodes.OK
    )
  },

  updateStudent: async c => {
    const authUser = c.get('user')
    if (!authUser) {
      return c.json({ message: 'Unauthorized' }, HttpStatusCodes.UNAUTHORIZED)
    }

    const { id } = c.req.valid('param')
    const body = await c.req.valid('json')
    const student = await updateStudentService(Number(id), authUser.id, body)
    if (!student) {
      return c.json({ message: 'Student not found' }, HttpStatusCodes.NOT_FOUND)
    }

    return c.json(
      {
        message: 'Student updated successfully',
        success: true,
        data: student,
      },
      HttpStatusCodes.OK
    )
  },

  deleteStudent: async c => {
    const authUser = c.get('user')
    if (!authUser) {
      return c.json({ message: 'Unauthorized' }, HttpStatusCodes.UNAUTHORIZED)
    }

    const { id } = c.req.valid('param')
    const deleted = await deleteStudentService(Number(id), authUser.id)
    if (!deleted) {
      return c.json({ message: 'Student not found' }, HttpStatusCodes.NOT_FOUND)
    }

    return c.json(
      {
        message: 'Student deleted successfully',
        success: true,
        data: { success: true },
      },
      HttpStatusCodes.OK
    )
  },
}
