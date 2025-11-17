export const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002',
] as const

export const ALLOWED_ORIGINS_MUTABLE = [...ALLOWED_ORIGINS]

export type AllowedOrigin = (typeof ALLOWED_ORIGINS)[number]
