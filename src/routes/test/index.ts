import { createRouter } from '~/lib/create-app'
import { TEST_ROUTE_HANDLER } from '~/routes/test/test.handler'
import { TEST_ROUTES } from '~/routes/test/test.routes'

const router = createRouter()
Object.entries(TEST_ROUTES).forEach(([key, route]) => {
  router.openapi(route, TEST_ROUTE_HANDLER[key as keyof typeof TEST_ROUTE_HANDLER])
})

export default router
