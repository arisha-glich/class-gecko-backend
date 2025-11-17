import { createRoute, z } from '@hono/zod-openapi'
import * as HttpStatusCodes from 'stoker/http-status-codes'
import { jsonContent, jsonContentRequired } from 'stoker/openapi/helpers'
import { zodResponseSchema } from '~/lib/zod-helper'

export const StudentSchema = z.object({
  id: z.number(),
  familyId: z.number().nullable(),
  firstName: z.string(),
  lastName: z.string(),
  dateOfBirth: z.string().nullable(),
  gender: z.string().nullable(),
  medicalInfo: z.string().nullable(),
  photoVideoConsent: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const FamilySchema = z.object({
  id: z.number(),
  familyName: z.string(),
  organizationId: z.string(),
  userId: z.string(),
  primaryParentFirstName: z.string(),
  primaryParentLastName: z.string(),
  primaryParentEmail: z.string(),
  primaryParentPhoneCountry: z.string().nullable(),
  primaryParentPhoneNumber: z.string().nullable(),
  sendPortalInvitation: z.boolean(),
  status: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  students: z.array(StudentSchema),
})

export const FamilyResponseSchema = z.object({
  family: FamilySchema,
  user: z.object({
    id: z.string(),
    email: z.string(),
    role: z.string(),
    name: z.string().nullable(),
    phoneNo: z.string().nullable(),
  }),
})

export const CreateFamilyBodySchema = z
  .object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email(),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    phoneCountryCode: z.string().optional(),
    phoneNumber: z.string().optional(),
    sendPortalInvitation: z.boolean().optional(),
    familyName: z.string().optional(),
  })
  .openapi({ description: 'Payload to create a family account' })

export const CreateStudentBodySchema = z
  .object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    dateOfBirth: z.string().datetime().optional(),
    gender: z.string().optional(),
    medicalInfo: z.string().optional(),
    photoVideoConsent: z.boolean().optional(),
  })
  .openapi({ description: 'Payload to create a student under a family' })

export const FamilyParamsSchema = z.object({
  id: z.string().openapi({ param: { name: 'id', in: 'path' } }),
})

export const FAMILIES_ROUTES = {
  createFamily: createRoute({
    method: 'post',
    tags: ['Families'],
    path: '/',
    summary: 'Create a family and associated user account',
    request: {
      body: jsonContentRequired(CreateFamilyBodySchema, 'Family creation payload'),
    },
    responses: {
      [HttpStatusCodes.CREATED]: jsonContent(
        zodResponseSchema(FamilyResponseSchema),
        'Family created successfully'
      ),
      [HttpStatusCodes.CONFLICT]: jsonContent(zodResponseSchema(), 'Email already used'),
      [HttpStatusCodes.UNAUTHORIZED]: jsonContent(zodResponseSchema(), 'Authentication required'),
      [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
        zodResponseSchema(),
        'Failed to create family'
      ),
    },
  }),

  getFamilies: createRoute({
    method: 'get',
    tags: ['Families'],
    path: '/',
    summary: 'Get all families created by the organization',
    responses: {
      [HttpStatusCodes.OK]: jsonContent(
        zodResponseSchema(z.array(FamilySchema)),
        'List of families'
      ),
      [HttpStatusCodes.UNAUTHORIZED]: jsonContent(zodResponseSchema(), 'Authentication required'),
    },
  }),

  getFamily: createRoute({
    method: 'get',
    tags: ['Families'],
    path: '/{id}',
    summary: 'Get a family by ID',
    request: { params: FamilyParamsSchema },
    responses: {
      [HttpStatusCodes.OK]: jsonContent(zodResponseSchema(FamilySchema), 'Family details'),
      [HttpStatusCodes.NOT_FOUND]: jsonContent(zodResponseSchema(), 'Family not found'),
      [HttpStatusCodes.UNAUTHORIZED]: jsonContent(zodResponseSchema(), 'Authentication required'),
    },
  }),

  createStudent: createRoute({
    method: 'post',
    tags: ['Families'],
    path: '/{id}/students',
    summary: 'Add a student to a family',
    request: {
      params: FamilyParamsSchema,
      body: jsonContentRequired(CreateStudentBodySchema, 'Student creation payload'),
    },
    responses: {
      [HttpStatusCodes.CREATED]: jsonContent(
        zodResponseSchema(StudentSchema),
        'Student created successfully'
      ),
      [HttpStatusCodes.NOT_FOUND]: jsonContent(zodResponseSchema(), 'Family not found'),
      [HttpStatusCodes.UNAUTHORIZED]: jsonContent(zodResponseSchema(), 'Authentication required'),
      [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
        zodResponseSchema(),
        'Failed to create student'
      ),
    },
  }),
}

export type FamiliesRoutes = typeof FAMILIES_ROUTES
