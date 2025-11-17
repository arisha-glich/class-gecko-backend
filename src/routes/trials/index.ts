import { createRouter } from '~/lib/create-app'
import { TRIALS_HANDLER } from '~/routes/trials/trials.handler'
import { TRIALS_ROUTES } from '~/routes/trials/trials.routes'

const router = createRouter()
;(Object.keys(TRIALS_ROUTES) as Array<keyof typeof TRIALS_ROUTES>).forEach(key => {
  // biome-ignore lint/suspicious/noExplicitAny: HandlerMapFromRoutes ensures type safety
  router.openapi(TRIALS_ROUTES[key], TRIALS_HANDLER[key] as any)
})

export default router
