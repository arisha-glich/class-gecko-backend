import { createRoute, z } from '@hono/zod-openapi'
import * as HttpStatusCodes from 'stoker/http-status-codes'
import { jsonContent, jsonContentRequired } from 'stoker/openapi/helpers'
import { zodResponseSchema } from '~/lib/zod-helper'

// Request Schemas
export const CreateTrialBodySchema = z
  .object({
    classId: z.number().int().positive(),
    termId: z.number().int().positive().optional(),
    studentId: z.number().int().positive(),
    lessonId: z.number().int().positive().optional(),
    date: z.string().datetime().optional(),
    status: z.string().default('pending'),
    notes: z.string().optional(),
  })
  .openapi({ description: 'Payload to create a new trial' })

export const UpdateTrialBodySchema = CreateTrialBodySchema.partial().extend({
  classId: z.number().int().positive().optional(),
  studentId: z.number().int().positive().optional(),
})

export const TrialParamsSchema = z.object({
  id: z.string().openapi({ param: { name: 'id', in: 'path' } }),
})

export const TrialByClassParamsSchema = z.object({
  classId: z.string().openapi({ param: { name: 'classId', in: 'path' } }),
})

// Response Schemas
export const TrialSchema = z.object({
  id: z.number(),
  userId: z.string(),
  classId: z.number(),
  termId: z.number().nullable(),
  studentId: z.number().nullable(),
  lessonId: z.number().nullable(),
  date: z.string().nullable(),
  status: z.string(),
  notes: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const TrialListSchema = z.array(TrialSchema)

export const TRIALS_ROUTES = {
  createTrial: createRoute({
    method: 'post',
    tags: ['Trials'],
    path: '/',
    summary: 'Create a new trial',
    request: {
      body: jsonContentRequired(CreateTrialBodySchema, 'Trial creation payload'),
    },
    responses: {
      [HttpStatusCodes.CREATED]: jsonContent(
        zodResponseSchema(TrialSchema),
        'Trial created successfully'
      ),
      [HttpStatusCodes.UNAUTHORIZED]: jsonContent(zodResponseSchema(), 'Authentication required'),
    },
  }),

  getTrials: createRoute({
    method: 'get',
    tags: ['Trials'],
    path: '/',
    summary: 'Get all trials',
    responses: {
      [HttpStatusCodes.OK]: jsonContent(zodResponseSchema(TrialListSchema), 'List of trials'),
    },
  }),

  getTrial: createRoute({
    method: 'get',
    tags: ['Trials'],
    path: '/{id}',
    summary: 'Get a trial by ID',
    request: {
      params: TrialParamsSchema,
    },
    responses: {
      [HttpStatusCodes.OK]: jsonContent(zodResponseSchema(TrialSchema), 'Trial details'),
      [HttpStatusCodes.NOT_FOUND]: jsonContent(zodResponseSchema(), 'Trial not found'),
    },
  }),

  getTrialsByClass: createRoute({
    method: 'get',
    tags: ['Trials'],
    path: '/class/{classId}',
    summary: 'Get all trials for a class',
    request: {
      params: TrialByClassParamsSchema,
    },
    responses: {
      [HttpStatusCodes.OK]: jsonContent(
        zodResponseSchema(TrialListSchema),
        'List of trials for the class'
      ),
    },
  }),

  updateTrial: createRoute({
    method: 'patch',
    tags: ['Trials'],
    path: '/{id}',
    summary: 'Update a trial',
    request: {
      params: TrialParamsSchema,
      body: jsonContentRequired(UpdateTrialBodySchema, 'Trial update payload'),
    },
    responses: {
      [HttpStatusCodes.OK]: jsonContent(
        zodResponseSchema(TrialSchema),
        'Trial updated successfully'
      ),
      [HttpStatusCodes.NOT_FOUND]: jsonContent(zodResponseSchema(), 'Trial not found'),
    },
  }),

  deleteTrial: createRoute({
    method: 'delete',
    tags: ['Trials'],
    path: '/{id}',
    summary: 'Delete a trial',
    request: {
      params: TrialParamsSchema,
    },
    responses: {
      [HttpStatusCodes.OK]: jsonContent(
        zodResponseSchema(z.object({ message: z.string() })),
        'Trial deleted successfully'
      ),
      [HttpStatusCodes.NOT_FOUND]: jsonContent(zodResponseSchema(), 'Trial not found'),
    },
  }),
}

export type TrialsRoutes = typeof TRIALS_ROUTES
