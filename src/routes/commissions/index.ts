import { createRouter } from '~/lib/create-app'
import { COMMISSIONS_HANDLER } from '~/routes/commissions/commissions.handler'
import { COMMISSIONS_ROUTES } from '~/routes/commissions/commissions.routes'

const router = createRouter()
;(Object.keys(COMMISSIONS_ROUTES) as Array<keyof typeof COMMISSIONS_ROUTES>).forEach(key => {
  // biome-ignore lint/suspicious/noExplicitAny: HandlerMapFromRoutes ensures type safety
  router.openapi(COMMISSIONS_ROUTES[key], COMMISSIONS_HANDLER[key] as any)
})

export default router
