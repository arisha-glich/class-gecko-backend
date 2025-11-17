import { createRouter } from '~/lib/create-app'
import { CAMPS_HANDLER } from '~/routes/camps/camps.handler'
import { CAMPS_ROUTES } from '~/routes/camps/camps.routes'

const router = createRouter()
  .openapi(CAMPS_ROUTES.createCamp, CAMPS_HANDLER.createCamp)
  .openapi(CAMPS_ROUTES.getCamps, CAMPS_HANDLER.getCamps)
  .openapi(CAMPS_ROUTES.getCamp, CAMPS_HANDLER.getCamp)
  .openapi(CAMPS_ROUTES.updateCamp, CAMPS_HANDLER.updateCamp)
  .openapi(CAMPS_ROUTES.deleteCamp, CAMPS_HANDLER.deleteCamp)

export default router
