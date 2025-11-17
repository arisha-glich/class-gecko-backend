import { createRouter } from '~/lib/create-app'
import { ORGANIZATION_HANDLER } from '~/routes/organization/organization.handler'
import { ORGANIZATION_ROUTES } from '~/routes/organization/organization.routes'

const router = createRouter()
;(Object.keys(ORGANIZATION_ROUTES) as Array<keyof typeof ORGANIZATION_ROUTES>).forEach(key => {
  // biome-ignore lint/suspicious/noExplicitAny: HandlerMapFromRoutes ensures type safety
  router.openapi(ORGANIZATION_ROUTES[key], ORGANIZATION_HANDLER[key] as any)
})

export default router
