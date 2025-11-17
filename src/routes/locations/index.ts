import { createRouter } from '~/lib/create-app'
import { LOCATIONS_HANDLER } from '~/routes/locations/locations.handler'
import { LOCATIONS_ROUTES } from '~/routes/locations/locations.routes'

const router = createRouter()
  .openapi(LOCATIONS_ROUTES.createLocation, LOCATIONS_HANDLER.createLocation)
  .openapi(LOCATIONS_ROUTES.getLocations, LOCATIONS_HANDLER.getLocations)
  .openapi(LOCATIONS_ROUTES.getLocation, LOCATIONS_HANDLER.getLocation)
  .openapi(LOCATIONS_ROUTES.updateLocation, LOCATIONS_HANDLER.updateLocation)
  .openapi(LOCATIONS_ROUTES.deleteLocation, LOCATIONS_HANDLER.deleteLocation)

export default router

