import { createRoute, z } from '@hono/zod-openapi'
import * as HttpStatusCodes from 'stoker/http-status-codes'
import { jsonContent, jsonContentRequired } from 'stoker/openapi/helpers'
import { zodResponseSchema } from '~/lib/zod-helper'

export const CreateCustomFieldBodySchema = z
  .object({
    appliesTo: z.string().min(1),
    question: z.string().min(1),
    answerType: z.string().min(1),
    options: z.unknown().optional(),
    isRequired: z.boolean().optional(),
    isActive: z.boolean().optional(),
  })
  .openapi({ description: 'Payload to create a custom field' })

export const UpdateCustomFieldBodySchema = CreateCustomFieldBodySchema.partial()

export const CustomFieldParamsSchema = z.object({
  id: z.string().openapi({ param: { name: 'id', in: 'path' } }),
})

export const CustomFieldSchema = z.object({
  id: z.number(),
  userId: z.string(),
  appliesTo: z.string(),
  question: z.string(),
  answerType: z.string(),
  options: z.unknown().nullable(),
  isRequired: z.boolean(),
  isActive: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const CustomFieldListSchema = z.array(CustomFieldSchema)

export const CUSTOM_FIELDS_ROUTES = {
  createCustomField: createRoute({
    method: 'post',
    tags: ['CustomFields'],
    path: '/',
    summary: 'Create a custom field',
    request: {
      body: jsonContentRequired(CreateCustomFieldBodySchema, 'Custom field payload'),
    },
    responses: {
      [HttpStatusCodes.CREATED]: jsonContent(
        zodResponseSchema(CustomFieldSchema),
        'Custom field created successfully'
      ),
      [HttpStatusCodes.UNAUTHORIZED]: jsonContent(zodResponseSchema(), 'Authentication required'),
      [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
        zodResponseSchema(),
        'Failed to create custom field'
      ),
    },
  }),

  getCustomFields: createRoute({
    method: 'get',
    tags: ['CustomFields'],
    path: '/',
    summary: 'Get all custom fields',
    responses: {
      [HttpStatusCodes.OK]: jsonContent(
        zodResponseSchema(CustomFieldListSchema),
        'List of custom fields'
      ),
      [HttpStatusCodes.UNAUTHORIZED]: jsonContent(zodResponseSchema(), 'Authentication required'),
      [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
        zodResponseSchema(),
        'Failed to fetch custom fields'
      ),
    },
  }),

  getCustomField: createRoute({
    method: 'get',
    tags: ['CustomFields'],
    path: '/{id}',
    summary: 'Get custom field by ID',
    request: {
      params: CustomFieldParamsSchema,
    },
    responses: {
      [HttpStatusCodes.OK]: jsonContent(
        zodResponseSchema(CustomFieldSchema),
        'Custom field details'
      ),
      [HttpStatusCodes.NOT_FOUND]: jsonContent(zodResponseSchema(), 'Custom field not found'),
      [HttpStatusCodes.UNAUTHORIZED]: jsonContent(zodResponseSchema(), 'Authentication required'),
      [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
        zodResponseSchema(),
        'Failed to fetch custom field'
      ),
    },
  }),

  updateCustomField: createRoute({
    method: 'patch',
    tags: ['CustomFields'],
    path: '/{id}',
    summary: 'Update a custom field',
    request: {
      params: CustomFieldParamsSchema,
      body: jsonContentRequired(UpdateCustomFieldBodySchema, 'Custom field update payload'),
    },
    responses: {
      [HttpStatusCodes.OK]: jsonContent(
        zodResponseSchema(CustomFieldSchema),
        'Custom field updated successfully'
      ),
      [HttpStatusCodes.NOT_FOUND]: jsonContent(zodResponseSchema(), 'Custom field not found'),
      [HttpStatusCodes.UNAUTHORIZED]: jsonContent(zodResponseSchema(), 'Authentication required'),
      [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
        zodResponseSchema(),
        'Failed to update custom field'
      ),
    },
  }),

  deleteCustomField: createRoute({
    method: 'delete',
    tags: ['CustomFields'],
    path: '/{id}',
    summary: 'Delete a custom field',
    request: {
      params: CustomFieldParamsSchema,
    },
    responses: {
      [HttpStatusCodes.OK]: jsonContent(
        zodResponseSchema(z.object({ success: z.boolean() })),
        'Custom field deleted successfully'
      ),
      [HttpStatusCodes.NOT_FOUND]: jsonContent(zodResponseSchema(), 'Custom field not found'),
      [HttpStatusCodes.UNAUTHORIZED]: jsonContent(zodResponseSchema(), 'Authentication required'),
      [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
        zodResponseSchema(),
        'Failed to delete custom field'
      ),
    },
  }),
}

export type CustomFieldsRoutes = typeof CUSTOM_FIELDS_ROUTES
