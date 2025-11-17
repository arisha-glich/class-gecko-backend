import { createRouter } from '~/lib/create-app'
import { DROPIN_CLASSES_HANDLER } from '~/routes/dropin-classes/dropin-classes.handler'
import { DROPIN_CLASSES_ROUTES } from '~/routes/dropin-classes/dropin-classes.routes'

const router = createRouter()
;(Object.keys(DROPIN_CLASSES_ROUTES) as Array<keyof typeof DROPIN_CLASSES_ROUTES>).forEach(key => {
  // biome-ignore lint/suspicious/noExplicitAny: HandlerMapFromRoutes ensures type safety
  router.openapi(DROPIN_CLASSES_ROUTES[key], DROPIN_CLASSES_HANDLER[key] as any)
})

export default router
