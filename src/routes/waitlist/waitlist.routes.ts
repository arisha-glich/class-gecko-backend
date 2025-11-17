import { createRoute, z } from '@hono/zod-openapi'
import * as HttpStatusCodes from 'stoker/http-status-codes'
import { jsonContent, jsonContentRequired } from 'stoker/openapi/helpers'
import { zodResponseSchema } from '~/lib/zod-helper'

// Request Schemas
export const CreateWaitlistBodySchema = z
  .object({
    termId: z.number().int().positive().optional(),
    studentId: z.number().int().positive(),
    classId: z.number().int().positive().optional(),
  })
  .openapi({ description: 'Payload to add to waitlist' })

export const UpdateWaitlistBodySchema = CreateWaitlistBodySchema.partial()

export const WaitlistParamsSchema = z.object({
  id: z.string().openapi({ param: { name: 'id', in: 'path' } }),
})

export const WaitlistByClassParamsSchema = z.object({
  classId: z.string().openapi({ param: { name: 'classId', in: 'path' } }),
})

// Response Schemas
export const WaitlistSchema = z.object({
  id: z.number(),
  termId: z.number().nullable(),
  userId: z.string(),
  studentId: z.number().nullable(),
  classId: z.number().nullable(),
  date: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const WaitlistListSchema = z.array(WaitlistSchema)

export const WAITLIST_ROUTES = {
  createWaitlist: createRoute({
    method: 'post',
    tags: ['Waitlist'],
    path: '/',
    summary: 'Add to waitlist',
    request: {
      body: jsonContentRequired(CreateWaitlistBodySchema, 'Waitlist creation payload'),
    },
    responses: {
      [HttpStatusCodes.CREATED]: jsonContent(
        zodResponseSchema(WaitlistSchema),
        'Added to waitlist successfully'
      ),
      [HttpStatusCodes.UNAUTHORIZED]: jsonContent(zodResponseSchema(), 'Authentication required'),
    },
  }),

  getWaitlist: createRoute({
    method: 'get',
    tags: ['Waitlist'],
    path: '/',
    summary: 'Get all waitlist entries',
    responses: {
      [HttpStatusCodes.OK]: jsonContent(
        zodResponseSchema(WaitlistListSchema),
        'List of waitlist entries'
      ),
    },
  }),

  getWaitlistEntry: createRoute({
    method: 'get',
    tags: ['Waitlist'],
    path: '/{id}',
    summary: 'Get a waitlist entry by ID',
    request: {
      params: WaitlistParamsSchema,
    },
    responses: {
      [HttpStatusCodes.OK]: jsonContent(
        zodResponseSchema(WaitlistSchema),
        'Waitlist entry details'
      ),
      [HttpStatusCodes.NOT_FOUND]: jsonContent(zodResponseSchema(), 'Waitlist entry not found'),
    },
  }),

  getWaitlistByClass: createRoute({
    method: 'get',
    tags: ['Waitlist'],
    path: '/class/{classId}',
    summary: 'Get all waitlist entries for a class',
    request: {
      params: WaitlistByClassParamsSchema,
    },
    responses: {
      [HttpStatusCodes.OK]: jsonContent(
        zodResponseSchema(WaitlistListSchema),
        'List of waitlist entries for the class'
      ),
    },
  }),

  updateWaitlist: createRoute({
    method: 'patch',
    tags: ['Waitlist'],
    path: '/{id}',
    summary: 'Update a waitlist entry',
    request: {
      params: WaitlistParamsSchema,
      body: jsonContentRequired(UpdateWaitlistBodySchema, 'Waitlist update payload'),
    },
    responses: {
      [HttpStatusCodes.OK]: jsonContent(
        zodResponseSchema(WaitlistSchema),
        'Waitlist entry updated successfully'
      ),
      [HttpStatusCodes.NOT_FOUND]: jsonContent(zodResponseSchema(), 'Waitlist entry not found'),
    },
  }),

  deleteWaitlist: createRoute({
    method: 'delete',
    tags: ['Waitlist'],
    path: '/{id}',
    summary: 'Remove from waitlist',
    request: {
      params: WaitlistParamsSchema,
    },
    responses: {
      [HttpStatusCodes.OK]: jsonContent(
        zodResponseSchema(z.object({ message: z.string() })),
        'Removed from waitlist successfully'
      ),
      [HttpStatusCodes.NOT_FOUND]: jsonContent(zodResponseSchema(), 'Waitlist entry not found'),
    },
  }),
}

export type WaitlistRoutes = typeof WAITLIST_ROUTES
