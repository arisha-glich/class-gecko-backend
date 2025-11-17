import { createRouter } from '~/lib/create-app'
import { DISCOUNTS_HANDLER } from '~/routes/discounts/discounts.handler'
import { DISCOUNTS_ROUTES } from '~/routes/discounts/discounts.routes'

const router = createRouter()
;(Object.keys(DISCOUNTS_ROUTES) as Array<keyof typeof DISCOUNTS_ROUTES>).forEach(key => {
  // biome-ignore lint/suspicious/noExplicitAny: HandlerMapFromRoutes ensures type safety
  router.openapi(DISCOUNTS_ROUTES[key], DISCOUNTS_HANDLER[key] as any)
})

export default router
