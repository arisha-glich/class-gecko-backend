import { createRoute, z } from '@hono/zod-openapi'
import * as HttpStatusCodes from 'stoker/http-status-codes'
import { jsonContent, jsonContentRequired } from 'stoker/openapi/helpers'
import { zodResponseSchema } from '~/lib/zod-helper'

// Billing Option Schema
export const BillingOptionSchema = z.object({
  enabled: z.boolean(),
  type: z.enum(['Upfront', 'Monthly', 'Every two weeks', 'Weekly', 'Custom']),
  // For Upfront: payment date (ISO datetime string)
  paymentDate: z.string().optional(),
  // For recurring payments (Monthly, Every two weeks, Weekly): frequency and start date
  frequency: z.string().optional(), // e.g., "1 month", "2 weeks", "1 week"
  startDate: z.string().optional(), // ISO datetime string - when recurring payments start
  // For Custom payment options
  customName: z.string().optional(),
  customDescription: z.string().optional(),
  customFrequency: z.string().optional(), // Custom frequency description
  customStartDate: z.string().optional(), // ISO datetime string
})

// Request Schemas
export const CreateTermBodySchema = z
  .object({
    title: z.string().min(1, 'Title is required'),
    startDate: z.string().datetime(),
    endDate: z.string().datetime(),
    registrationFee: z.boolean().default(false),
    seasonSpecificFee: z.boolean().default(false),
    pricingType: z
      .enum(['By Lesson', 'By Month', 'By Season', 'Number of Classes', 'Number of Hours'])
      .optional(),
    billingOptions: z.array(BillingOptionSchema).optional(), // Array of billing options with enabled/disabled state
    pricing: z.unknown().optional(), // JSON object - accepts any key-value pairs
    seasonSpecificFees: z
      .array(
        z.object({
          name: z.string(),
          amount: z.number(),
          maxPerFamily: z.number().optional(),
        })
      )
      .optional(),
  })
  .openapi({ description: 'Payload to create a new term/season' })

export const UpdateTermBodySchema = z.object({
  title: z.string().min(1, 'Title is required').optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  registrationFee: z.boolean().optional(),
  seasonSpecificFee: z.boolean().optional(),
  pricingType: z
    .enum(['By Lesson', 'By Month', 'By Season', 'Number of Classes', 'Number of Hours'])
    .optional(),
  billingOptions: z.array(BillingOptionSchema).optional(),
  pricing: z.unknown().optional(),
  seasonSpecificFees: z
    .array(
      z.object({
        name: z.string(),
        amount: z.number(),
        maxPerFamily: z.number().optional(),
      })
    )
    .optional(),
})

export const TermParamsSchema = z.object({
  id: z.string().openapi({ param: { name: 'id', in: 'path' } }),
})

// Response Schemas
export const TermSchema = z.object({
  id: z.number(),
  userId: z.string(),
  title: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  registrationFee: z.boolean(),
  seasonSpecificFee: z.boolean(),
  pricingType: z.string().nullable(),
  billingOptions: z.array(BillingOptionSchema).nullable(), // Structured billing options
  pricing: z.unknown().nullable(), // JSON object
  seasonSpecificFees: z
    .array(
      z.object({
        name: z.string(),
        amount: z.number(),
        maxPerFamily: z.number().nullable().optional(),
      })
    )
    .nullable(), // JSON array
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const TermListSchema = z.array(TermSchema)

export const TERMS_ROUTES = {
  createTerm: createRoute({
    method: 'post',
    tags: ['Terms'],
    path: '/',
    summary: 'Create a new term/season',
    request: {
      body: jsonContentRequired(CreateTermBodySchema, 'Term creation payload'),
    },
    responses: {
      [HttpStatusCodes.CREATED]: jsonContent(
        zodResponseSchema(TermSchema),
        'Term created successfully'
      ),
      [HttpStatusCodes.UNAUTHORIZED]: jsonContent(zodResponseSchema(), 'Authentication required'),
      [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
        zodResponseSchema(),
        'Failed to create term'
      ),
    },
  }),

  getTerms: createRoute({
    method: 'get',
    tags: ['Terms'],
    path: '/',
    summary: 'Get all terms/seasons',
    responses: {
      [HttpStatusCodes.OK]: jsonContent(zodResponseSchema(TermListSchema), 'List of terms'),
      [HttpStatusCodes.UNAUTHORIZED]: jsonContent(zodResponseSchema(), 'Authentication required'),
      [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
        zodResponseSchema(),
        'Failed to fetch terms'
      ),
    },
  }),

  getTerm: createRoute({
    method: 'get',
    tags: ['Terms'],
    path: '/{id}',
    summary: 'Get a term by ID',
    request: {
      params: TermParamsSchema,
    },
    responses: {
      [HttpStatusCodes.OK]: jsonContent(zodResponseSchema(TermSchema), 'Term details'),
      [HttpStatusCodes.NOT_FOUND]: jsonContent(zodResponseSchema(), 'Term not found'),
      [HttpStatusCodes.UNAUTHORIZED]: jsonContent(zodResponseSchema(), 'Authentication required'),
      [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
        zodResponseSchema(),
        'Failed to fetch term'
      ),
    },
  }),

  updateTerm: createRoute({
    method: 'patch',
    tags: ['Terms'],
    path: '/{id}',
    summary: 'Update a term',
    request: {
      params: TermParamsSchema,
      body: jsonContentRequired(UpdateTermBodySchema, 'Term update payload'),
    },
    responses: {
      [HttpStatusCodes.OK]: jsonContent(zodResponseSchema(TermSchema), 'Term updated successfully'),
      [HttpStatusCodes.NOT_FOUND]: jsonContent(zodResponseSchema(), 'Term not found'),
      [HttpStatusCodes.UNAUTHORIZED]: jsonContent(zodResponseSchema(), 'Authentication required'),
      [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
        zodResponseSchema(),
        'Failed to update term'
      ),
    },
  }),

  deleteTerm: createRoute({
    method: 'delete',
    tags: ['Terms'],
    path: '/{id}',
    summary: 'Delete a term',
    request: {
      params: TermParamsSchema,
    },
    responses: {
      [HttpStatusCodes.OK]: jsonContent(
        zodResponseSchema(z.object({ message: z.string() })),
        'Term deleted successfully'
      ),
      [HttpStatusCodes.NOT_FOUND]: jsonContent(zodResponseSchema(), 'Term not found'),
      [HttpStatusCodes.UNAUTHORIZED]: jsonContent(zodResponseSchema(), 'Authentication required'),
      [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
        zodResponseSchema(),
        'Failed to delete term'
      ),
    },
  }),
}

export type TermsRoutes = typeof TERMS_ROUTES
