import { createRouter } from '~/lib/create-app'
import { HOLIDAYS_HANDLER } from '~/routes/holidays/holidays.handler'
import { HOLIDAYS_ROUTES } from '~/routes/holidays/holidays.routes'

const router = createRouter()
Object.entries(HOLIDAYS_ROUTES).forEach(([key, route]) => {
  router.openapi(route, HOLIDAYS_HANDLER[key as keyof typeof HOLIDAYS_HANDLER])
})

export default router
