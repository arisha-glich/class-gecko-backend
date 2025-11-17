import { createRouter } from '~/lib/create-app'
import { DROPIN_LESSONS_HANDLER } from '~/routes/dropin-lessons/dropin-lessons.handler'
import { DROPIN_LESSONS_ROUTES } from '~/routes/dropin-lessons/dropin-lessons.routes'

const router = createRouter()
Object.entries(DROPIN_LESSONS_ROUTES).forEach(([key, route]) => {
  router.openapi(route, DROPIN_LESSONS_HANDLER[key as keyof typeof DROPIN_LESSONS_HANDLER])
})

export default router
