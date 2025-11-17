import { createRouter } from '~/lib/create-app'
import { FAMILIES_HANDLER } from '~/routes/families/families.handler'
import { FAMILIES_ROUTES } from '~/routes/families/families.routes'

const router = createRouter()
  .openapi(FAMILIES_ROUTES.createFamily, FAMILIES_HANDLER.createFamily)
  .openapi(FAMILIES_ROUTES.getFamilies, FAMILIES_HANDLER.getFamilies)
  .openapi(FAMILIES_ROUTES.getFamily, FAMILIES_HANDLER.getFamily)
  .openapi(FAMILIES_ROUTES.createStudent, FAMILIES_HANDLER.createStudent)

export default router
