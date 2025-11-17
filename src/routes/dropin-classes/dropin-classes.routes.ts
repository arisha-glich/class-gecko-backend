import { createRoute, z } from '@hono/zod-openapi'
import * as HttpStatusCodes from 'stoker/http-status-codes'
import { jsonContent, jsonContentRequired } from 'stoker/openapi/helpers'
import { zodResponseSchema } from '~/lib/zod-helper'

const frequencyEnum = z.enum(['DAILY', 'WEEKLY', 'MONTHLY'])
const classTypeEnum = z.enum(['ONGOING_CLASS', 'DROP_CLASS'])

export const DropInClassSchema = z.object({
  id: z.number(),
  userId: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  startDate: z.string(),
  endDate: z.string(),
  frequency: frequencyEnum,
  recurringDay: z.string().nullable(),
  startTimeOfClass: z.string(),
  endTimeOfClass: z.string().nullable(),
  duration: z.number(),
  pricingPerLesson: z.number(),
  classImage: z.string().nullable(),
  locationId: z.number().nullable(),
  teacherId: z.number().nullable(),
  minimumAge: z.number().nullable(),
  maximumAge: z.number().nullable(),
  classColor: z.string().nullable(),
  limitCapacity: z.boolean(),
  capacity: z.number().nullable(),
  allowPortalBooking: z.boolean(),
  familyPortalTrial: z.boolean(),
  globalClassDiscount: z.boolean(),
  siblingDiscount: z.boolean(),
  classType: classTypeEnum,
  createdAt: z.string(),
  updatedAt: z.string(),
  location: z
    .object({
      id: z.number(),
      name: z.string(),
      address: z.string(),
    })
    .nullable(),
  teacher: z
    .object({
      id: z.number(),
      firstName: z.string(),
      lastName: z.string(),
      email: z.string(),
    })
    .nullable(),
})

export const DropInClassListSchema = z.array(DropInClassSchema)

export const CreateDropInClassBodySchema = z
  .object({
    title: z.string(),
    description: z.string().optional(),
    startDate: z.string().datetime(),
    endDate: z.string().datetime(),
    frequency: frequencyEnum,
    recurringDay: z.string().optional(),
    startTimeOfClass: z.string(),
    endTimeOfClass: z.string().optional(),
    duration: z.number().int().positive(),
    pricingPerLesson: z.number().positive(),
    classImage: z.string().url().optional(),
    locationId: z.number().int().optional(),
    teacherId: z.number().int().optional(),
    minimumAge: z.number().int().optional(),
    maximumAge: z.number().int().optional(),
    classColor: z.string().optional(),
    limitCapacity: z.boolean().optional(),
    capacity: z.number().int().optional(),
    allowPortalBooking: z.boolean().optional(),
    familyPortalTrial: z.boolean().optional(),
    globalClassDiscount: z.boolean().optional(),
    siblingDiscount: z.boolean().optional(),
    classType: classTypeEnum.optional(),
  })
  .openapi({ description: 'Payload to create a drop-in class' })

export const UpdateDropInClassBodySchema = CreateDropInClassBodySchema.partial()

export const DropInClassParamsSchema = z.object({
  id: z.string().openapi({ param: { name: 'id', in: 'path' } }),
})

export const DROPIN_CLASSES_ROUTES = {
  createDropInClass: createRoute({
    method: 'post',
    tags: ['DropInClasses'],
    path: '/',
    summary: 'Create a drop-in class',
    request: {
      body: jsonContentRequired(CreateDropInClassBodySchema, 'Drop-in class payload'),
    },
    responses: {
      [HttpStatusCodes.CREATED]: jsonContent(
        zodResponseSchema(DropInClassSchema),
        'Drop-in class created successfully'
      ),
      [HttpStatusCodes.UNAUTHORIZED]: jsonContent(zodResponseSchema(), 'Authentication required'),
      [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
        zodResponseSchema(),
        'Failed to create drop-in class'
      ),
    },
  }),

  getDropInClasses: createRoute({
    method: 'get',
    tags: ['DropInClasses'],
    path: '/',
    summary: 'List drop-in classes',
    responses: {
      [HttpStatusCodes.OK]: jsonContent(
        zodResponseSchema(DropInClassListSchema),
        'List of drop-in classes'
      ),
      [HttpStatusCodes.UNAUTHORIZED]: jsonContent(zodResponseSchema(), 'Authentication required'),
    },
  }),

  getDropInClass: createRoute({
    method: 'get',
    tags: ['DropInClasses'],
    path: '/{id}',
    summary: 'Get drop-in class by ID',
    request: {
      params: DropInClassParamsSchema,
    },
    responses: {
      [HttpStatusCodes.OK]: jsonContent(
        zodResponseSchema(DropInClassSchema),
        'Drop-in class details'
      ),
      [HttpStatusCodes.NOT_FOUND]: jsonContent(zodResponseSchema(), 'Drop-in class not found'),
      [HttpStatusCodes.UNAUTHORIZED]: jsonContent(zodResponseSchema(), 'Authentication required'),
    },
  }),

  updateDropInClass: createRoute({
    method: 'patch',
    tags: ['DropInClasses'],
    path: '/{id}',
    summary: 'Update a drop-in class',
    request: {
      params: DropInClassParamsSchema,
      body: jsonContentRequired(UpdateDropInClassBodySchema, 'Drop-in class update payload'),
    },
    responses: {
      [HttpStatusCodes.OK]: jsonContent(
        zodResponseSchema(DropInClassSchema),
        'Drop-in class updated successfully'
      ),
      [HttpStatusCodes.NOT_FOUND]: jsonContent(zodResponseSchema(), 'Drop-in class not found'),
      [HttpStatusCodes.UNAUTHORIZED]: jsonContent(zodResponseSchema(), 'Authentication required'),
    },
  }),

  deleteDropInClass: createRoute({
    method: 'delete',
    tags: ['DropInClasses'],
    path: '/{id}',
    summary: 'Delete a drop-in class',
    request: {
      params: DropInClassParamsSchema,
    },
    responses: {
      [HttpStatusCodes.OK]: jsonContent(
        zodResponseSchema(z.object({ success: z.boolean() })),
        'Drop-in class deleted successfully'
      ),
      [HttpStatusCodes.NOT_FOUND]: jsonContent(zodResponseSchema(), 'Drop-in class not found'),
      [HttpStatusCodes.UNAUTHORIZED]: jsonContent(zodResponseSchema(), 'Authentication required'),
    },
  }),
}

export type DropInClassesRoutes = typeof DROPIN_CLASSES_ROUTES
