import { createRouter } from '~/lib/create-app'
import { CUSTOM_FIELDS_HANDLER } from '~/routes/custom-fields/custom-fields.handler'
import { CUSTOM_FIELDS_ROUTES } from '~/routes/custom-fields/custom-fields.routes'

const router = createRouter()
;(Object.keys(CUSTOM_FIELDS_ROUTES) as Array<keyof typeof CUSTOM_FIELDS_ROUTES>).forEach(key => {
  // biome-ignore lint/suspicious/noExplicitAny: HandlerMapFromRoutes ensures type safety
  router.openapi(CUSTOM_FIELDS_ROUTES[key], CUSTOM_FIELDS_HANDLER[key] as any)
})

export default router
