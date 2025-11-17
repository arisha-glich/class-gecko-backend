import { createRoute, z } from '@hono/zod-openapi'
import * as HttpStatusCodes from 'stoker/http-status-codes'
import { jsonContent, jsonContentRequired } from 'stoker/openapi/helpers'
import { zodResponseSchema } from '~/lib/zod-helper'

// Schemas
export const BusinessSchema = z.object({
  id: z.number().int(),
  schoolName: z.string(),
  email: z.string().email(),
  phone: z.string(),
  status: z.string(),
  user: z.object({
    id: z.string(),
    email: z.string().email(),
    phoneNo: z.string().nullable(),
  }),
})

export const BusinessListResponseSchema = z.object({
  data: z.array(BusinessSchema),
  pagination: z.object({
    page: z.number().int(),
    limit: z.number().int(),
    total: z.number().int(),
    totalPages: z.number().int(),
  }),
})

export const BusinessDetailSchema = z.object({
  id: z.number().int(),
  schoolName: z.string(),
  email: z.string().email(),
  phone: z.string(),
  address: z.string().nullable(),
  website: z.string().nullable(),
  status: z.string(),
  statistics: z.object({
    students: z.number().int(),
    teachers: z.number().int(),
    revenue: z.number(),
    profit: z.number(),
  }),
  contactInfo: z.object({
    email: z.string().email(),
    phone: z.string(),
    address: z.string().nullable(),
    website: z.string().nullable(),
  }),
  commission: z
    .object({
      commissionType: z.string(),
      commissionValue: z.number(),
    })
    .nullable(),
  user: z.object({
    id: z.string(),
    email: z.string().email(),
    phoneNo: z.string().nullable(),
  }),
})

export const CreateBusinessBodySchema = z
  .object({
    schoolName: z.string().min(1, 'School name is required'),
    email: z.string().email('Valid email is required'),
    phone: z.string().min(1, 'Phone number is required'),
    address: z.string().optional(),
    website: z.string().url('Valid URL is required').optional().or(z.literal('')),
    commissionType: z.enum(['PERCENTAGE', 'FIXED', 'TIERED']),
    commissionValue: z.number().min(0, 'Commission value must be non-negative'),
    status: z.boolean().optional().default(true),
  })
  .openapi({ description: 'Payload to create a new business/school' })

export const UpdateBusinessBodySchema = z
  .object({
    schoolName: z.string().min(1).optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
    website: z.string().url().optional().or(z.literal('')),
    status: z.boolean().optional(),
  })
  .openapi({ description: 'Payload to update business/school information' })

export const UpdateCommissionBodySchema = z
  .object({
    commissionType: z.enum(['PERCENTAGE', 'FIXED', 'TIERED']),
    commissionValue: z.number().min(0, 'Commission value must be non-negative'),
    country: z.string().optional(),
    currency: z.string().optional(),
  })
  .openapi({ description: 'Payload to update commission settings' })

export const BusinessParamsSchema = z.object({
  id: z.string().openapi({ param: { name: 'id', in: 'path' } }),
})

export const BusinessQuerySchema = z.object({
  search: z.string().optional().openapi({ param: { name: 'search', in: 'query' } }),
  page: z.string().optional().openapi({ param: { name: 'page', in: 'query' } }),
  limit: z.string().optional().openapi({ param: { name: 'limit', in: 'query' } }),
})

export const StudentSchema = z.object({
  id: z.number().int(),
  studentName: z.string(),
  email: z.string().email(),
  phone: z.string(),
  status: z.string(),
})

export const BusinessStudentsResponseSchema = z.object({
  data: z.array(StudentSchema),
  pagination: z.object({
    page: z.number().int(),
    limit: z.number().int(),
    total: z.number().int(),
    totalPages: z.number().int(),
  }),
})

export const ToggleStatusBodySchema = z
  .object({
    status: z.boolean(),
  })
  .openapi({ description: 'Payload to toggle business status' })

// Routes
export const BUSINESS_ROUTES = {
  getBusinesses: createRoute({
    method: 'get',
    tags: ['Business'],
    path: '/',
    summary: 'Get all businesses/schools',
    description: 'Retrieves a paginated list of all businesses with optional search',
    request: {
      query: BusinessQuerySchema,
    },
    responses: {
      [HttpStatusCodes.OK]: jsonContent(
        zodResponseSchema(BusinessListResponseSchema),
        'Businesses retrieved successfully'
      ),
      [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
        zodResponseSchema(),
        'Authentication required'
      ),
      [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
        zodResponseSchema(),
        'Failed to retrieve businesses'
      ),
    },
  }),

  getBusiness: createRoute({
    method: 'get',
    tags: ['Business'],
    path: '/{id}',
    summary: 'Get business details by ID',
    description: 'Retrieves detailed information about a specific business including statistics',
    request: {
      params: BusinessParamsSchema,
    },
    responses: {
      [HttpStatusCodes.OK]: jsonContent(
        zodResponseSchema(BusinessDetailSchema),
        'Business details retrieved successfully'
      ),
      [HttpStatusCodes.NOT_FOUND]: jsonContent(zodResponseSchema(), 'Business not found'),
      [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
        zodResponseSchema(),
        'Authentication required'
      ),
      [HttpStatusCodes.INTERNAL_SERVER_ERROR]:jsonContent(zodResponseSchema(), 'Failed to retrieve business')
    },
  }),

  createBusiness: createRoute({
    method: 'post',
    tags: ['Business'],
    path: '/',
    summary: 'Create a new business/school',
    description: 'Creates a new business organization with commission settings',
    request: {
      body: jsonContentRequired(CreateBusinessBodySchema, 'Business creation payload'),
    },
    responses: {
      [HttpStatusCodes.CREATED]: jsonContent(
        zodResponseSchema(BusinessSchema),
        'Business created successfully'
      ),
      [HttpStatusCodes.CONFLICT]: jsonContent(
        zodResponseSchema(),
        'Email already in use'
      ),
      [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
        zodResponseSchema(),
        'Authentication required'
      ),
      [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
        zodResponseSchema(),
        'Failed to create business'
      ),
    },
  }),

  updateBusiness: createRoute({
    method: 'patch',
    tags: ['Business'],
    path: '/{id}',
    summary: 'Update business information',
    description: 'Updates business/school details',
    request: {
      params: BusinessParamsSchema,
      body: jsonContentRequired(UpdateBusinessBodySchema, 'Business update payload'),
    },
    responses: {
      [HttpStatusCodes.OK]: jsonContent(
        zodResponseSchema(BusinessSchema),
        'Business updated successfully'
      ),
      [HttpStatusCodes.NOT_FOUND]: jsonContent(zodResponseSchema(), 'Business not found'),
      [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
        zodResponseSchema(),
        'Authentication required'
      ),
      [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
        zodResponseSchema(),
        'Failed to update business'
      ),
    },
  }),

  updateBusinessCommission: createRoute({
    method: 'patch',
    tags: ['Business'],
    path: '/{id}/commission',
    summary: 'Update business commission settings',
    description: 'Updates commission type and value for a specific business',
    request: {
      params: BusinessParamsSchema,
      body: jsonContentRequired(
        UpdateCommissionBodySchema,
        'Commission update payload'
      ),
    },
    responses: {
      [HttpStatusCodes.OK]: jsonContent(
        zodResponseSchema(
          z.object({
            commissionType: z.string(),
            commissionValue: z.number(),
          })
        ),
        'Commission updated successfully'
      ),
      [HttpStatusCodes.NOT_FOUND]: jsonContent(zodResponseSchema(), 'Business not found'),
      [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
        zodResponseSchema(),
        'Authentication required'
      ),
      [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
        zodResponseSchema(),
        'Failed to update commission'
      ),
    },
  }),

  getBusinessStudents: createRoute({
    method: 'get',
    tags: ['Business'],
    path: '/{id}/students',
    summary: 'Get students for a business',
    description: 'Retrieves a paginated list of students belonging to a business',
    request: {
      params: BusinessParamsSchema,
      query: BusinessQuerySchema,
    },
    responses: {
      [HttpStatusCodes.OK]: jsonContent(
        zodResponseSchema(BusinessStudentsResponseSchema),
        'Students retrieved successfully'
      ),
      [HttpStatusCodes.NOT_FOUND]: jsonContent(zodResponseSchema(), 'Business not found'),
      [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
        zodResponseSchema(),
        'Authentication required'
      ),
      [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
        zodResponseSchema(),
        'Failed to retrieve students'
      ),
    },
  }),

  toggleBusinessStatus: createRoute({
    method: 'patch',
    tags: ['Business'],
    path: '/{id}/status',
    summary: 'Toggle business status',
    description: 'Activates or deactivates a business',
    request: {
      params: BusinessParamsSchema,
      body: jsonContentRequired(ToggleStatusBodySchema, 'Status toggle payload'),
    },
    responses: {
      [HttpStatusCodes.OK]: jsonContent(
        zodResponseSchema(
          z.object({
            id: z.number().int(),
            status: z.string(),
          })
        ),
        'Business status updated successfully'
      ),
      [HttpStatusCodes.NOT_FOUND]: jsonContent(zodResponseSchema(), 'Business not found'),
      [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
        zodResponseSchema(),
        'Authentication required'
      ),
      [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
        zodResponseSchema(),
        'Failed to update status'
      ),
    },
  }),
}

export type BusinessRoutes = typeof BUSINESS_ROUTES

