import { createRouter } from '~/lib/create-app'
import { HOLIDAYS_HANDLER } from '~/routes/holidays/holidays.handler'
import { HOLIDAYS_ROUTES } from '~/routes/holidays/holidays.routes'

const router = createRouter()
;(Object.keys(HOLIDAYS_ROUTES) as Array<keyof typeof HOLIDAYS_ROUTES>).forEach(key => {
  // biome-ignore lint/suspicious/noExplicitAny: HandlerMapFromRoutes ensures type safety
  router.openapi(HOLIDAYS_ROUTES[key], HOLIDAYS_HANDLER[key] as any)
})

export default router
