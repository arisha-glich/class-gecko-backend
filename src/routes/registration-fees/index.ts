import { createRouter } from '~/lib/create-app'
import { REGISTRATION_FEES_HANDLER } from '~/routes/registration-fees/registration-fees.handler'
import { REGISTRATION_FEES_ROUTES } from '~/routes/registration-fees/registration-fees.routes'

const router = createRouter()
;(Object.keys(REGISTRATION_FEES_ROUTES) as Array<keyof typeof REGISTRATION_FEES_ROUTES>).forEach(
  key => {
    // biome-ignore lint/suspicious/noExplicitAny: HandlerMapFromRoutes ensures type safety
    router.openapi(REGISTRATION_FEES_ROUTES[key], REGISTRATION_FEES_HANDLER[key] as any)
  }
)

export default router
