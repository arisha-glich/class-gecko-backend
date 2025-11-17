import { createRouter } from '~/lib/create-app'
import { REGISTRATION_FEES_HANDLER } from '~/routes/registration-fees/registration-fees.handler'
import { REGISTRATION_FEES_ROUTES } from '~/routes/registration-fees/registration-fees.routes'

const router = createRouter()
Object.entries(REGISTRATION_FEES_ROUTES).forEach(([key, route]) => {
  router.openapi(route, REGISTRATION_FEES_HANDLER[key as keyof typeof REGISTRATION_FEES_HANDLER])
})

export default router
