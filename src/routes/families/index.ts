import { createRouter } from '~/lib/create-app'
import { FAMILIES_HANDLER } from '~/routes/families/families.handler'
import { FAMILIES_ROUTES } from '~/routes/families/families.routes'

const router = createRouter()
Object.entries(FAMILIES_ROUTES).forEach(([key, route]) => {
  router.openapi(route, FAMILIES_HANDLER[key as keyof typeof FAMILIES_HANDLER])
})

export default router
