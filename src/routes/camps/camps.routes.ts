import { createRoute, z } from '@hono/zod-openapi'
import * as HttpStatusCodes from 'stoker/http-status-codes'
import { jsonContent, jsonContentRequired } from 'stoker/openapi/helpers'
import { zodResponseSchema } from '~/lib/zod-helper'

export const CreateCampBodySchema = z
  .object({
    title: z.string().min(1, 'Camp title is required'),
    startDate: z.string().datetime(),
    endDate: z.string().datetime().optional(),
    allowParentsToBookIndividualDays: z.boolean().optional().default(false),
    allowParentsToBookHalfDaySession: z.boolean().optional().default(false),
    offerEarlyDropoff: z.boolean().optional().default(false),
    offerLatePickup: z.boolean().optional().default(false),
  })
  .openapi({ description: 'Payload to create a camp' })

export const UpdateCampBodySchema = z
  .object({
    title: z.string().min(1).optional(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().nullable().optional(),
    allowParentsToBookIndividualDays: z.boolean().optional(),
    allowParentsToBookHalfDaySession: z.boolean().optional(),
    offerEarlyDropoff: z.boolean().optional(),
    offerLatePickup: z.boolean().optional(),
  })
  .openapi({ description: 'Payload to update a camp' })

export const CampParamsSchema = z.object({
  id: z.string().openapi({ param: { name: 'id', in: 'path' } }),
})

export const CampSchema = z.object({
  id: z.number(),
  userId: z.string(),
  title: z.string(),
  startDate: z.string(),
  endDate: z.string().nullable(),
  allowParentsToBookIndividualDays: z.boolean(),
  allowParentsToBookHalfDaySession: z.boolean(),
  offerEarlyDropoff: z.boolean(),
  offerLatePickup: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const CampListSchema = z.array(CampSchema)

export const CAMPS_ROUTES = {
  createCamp: createRoute({
    method: 'post',
    tags: ['Camps'],
    path: '/',
    summary: 'Create a new camp',
    request: {
      body: jsonContentRequired(CreateCampBodySchema, 'Camp creation payload'),
    },
    responses: {
      [HttpStatusCodes.CREATED]: jsonContent(
        zodResponseSchema(CampSchema),
        'Camp created successfully'
      ),
      [HttpStatusCodes.UNAUTHORIZED]: jsonContent(zodResponseSchema(), 'Authentication required'),
      [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
        zodResponseSchema(),
        'Failed to create camp'
      ),
    },
  }),

  getCamps: createRoute({
    method: 'get',
    tags: ['Camps'],
    path: '/',
    summary: 'Get all camps for the current user',
    responses: {
      [HttpStatusCodes.OK]: jsonContent(zodResponseSchema(CampListSchema), 'List of camps'),
      [HttpStatusCodes.UNAUTHORIZED]: jsonContent(zodResponseSchema(), 'Authentication required'),
      [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
        zodResponseSchema(),
        'Failed to fetch camps'
      ),
    },
  }),

  getCamp: createRoute({
    method: 'get',
    tags: ['Camps'],
    path: '/{id}',
    summary: 'Get a camp by ID',
    request: {
      params: CampParamsSchema,
    },
    responses: {
      [HttpStatusCodes.OK]: jsonContent(zodResponseSchema(CampSchema), 'Camp details'),
      [HttpStatusCodes.NOT_FOUND]: jsonContent(zodResponseSchema(), 'Camp not found'),
      [HttpStatusCodes.UNAUTHORIZED]: jsonContent(zodResponseSchema(), 'Authentication required'),
      [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
        zodResponseSchema(),
        'Failed to fetch camp'
      ),
    },
  }),

  updateCamp: createRoute({
    method: 'patch',
    tags: ['Camps'],
    path: '/{id}',
    summary: 'Update a camp',
    request: {
      params: CampParamsSchema,
      body: jsonContentRequired(UpdateCampBodySchema, 'Camp update payload'),
    },
    responses: {
      [HttpStatusCodes.OK]: jsonContent(zodResponseSchema(CampSchema), 'Camp updated successfully'),
      [HttpStatusCodes.NOT_FOUND]: jsonContent(zodResponseSchema(), 'Camp not found'),
      [HttpStatusCodes.UNAUTHORIZED]: jsonContent(zodResponseSchema(), 'Authentication required'),
      [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
        zodResponseSchema(),
        'Failed to update camp'
      ),
    },
  }),

  deleteCamp: createRoute({
    method: 'delete',
    tags: ['Camps'],
    path: '/{id}',
    summary: 'Delete a camp',
    request: {
      params: CampParamsSchema,
    },
    responses: {
      [HttpStatusCodes.OK]: jsonContent(
        zodResponseSchema(z.object({ message: z.string() })),
        'Camp deleted successfully'
      ),
      [HttpStatusCodes.NOT_FOUND]: jsonContent(zodResponseSchema(), 'Camp not found'),
      [HttpStatusCodes.UNAUTHORIZED]: jsonContent(zodResponseSchema(), 'Authentication required'),
      [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
        zodResponseSchema(),
        'Failed to delete camp'
      ),
    },
  }),
}

export type CampsRoutes = typeof CAMPS_ROUTES
