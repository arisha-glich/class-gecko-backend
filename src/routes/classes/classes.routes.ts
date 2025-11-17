import { createRoute, z } from '@hono/zod-openapi'
import * as HttpStatusCodes from 'stoker/http-status-codes'
import { jsonContent, jsonContentRequired } from 'stoker/openapi/helpers'
import { zodResponseSchema } from '~/lib/zod-helper'

// Request Schemas
export const CreateClassBodySchema = z
  .object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(),
    startDate: z.string().datetime(),
    endDate: z.string().datetime(),
    frequency: z.enum(['DAILY', 'WEEKLY', 'MONTHLY']),
    recurringDay: z.string().optional(), // Day of week
    startTimeOfClass: z.string(),
    endTimeOfClass: z.string().optional(),
    duration: z.number().int().positive(),
    pricingPerLesson: z.number().positive(),
    classImage: z.string().url().optional(),
    locationId: z.number().int().optional(),
    teacherId: z.number().int().optional(),
    minimumAge: z.number().int().optional(),
    maximumAge: z.number().int().optional(),
    classColor: z.string().optional(),
    limitCapacity: z.boolean().default(false),
    capacity: z.number().int().positive().optional(),
    allowPortalBooking: z.boolean().default(true),
    familyPortalTrial: z.boolean().default(false),
    globalClassDiscount: z.boolean().default(false),
    siblingDiscount: z.boolean().default(false),
    classType: z.enum(['ONGOING_CLASS', 'DROP_CLASS']).default('ONGOING_CLASS'),
    termId: z.number().int().optional(),
  })
  .openapi({ description: 'Payload to create a new class' })

export const UpdateClassBodySchema = CreateClassBodySchema.partial()

export const ClassParamsSchema = z.object({
  id: z.string().openapi({ param: { name: 'id', in: 'path' } }),
})

// Response Schemas
export const ClassSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string().nullable(),
  startDate: z.string(),
  endDate: z.string(),
  frequency: z.string(),
  recurringDay: z.string().nullable(),
  startTimeOfClass: z.string(),
  endTimeOfClass: z.string().nullable(),
  duration: z.number(),
  pricingPerLesson: z.number(),
  classImage: z.string().nullable(),
  locationId: z.number().nullable(),
  teacherId: z.number().nullable(),
  minimumAge: z.number().nullable(),
  maximumAge: z.number().nullable(),
  classColor: z.string().nullable(),
  limitCapacity: z.boolean(),
  capacity: z.number().nullable(),
  allowPortalBooking: z.boolean(),
  familyPortalTrial: z.boolean(),
  globalClassDiscount: z.boolean(),
  siblingDiscount: z.boolean(),
  classType: z.string(),
  termId: z.number().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const ClassListSchema = z.array(ClassSchema)

export const CLASSES_ROUTES = {
  createClass: createRoute({
    method: 'post',
    tags: ['Classes'],
    path: '/',
    summary: 'Create a new class',
    request: {
      body: jsonContentRequired(CreateClassBodySchema, 'Class creation payload'),
    },
    responses: {
      [HttpStatusCodes.CREATED]: jsonContent(
        zodResponseSchema(ClassSchema),
        'Class created successfully'
      ),
      [HttpStatusCodes.UNAUTHORIZED]: jsonContent(zodResponseSchema(), 'Authentication required'),
    },
  }),

  getClasses: createRoute({
    method: 'get',
    tags: ['Classes'],
    path: '/',
    summary: 'Get all classes',
    responses: {
      [HttpStatusCodes.OK]: jsonContent(zodResponseSchema(ClassListSchema), 'List of classes'),
      [HttpStatusCodes.UNAUTHORIZED]: jsonContent(zodResponseSchema(), 'Authentication required'),
      [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
        zodResponseSchema(),
        'Failed to fetch classes'
      ),
    },
  }),

  getClass: createRoute({
    method: 'get',
    tags: ['Classes'],
    path: '/{id}',
    summary: 'Get a class by ID',
    request: {
      params: ClassParamsSchema,
    },
    responses: {
      [HttpStatusCodes.OK]: jsonContent(zodResponseSchema(ClassSchema), 'Class details'),
      [HttpStatusCodes.NOT_FOUND]: jsonContent(zodResponseSchema(), 'Class not found'),
      [HttpStatusCodes.UNAUTHORIZED]: jsonContent(zodResponseSchema(), 'Authentication required'),
      [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
        zodResponseSchema(),
        'Failed to fetch class'
      ),
    },
  }),

  updateClass: createRoute({
    method: 'patch',
    tags: ['Classes'],
    path: '/{id}',
    summary: 'Update a class',
    request: {
      params: ClassParamsSchema,
      body: jsonContentRequired(UpdateClassBodySchema, 'Class update payload'),
    },
    responses: {
      [HttpStatusCodes.OK]: jsonContent(
        zodResponseSchema(ClassSchema),
        'Class updated successfully'
      ),
      [HttpStatusCodes.NOT_FOUND]: jsonContent(zodResponseSchema(), 'Class not found'),
      [HttpStatusCodes.UNAUTHORIZED]: jsonContent(zodResponseSchema(), 'Authentication required'),
      [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
        zodResponseSchema(),
        'Failed to update class'
      ),
    },
  }),

  deleteClass: createRoute({
    method: 'delete',
    tags: ['Classes'],
    path: '/{id}',
    summary: 'Delete a class',
    request: {
      params: ClassParamsSchema,
    },
    responses: {
      [HttpStatusCodes.OK]: jsonContent(
        zodResponseSchema(z.object({ message: z.string() })),
        'Class deleted successfully'
      ),
      [HttpStatusCodes.NOT_FOUND]: jsonContent(zodResponseSchema(), 'Class not found'),
      [HttpStatusCodes.UNAUTHORIZED]: jsonContent(zodResponseSchema(), 'Authentication required'),
      [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
        zodResponseSchema(),
        'Failed to delete class'
      ),
    },
  }),

  getClassesByTerm: createRoute({
    method: 'get',
    tags: ['Classes'],
    path: '/term/{termId}',
    summary: 'Get all classes for a term',
    request: {
      params: z.object({
        termId: z.string().openapi({ param: { name: 'termId', in: 'path' } }),
      }),
    },
    responses: {
      [HttpStatusCodes.OK]: jsonContent(
        zodResponseSchema(ClassListSchema),
        'List of classes for the term'
      ),
      [HttpStatusCodes.UNAUTHORIZED]: jsonContent(zodResponseSchema(), 'Authentication required'),
      [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
        zodResponseSchema(),
        'Failed to fetch classes'
      ),
    },
  }),
}

export type ClassesRoutes = typeof CLASSES_ROUTES
