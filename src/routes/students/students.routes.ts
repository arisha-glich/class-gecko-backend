import { createRoute, z } from '@hono/zod-openapi'
import * as HttpStatusCodes from 'stoker/http-status-codes'
import { jsonContent, jsonContentRequired } from 'stoker/openapi/helpers'
import { zodResponseSchema } from '~/lib/zod-helper'

export const StudentSchema = z.object({
  id: z.number(),
  familyId: z.number().nullable(),
  firstName: z.string(),
  lastName: z.string(),
  dateOfBirth: z.string().nullable(),
  gender: z.string().nullable(),
  medicalInfo: z.string().nullable(),
  photoVideoConsent: z.boolean(),
  height: z.number().nullable(),
  neck: z.number().nullable(),
  girth: z.number().nullable(),
  chest: z.number().nullable(),
  braSize: z.string().nullable(),
  waist: z.number().nullable(),
  hips: z.number().nullable(),
  inseam: z.number().nullable(),
  shoeSize: z.string().nullable(),
  tshirtSize: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  family: z
    .object({
      id: z.number(),
      familyName: z.string(),
    })
    .nullable(),
})

export const StudentListSchema = z.array(StudentSchema)

export const UpdateStudentBodySchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  dateOfBirth: z.string().datetime().nullable().optional(),
  gender: z.string().optional(),
  medicalInfo: z.string().nullable().optional(),
  photoVideoConsent: z.boolean().optional(),
  height: z.number().nullable().optional(),
  neck: z.number().nullable().optional(),
  girth: z.number().nullable().optional(),
  chest: z.number().nullable().optional(),
  braSize: z.string().nullable().optional(),
  waist: z.number().nullable().optional(),
  hips: z.number().nullable().optional(),
  inseam: z.number().nullable().optional(),
  shoeSize: z.string().nullable().optional(),
  tshirtSize: z.string().nullable().optional(),
})

export const StudentParamsSchema = z.object({
  id: z.string().openapi({ param: { name: 'id', in: 'path' } }),
})

export const StudentFamilyParamsSchema = z.object({
  familyId: z.string().openapi({ param: { name: 'familyId', in: 'path' } }),
})

export const STUDENTS_ROUTES = {
  getStudents: createRoute({
    method: 'get',
    tags: ['Students'],
    path: '/',
    summary: 'Get all students for the organization',
    responses: {
      [HttpStatusCodes.OK]: jsonContent(zodResponseSchema(StudentListSchema), 'List of students'),
      [HttpStatusCodes.UNAUTHORIZED]: jsonContent(zodResponseSchema(), 'Authentication required'),
    },
  }),

  getStudent: createRoute({
    method: 'get',
    tags: ['Students'],
    path: '/{id}',
    summary: 'Get a student by ID',
    request: {
      params: StudentParamsSchema,
    },
    responses: {
      [HttpStatusCodes.OK]: jsonContent(zodResponseSchema(StudentSchema), 'Student details'),
      [HttpStatusCodes.NOT_FOUND]: jsonContent(zodResponseSchema(), 'Student not found'),
      [HttpStatusCodes.UNAUTHORIZED]: jsonContent(zodResponseSchema(), 'Authentication required'),
    },
  }),

  getStudentsByFamily: createRoute({
    method: 'get',
    tags: ['Students'],
    path: '/family/{familyId}',
    summary: 'Get students for a specific family',
    request: {
      params: StudentFamilyParamsSchema,
    },
    responses: {
      [HttpStatusCodes.OK]: jsonContent(
        zodResponseSchema(StudentListSchema),
        'List of students for family'
      ),
      [HttpStatusCodes.UNAUTHORIZED]: jsonContent(zodResponseSchema(), 'Authentication required'),
    },
  }),

  updateStudent: createRoute({
    method: 'patch',
    tags: ['Students'],
    path: '/{id}',
    summary: 'Update a student profile',
    request: {
      params: StudentParamsSchema,
      body: jsonContentRequired(UpdateStudentBodySchema, 'Student update payload'),
    },
    responses: {
      [HttpStatusCodes.OK]: jsonContent(
        zodResponseSchema(StudentSchema),
        'Student updated successfully'
      ),
      [HttpStatusCodes.NOT_FOUND]: jsonContent(zodResponseSchema(), 'Student not found'),
      [HttpStatusCodes.UNAUTHORIZED]: jsonContent(zodResponseSchema(), 'Authentication required'),
    },
  }),

  deleteStudent: createRoute({
    method: 'delete',
    tags: ['Students'],
    path: '/{id}',
    summary: 'Delete a student',
    request: {
      params: StudentParamsSchema,
    },
    responses: {
      [HttpStatusCodes.OK]: jsonContent(
        zodResponseSchema(z.object({ success: z.boolean() })),
        'Student deleted successfully'
      ),
      [HttpStatusCodes.NOT_FOUND]: jsonContent(zodResponseSchema(), 'Student not found'),
      [HttpStatusCodes.UNAUTHORIZED]: jsonContent(zodResponseSchema(), 'Authentication required'),
    },
  }),
}

export type StudentsRoutes = typeof STUDENTS_ROUTES
