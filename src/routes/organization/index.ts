import { createRouter } from '~/lib/create-app'
import { ORGANIZATION_HANDLER } from '~/routes/organization/organization.handler'
import { ORGANIZATION_ROUTES } from '~/routes/organization/organization.routes'

const router = createRouter()
Object.entries(ORGANIZATION_ROUTES).forEach(([key, route]) => {
  router.openapi(route, ORGANIZATION_HANDLER[key as keyof typeof ORGANIZATION_HANDLER])
})

export default router
