import { createRoute, z } from '@hono/zod-openapi'
import * as HttpStatusCodes from 'stoker/http-status-codes'
import { jsonContent, jsonContentRequired } from 'stoker/openapi/helpers'
import { zodResponseSchema } from '~/lib/zod-helper'

// Request Schemas
export const CreateLessonBodySchema = z
  .object({
    classId: z.number().int().positive(),
    title: z.string().min(1, 'Title is required'),
    isTrial: z.boolean().default(false),
    status: z.string().default('scheduled'),
    attendanceId: z.string().optional(),
    notes: z.string().optional(),
    date: z.string().datetime(),
    startTime: z.string(),
    endTime: z.string().optional(),
    duration: z.number().int().positive(),
  })
  .openapi({ description: 'Payload to create a new lesson' })

export const UpdateLessonBodySchema = CreateLessonBodySchema.partial().extend({
  classId: z.number().int().positive().optional(),
})

export const LessonParamsSchema = z.object({
  id: z.string().openapi({ param: { name: 'id', in: 'path' } }),
})

export const LessonByClassParamsSchema = z.object({
  classId: z.string().openapi({ param: { name: 'classId', in: 'path' } }),
})

// Response Schemas
export const LessonSchema = z.object({
  id: z.number(),
  classId: z.number(),
  title: z.string(),
  isTrial: z.boolean(),
  status: z.string(),
  attendanceId: z.string().nullable(),
  notes: z.string().nullable(),
  date: z.string(),
  startTime: z.string(),
  endTime: z.string().nullable(),
  duration: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const LessonListSchema = z.array(LessonSchema)

export const LESSONS_ROUTES = {
  createLesson: createRoute({
    method: 'post',
    tags: ['Lessons'],
    path: '/',
    summary: 'Create a new lesson',
    request: {
      body: jsonContentRequired(CreateLessonBodySchema, 'Lesson creation payload'),
    },
    responses: {
      [HttpStatusCodes.CREATED]: jsonContent(
        zodResponseSchema(LessonSchema),
        'Lesson created successfully'
      ),
      [HttpStatusCodes.UNAUTHORIZED]: jsonContent(zodResponseSchema(), 'Authentication required'),
    },
  }),

  getLessons: createRoute({
    method: 'get',
    tags: ['Lessons'],
    path: '/',
    summary: 'Get all lessons',
    responses: {
      [HttpStatusCodes.OK]: jsonContent(zodResponseSchema(LessonListSchema), 'List of lessons'),
    },
  }),

  getLesson: createRoute({
    method: 'get',
    tags: ['Lessons'],
    path: '/{id}',
    summary: 'Get a lesson by ID',
    request: {
      params: LessonParamsSchema,
    },
    responses: {
      [HttpStatusCodes.OK]: jsonContent(zodResponseSchema(LessonSchema), 'Lesson details'),
      [HttpStatusCodes.NOT_FOUND]: jsonContent(zodResponseSchema(), 'Lesson not found'),
    },
  }),

  getLessonsByClass: createRoute({
    method: 'get',
    tags: ['Lessons'],
    path: '/class/{classId}',
    summary: 'Get all lessons for a class',
    request: {
      params: LessonByClassParamsSchema,
    },
    responses: {
      [HttpStatusCodes.OK]: jsonContent(
        zodResponseSchema(LessonListSchema),
        'List of lessons for the class'
      ),
    },
  }),

  updateLesson: createRoute({
    method: 'patch',
    tags: ['Lessons'],
    path: '/{id}',
    summary: 'Update a lesson',
    request: {
      params: LessonParamsSchema,
      body: jsonContentRequired(UpdateLessonBodySchema, 'Lesson update payload'),
    },
    responses: {
      [HttpStatusCodes.OK]: jsonContent(
        zodResponseSchema(LessonSchema),
        'Lesson updated successfully'
      ),
      [HttpStatusCodes.NOT_FOUND]: jsonContent(zodResponseSchema(), 'Lesson not found'),
    },
  }),

  deleteLesson: createRoute({
    method: 'delete',
    tags: ['Lessons'],
    path: '/{id}',
    summary: 'Delete a lesson',
    request: {
      params: LessonParamsSchema,
    },
    responses: {
      [HttpStatusCodes.OK]: jsonContent(
        zodResponseSchema(z.object({ message: z.string() })),
        'Lesson deleted successfully'
      ),
      [HttpStatusCodes.NOT_FOUND]: jsonContent(zodResponseSchema(), 'Lesson not found'),
    },
  }),
}

export type LessonsRoutes = typeof LESSONS_ROUTES
