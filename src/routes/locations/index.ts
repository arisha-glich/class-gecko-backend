import { createRouter } from '~/lib/create-app'
import { LOCATIONS_HANDLER } from '~/routes/locations/locations.handler'
import { LOCATIONS_ROUTES } from '~/routes/locations/locations.routes'

const router = createRouter()
Object.entries(LOCATIONS_ROUTES).forEach(([key, route]) => {
  router.openapi(route, LOCATIONS_HANDLER[key as keyof typeof LOCATIONS_HANDLER])
})

export default router
