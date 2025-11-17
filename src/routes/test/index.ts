import { createRouter } from '~/lib/create-app'
import { TEST_ROUTE_HANDLER } from '~/routes/test/test.handler'
import { TEST_ROUTES } from '~/routes/test/test.routes'

const router = createRouter()
;(Object.keys(TEST_ROUTES) as Array<keyof typeof TEST_ROUTES>).forEach(key => {
  // biome-ignore lint/suspicious/noExplicitAny: HandlerMapFromRoutes ensures type safety
  router.openapi(TEST_ROUTES[key], TEST_ROUTE_HANDLER[key] as any)
})

export default router
