import { createRouter } from '~/lib/create-app'
import { WAITLIST_HANDLER } from '~/routes/waitlist/waitlist.handler'
import { WAITLIST_ROUTES } from '~/routes/waitlist/waitlist.routes'

const router = createRouter()
;(Object.keys(WAITLIST_ROUTES) as Array<keyof typeof WAITLIST_ROUTES>).forEach(key => {
  // biome-ignore lint/suspicious/noExplicitAny: HandlerMapFromRoutes ensures type safety
  router.openapi(WAITLIST_ROUTES[key], WAITLIST_HANDLER[key] as any)
})

export default router
