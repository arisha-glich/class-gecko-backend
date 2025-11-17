import { createRoute, z } from '@hono/zod-openapi'
import * as HttpStatusCodes from 'stoker/http-status-codes'
import { jsonContent, jsonContentRequired } from 'stoker/openapi/helpers'
import { zodResponseSchema } from '~/lib/zod-helper'

export const CreateRegistrationFeeBodySchema = z
  .object({
    title: z.string().min(1),
    pricePerStudent: z.number().positive(),
    maxPerFamily: z.number().positive().optional(),
    renewalType: z.string(),
    renewalDate: z.string().datetime().optional(),
    isActive: z.boolean().optional(),
  })
  .openapi({ description: 'Payload to create a registration fee' })

export const UpdateRegistrationFeeBodySchema = CreateRegistrationFeeBodySchema.partial()

export const RegistrationFeeParamsSchema = z.object({
  id: z.string().openapi({ param: { name: 'id', in: 'path' } }),
})

export const RegistrationFeeSchema = z.object({
  id: z.number(),
  userId: z.string(),
  title: z.string(),
  pricePerStudent: z.number(),
  maxPerFamily: z.number().nullable(),
  renewalType: z.string(),
  renewalDate: z.string().nullable(),
  isActive: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const RegistrationFeeListSchema = z.array(RegistrationFeeSchema)

export const REGISTRATION_FEES_ROUTES = {
  createRegistrationFee: createRoute({
    method: 'post',
    tags: ['RegistrationFees'],
    path: '/',
    summary: 'Create a registration fee',
    request: {
      body: jsonContentRequired(CreateRegistrationFeeBodySchema, 'Registration fee payload'),
    },
    responses: {
      [HttpStatusCodes.CREATED]: jsonContent(
        zodResponseSchema(RegistrationFeeSchema),
        'Registration fee created successfully'
      ),
      [HttpStatusCodes.UNAUTHORIZED]: jsonContent(zodResponseSchema(), 'Authentication required'),
      [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
        zodResponseSchema(),
        'Failed to create registration fee'
      ),
    },
  }),

  getRegistrationFees: createRoute({
    method: 'get',
    tags: ['RegistrationFees'],
    path: '/',
    summary: 'Get all registration fees',
    responses: {
      [HttpStatusCodes.OK]: jsonContent(
        zodResponseSchema(RegistrationFeeListSchema),
        'List of registration fees'
      ),
      [HttpStatusCodes.UNAUTHORIZED]: jsonContent(zodResponseSchema(), 'Authentication required'),
      [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
        zodResponseSchema(),
        'Failed to fetch registration fees'
      ),
    },
  }),

  getRegistrationFee: createRoute({
    method: 'get',
    tags: ['RegistrationFees'],
    path: '/{id}',
    summary: 'Get registration fee by ID',
    request: {
      params: RegistrationFeeParamsSchema,
    },
    responses: {
      [HttpStatusCodes.OK]: jsonContent(
        zodResponseSchema(RegistrationFeeSchema),
        'Registration fee details'
      ),
      [HttpStatusCodes.NOT_FOUND]: jsonContent(zodResponseSchema(), 'Registration fee not found'),
      [HttpStatusCodes.UNAUTHORIZED]: jsonContent(zodResponseSchema(), 'Authentication required'),
      [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
        zodResponseSchema(),
        'Failed to fetch registration fee'
      ),
    },
  }),

  updateRegistrationFee: createRoute({
    method: 'patch',
    tags: ['RegistrationFees'],
    path: '/{id}',
    summary: 'Update a registration fee',
    request: {
      params: RegistrationFeeParamsSchema,
      body: jsonContentRequired(UpdateRegistrationFeeBodySchema, 'Registration fee update payload'),
    },
    responses: {
      [HttpStatusCodes.OK]: jsonContent(
        zodResponseSchema(RegistrationFeeSchema),
        'Registration fee updated successfully'
      ),
      [HttpStatusCodes.NOT_FOUND]: jsonContent(zodResponseSchema(), 'Registration fee not found'),
      [HttpStatusCodes.UNAUTHORIZED]: jsonContent(zodResponseSchema(), 'Authentication required'),
      [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
        zodResponseSchema(),
        'Failed to update registration fee'
      ),
    },
  }),

  deleteRegistrationFee: createRoute({
    method: 'delete',
    tags: ['RegistrationFees'],
    path: '/{id}',
    summary: 'Delete a registration fee',
    request: {
      params: RegistrationFeeParamsSchema,
    },
    responses: {
      [HttpStatusCodes.OK]: jsonContent(
        zodResponseSchema(z.object({ success: z.boolean() })),
        'Registration fee deleted successfully'
      ),
      [HttpStatusCodes.NOT_FOUND]: jsonContent(zodResponseSchema(), 'Registration fee not found'),
      [HttpStatusCodes.UNAUTHORIZED]: jsonContent(zodResponseSchema(), 'Authentication required'),
      [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
        zodResponseSchema(),
        'Failed to delete registration fee'
      ),
    },
  }),
}

export type RegistrationFeesRoutes = typeof REGISTRATION_FEES_ROUTES
