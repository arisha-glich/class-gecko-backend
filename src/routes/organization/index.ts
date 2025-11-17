import { createRouter } from '~/lib/create-app'
import { ORGANIZATION_HANDLER } from '~/routes/organization/organization.handler'
import { ORGANIZATION_ROUTES } from '~/routes/organization/organization.routes'

const router = createRouter()
  .openapi(ORGANIZATION_ROUTES.getOrganization, ORGANIZATION_HANDLER.getOrganization)
  .openapi(ORGANIZATION_ROUTES.updateOrganization, ORGANIZATION_HANDLER.updateOrganization)

export default router
