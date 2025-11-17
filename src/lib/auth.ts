import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { openAPI } from 'better-auth/plugins'
import { ALLOWED_ORIGINS } from '~/config/origins'
import prisma from '~/lib/prisma'

const baseURL = process.env.BETTER_AUTH_URL || process.env.BASE_URL || 'http://localhost:8080'

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },
  trustedOrigins: [...ALLOWED_ORIGINS, 'http://localhost:8080'],
  baseURL,

  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),

  user: {
    fields: {
      // Map unused Better Auth default name fields to a single column to avoid requiring extra Prisma columns.
      firstName: 'name',
      lastName: 'name',
    } as Record<string, string>,
    additionalFields: {
      role: {
        type: 'string',
        required: true,
        input: true,
        defaultValue: 'FAMILY',
      },
      banned: {
        type: 'boolean',
        required: false,
        defaultValue: false,
      },
      phoneNo: {
        type: 'string',
        required: false,
        input: true,
      },
      dob: {
        type: 'date',
        required: false,
        input: true,
      },
      gender: {
        type: 'string',
        required: false,
        input: true,
      },
      sendInvitationOnSignup: {
        type: 'boolean',
        required: false,
        defaultValue: false,
      },
      onboardingStage: {
        type: 'string',
        required: false,
      },
    },
  },

  plugins: [
    openAPI({
      theme: 'kepler',
    }),
  ],
})
