import { createRouter } from '~/lib/create-app'
import { CAMPS_HANDLER } from '~/routes/camps/camps.handler'
import { CAMPS_ROUTES } from '~/routes/camps/camps.routes'

const router = createRouter()
Object.entries(CAMPS_ROUTES).forEach(([key, route]) => {
  router.openapi(route, CAMPS_HANDLER[key as keyof typeof CAMPS_HANDLER])
})

export default router
