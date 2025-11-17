import { createRouter } from '~/lib/create-app'
import { DROPIN_BOOKINGS_HANDLER } from '~/routes/dropin-bookings/dropin-bookings.handler'
import { DROPIN_BOOKINGS_ROUTES } from '~/routes/dropin-bookings/dropin-bookings.routes'

const router = createRouter()
Object.entries(DROPIN_BOOKINGS_ROUTES).forEach(([key, route]) => {
  router.openapi(route, DROPIN_BOOKINGS_HANDLER[key as keyof typeof DROPIN_BOOKINGS_HANDLER])
})

export default router
