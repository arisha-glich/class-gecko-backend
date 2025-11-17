import { createRoute, z } from '@hono/zod-openapi'
import * as HttpStatusCodes from 'stoker/http-status-codes'
import { jsonContent, jsonContentRequired } from 'stoker/openapi/helpers'
import { zodResponseSchema } from '~/lib/zod-helper'

export const CreateWaiverPolicyBodySchema = z
  .object({
    title: z.string().min(1),
    description: z.string().min(1),
    permission: z.string().min(1),
  })
  .openapi({ description: 'Payload to create a waiver/policy' })

export const UpdateWaiverPolicyBodySchema = CreateWaiverPolicyBodySchema.partial()

export const WaiverPolicyParamsSchema = z.object({
  id: z.string().openapi({ param: { name: 'id', in: 'path' } }),
})

export const WaiverPolicySchema = z.object({
  id: z.number(),
  userId: z.string(),
  title: z.string(),
  description: z.string(),
  permission: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const WaiverPolicyListSchema = z.array(WaiverPolicySchema)

export const WAIVERS_POLICIES_ROUTES = {
  createWaiverPolicy: createRoute({
    method: 'post',
    tags: ['WaiversPolicies'],
    path: '/',
    summary: 'Create a waiver/policy',
    request: {
      body: jsonContentRequired(CreateWaiverPolicyBodySchema, 'Waiver/policy payload'),
    },
    responses: {
      [HttpStatusCodes.CREATED]: jsonContent(
        zodResponseSchema(WaiverPolicySchema),
        'Waiver/policy created successfully'
      ),
      [HttpStatusCodes.UNAUTHORIZED]: jsonContent(zodResponseSchema(), 'Authentication required'),
      [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
        zodResponseSchema(),
        'Failed to create waiver/policy'
      ),
    },
  }),

  getWaiverPolicies: createRoute({
    method: 'get',
    tags: ['WaiversPolicies'],
    path: '/',
    summary: 'Get all waivers/policies',
    responses: {
      [HttpStatusCodes.OK]: jsonContent(
        zodResponseSchema(WaiverPolicyListSchema),
        'List of waivers/policies'
      ),
      [HttpStatusCodes.UNAUTHORIZED]: jsonContent(zodResponseSchema(), 'Authentication required'),
      [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
        zodResponseSchema(),
        'Failed to fetch waivers/policies'
      ),
    },
  }),

  getWaiverPolicy: createRoute({
    method: 'get',
    tags: ['WaiversPolicies'],
    path: '/{id}',
    summary: 'Get waiver/policy by ID',
    request: {
      params: WaiverPolicyParamsSchema,
    },
    responses: {
      [HttpStatusCodes.OK]: jsonContent(
        zodResponseSchema(WaiverPolicySchema),
        'Waiver/policy details'
      ),
      [HttpStatusCodes.NOT_FOUND]: jsonContent(zodResponseSchema(), 'Waiver/policy not found'),
      [HttpStatusCodes.UNAUTHORIZED]: jsonContent(zodResponseSchema(), 'Authentication required'),
      [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
        zodResponseSchema(),
        'Failed to fetch waiver/policy'
      ),
    },
  }),

  updateWaiverPolicy: createRoute({
    method: 'patch',
    tags: ['WaiversPolicies'],
    path: '/{id}',
    summary: 'Update a waiver/policy',
    request: {
      params: WaiverPolicyParamsSchema,
      body: jsonContentRequired(UpdateWaiverPolicyBodySchema, 'Waiver/policy update payload'),
    },
    responses: {
      [HttpStatusCodes.OK]: jsonContent(
        zodResponseSchema(WaiverPolicySchema),
        'Waiver/policy updated successfully'
      ),
      [HttpStatusCodes.NOT_FOUND]: jsonContent(zodResponseSchema(), 'Waiver/policy not found'),
      [HttpStatusCodes.UNAUTHORIZED]: jsonContent(zodResponseSchema(), 'Authentication required'),
      [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
        zodResponseSchema(),
        'Failed to update waiver/policy'
      ),
    },
  }),

  deleteWaiverPolicy: createRoute({
    method: 'delete',
    tags: ['WaiversPolicies'],
    path: '/{id}',
    summary: 'Delete a waiver/policy',
    request: {
      params: WaiverPolicyParamsSchema,
    },
    responses: {
      [HttpStatusCodes.OK]: jsonContent(
        zodResponseSchema(z.object({ success: z.boolean() })),
        'Waiver/policy deleted successfully'
      ),
      [HttpStatusCodes.NOT_FOUND]: jsonContent(zodResponseSchema(), 'Waiver/policy not found'),
      [HttpStatusCodes.UNAUTHORIZED]: jsonContent(zodResponseSchema(), 'Authentication required'),
      [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
        zodResponseSchema(),
        'Failed to delete waiver/policy'
      ),
    },
  }),
}

export type WaiversPoliciesRoutes = typeof WAIVERS_POLICIES_ROUTES

