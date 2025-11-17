import { createRouter } from '~/lib/create-app'
import { LOCATIONS_HANDLER } from '~/routes/locations/locations.handler'
import { LOCATIONS_ROUTES } from '~/routes/locations/locations.routes'

const router = createRouter()
;(Object.keys(LOCATIONS_ROUTES) as Array<keyof typeof LOCATIONS_ROUTES>).forEach(key => {
  // biome-ignore lint/suspicious/noExplicitAny: HandlerMapFromRoutes ensures type safety
  router.openapi(LOCATIONS_ROUTES[key], LOCATIONS_HANDLER[key] as any)
})

export default router
