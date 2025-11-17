import * as z from 'zod'

// Create zod schema for env variables
const envSchema = z.object({
  PORT_NO: z.coerce.number(),
  RESEND_API_KEY: z.string().optional(),
  RESEND_FROM_EMAIL: z.string().optional(),
  BETTER_AUTH_URL: z.string().optional(),
  BASE_URL: z.string().optional(),
})

export async function parseENV() {
  try {
    envSchema.parse(Bun.env)
  } catch (err) {
    console.error('Invalid Env variables Configuration::::', err)
    process.exit(1)
  }
}

declare module 'bun' {
  interface Env extends z.TypeOf<typeof envSchema> {}
}
