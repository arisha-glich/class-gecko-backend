import { createRouter } from '~/lib/create-app'
import { ENROLLMENTS_HANDLER } from '~/routes/enrollments/enrollments.handler'
import { ENROLLMENTS_ROUTES } from '~/routes/enrollments/enrollments.routes'

const router = createRouter()
;(Object.keys(ENROLLMENTS_ROUTES) as Array<keyof typeof ENROLLMENTS_ROUTES>).forEach(key => {
  // biome-ignore lint/suspicious/noExplicitAny: HandlerMapFromRoutes ensures type safety
  router.openapi(ENROLLMENTS_ROUTES[key], ENROLLMENTS_HANDLER[key] as any)
})

export default router
