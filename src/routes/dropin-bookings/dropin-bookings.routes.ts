import { createRoute, z } from '@hono/zod-openapi'
import * as HttpStatusCodes from 'stoker/http-status-codes'
import { jsonContent, jsonContentRequired } from 'stoker/openapi/helpers'
import { zodResponseSchema } from '~/lib/zod-helper'

// Request Schemas
export const CreateDropInBookingBodySchema = z
  .object({
    dropInClassId: z.number().int().positive(),
    studentId: z.number().int().positive(),
    enrollmentDate: z.string().datetime().optional(),
    paymentOption: z.string().optional(),
    status: z.string().optional(),
  })
  .openapi({ description: 'Payload to create a new drop-in class booking' })

export const UpdateDropInBookingBodySchema = CreateDropInBookingBodySchema.partial()

export const DropInBookingParamsSchema = z.object({
  id: z.string().openapi({ param: { name: 'id', in: 'path' } }),
})

export const DropInBookingByClassParamsSchema = z.object({
  classId: z.string().openapi({ param: { name: 'classId', in: 'path' } }),
})

// Response Schemas
export const DropInBookingSchema = z.object({
  id: z.number(),
  userId: z.string(),
  dropInClassId: z.number(),
  studentId: z.number().nullable(),
  enrollmentDate: z.string().nullable(),
  paymentOption: z.string().nullable(),
  status: z.string().nullable(),
  date: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  dropInClass: z
    .object({
      id: z.number(),
      title: z.string(),
      description: z.string().nullable(),
      startDate: z.string(),
      endDate: z.string(),
      pricingPerLesson: z.number(),
      teacher: z
        .object({
          id: z.number(),
          firstName: z.string(),
          lastName: z.string(),
          email: z.string(),
        })
        .nullable()
        .optional(),
      location: z
        .object({
          id: z.number(),
          name: z.string(),
          address: z.string(),
        })
        .nullable()
        .optional(),
    })
    .optional(),
  student: z
    .object({
      id: z.number(),
      firstName: z.string(),
      lastName: z.string(),
      familyId: z.number().nullable(),
    })
    .nullable()
    .optional(),
})

export const DropInBookingListSchema = z.array(DropInBookingSchema)

export const DROPIN_BOOKINGS_ROUTES = {
  createDropInBooking: createRoute({
    method: 'post',
    tags: ['DropInBookings'],
    path: '/',
    summary: 'Create a new drop-in class booking',
    request: {
      body: jsonContentRequired(CreateDropInBookingBodySchema, 'Drop-in booking creation payload'),
    },
    responses: {
      [HttpStatusCodes.CREATED]: jsonContent(
        zodResponseSchema(DropInBookingSchema),
        'Drop-in booking created successfully'
      ),
      [HttpStatusCodes.UNAUTHORIZED]: jsonContent(zodResponseSchema(), 'Authentication required'),
      [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
        zodResponseSchema(),
        'Failed to create drop-in booking'
      ),
    },
  }),

  getDropInBookings: createRoute({
    method: 'get',
    tags: ['DropInBookings'],
    path: '/',
    summary: 'Get all drop-in class bookings',
    responses: {
      [HttpStatusCodes.OK]: jsonContent(
        zodResponseSchema(DropInBookingListSchema),
        'List of drop-in bookings'
      ),
      [HttpStatusCodes.UNAUTHORIZED]: jsonContent(zodResponseSchema(), 'Authentication required'),
      [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
        zodResponseSchema(),
        'Failed to fetch drop-in bookings'
      ),
    },
  }),

  getDropInBooking: createRoute({
    method: 'get',
    tags: ['DropInBookings'],
    path: '/{id}',
    summary: 'Get a drop-in booking by ID',
    request: {
      params: DropInBookingParamsSchema,
    },
    responses: {
      [HttpStatusCodes.OK]: jsonContent(
        zodResponseSchema(DropInBookingSchema),
        'Drop-in booking details'
      ),
      [HttpStatusCodes.NOT_FOUND]: jsonContent(zodResponseSchema(), 'Drop-in booking not found'),
      [HttpStatusCodes.UNAUTHORIZED]: jsonContent(zodResponseSchema(), 'Authentication required'),
      [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
        zodResponseSchema(),
        'Failed to fetch drop-in booking'
      ),
    },
  }),

  getDropInBookingsByClass: createRoute({
    method: 'get',
    tags: ['DropInBookings'],
    path: '/class/{classId}',
    summary: 'Get all bookings for a drop-in class',
    request: {
      params: DropInBookingByClassParamsSchema,
    },
    responses: {
      [HttpStatusCodes.OK]: jsonContent(
        zodResponseSchema(DropInBookingListSchema),
        'List of bookings for the drop-in class'
      ),
      [HttpStatusCodes.UNAUTHORIZED]: jsonContent(zodResponseSchema(), 'Authentication required'),
      [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
        zodResponseSchema(),
        'Failed to fetch drop-in bookings'
      ),
    },
  }),

  updateDropInBooking: createRoute({
    method: 'patch',
    tags: ['DropInBookings'],
    path: '/{id}',
    summary: 'Update a drop-in booking',
    request: {
      params: DropInBookingParamsSchema,
      body: jsonContentRequired(UpdateDropInBookingBodySchema, 'Drop-in booking update payload'),
    },
    responses: {
      [HttpStatusCodes.OK]: jsonContent(
        zodResponseSchema(DropInBookingSchema),
        'Drop-in booking updated successfully'
      ),
      [HttpStatusCodes.NOT_FOUND]: jsonContent(zodResponseSchema(), 'Drop-in booking not found'),
      [HttpStatusCodes.UNAUTHORIZED]: jsonContent(zodResponseSchema(), 'Authentication required'),
      [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
        zodResponseSchema(),
        'Failed to update drop-in booking'
      ),
    },
  }),

  deleteDropInBooking: createRoute({
    method: 'delete',
    tags: ['DropInBookings'],
    path: '/{id}',
    summary: 'Delete a drop-in booking',
    request: {
      params: DropInBookingParamsSchema,
    },
    responses: {
      [HttpStatusCodes.OK]: jsonContent(
        zodResponseSchema(z.object({ success: z.boolean() })),
        'Drop-in booking deleted successfully'
      ),
      [HttpStatusCodes.NOT_FOUND]: jsonContent(zodResponseSchema(), 'Drop-in booking not found'),
      [HttpStatusCodes.UNAUTHORIZED]: jsonContent(zodResponseSchema(), 'Authentication required'),
      [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
        zodResponseSchema(),
        'Failed to delete drop-in booking'
      ),
    },
  }),
}

export type DropInBookingsRoutes = typeof DROPIN_BOOKINGS_ROUTES

