import { cors } from 'hono/cors'
import { registerRoutes } from '~/app'
import { ALLOWED_ORIGINS_MUTABLE } from '~/config/origins'
import { auth } from '~/lib/auth'
import configureOpenAPI from '~/lib/configure-open-api'
import createApp from '~/lib/create-app'
import { registerEmailListeners } from '~/services/email-helpers'

// Initialize email listeners
registerEmailListeners()

// parseENV()
const app = createApp()

app.use('*', async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers })
  if (!session) {
    c.set('user', null)
    c.set('session', null)
    return next()
  }
  c.set('user', session.user)
  c.set('session', session.session)
  return next()
})
app.use(
  '*', // or replace with "*" to enable cors for all routes
  cors({
    origin: ALLOWED_ORIGINS_MUTABLE,
    allowHeaders: ['Content-Type', 'Authorization'],
    allowMethods: ['POST', 'GET', 'OPTIONS', 'PUT', 'DELETE', 'PATCH'],
    exposeHeaders: ['Content-Length'],
    maxAge: 600,
    credentials: true,
  })
)
app.on(['POST', 'GET'], '/api/auth/*', c => {
  return auth.handler(c.req.raw)
})
registerRoutes(app)
configureOpenAPI(app)
console.log('Auth reference available at http://localhost:8080/api/auth/reference')
console.log('API reference available at http://localhost:8080/reference')

export default {
  fetch: app.fetch,
  port: Bun.env.PORT_NO,
}
