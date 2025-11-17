import { createRoute, z } from '@hono/zod-openapi'
import * as HttpStatusCodes from 'stoker/http-status-codes'
import { jsonContent, jsonContentRequired } from 'stoker/openapi/helpers'
import { zodResponseSchema } from '~/lib/zod-helper'

// Request Schemas
export const CreateDropInLessonBodySchema = z
  .object({
    dropInClassId: z.number().int().positive(),
    title: z.string().min(1, 'Title is required'),
    status: z.string().default('scheduled'),
    notes: z.string().optional(),
    date: z.string().datetime(),
    startTime: z.string(),
    endTime: z.string().optional(),
    duration: z.number().int().positive(),
  })
  .openapi({ description: 'Payload to create a new drop-in lesson' })

export const UpdateDropInLessonBodySchema = CreateDropInLessonBodySchema.partial().extend({
  dropInClassId: z.number().int().positive().optional(),
})

export const DropInLessonParamsSchema = z.object({
  id: z.string().openapi({ param: { name: 'id', in: 'path' } }),
})

export const DropInLessonByClassParamsSchema = z.object({
  classId: z.string().openapi({ param: { name: 'classId', in: 'path' } }),
})

// Response Schemas
export const DropInLessonSchema = z.object({
  id: z.number(),
  dropInClassId: z.number(),
  title: z.string(),
  status: z.string(),
  notes: z.string().nullable(),
  date: z.string(),
  startTime: z.string(),
  endTime: z.string().nullable(),
  duration: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
  dropInClass: z
    .object({
      id: z.number(),
      title: z.string(),
      description: z.string().nullable(),
      startDate: z.string(),
      endDate: z.string(),
      teacher: z
        .object({
          id: z.number(),
          firstName: z.string(),
          lastName: z.string(),
          email: z.string(),
        })
        .nullable()
        .optional(),
      location: z
        .object({
          id: z.number(),
          name: z.string(),
          address: z.string(),
        })
        .nullable()
        .optional(),
    })
    .optional(),
})

export const DropInLessonListSchema = z.array(DropInLessonSchema)

export const DROPIN_LESSONS_ROUTES = {
  createDropInLesson: createRoute({
    method: 'post',
    tags: ['DropInLessons'],
    path: '/',
    summary: 'Create a new drop-in lesson',
    request: {
      body: jsonContentRequired(CreateDropInLessonBodySchema, 'Drop-in lesson creation payload'),
    },
    responses: {
      [HttpStatusCodes.CREATED]: jsonContent(
        zodResponseSchema(DropInLessonSchema),
        'Drop-in lesson created successfully'
      ),
      [HttpStatusCodes.UNAUTHORIZED]: jsonContent(zodResponseSchema(), 'Authentication required'),
      [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
        zodResponseSchema(),
        'Failed to create drop-in lesson'
      ),
    },
  }),

  getDropInLessons: createRoute({
    method: 'get',
    tags: ['DropInLessons'],
    path: '/',
    summary: 'Get all drop-in lessons',
    responses: {
      [HttpStatusCodes.OK]: jsonContent(
        zodResponseSchema(DropInLessonListSchema),
        'List of drop-in lessons'
      ),
      [HttpStatusCodes.UNAUTHORIZED]: jsonContent(zodResponseSchema(), 'Authentication required'),
      [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
        zodResponseSchema(),
        'Failed to fetch drop-in lessons'
      ),
    },
  }),

  getDropInLesson: createRoute({
    method: 'get',
    tags: ['DropInLessons'],
    path: '/{id}',
    summary: 'Get a drop-in lesson by ID',
    request: {
      params: DropInLessonParamsSchema,
    },
    responses: {
      [HttpStatusCodes.OK]: jsonContent(
        zodResponseSchema(DropInLessonSchema),
        'Drop-in lesson details'
      ),
      [HttpStatusCodes.NOT_FOUND]: jsonContent(zodResponseSchema(), 'Drop-in lesson not found'),
      [HttpStatusCodes.UNAUTHORIZED]: jsonContent(zodResponseSchema(), 'Authentication required'),
      [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
        zodResponseSchema(),
        'Failed to fetch drop-in lesson'
      ),
    },
  }),

  getDropInLessonsByClass: createRoute({
    method: 'get',
    tags: ['DropInLessons'],
    path: '/class/{classId}',
    summary: 'Get all lessons for a drop-in class',
    request: {
      params: DropInLessonByClassParamsSchema,
    },
    responses: {
      [HttpStatusCodes.OK]: jsonContent(
        zodResponseSchema(DropInLessonListSchema),
        'List of lessons for the drop-in class'
      ),
      [HttpStatusCodes.UNAUTHORIZED]: jsonContent(zodResponseSchema(), 'Authentication required'),
      [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
        zodResponseSchema(),
        'Failed to fetch drop-in lessons'
      ),
    },
  }),

  updateDropInLesson: createRoute({
    method: 'patch',
    tags: ['DropInLessons'],
    path: '/{id}',
    summary: 'Update a drop-in lesson',
    request: {
      params: DropInLessonParamsSchema,
      body: jsonContentRequired(UpdateDropInLessonBodySchema, 'Drop-in lesson update payload'),
    },
    responses: {
      [HttpStatusCodes.OK]: jsonContent(
        zodResponseSchema(DropInLessonSchema),
        'Drop-in lesson updated successfully'
      ),
      [HttpStatusCodes.NOT_FOUND]: jsonContent(zodResponseSchema(), 'Drop-in lesson not found'),
      [HttpStatusCodes.UNAUTHORIZED]: jsonContent(zodResponseSchema(), 'Authentication required'),
      [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
        zodResponseSchema(),
        'Failed to update drop-in lesson'
      ),
    },
  }),

  deleteDropInLesson: createRoute({
    method: 'delete',
    tags: ['DropInLessons'],
    path: '/{id}',
    summary: 'Delete a drop-in lesson',
    request: {
      params: DropInLessonParamsSchema,
    },
    responses: {
      [HttpStatusCodes.OK]: jsonContent(
        zodResponseSchema(z.object({ success: z.boolean() })),
        'Drop-in lesson deleted successfully'
      ),
      [HttpStatusCodes.NOT_FOUND]: jsonContent(zodResponseSchema(), 'Drop-in lesson not found'),
      [HttpStatusCodes.UNAUTHORIZED]: jsonContent(zodResponseSchema(), 'Authentication required'),
      [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
        zodResponseSchema(),
        'Failed to delete drop-in lesson'
      ),
    },
  }),
}

export type DropInLessonsRoutes = typeof DROPIN_LESSONS_ROUTES
