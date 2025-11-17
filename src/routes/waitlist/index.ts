import { createRouter } from '~/lib/create-app'
import { WAITLIST_HANDLER } from '~/routes/waitlist/waitlist.handler'
import { WAITLIST_ROUTES } from '~/routes/waitlist/waitlist.routes'

const router = createRouter()
  .openapi(WAITLIST_ROUTES.createWaitlist, WAITLIST_HANDLER.createWaitlist)
  .openapi(WAITLIST_ROUTES.getWaitlist, WAITLIST_HANDLER.getWaitlist)
  .openapi(WAITLIST_ROUTES.getWaitlistEntry, WAITLIST_HANDLER.getWaitlistEntry)
  .openapi(WAITLIST_ROUTES.getWaitlistByClass, WAITLIST_HANDLER.getWaitlistByClass)
  .openapi(WAITLIST_ROUTES.updateWaitlist, WAITLIST_HANDLER.updateWaitlist)
  .openapi(WAITLIST_ROUTES.deleteWaitlist, WAITLIST_HANDLER.deleteWaitlist)

export default router
