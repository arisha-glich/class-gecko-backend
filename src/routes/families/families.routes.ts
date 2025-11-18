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

export const FamilyQuerySchema = z.object({
  search: z
    .string()
    .optional()
    .openapi({
      param: { name: 'search', in: 'query' },
      description: 'Search by family name, email, or phone',
    }),
  status: z
    .string()
    .optional()
    .openapi({
      param: { name: 'status', in: 'query' },
      description: 'Filter by status (ACTIVE, INACTIVE, ALL)',
    }),
  page: z
    .string()
    .optional()
    .openapi({ param: { name: 'page', in: 'query' } }),
  limit: z
    .string()
    .optional()
    .openapi({ param: { name: 'limit', in: 'query' } }),
})

export const FamilyListResponseSchema = z.object({
  data: z.array(
    z.object({
      id: z.number(),
      familyName: z.string(),
      email: z.string(),
      phone: z.string(),
      students: z.number(),
      status: z.string(),
      createdAt: z.string(),
    })
  ),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number(),
  }),
})

export const FamilyDetailResponseSchema = z.object({
  id: z.number(),
  familyName: z.string(),
  primaryParentFirstName: z.string(),
  primaryParentLastName: z.string(),
  primaryParentEmail: z.string(),
  primaryParentPhoneCountry: z.string().nullable(),
  primaryParentPhoneNumber: z.string().nullable(),
  status: z.string().nullable(),
  notes: z.string().nullable(),
  memberSince: z.string(),
  contactInfo: z.object({
    email: z.string(),
    phone: z.string(),
    linkedBusiness: z.string(),
  }),
  address: z
    .object({
      street: z.string(),
      city: z.string(),
      state: z.string(),
      zipcode: z.string(),
      country: z.string(),
    })
    .nullable(),
  emergencyContact: z
    .object({
      name: z.string(),
      relation: z.string().nullable(),
      phone: z.string().nullable(),
      email: z.string().nullable(),
    })
    .nullable(),
  user: z.object({
    id: z.string(),
    email: z.string(),
    name: z.string().nullable(),
    phoneNo: z.string().nullable(),
  }),
})

export const UpdateFamilyBodySchema = z
  .object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    email: z.string().email().optional(),
    phoneCountryCode: z.string().optional(),
    phoneNumber: z.string().optional(),
    familyName: z.string().optional(),
    status: z.string().optional(),
    notes: z.string().optional(),
    address: z
      .object({
        street: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        zipcode: z.string().optional(),
        country: z.string().optional(),
      })
      .optional(),
    emergencyContact: z
      .object({
        name: z.string().optional(),
        relation: z.string().optional(),
        phoneNo: z.string().optional(),
        email: z.string().email().optional(),
        useInEmergency: z.boolean().optional(),
      })
      .optional(),
  })
  .openapi({ description: 'Payload to update a family' })

export const SuspendFamilyBodySchema = z
  .object({
    status: z.string().min(1, 'Status is required'),
  })
  .openapi({ description: 'Payload to suspend/activate a family' })

export const FamilyChildrenResponseSchema = z.array(
  z.object({
    id: z.number(),
    firstName: z.string(),
    lastName: z.string(),
    dateOfBirth: z.string().nullable(),
    age: z.number().nullable(),
    overallStatus: z.string(),
    enrolledClasses: z.array(
      z.object({
        id: z.number(),
        title: z.string(),
        classType: z.string(),
      })
    ),
  })
)

export const FamilyPaymentsResponseSchema = z.object({
  summary: z.object({
    totalPaid: z.number(),
    totalInvoices: z.number(),
    due: z.number(),
  }),
  invoices: z.array(
    z.object({
      invoiceId: z.string(),
      date: z.string(),
      description: z.string(),
      amount: z.number(),
      status: z.string(),
    })
  ),
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
    summary: 'Get all families with search, filter, and pagination',
    description: 'Retrieves a paginated list of families with optional search and status filtering',
    request: {
      query: FamilyQuerySchema,
    },
    responses: {
      [HttpStatusCodes.OK]: jsonContent(
        zodResponseSchema(FamilyListResponseSchema),
        'List of families retrieved successfully'
      ),
      [HttpStatusCodes.UNAUTHORIZED]: jsonContent(zodResponseSchema(), 'Authentication required'),
      [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
        zodResponseSchema(),
        'Failed to retrieve families'
      ),
    },
  }),

  getFamily: createRoute({
    method: 'get',
    tags: ['Families'],
    path: '/{id}',
    summary: 'Get family details by ID',
    description:
      'Retrieves detailed information about a specific family including contact info, address, and emergency contact',
    request: { params: FamilyParamsSchema },
    responses: {
      [HttpStatusCodes.OK]: jsonContent(
        zodResponseSchema(FamilyDetailResponseSchema),
        'Family details retrieved successfully'
      ),
      [HttpStatusCodes.NOT_FOUND]: jsonContent(zodResponseSchema(), 'Family not found'),
      [HttpStatusCodes.UNAUTHORIZED]: jsonContent(zodResponseSchema(), 'Authentication required'),
      [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
        zodResponseSchema(),
        'Failed to retrieve family'
      ),
    },
  }),

  updateFamily: createRoute({
    method: 'patch',
    tags: ['Families'],
    path: '/{id}',
    summary: 'Update family information',
    description:
      'Updates family details including contact information, address, and emergency contact',
    request: {
      params: FamilyParamsSchema,
      body: jsonContentRequired(UpdateFamilyBodySchema, 'Family update payload'),
    },
    responses: {
      [HttpStatusCodes.OK]: jsonContent(
        zodResponseSchema(FamilyDetailResponseSchema),
        'Family updated successfully'
      ),
      [HttpStatusCodes.NOT_FOUND]: jsonContent(zodResponseSchema(), 'Family not found'),
      [HttpStatusCodes.CONFLICT]: jsonContent(zodResponseSchema(), 'Email already used'),
      [HttpStatusCodes.UNAUTHORIZED]: jsonContent(zodResponseSchema(), 'Authentication required'),
      [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
        zodResponseSchema(),
        'Failed to update family'
      ),
    },
  }),

  deleteFamily: createRoute({
    method: 'delete',
    tags: ['Families'],
    path: '/{id}',
    summary: 'Delete a family',
    description: 'Permanently deletes a family and associated user account',
    request: { params: FamilyParamsSchema },
    responses: {
      [HttpStatusCodes.OK]: jsonContent(
        zodResponseSchema(z.object({ success: z.boolean() })),
        'Family deleted successfully'
      ),
      [HttpStatusCodes.NOT_FOUND]: jsonContent(zodResponseSchema(), 'Family not found'),
      [HttpStatusCodes.UNAUTHORIZED]: jsonContent(zodResponseSchema(), 'Authentication required'),
      [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
        zodResponseSchema(),
        'Failed to delete family'
      ),
    },
  }),

  suspendFamily: createRoute({
    method: 'patch',
    tags: ['Families'],
    path: '/{id}/suspend',
    summary: 'Suspend or activate a family',
    description: 'Updates the status of a family (ACTIVE, INACTIVE, etc.)',
    request: {
      params: FamilyParamsSchema,
      body: jsonContentRequired(SuspendFamilyBodySchema, 'Suspend family payload'),
    },
    responses: {
      [HttpStatusCodes.OK]: jsonContent(
        zodResponseSchema(FamilySchema),
        'Family status updated successfully'
      ),
      [HttpStatusCodes.NOT_FOUND]: jsonContent(zodResponseSchema(), 'Family not found'),
      [HttpStatusCodes.UNAUTHORIZED]: jsonContent(zodResponseSchema(), 'Authentication required'),
      [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
        zodResponseSchema(),
        'Failed to update family status'
      ),
    },
  }),

  getFamilyChildren: createRoute({
    method: 'get',
    tags: ['Families'],
    path: '/{id}/children',
    summary: 'Get family children with enrolled classes',
    description:
      'Retrieves all children belonging to a family along with their enrolled classes and status',
    request: { params: FamilyParamsSchema },
    responses: {
      [HttpStatusCodes.OK]: jsonContent(
        zodResponseSchema(FamilyChildrenResponseSchema),
        'Family children retrieved successfully'
      ),
      [HttpStatusCodes.NOT_FOUND]: jsonContent(zodResponseSchema(), 'Family not found'),
      [HttpStatusCodes.UNAUTHORIZED]: jsonContent(zodResponseSchema(), 'Authentication required'),
      [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
        zodResponseSchema(),
        'Failed to retrieve children'
      ),
    },
  }),

  getFamilyPayments: createRoute({
    method: 'get',
    tags: ['Families'],
    path: '/{id}/payments',
    summary: 'Get family payment history',
    description: 'Retrieves payment summary and invoice history for a family',
    request: { params: FamilyParamsSchema },
    responses: {
      [HttpStatusCodes.OK]: jsonContent(
        zodResponseSchema(FamilyPaymentsResponseSchema),
        'Payment history retrieved successfully'
      ),
      [HttpStatusCodes.NOT_FOUND]: jsonContent(zodResponseSchema(), 'Family not found'),
      [HttpStatusCodes.UNAUTHORIZED]: jsonContent(zodResponseSchema(), 'Authentication required'),
      [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
        zodResponseSchema(),
        'Failed to retrieve payment history'
      ),
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
