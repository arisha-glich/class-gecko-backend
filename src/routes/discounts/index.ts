import { createRouter } from '~/lib/create-app'
import { DISCOUNTS_HANDLER } from '~/routes/discounts/discounts.handler'
import { DISCOUNTS_ROUTES } from '~/routes/discounts/discounts.routes'

const router = createRouter()
Object.entries(DISCOUNTS_ROUTES).forEach(([key, route]) => {
  router.openapi(route, DISCOUNTS_HANDLER[key as keyof typeof DISCOUNTS_HANDLER])
})

export default router
