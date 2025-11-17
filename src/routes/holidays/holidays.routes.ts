import { createRoute, z } from '@hono/zod-openapi'
import * as HttpStatusCodes from 'stoker/http-status-codes'
import { jsonContent, jsonContentRequired } from 'stoker/openapi/helpers'
import { zodResponseSchema } from '~/lib/zod-helper'

export const CreateHolidayBodySchema = z
  .object({
    name: z.string().min(1),
    isRecurring: z.boolean().optional(),
    affectsClass: z.boolean().optional(),
    startDate: z.string().datetime(),
    endDate: z.string().datetime(),
  })
  .openapi({ description: 'Payload to create a holiday' })

export const UpdateHolidayBodySchema = CreateHolidayBodySchema.partial()

export const HolidayParamsSchema = z.object({
  id: z.string().openapi({ param: { name: 'id', in: 'path' } }),
})

export const HolidaySchema = z.object({
  id: z.number(),
  userId: z.string(),
  name: z.string(),
  isRecurring: z.boolean(),
  affectsClass: z.boolean(),
  startDate: z.string(),
  endDate: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const HolidayListSchema = z.array(HolidaySchema)

export const HOLIDAYS_ROUTES = {
  createHoliday: createRoute({
    method: 'post',
    tags: ['Holidays'],
    path: '/',
    summary: 'Create a holiday',
    request: {
      body: jsonContentRequired(CreateHolidayBodySchema, 'Holiday payload'),
    },
    responses: {
      [HttpStatusCodes.CREATED]: jsonContent(
        zodResponseSchema(HolidaySchema),
        'Holiday created successfully'
      ),
      [HttpStatusCodes.UNAUTHORIZED]: jsonContent(zodResponseSchema(), 'Authentication required'),
      [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
        zodResponseSchema(),
        'Failed to create holiday'
      ),
    },
  }),

  getHolidays: createRoute({
    method: 'get',
    tags: ['Holidays'],
    path: '/',
    summary: 'Get all holidays',
    responses: {
      [HttpStatusCodes.OK]: jsonContent(zodResponseSchema(HolidayListSchema), 'List of holidays'),
      [HttpStatusCodes.UNAUTHORIZED]: jsonContent(zodResponseSchema(), 'Authentication required'),
      [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
        zodResponseSchema(),
        'Failed to fetch holidays'
      ),
    },
  }),

  getHoliday: createRoute({
    method: 'get',
    tags: ['Holidays'],
    path: '/{id}',
    summary: 'Get holiday by ID',
    request: {
      params: HolidayParamsSchema,
    },
    responses: {
      [HttpStatusCodes.OK]: jsonContent(zodResponseSchema(HolidaySchema), 'Holiday details'),
      [HttpStatusCodes.NOT_FOUND]: jsonContent(zodResponseSchema(), 'Holiday not found'),
      [HttpStatusCodes.UNAUTHORIZED]: jsonContent(zodResponseSchema(), 'Authentication required'),
      [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
        zodResponseSchema(),
        'Failed to fetch holiday'
      ),
    },
  }),

  updateHoliday: createRoute({
    method: 'patch',
    tags: ['Holidays'],
    path: '/{id}',
    summary: 'Update a holiday',
    request: {
      params: HolidayParamsSchema,
      body: jsonContentRequired(UpdateHolidayBodySchema, 'Holiday update payload'),
    },
    responses: {
      [HttpStatusCodes.OK]: jsonContent(
        zodResponseSchema(HolidaySchema),
        'Holiday updated successfully'
      ),
      [HttpStatusCodes.NOT_FOUND]: jsonContent(zodResponseSchema(), 'Holiday not found'),
      [HttpStatusCodes.UNAUTHORIZED]: jsonContent(zodResponseSchema(), 'Authentication required'),
      [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
        zodResponseSchema(),
        'Failed to update holiday'
      ),
    },
  }),

  deleteHoliday: createRoute({
    method: 'delete',
    tags: ['Holidays'],
    path: '/{id}',
    summary: 'Delete a holiday',
    request: {
      params: HolidayParamsSchema,
    },
    responses: {
      [HttpStatusCodes.OK]: jsonContent(
        zodResponseSchema(z.object({ success: z.boolean() })),
        'Holiday deleted successfully'
      ),
      [HttpStatusCodes.NOT_FOUND]: jsonContent(zodResponseSchema(), 'Holiday not found'),
      [HttpStatusCodes.UNAUTHORIZED]: jsonContent(zodResponseSchema(), 'Authentication required'),
      [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
        zodResponseSchema(),
        'Failed to delete holiday'
      ),
    },
  }),
}

export type HolidaysRoutes = typeof HOLIDAYS_ROUTES
