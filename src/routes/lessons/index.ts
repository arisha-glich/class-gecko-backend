import { createRouter } from '~/lib/create-app'
import { LESSONS_HANDLER } from '~/routes/lessons/lessons.handler'
import { LESSONS_ROUTES } from '~/routes/lessons/lessons.routes'

const router = createRouter()
;(Object.keys(LESSONS_ROUTES) as Array<keyof typeof LESSONS_ROUTES>).forEach(key => {
  // biome-ignore lint/suspicious/noExplicitAny: HandlerMapFromRoutes ensures type safety
  router.openapi(LESSONS_ROUTES[key], LESSONS_HANDLER[key] as any)
})

export default router
