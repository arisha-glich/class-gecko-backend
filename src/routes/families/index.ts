import { createRouter } from '~/lib/create-app'
import { FAMILIES_HANDLER } from '~/routes/families/families.handler'
import { FAMILIES_ROUTES } from '~/routes/families/families.routes'

const router = createRouter()
;(Object.keys(FAMILIES_ROUTES) as Array<keyof typeof FAMILIES_ROUTES>).forEach(key => {
  // biome-ignore lint/suspicious/noExplicitAny: HandlerMapFromRoutes ensures type safety
  router.openapi(FAMILIES_ROUTES[key], FAMILIES_HANDLER[key] as any)
})

export default router
