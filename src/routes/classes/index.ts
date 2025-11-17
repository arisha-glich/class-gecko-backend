import { createRouter } from '~/lib/create-app'
import { CLASSES_HANDLER } from '~/routes/classes/classes.handler'
import { CLASSES_ROUTES } from '~/routes/classes/classes.routes'

const router = createRouter()
;(Object.keys(CLASSES_ROUTES) as Array<keyof typeof CLASSES_ROUTES>).forEach(key => {
  // biome-ignore lint/suspicious/noExplicitAny: HandlerMapFromRoutes ensures type safety
  router.openapi(CLASSES_ROUTES[key], CLASSES_HANDLER[key] as any)
})

export default router
