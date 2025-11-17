import { createRouter } from '~/lib/create-app'
import { ENROLLMENTS_HANDLER } from '~/routes/enrollments/enrollments.handler'
import { ENROLLMENTS_ROUTES } from '~/routes/enrollments/enrollments.routes'

const router = createRouter()
Object.entries(ENROLLMENTS_ROUTES).forEach(([key, route]) => {
  router.openapi(route, ENROLLMENTS_HANDLER[key as keyof typeof ENROLLMENTS_HANDLER])
})

export default router
