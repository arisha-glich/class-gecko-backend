import { createRoute, z } from '@hono/zod-openapi'
import * as HttpStatusCodes from 'stoker/http-status-codes'
import { jsonContent, jsonContentRequired } from 'stoker/openapi/helpers'
import { zodResponseSchema } from '~/lib/zod-helper'

export const UpdateOrganizationBodySchema = z
  .object({
    phoneNo: z
      .string()
      .min(1, 'Phone number is required')
      .openapi({ description: 'Primary contact phone number' }),
    organizationName: z
      .string()
      .min(1, 'Organization name is required')
      .openapi({ description: 'Display name of the organization' }),
    industry: z
      .string()
      .min(1, 'Industry is required')
      .openapi({ description: 'Industry classification for the organization' }),
    students: z
      .number()
      .int()
      .min(0, 'Students must be zero or greater')
      .openapi({ description: 'Number of students associated with the organization' }),
  })
  .openapi({
    description: 'Payload to update organization profile fields',
  })

export const UpdateOrganizationDataSchema = z
  .object({
    user: z.object({
      id: z.string(),
      phoneNo: z.string().nullish(),
      onboardingStage: z.string().nullish(),
      meta: z.unknown().nullish(),
    }),
    organization: z.object({
      id: z.number().int(),
      companyName: z.string(),
      industry: z.string(),
    }),
  })
  .openapi({
    description: 'Updated user and organization information',
  })

export const OrganizationSchema = z
  .object({
    id: z.number().int(),
    companyName: z.string(),
    industry: z.string(),
    language: z.string(),
    currency: z.string(),
    timeZone: z.string(),
    websiteTheme: z.string(),
    timeFormat: z.string(),
    startDateForWeeklyCalendar: z.string(),
    ageCutoffDate: z.string(),
    logo: z.string().nullable(),
  })
  .openapi({
    description: 'Organization information',
  })

export const GetOrganizationResponseSchema = z
  .object({
    organization: OrganizationSchema.nullable(),
  })
  .openapi({
    description: 'Current user organization information',
  })

export const ORGANIZATION_ROUTES = {
  getOrganization: createRoute({
    method: 'get',
    tags: ['Organization'],
    path: '/',
    summary: 'Get current user organization',
    description: 'Retrieves the organization information for the currently authenticated user.',
    responses: {
      [HttpStatusCodes.OK]: jsonContent(
        zodResponseSchema(GetOrganizationResponseSchema),
        'Organization information retrieved successfully'
      ),
      [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
        zodResponseSchema(),
        'Authentication is required to get organization information'
      ),
      [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
        zodResponseSchema(),
        'Unexpected error while retrieving organization information'
      ),
    },
  }),

  updateOrganization: createRoute({
    method: 'patch',
    tags: ['Organization'],
    path: '/',
    summary: 'Update organization profile fields',
    description:
      'Updates the organization profile with contact phone number, organization name, industry, and student count.',
    request: {
      body: jsonContentRequired(
        UpdateOrganizationBodySchema,
        'Organization profile update payload'
      ),
    },
    responses: {
      [HttpStatusCodes.OK]: jsonContent(
        zodResponseSchema(UpdateOrganizationDataSchema),
        'Organization profile updated successfully'
      ),
      [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
        zodResponseSchema(),
        'Authentication is required to update organization profile'
      ),
      [HttpStatusCodes.NOT_FOUND]: jsonContent(
        zodResponseSchema(),
        'Organization or user record was not found for the request'
      ),
      [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
        zodResponseSchema(),
        'Unexpected error while updating organization profile'
      ),
    },
  }),
}

export type OrganizationRoutes = typeof ORGANIZATION_ROUTES
