import { createRoute, z } from '@hono/zod-openapi'
import * as HttpStatusCodes from 'stoker/http-status-codes'
import { jsonContent, jsonContentRequired } from 'stoker/openapi/helpers'
import { zodResponseSchema } from '~/lib/zod-helper'

// Schemas
export const CommissionSchema = z.object({
  id: z.number().int(),
  businessId: z.number().int().nullable(),
  businessName: z.string().nullable(),
  effectiveFrom: z.string().datetime(),
  country: z.string(),
  currency: z.string(),
  commissionType: z.enum(['PERCENTAGE', 'FIXED', 'TIERED']),
  commissionValue: z.number(),
  tierConfig: z.unknown().nullable(),
  platformCommission: z.number(),
  platformAmount: z.number(),
  appliesTo: z.string(),
  minTransactionAmt: z.number().nullable(),
  maxTransactionAmt: z.number().nullable(),
  isActive: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export const CommissionListResponseSchema = z.object({
  data: z.array(CommissionSchema),
  pagination: z.object({
    page: z.number().int(),
    limit: z.number().int(),
    total: z.number().int(),
    totalPages: z.number().int(),
  }),
})

export const CreateGlobalCommissionBodySchema = z.object({
  commissionType: z.enum(['PERCENTAGE', 'FIXED', 'TIERED']),
  commissionValue: z.number().min(0, 'Commission value must be positive').optional(),
  country: z.string().optional().default('US'),
  currency: z.string().optional().default('USD'),
  effectiveFrom: z.string().datetime().optional(),
  appliesTo: z.string().optional().default('ALL'),
  minTransactionAmt: z.number().min(0).optional(),
  maxTransactionAmt: z.number().min(0).optional(),
  tierConfig: z.unknown().optional(),
})

export const CreateOrganizationCommissionBodySchema = z.object({
  businessId: z.number().int().min(1, 'Business ID is required'),
  commissionType: z.enum(['PERCENTAGE', 'FIXED', 'TIERED']),
  commissionValue: z.number().min(0, 'Commission value must be positive'),
  country: z.string().optional().default('US'),
  currency: z.string().optional().default('USD'),
  effectiveFrom: z.string().datetime().optional(),
  appliesTo: z.string().optional().default('ALL'),
  minTransactionAmt: z.number().min(0).optional(),
  maxTransactionAmt: z.number().min(0).optional(),
  tierConfig: z.unknown().optional(),
})

export const UpdateCommissionBodySchema = z.object({
  commissionType: z.enum(['PERCENTAGE', 'FIXED', 'TIERED']).optional(),
  commissionValue: z.number().min(0).optional(),
  country: z.string().optional(),
  currency: z.string().optional(),
  effectiveFrom: z.string().datetime().optional(),
  appliesTo: z.string().optional(),
  minTransactionAmt: z.number().min(0).optional(),
  maxTransactionAmt: z.number().min(0).optional(),
  tierConfig: z.unknown().optional(),
  isActive: z.boolean().optional(),
})

export const CommissionParamsSchema = z.object({
  id: z.string().openapi({ param: { name: 'id', in: 'path' } }),
})

export const COMMISSIONS_ROUTES = {
  // Get all commissions (global and organization-specific)
  getCommissions: createRoute({
    method: 'get',
    tags: ['Commissions'],
    path: '/',
    summary: 'Get all commissions',
    description: 'Get all commissions (global and organization-specific). Admin only.',
    request: {
      query: z.object({
        page: z
          .string()
          .optional()
          .openapi({ param: { name: 'page', in: 'query' } }),
        limit: z
          .string()
          .optional()
          .openapi({ param: { name: 'limit', in: 'query' } }),
        businessId: z
          .string()
          .optional()
          .openapi({ param: { name: 'businessId', in: 'query' } }),
        isActive: z
          .string()
          .optional()
          .openapi({ param: { name: 'isActive', in: 'query' } }),
      }),
    },
    responses: {
      [HttpStatusCodes.OK]: jsonContent(
        zodResponseSchema(CommissionListResponseSchema),
        'Commissions retrieved successfully'
      ),
      [HttpStatusCodes.UNAUTHORIZED]: jsonContent(zodResponseSchema(), 'Authentication required'),
      [HttpStatusCodes.FORBIDDEN]: jsonContent(zodResponseSchema(), 'Admin access required'),
      [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(zodResponseSchema(), 'Failed to retrieve commissions') 
    },
  }),

  // Get commission by ID
  getCommission: createRoute({
    method: 'get',
    tags: ['Commissions'],
    path: '/{id}',
    summary: 'Get commission by ID',
    description: 'Get a specific commission by ID. Admin only.',
    request: {
      params: CommissionParamsSchema,
    },
    responses: {
      [HttpStatusCodes.OK]: jsonContent(
        zodResponseSchema(CommissionSchema),
        'Commission retrieved successfully'
      ),
      [HttpStatusCodes.NOT_FOUND]: jsonContent(zodResponseSchema(), 'Commission not found'),
      [HttpStatusCodes.UNAUTHORIZED]: jsonContent(zodResponseSchema(), 'Authentication required'),
      [HttpStatusCodes.FORBIDDEN]: jsonContent(zodResponseSchema(), 'Admin access required'),
      [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(zodResponseSchema(), 'Failed to retrieve commission')
    },
  }),

  // Create global commission
  createGlobalCommission: createRoute({
    method: 'post',
    tags: ['Commissions'],
    path: '/global',
    summary: 'Create global commission',
    description: 'Create a global commission that applies to all organizations. Admin only.',
    request: {
      body: jsonContentRequired(CreateGlobalCommissionBodySchema, 'Global commission payload'),
    },
    responses: {
      [HttpStatusCodes.CREATED]: jsonContent(
        zodResponseSchema(CommissionSchema),
        'Global commission created successfully'
      ),
      [HttpStatusCodes.UNAUTHORIZED]: jsonContent(zodResponseSchema(), 'Authentication required'),
      [HttpStatusCodes.FORBIDDEN]: jsonContent(zodResponseSchema(), 'Admin access required'),
      [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
        zodResponseSchema(),
        'Failed to create global commission'
      ),
    },
  }),

  // Create organization-specific commission
  createOrganizationCommission: createRoute({
    method: 'post',
    tags: ['Commissions'],
    path: '/organization',
    summary: 'Create organization commission',
    description: 'Create a commission for a specific organization. Admin only.',
    request: {
      body: jsonContentRequired(
        CreateOrganizationCommissionBodySchema,
        'Organization commission payload'
      ),
    },
    responses: {
      [HttpStatusCodes.CREATED]: jsonContent(
        zodResponseSchema(CommissionSchema),
        'Organization commission created successfully'
      ),
      [HttpStatusCodes.NOT_FOUND]: jsonContent(zodResponseSchema(), 'Business not found'),
      [HttpStatusCodes.UNAUTHORIZED]: jsonContent(zodResponseSchema(), 'Authentication required'),
      [HttpStatusCodes.FORBIDDEN]: jsonContent(zodResponseSchema(), 'Admin access required'),
      [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
        zodResponseSchema(),
        'Failed to create organization commission'
      ),
    },
  }),

  // Update commission by ID
  updateCommission: createRoute({
    method: 'patch',
    tags: ['Commissions'],
    path: '/{id}',
    summary: 'Update commission',
    description: 'Update a commission by ID. Admin only.',
    request: {
      params: CommissionParamsSchema,
      body: jsonContentRequired(UpdateCommissionBodySchema, 'Commission update payload'),
    },
    responses: {
      [HttpStatusCodes.OK]: jsonContent(
        zodResponseSchema(CommissionSchema),
        'Commission updated successfully'
      ),
      [HttpStatusCodes.NOT_FOUND]: jsonContent(zodResponseSchema(), 'Commission not found'),
      [HttpStatusCodes.UNAUTHORIZED]: jsonContent(zodResponseSchema(), 'Authentication required'),
      [HttpStatusCodes.FORBIDDEN]: jsonContent(zodResponseSchema(), 'Admin access required'),
      [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
        zodResponseSchema(),
        'Failed to update commission'
      ),
    },
  }),

  // Delete commission by ID
  deleteCommission: createRoute({
    method: 'delete',
    tags: ['Commissions'],
    path: '/{id}',
    summary: 'Delete commission',
    description: 'Delete a commission by ID. Admin only.',
    request: {
      params: CommissionParamsSchema,
    },
    responses: {
      [HttpStatusCodes.OK]: jsonContent(
        zodResponseSchema(z.object({ success: z.boolean() })),
        'Commission deleted successfully'
      ),
      [HttpStatusCodes.NOT_FOUND]: jsonContent(zodResponseSchema(), 'Commission not found'),
      [HttpStatusCodes.UNAUTHORIZED]: jsonContent(zodResponseSchema(), 'Authentication required'),
      [HttpStatusCodes.FORBIDDEN]: jsonContent(zodResponseSchema(), 'Admin access required'),
      [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
        zodResponseSchema(),
        'Failed to delete commission'
      ),
    },
  }),
}

export type CommissionsRoutes = typeof COMMISSIONS_ROUTES
