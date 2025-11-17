import { createRouter } from '~/lib/create-app'
import { WAITLIST_HANDLER } from '~/routes/waitlist/waitlist.handler'
import { WAITLIST_ROUTES } from '~/routes/waitlist/waitlist.routes'

const router = createRouter()
Object.entries(WAITLIST_ROUTES).forEach(([key, route]) => {
  router.openapi(route, WAITLIST_HANDLER[key as keyof typeof WAITLIST_HANDLER])
})

export default router
