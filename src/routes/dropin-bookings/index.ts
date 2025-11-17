import { createRouter } from '~/lib/create-app'
import { DROPIN_BOOKINGS_HANDLER } from '~/routes/dropin-bookings/dropin-bookings.handler'
import { DROPIN_BOOKINGS_ROUTES } from '~/routes/dropin-bookings/dropin-bookings.routes'

const router = createRouter()
;(Object.keys(DROPIN_BOOKINGS_ROUTES) as Array<keyof typeof DROPIN_BOOKINGS_ROUTES>).forEach(
  key => {
    // biome-ignore lint/suspicious/noExplicitAny: HandlerMapFromRoutes ensures type safety
    router.openapi(DROPIN_BOOKINGS_ROUTES[key], DROPIN_BOOKINGS_HANDLER[key] as any)
  }
)

export default router
