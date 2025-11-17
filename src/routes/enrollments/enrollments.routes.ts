import { createRoute, z } from '@hono/zod-openapi'
import * as HttpStatusCodes from 'stoker/http-status-codes'
import { jsonContent, jsonContentRequired } from 'stoker/openapi/helpers'
import { zodResponseSchema } from '~/lib/zod-helper'

// Request Schemas
export const CreateEnrollmentBodySchema = z
  .object({
    classId: z.number().int().positive(),
    termId: z.number().int().positive().optional(),
    studentId: z.number().int().positive(),
    enrollmentStartDate: z.string().datetime(),
    enrollmentEndDate: z.string().datetime(),
    paymentOption: z.string(), // Weekly, Monthly, Upfront, etc.
  })
  .openapi({ description: 'Payload to create a new enrollment' })

export const UpdateEnrollmentBodySchema = CreateEnrollmentBodySchema.partial()

export const EnrollmentParamsSchema = z.object({
  id: z.string().openapi({ param: { name: 'id', in: 'path' } }),
})

export const EnrollmentByClassParamsSchema = z.object({
  classId: z.string().openapi({ param: { name: 'classId', in: 'path' } }),
})

// Response Schemas
export const EnrollmentSchema = z.object({
  id: z.number(),
  userId: z.string(),
  classId: z.number(),
  termId: z.number().nullable(),
  studentId: z.number().nullable(),
  enrollmentStartDate: z.string().nullable(),
  enrollmentEndDate: z.string().nullable(),
  paymentOption: z.string().nullable(),
  status: z.string().nullable(),
  date: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const EnrollmentListSchema = z.array(EnrollmentSchema)

export const ENROLLMENTS_ROUTES = {
  createEnrollment: createRoute({
    method: 'post',
    tags: ['Enrollments'],
    path: '/',
    summary: 'Create a new enrollment',
    request: {
      body: jsonContentRequired(CreateEnrollmentBodySchema, 'Enrollment creation payload'),
    },
    responses: {
      [HttpStatusCodes.CREATED]: jsonContent(
        zodResponseSchema(EnrollmentSchema),
        'Enrollment created successfully'
      ),
      [HttpStatusCodes.UNAUTHORIZED]: jsonContent(zodResponseSchema(), 'Authentication required'),
    },
  }),

  getEnrollments: createRoute({
    method: 'get',
    tags: ['Enrollments'],
    path: '/',
    summary: 'Get all enrollments',
    responses: {
      [HttpStatusCodes.OK]: jsonContent(
        zodResponseSchema(EnrollmentListSchema),
        'List of enrollments'
      ),
    },
  }),

  getEnrollment: createRoute({
    method: 'get',
    tags: ['Enrollments'],
    path: '/{id}',
    summary: 'Get an enrollment by ID',
    request: {
      params: EnrollmentParamsSchema,
    },
    responses: {
      [HttpStatusCodes.OK]: jsonContent(zodResponseSchema(EnrollmentSchema), 'Enrollment details'),
      [HttpStatusCodes.NOT_FOUND]: jsonContent(zodResponseSchema(), 'Enrollment not found'),
    },
  }),

  getEnrollmentsByClass: createRoute({
    method: 'get',
    tags: ['Enrollments'],
    path: '/class/{classId}',
    summary: 'Get all enrollments for a class',
    request: {
      params: EnrollmentByClassParamsSchema,
    },
    responses: {
      [HttpStatusCodes.OK]: jsonContent(
        zodResponseSchema(EnrollmentListSchema),
        'List of enrollments for the class'
      ),
    },
  }),

  updateEnrollment: createRoute({
    method: 'patch',
    tags: ['Enrollments'],
    path: '/{id}',
    summary: 'Update an enrollment',
    request: {
      params: EnrollmentParamsSchema,
      body: jsonContentRequired(UpdateEnrollmentBodySchema, 'Enrollment update payload'),
    },
    responses: {
      [HttpStatusCodes.OK]: jsonContent(
        zodResponseSchema(EnrollmentSchema),
        'Enrollment updated successfully'
      ),
      [HttpStatusCodes.NOT_FOUND]: jsonContent(zodResponseSchema(), 'Enrollment not found'),
    },
  }),

  deleteEnrollment: createRoute({
    method: 'delete',
    tags: ['Enrollments'],
    path: '/{id}',
    summary: 'Delete an enrollment',
    request: {
      params: EnrollmentParamsSchema,
    },
    responses: {
      [HttpStatusCodes.OK]: jsonContent(
        zodResponseSchema(z.object({ message: z.string() })),
        'Enrollment deleted successfully'
      ),
      [HttpStatusCodes.NOT_FOUND]: jsonContent(zodResponseSchema(), 'Enrollment not found'),
    },
  }),
}

export type EnrollmentsRoutes = typeof ENROLLMENTS_ROUTES
