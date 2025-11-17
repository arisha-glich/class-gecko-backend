import { createRouter } from '~/lib/create-app'
import { CAMPS_HANDLER } from '~/routes/camps/camps.handler'
import { CAMPS_ROUTES } from '~/routes/camps/camps.routes'

const router = createRouter()
;(Object.keys(CAMPS_ROUTES) as Array<keyof typeof CAMPS_ROUTES>).forEach(key => {
  // biome-ignore lint/suspicious/noExplicitAny: HandlerMapFromRoutes ensures type safety
  router.openapi(CAMPS_ROUTES[key], CAMPS_HANDLER[key] as any)
})

export default router
