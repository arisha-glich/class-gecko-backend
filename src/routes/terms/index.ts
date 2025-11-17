import { createRouter } from '~/lib/create-app'
import { TERMS_HANDLER } from '~/routes/terms/terms.handler'
import { TERMS_ROUTES } from '~/routes/terms/terms.routes'

const router = createRouter()
;(Object.keys(TERMS_ROUTES) as Array<keyof typeof TERMS_ROUTES>).forEach(key => {
  // biome-ignore lint/suspicious/noExplicitAny: HandlerMapFromRoutes ensures type safety
  router.openapi(TERMS_ROUTES[key], TERMS_HANDLER[key] as any)
})

export default router
