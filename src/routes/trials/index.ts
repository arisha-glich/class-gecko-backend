import { createRouter } from '~/lib/create-app'
import { TRIALS_HANDLER } from '~/routes/trials/trials.handler'
import { TRIALS_ROUTES } from '~/routes/trials/trials.routes'

const router = createRouter()
Object.entries(TRIALS_ROUTES).forEach(([key, route]) => {
  router.openapi(route, TRIALS_HANDLER[key as keyof typeof TRIALS_HANDLER])
})

export default router
