import { createRouter } from '~/lib/create-app'
import { DROPIN_LESSONS_HANDLER } from '~/routes/dropin-lessons/dropin-lessons.handler'
import { DROPIN_LESSONS_ROUTES } from '~/routes/dropin-lessons/dropin-lessons.routes'

const router = createRouter()
;(Object.keys(DROPIN_LESSONS_ROUTES) as Array<keyof typeof DROPIN_LESSONS_ROUTES>).forEach(key => {
  // biome-ignore lint/suspicious/noExplicitAny: HandlerMapFromRoutes ensures type safety
  router.openapi(DROPIN_LESSONS_ROUTES[key], DROPIN_LESSONS_HANDLER[key] as any)
})

export default router
