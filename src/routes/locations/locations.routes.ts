import { createRoute, z } from '@hono/zod-openapi'
import * as HttpStatusCodes from 'stoker/http-status-codes'
import { jsonContent, jsonContentRequired } from 'stoker/openapi/helpers'
import { zodResponseSchema } from '~/lib/zod-helper'

export const CreateLocationBodySchema = z
  .object({
    name: z.string().min(1),
    address: z.string().min(1),
  })
  .openapi({ description: 'Payload to create a location' })

export const UpdateLocationBodySchema = CreateLocationBodySchema.partial()

export const LocationParamsSchema = z.object({
  id: z.string().openapi({ param: { name: 'id', in: 'path' } }),
})

export const LocationSchema = z.object({
  id: z.number(),
  name: z.string(),
  address: z.string(),
  createdAt: z.string(),
})

export const LocationListSchema = z.array(LocationSchema)

export const LOCATIONS_ROUTES = {
  createLocation: createRoute({
    method: 'post',
    tags: ['Locations'],
    path: '/',
    summary: 'Create a location',
    request: {
      body: jsonContentRequired(CreateLocationBodySchema, 'Location payload'),
    },
    responses: {
      [HttpStatusCodes.CREATED]: jsonContent(
        zodResponseSchema(LocationSchema),
        'Location created successfully'
      ),
      [HttpStatusCodes.UNAUTHORIZED]: jsonContent(zodResponseSchema(), 'Authentication required'),
      [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
        zodResponseSchema(),
        'Failed to create location'
      ),
    },
  }),

  getLocations: createRoute({
    method: 'get',
    tags: ['Locations'],
    path: '/',
    summary: 'Get all locations',
    responses: {
      [HttpStatusCodes.OK]: jsonContent(zodResponseSchema(LocationListSchema), 'List of locations'),
      [HttpStatusCodes.UNAUTHORIZED]: jsonContent(zodResponseSchema(), 'Authentication required'),
      [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
        zodResponseSchema(),
        'Failed to fetch locations'
      ),
    },
  }),

  getLocation: createRoute({
    method: 'get',
    tags: ['Locations'],
    path: '/{id}',
    summary: 'Get location by ID',
    request: {
      params: LocationParamsSchema,
    },
    responses: {
      [HttpStatusCodes.OK]: jsonContent(zodResponseSchema(LocationSchema), 'Location details'),
      [HttpStatusCodes.NOT_FOUND]: jsonContent(zodResponseSchema(), 'Location not found'),
      [HttpStatusCodes.UNAUTHORIZED]: jsonContent(zodResponseSchema(), 'Authentication required'),
      [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
        zodResponseSchema(),
        'Failed to fetch location'
      ),
    },
  }),

  updateLocation: createRoute({
    method: 'patch',
    tags: ['Locations'],
    path: '/{id}',
    summary: 'Update a location',
    request: {
      params: LocationParamsSchema,
      body: jsonContentRequired(UpdateLocationBodySchema, 'Location update payload'),
    },
    responses: {
      [HttpStatusCodes.OK]: jsonContent(
        zodResponseSchema(LocationSchema),
        'Location updated successfully'
      ),
      [HttpStatusCodes.NOT_FOUND]: jsonContent(zodResponseSchema(), 'Location not found'),
      [HttpStatusCodes.UNAUTHORIZED]: jsonContent(zodResponseSchema(), 'Authentication required'),
      [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
        zodResponseSchema(),
        'Failed to update location'
      ),
    },
  }),

  deleteLocation: createRoute({
    method: 'delete',
    tags: ['Locations'],
    path: '/{id}',
    summary: 'Delete a location',
    request: {
      params: LocationParamsSchema,
    },
    responses: {
      [HttpStatusCodes.OK]: jsonContent(
        zodResponseSchema(z.object({ success: z.boolean() })),
        'Location deleted successfully'
      ),
      [HttpStatusCodes.NOT_FOUND]: jsonContent(zodResponseSchema(), 'Location not found'),
      [HttpStatusCodes.UNAUTHORIZED]: jsonContent(zodResponseSchema(), 'Authentication required'),
      [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
        zodResponseSchema(),
        'Failed to delete location'
      ),
    },
  }),
}

export type LocationsRoutes = typeof LOCATIONS_ROUTES
