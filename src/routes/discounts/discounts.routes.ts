import { createRoute, z } from '@hono/zod-openapi'
import * as HttpStatusCodes from 'stoker/http-status-codes'
import { jsonContent, jsonContentRequired } from 'stoker/openapi/helpers'
import { zodResponseSchema } from '~/lib/zod-helper'

const DiscountTypeSchema = z.enum(['PERCENTAGE', 'FIXED'])
const DiscountCategorySchema = z.enum(['MULTIPLE_STUDENT', 'CLASS_BY_STUDENT', 'CLASS_BY_FAMILY'])

export const DiscountTierSchema = z.object({
  id: z.number(),
  studentsPerFamily: z.number().nullable(),
  classesPerStudent: z.number().nullable(),
  percentageOff: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const DiscountSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string().nullable(),
  discountType: DiscountTypeSchema,
  discountValue: z.number(),
  appliesTo: z.string(),
  applicableClassIds: z.unknown().nullable(),
  applicableClassTypes: z.unknown().nullable(),
  minEnrollmentCount: z.number().nullable(),
  siblingConfig: z.unknown().nullable(),
  validFrom: z.string(),
  validUntil: z.string(),
  maxUsesTotal: z.number().nullable(),
  maxUsesPerFamily: z.number().nullable(),
  timesUsed: z.number(),
  isActive: z.boolean(),
  category: DiscountCategorySchema.nullable(),
  tiers: z.array(DiscountTierSchema),
})

export const DiscountListSchema = z.array(DiscountSchema)

const DiscountTierInputSchema = z.object({
  studentsPerFamily: z.number().int().min(1).optional(),
  classesPerStudent: z.number().int().min(1).optional(),
  percentageOff: z.number().min(0),
})

export const CreateDiscountBodySchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  discountType: DiscountTypeSchema,
  discountValue: z.number(),
  appliesTo: z.string().min(1),
  applicableClassIds: z.unknown().optional(),
  applicableClassTypes: z.unknown().optional(),
  minEnrollmentCount: z.number().int().optional(),
  siblingConfig: z.unknown().optional(),
  validFrom: z.string().datetime(),
  validUntil: z.string().datetime(),
  maxUsesTotal: z.number().int().optional(),
  maxUsesPerFamily: z.number().int().optional(),
  isActive: z.boolean().optional(),
  category: DiscountCategorySchema.optional(),
  tiers: z.array(DiscountTierInputSchema).optional(),
})

export const UpdateDiscountBodySchema = CreateDiscountBodySchema.partial()

export const DiscountParamsSchema = z.object({
  id: z.string().openapi({ param: { name: 'id', in: 'path' } }),
})

export const DISCOUNTS_ROUTES = {
  createDiscount: createRoute({
    method: 'post',
    tags: ['Discounts'],
    path: '/',
    summary: 'Create a discount scheme',
    request: {
      body: jsonContentRequired(CreateDiscountBodySchema, 'Discount payload'),
    },
    responses: {
      [HttpStatusCodes.CREATED]: jsonContent(
        zodResponseSchema(DiscountSchema),
        'Discount created successfully'
      ),
      [HttpStatusCodes.UNAUTHORIZED]: jsonContent(zodResponseSchema(), 'Authentication required'),
      [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
        zodResponseSchema(),
        'Failed to create discount'
      ),
    },
  }),

  getDiscounts: createRoute({
    method: 'get',
    tags: ['Discounts'],
    path: '/',
    summary: 'Get all discounts',
    responses: {
      [HttpStatusCodes.OK]: jsonContent(zodResponseSchema(DiscountListSchema), 'List of discounts'),
      [HttpStatusCodes.UNAUTHORIZED]: jsonContent(zodResponseSchema(), 'Authentication required'),
    },
  }),

  getDiscount: createRoute({
    method: 'get',
    tags: ['Discounts'],
    path: '/{id}',
    summary: 'Get discount by ID',
    request: {
      params: DiscountParamsSchema,
    },
    responses: {
      [HttpStatusCodes.OK]: jsonContent(zodResponseSchema(DiscountSchema), 'Discount details'),
      [HttpStatusCodes.NOT_FOUND]: jsonContent(zodResponseSchema(), 'Discount not found'),
      [HttpStatusCodes.UNAUTHORIZED]: jsonContent(zodResponseSchema(), 'Authentication required'),
    },
  }),

  updateDiscount: createRoute({
    method: 'patch',
    tags: ['Discounts'],
    path: '/{id}',
    summary: 'Update a discount',
    request: {
      params: DiscountParamsSchema,
      body: jsonContentRequired(UpdateDiscountBodySchema, 'Discount update payload'),
    },
    responses: {
      [HttpStatusCodes.OK]: jsonContent(
        zodResponseSchema(DiscountSchema),
        'Discount updated successfully'
      ),
      [HttpStatusCodes.NOT_FOUND]: jsonContent(zodResponseSchema(), 'Discount not found'),
      [HttpStatusCodes.UNAUTHORIZED]: jsonContent(zodResponseSchema(), 'Authentication required'),
    },
  }),

  deleteDiscount: createRoute({
    method: 'delete',
    tags: ['Discounts'],
    path: '/{id}',
    summary: 'Delete a discount',
    request: {
      params: DiscountParamsSchema,
    },
    responses: {
      [HttpStatusCodes.OK]: jsonContent(
        zodResponseSchema(z.object({ success: z.boolean() })),
        'Discount deleted successfully'
      ),
      [HttpStatusCodes.NOT_FOUND]: jsonContent(zodResponseSchema(), 'Discount not found'),
      [HttpStatusCodes.UNAUTHORIZED]: jsonContent(zodResponseSchema(), 'Authentication required'),
    },
  }),
}

export type DiscountsRoutes = typeof DISCOUNTS_ROUTES
